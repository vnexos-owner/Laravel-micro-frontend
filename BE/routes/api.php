<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\SemesterController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => response()->json(
    ['message' => 'Hello World!']
));

Route::get('/debug-ip', function (Illuminate\Http\Request $request) {
    return response()->json([
        'request_ip' => $request->ip(),
        'header_ip'  => $request->header('X-Forwarded-For'),
        'header_ip_proto'  => $request->header('X-Forwarded-Proto'),
        'header_ip_real' => $request->header('X-Real-IP'),
        'server_remote_addr' => $_SERVER['REMOTE_ADDR']
    ]);
});

Route::middleware('auth.jwt')->group(function () {
    Route::prefix('statistic')->group(function () {
        Route::get('', [AccountController::class,'getStatistic']);
    });
});

Route::prefix('auth')->group(function () {
    Route::post('signup', [AuthController::class, 'signup']);
    Route::post('signin', [AuthController::class, 'signin']);
    Route::post('signout', [AuthController::class,'signout']);
    Route::post('refresh', [AuthController::class, 'refresh']);

    Route::middleware('auth.jwt')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
    });
});

Route::prefix('users')->group(function () {
    Route::middleware('auth.jwt')->group(function () {
        Route::get('classes', [AccountController::class,'getClass']);
        Route::get('', [AccountController::class,'index']);
        Route::get('roles/{role}', [AccountController::class,'getUsersInRole']);
        Route::post('', [AccountController::class,'store']);
        Route::prefix('{id}')->group(function() {
            Route::delete('', [AccountController::class,'destroy']);
            Route::patch('', [AccountController::class,'restoreUser']);
            Route::post('roles', [AccountController::class, 'addRole']);
            Route::delete('roles', [AccountController::class,'deleteRole']);
        });
    });
});

Route::prefix('courses')->group(function () {
    Route::get('', [CourseController::class,'index']);
    Route::get('{id}', [CourseController::class,'show']);
    Route::middleware('auth.jwt')->group(function () {
        Route::post('', [CourseController::class, 'store']);
        Route::patch('{id}', [CourseController::class, 'update']);
        Route::delete('{id}', [CourseController::class, 'destroy']);
        Route::patch('{id}/restore', [CourseController::class,'restore']);
    });
});

Route::prefix('semesters')->group(function () {
    Route::get('', [SemesterController::class, 'index']);
    route::get('current', [SemesterController::class,'getCurrent']);
    Route::get('{id}', [SemesterController::class, 'show']);
    Route::middleware('auth.jwt')->group(function () {
        Route::post('', [SemesterController::class, 'store']);
        Route::patch('{id}', [SemesterController::class, 'update']);

        Route::patch('{id}/set-current', [SemesterController::class, 'setCurrent']);

        Route::delete('{id}', [SemesterController::class, 'destroy']);
        Route::patch('{id}/restore', [SemesterController::class,'restore']);
    });
});

Route::prefix('classes')->group(function () {
    // Public
    Route::get('', [ClassController::class, 'index']);
    Route::get('{id}', [ClassController::class, 'show']);
    Route::get('{id}/courses', [ClassController::class, 'getCourses']);
    
    // Authenticated only
    Route::middleware('auth.jwt')->group(function () {
        Route::get('{id}/students', [ClassController::class, 'getStudents']);

        Route::post('', [ClassController::class, 'store']);
        Route::patch('{id}', [ClassController::class, 'update']);
        Route::delete('{id}', [ClassController::class, 'destroy']);
        Route::patch('{id}/restore', [ClassController::class,'restore']);

        Route::post('{id}/students', [ClassController::class, 'addStudent']);
        Route::delete('{id}/students', [ClassController::class, 'removeStudent']);

        Route::post('{id}/courses', [ClassController::class, 'addCourse']);
        Route::delete('{id}/courses', [ClassController::class, 'removeCourse']);
    });
});
