<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class Controller
{
    /**
     * Check if the request user has the admin role
     * @return JsonResponse|null
     */
    public function requireAdmin(): ?JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        if (!$user->containRoles(['admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return null;
    }

    /**
     * Check if the request user has the teacher role
     * @return JsonResponse|null
     */
    public function requireTeacher(): ?JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        if (!$user->containRoles(['teacher'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return null;
    }

    /**
     * Check if the request user has the teacher or admin role
     * @return JsonResponse|null
     */
    public function requireAdminOrTeacher(): ?JsonResponse
    {
        $adminCheck = $this->requireAdmin();
        if ($adminCheck === null) return null;
 
        $teacherCheck = $this->requireTeacher();
        if ($teacherCheck === null) return null;
 
        return response()->json(['message' => 'Forbidden'], 403);
    }
}
