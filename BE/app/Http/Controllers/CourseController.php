<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * GET /courses
     * List all courses with optional filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Course::query();
 
        $search = $request->input('search');
        $page = $request->input('page', 1);
        $limit = $request->input('limit');
        $includeDeleted = $request->boolean('includeDeleted', false);

        $query = Course::query();
        $query->orderByDesc('id');

        // Include soft-deleted records if requested
        if ($includeDeleted) {
            $query->withTrashed();
        }

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'LIKE', "%{$search}%")
                ->orWhere('name', 'LIKE', "%{$search}%")
                ->orWhere('prerequisite', 'LIKE', "%{$search}%");
            });
        }

        if (!$limit) {
            $courses = $query->get();
            return response()->json($courses, 200);
        }

        // Paginate results
        $courses = $query->paginate($limit, ['*'], 'page', $page);

        return response()->json($courses, 200);
    }
 
    /**
     * GET /courses/{id}
     * Show a single course.
     */
    public function show(string $id): JsonResponse
    {
        $course = Course::with('classes')->findOrFail($id);
 
        return response()->json($course);
    }
 
    /**
     * POST /courses
     * Create a new course.
     */
    public function store(Request $request): JsonResponse
    {
        if ($forbidden = $this->requireAdmin()) return $forbidden;

        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'code'         => ['required', 'string', 'max:50', 'unique:courses,code,NULL,id,deleted_at,NULL'],
            'prerequisite' => ['nullable', 'string', 'exists:courses,id'],
        ]);
 
        $course = Course::create([
            'name'         => $validated['name'],
            'code'         => $validated['code'],
            'prerequisite' => $validated['prerequisite'] ?? null,
        ]);
 
        return response()->json($course->load('classes'), 201);
    }
 
    /**
     * PATCH /courses/{id}
     * Partially update an existing course.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        if ($forbidden = $this->requireAdmin()) return $forbidden;

        $course = Course::findOrFail($id);
 
        $validated = $request->validate([
            'name'         => ['sometimes', 'required', 'string', 'max:255'],
            'code'         => ['sometimes', 'required', 'string', 'max:50', "unique:courses,code,$id,id,deleted_at,NULL"],
            'prerequisite' => ['sometimes', 'nullable', 'string', 'exists:courses,id'],
        ]);
 
        $course->update($validated);
 
        return response()->json($course->fresh('classes'));
    }
 
    /**
     * DELETE /courses/{id}
     * Soft-delete a course.
     */
    public function destroy(string $id): JsonResponse
    {
        if ($forbidden = $this->requireAdmin()) return $forbidden;

        $course = Course::findOrFail($id);
        $course->delete();
 
        return response()->json([], 204);
    }

    /**
     * PATCH /courses/{id}/restore
     * Restore a deleted course
     */
    public function restore(string $id): JsonResponse
    {
        if ($forbidden = $this->requireAdmin()) return $forbidden;

        $course = Course::onlyTrashed()->find($id);
        if(! $course)
            return response()->json([
                'message'=> 'Course not found'
            ], 404);
        $course->restore();

        return response()->json([], 204);
    }
}
