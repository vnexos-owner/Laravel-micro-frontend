<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    /**
     * GET /classes
     */
    public function index(Request $request): JsonResponse
    {
        $search         = $request->input('search');
        $page           = $request->input('page', 1);
        $limit          = $request->input('limit');
        $includeDeleted = $request->boolean('includeDeleted', false);
        $semesterId     = $request->input('semester_id');
        $homeroom_teacher_id = $request->input('homeroom_teacher_id');
 
        $query = SchoolClass::query()->with(['homeroomTeacher', 'semester']);
        $query->orderByDesc('created_at');

        if ($includeDeleted) {
            $query->withTrashed();
        }
 
        if($homeroom_teacher_id)
            $query->where('homeroom_teacher_id', $homeroom_teacher_id);

        if ($semesterId) {
            $query->where('semester_id', $semesterId);
        }
 
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%");
            });
        }
 
        if (!$limit) {
            $classes = $query->select('id', 'name', 'semester_id')->get();
            return response()->json($classes, 200);
        }
 
        $classes = $query->paginate($limit, ['*'], 'page', $page);
 
        return response()->json($classes, 200);
    }
 
    /**
     * GET /classes/{id}
     */
    public function show(string $id): JsonResponse
    {
        $class = SchoolClass::with(['homeroomTeacher', 'getSemester', 'courses', 'students'])
            ->findOrFail($id);
 
        return response()->json($class, 200);
    }
 
    /**
     * POST /classes
     */
    public function store(Request $request): JsonResponse
    {
        if ($forbidden = $this->requireAdminOrTeacher()) return $forbidden;
 
        $data = $request->validate([
            'name'                => ['required', 'string', 'max:255'],
            'semester_id'         => ['required', 'string', 'exists:semesters,id'],
            'homeroom_teacher_id' => ['required', 'string', 'exists:users,id'],
        ]);
 
        $class = SchoolClass::create([
            'name'                => $data['name'],
            'semester_id'         => $data['semester_id'],
            'homeroom_teacher_id' => $data['homeroom_teacher_id'],
        ]);
 
        return response()->json($class->load(['homeroomTeacher', 'semester']), 201);
    }
 
    /**
     * PATCH /classes/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        if ($forbidden = $this->requireAdminOrTeacher()) return $forbidden;
 
        $class = SchoolClass::findOrFail($id);
 
        $data = $request->validate([
            'name'                => ['sometimes', 'required', 'string', 'max:255'],
            'semester_id'         => ['sometimes', 'required', 'string', 'exists:semesters,id'],
            'homeroom_teacher_id' => ['sometimes', 'required', 'string', 'exists:users,id'],
        ]);
 
        $class->update($data);
 
        return response()->json($class->fresh(['homeroomTeacher', 'semester']), 200);
    }
 
    /**
     * DELETE /classes/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        if ($forbidden = $this->requireAdminOrTeacher()) return $forbidden;
 
        $class = SchoolClass::findOrFail($id);
        $class->delete();
 
        return response()->json([], 204);
    }

    /**
     * PATCH /classes/{id}/restore
     */
    public function restore(string $id): JsonResponse
    {
        if ($forbidden = $this->requireAdminOrTeacher()) return $forbidden;
 
        $class = SchoolClass::onlyTrashed()->find($id);
        if(!$class)
            return response()->json(["message"=> "Class not found"],404);
        $class->restore();
 
        return response()->json([], 204);
    }
 
    /**
     * GET /classes/{id}/students
     */
    public function getStudents(string $id): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
 
        $class = SchoolClass::findOrFail($id);
 
        // Admin and teacher can always view
        $isAdminOrTeacher = $user->containRoles(['admin', 'teacher']);
 
        // Students can only view if they belong to this class
        if (!$isAdminOrTeacher && !$class->students()->where('student_id', $user->id)->exists()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
 
        return response()->json($class->students, 200);
    }
 
    /**
     * GET /classes/{id}/courses
     */
    public function getCourses(string $id): JsonResponse
    {
        $class = SchoolClass::findOrFail($id);
 
        return response()->json($class->courses, 200);
    }

    /**
     * POST /classes/{id}/students
     */
    public function addStudent(Request $request, string $id): JsonResponse
    {
        if ($forbidden = $this->requireAdminOrTeacher()) return $forbidden;
 
        $class = SchoolClass::findOrFail($id);
 
        $data = $request->validate([
            'student_id' => ['required', 'string', 'exists:users,id'],
        ]);
 
        // Prevent adding the homeroom teacher as a student
        if ($data['student_id'] === $class->homeroom_teacher_id) {
            return response()->json([
                'message' => 'The homeroom teacher cannot be added as a student.',
            ], 422);
        }
 
        // Prevent duplicate students
        if ($class->students()->where('student_id', $data['student_id'])->exists()) {
            return response()->json([
                'message' => 'User is already a student in this class.',
            ], 422);
        }
 
        $class->addStudent($data['student_id']);
 
        return response()->json([
            'message'  => 'Student added successfully.',
            'students' => $class->students,
        ], 200);
    }
 
    /**
     * DELETE /classes/{id}/students
     */
    public function removeStudent(Request $request, string $id): JsonResponse
    {
        if ($forbidden = $this->requireAdminOrTeacher()) return $forbidden;
 
        $class = SchoolClass::findOrFail($id);
 
        $data = $request->validate([
            'student_id' => ['required', 'string', 'exists:users,id'],
        ]);
 
        // Check if the user is actually a student in this class
        if (!$class->students()->where('student_id', $data['student_id'])->exists()) {
            return response()->json([
                'message' => 'User is not a student in this class.',
            ], 422);
        }
 
        $class->removeStudent($data['student_id']);
 
        return response()->json([
            'message'  => 'Student removed successfully.',
            'students' => $class->fresh()->students,
        ], 200);
    }

    /**
     * POST /classes/{id}/courses
     */
    public function addCourse(Request $request, string $id): JsonResponse
    {
        if ($forbidden = $this->requireAdminOrTeacher()) return $forbidden;
 
        $class = SchoolClass::findOrFail($id);
 
        $data = $request->validate([
            'course_id' => ['required', 'string', 'exists:courses,id'],
        ]);
 
        // Prevent duplicate courses
        if ($class->courses()->where('course_id', $data['course_id'])->exists()) {
            return response()->json([
                'message' => 'Course is already assigned to this class.',
            ], 422);
        }
 
        $class->addCourse($data['course_id']);
 
        return response()->json([
            'message' => 'Course added successfully.',
            'courses' => $class->courses,
        ], 200);
    }
 
    /**
     * DELETE /classes/{id}/courses
     */
    public function removeCourse(Request $request, string $id): JsonResponse
    {
        if ($forbidden = $this->requireAdminOrTeacher()) return $forbidden;
 
        $class = SchoolClass::findOrFail($id);
 
        $data = $request->validate([
            'course_id' => ['required', 'string', 'exists:courses,id'],
        ]);
 
        // Check if the course is actually assigned to this class
        if (!$class->courses()->where('course_id', $data['course_id'])->exists()) {
            return response()->json([
                'message' => 'Course is not assigned to this class.',
            ], 422);
        }
 
        $class->removeCourse($data['course_id']);
 
        return response()->json([
            'message' => 'Course removed successfully.',
            'courses' => $class->fresh()->courses,
        ], 200);
    }
}
