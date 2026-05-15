<?php

namespace App\Http\Controllers;

use App\Models\RefreshToken;
use App\Models\Role;
use App\Models\User;
use App\Services\RiskAnalyzer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Jenssegers\Agent\Agent;

class AuthController extends Controller
{
    public function __construct(private RiskAnalyzer $risk) {}

    ////
    // Authentication helpers
    ////
    public function issueAccessToken($user): string
    {
        /** @var \PHPOpenSourceSaver\JWTAuth\JWTGuard $auth */
        $auth = auth('api');

        return $auth->login($user);
    }
    private function issueRefreshToken(User $user, Request $request): string
    {
        $device = $this->extractDeviceInfo($request);

        $refreshToken = RefreshToken::create([
            'user_id'      => $user->id,
            'ip_address'   => $device['ip_address'],
            'device_type'  => $device['device_type'],
            'operating_system'=> $device['operating_system'],
            'browser_name'      => $device['browser_name'],
            'expires_at'   => now()->addDays(30),
            'last_used_at' => now(),
        ]);

        return $refreshToken->id;
    }

    private function extractDeviceInfo(Request $request): array
    {
        $agent = new Agent();
        $agent->setUserAgent($request->userAgent());

        return [
            'ip_address'  => $request->ip(),
            'device_type' => $agent->isMobile() ? 'mobile' : ($agent->isTablet() ? 'tablet' : 'desktop'),
            'operating_system' => $agent->platform() ? $agent->platform() : '<unknown>',
            'browser_name'     => $agent->browser() ? $agent->browser() : '<unknown>',
        ];
    }
    private function tokenResponse(string $access, $refresh = null, int $status = 200): JsonResponse
    {
        $response = [
            'access_token'  => $access,
            'expires_in'    => config('jwt.ttl') * 60, // seconds
        ];

        if( $refresh )
            $response['refresh_token'] = $refresh;

        return response()->json($response, $status);
    }
    
    ////
    // Authentication Endpoints
    ////
    public function signup(Request $request) : JsonResponse
    {
        $messages = [
            // Name
            'name.required' => 'Vui lòng nhập họ và tên.',
            'name.string' => 'Họ và tên phải là chuỗi ký tự.',

            // Username
            'username.required' => 'Tên đăng nhập không được để trống.',
            'username.string' => 'Tên đăng nhập phải là chuỗi ký tự.',
            'username.max' => 'Tên đăng nhập không được vượt quá 50 ký tự.',
            'username.unique' => 'Tên đăng nhập này đã tồn tại trên hệ thống.',
            'username.regex' => 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới.',

            // Email
            'email.required' => 'Địa chỉ email là bắt buộc.',
            'email.string' => 'Email phải là một chuỗi ký tự.',
            'email.email' => 'Địa chỉ email không đúng định dạng.',
            'email.unique' => 'Email này đã được sử dụng bởi một tài khoản khác.',

            // Password
            'password.required' => 'Mật khẩu không được để trống.',
            'password.string' => 'Mật khẩu phải là chuỗi ký tự.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',

            // Gender
            'gender.required' => 'Vui lòng chọn giới tính.',
            'gender.string' => 'Giới tính không hợp lệ.',

            // Date of Birth
            'dob.required' => 'Vui lòng nhập ngày sinh.',
            'dob.date' => 'Ngày sinh không đúng định dạng ngày tháng.',
            'dob.before' => 'Ngày sinh phải là một ngày trong quá khứ.',
        ];

        $data = $request->validate([
            'name' => 'required|string',
            'username' => 'required|string|max:50|unique:users,username,NULL,id,deleted_at,NULL|regex:/^[a-zA-Z0-9_]+$/u',
            'email'=> 'required|string|email|unique:users,email,NULL,id,deleted_at,NULL',
            'password'=> 'required|string|min:8|confirmed',
            'gender' => 'required|string',
            'dob' => 'required|date|before:today',
        ], $messages);

        $user = User::create([
            'name' => $data['name'],
            'username' => $data['username'],
            'email'=> $data['email'],
            'password'=> $data['password'],
            'gender'=> $data['gender'],
            'dob' => $data['dob'],
        ]);

        Role::addUser("default", $user);

        $access = $this->issueAccessToken($user);
        $refresh = $this->issueRefreshToken($user, $request);

        return $this->tokenResponse($access, $refresh, 201);
    }

    public function signin(Request $request) : JsonResponse
    {
        $credentials = $request->validate([
            'account' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::getAccount($credentials['account']);

        if(!$user || !Hash::check($credentials['password'], $user->password))
            return response()->json(['message' => 'Invalid credentials'], 401);

        $access = $this->issueAccessToken($user);
        $refresh = $this->issueRefreshToken($user, $request);

        return $this->tokenResponse($access, $refresh);
    }

    public function refresh(Request $request): JsonResponse
    {
        $data = $request->validate([
            'refresh_token' => 'required|string'
        ]);

        $stored = RefreshToken::find($data['refresh_token']);

        if(!$stored || $stored->first()->isExpired())
            return response()->json(['message'=> 'Invalid refresh token'], 401);

        $current = $this->extractDeviceInfo($request);
        $risk = $this->risk->analyze($stored, $current);

        if($risk['level'] === RiskAnalyzer::LEVEL_HIGH)
        {
            $stored->delete();

            return response()->json([
                'message'=> 'Suspicious activity detected. Please try sign in again',
                'risk_level' => $risk['level'],
                'flags' => $risk['flags'],
            ], 401);
        }

        // Rotate refresh token
        $stored->update([
            'expires_at' => now()->addDays(30),
            'last_used_at' => now(),
        ]);

        $user = User::find($stored->user_id);

        $newAccess = $this->issueAccessToken($user);
        $response = $this->tokenResponse($newAccess);

        // Attach risk info for medium level warning
        if ($risk['level'] === RiskAnalyzer::LEVEL_MEDIUM) {
            $data              = $response->getData(true);
            $data['risk']      = $risk;
            $data['warning']   = 'Unusual activity detected on your account.';
            return response()->json($data);
        }

        return $response;
    }

    ////
    // Endpoints for authenticated user
    ////
    public function signout(Request $request)
    {
        $token = $request->input('refresh_token');

        if($token)
            RefreshToken::find($token)->delete();

        return response()->json([], 204);
    }

    public function me()
    {
        $auth = auth('api');

        /** @var \App\Models\User $user */
        $user = $auth->user();

        $user['roles'] = $user->roles()->select(['name'])->pluck('name');

        return response()->json(
            $user
        );
    }
}
