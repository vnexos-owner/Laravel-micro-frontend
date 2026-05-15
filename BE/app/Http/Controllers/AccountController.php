<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Role;
use App\Models\SchoolClass;
use App\Models\Semester;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function store(Request $request)
    {
        if($forbidden = $this->requireAdmin()) return $forbidden;

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

        $user = User::create($data);

        Role::addUser("default", $user);

        return response()->json($user, 201);
    }

    public function index(Request $request)
    {
        if($forbidden = $this->requireAdminOrTeacher()) return $forbidden;
        
        $search = $request->input('search');
        $page = $request->input('page', 1);
        $limit = $request->input('limit');
        $includeDeleted = $request->boolean('includeDeleted', false);

        $query = User::query()->with(['roles:name']);

        $query->orderByDesc('created_at');

        // Include soft-deleted records if requested
        if ($includeDeleted) {
            $query->withTrashed();
        }

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        if (!$limit) {
            $users = $query->get();
            return response()->json($users, 200);
        }

        // Paginate results
        $users = $query->paginate($limit, ['*'], 'page', $page);

        $users->getCollection()->transform(function ($user) {
            $user->setRelation('roles', $user->roles->pluck('name'));
            return $user;
        });

        return response()->json($users, 200);
    }

    public function destroy($id)
    {
        if($forbidden = $this->requireAdmin()) return $forbidden;

        $desUser = User::find($id);
        if(!$desUser)
            return response()->json([
                'message'=> 'User not found!',
            ], 404);

        $desUser->delete();

        return response()->json([], 204);
    }

    public function restoreUser($id)
    {
        if($forbidden = $this->requireAdmin()) return $forbidden;

        $desUser = User::onlyTrashed()->find($id);
        if(!$desUser)
            return response()->json([
                'message'=> 'User not found!',
            ], 404);

        $conflict = User::where(function($query) use ($desUser) {
        $query->where('email', $desUser->email)
              ->orWhere('username', $desUser->username);
        })->exists();

        if ($conflict)
            return response()->json([
                'message' => 'Cannot restore - email or username is already taken by another user.'
            ], 409);

        $desUser->restore();

        return response()->json([], 204);
    }

    public function addRole($id, Request $request): JsonResponse
    {
        if($forbidden = $this->requireAdmin()) return $forbidden;

        $data = $request->validate([
            'role' => 'required|string'
        ]);

        // Add user to destination user
        $desUser = User::find($id);
        if(!$desUser)
            return response()->json([
                'message'=> 'User not found'
            ], 404);
    
        try {
            Role::addUser($data['role'], $desUser);
        } catch (QueryException $e) {
            return response()->json([
                'message'=> $e->getMessage(),
                'user' => $desUser
            ], 400);
        }

        return response()->json([], 204); // No content
    }

    public function deleteRole($id, Request $request): JsonResponse
    {
        if($forbidden = $this->requireAdmin()) return $forbidden;

        // Add user to destination user
        $desUser = User::find($id);
        if(!$desUser)
            return response()->json([
                'message'=> 'User not found'
            ], 404);

        $data = $request->validate([
            'role' => 'required|string'
        ]);

        try {
            Role::removeUser($data['role'], $desUser);
        } catch (QueryException $e) {
            return response()->json([
                'message'=> 'The user already has this role.'
            ], 400);
        }

        return response()->json([], 204);
    }

    public function getUsersInRole($role): JsonResponse
    {
        if($forbidden = $this->requireAdminOrTeacher()) return $forbidden;

        $role = Role::where('name', $role)->first();
        if(!$role)
            return response()->json([
                'message'=> 'Role not found!'
            ], 404);
        
        $data = $role->users()->get();

        return response()->json($data, 200);
    }

    public function getStatistic(): JsonResponse
    {
        if($forbidden = $this->requireAdmin()) return $forbidden;

        $admin = Role::where('name', 'admin')->first();
        $teacher = Role::where('name', 'teacher')->first();
        $deleted = User::onlyTrashed()->count();

        $semester = Semester::where('is_current', '1')->first();

        $currentSemesterClassCount = SchoolClass::where('semester_id', $semester->id)->count();
        $totalClass = SchoolClass::count();

        $course = Course::count();

        return response()->json([
            'users' => [
                'total' => User::count(),
                'admin' => $admin->users()->count(),
                'teacher' => $teacher->users()->count(),
                'deleted' => $deleted,
            ],
            'course' => $course,
            'current_semester' => $semester,
            'class' => [
                'current'=> $currentSemesterClassCount,
                'total' => $totalClass,
            ]
        ], 200);
    }

    public function getClass(): JsonResponse
    {
        $id = auth()->user()->id;
        $classes = User::with([
            'classes.semester',
            'classes.homeroomTeacher'
        ])->findOrFail($id)->classes;
        return response()->json($classes,200);
    }
}
