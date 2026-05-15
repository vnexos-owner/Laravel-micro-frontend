<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SemesterController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $search         = $request->input('search');
        $page           = $request->input('page', 1);
        $limit          = (int) $request->input('limit');
        $includeDeleted = $request->boolean('includeDeleted', false);

        $query = Semester::query();
        $query->orderByDesc('created_at');

        if ($includeDeleted) {
            $query->withTrashed();
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%");
            });
        }

        if(!$limit) {
            $semesters = $query->get();
            return response()->json($semesters, 200);
        }

        $semesters = $query->paginate($limit, ['*'], 'page', $page);

        return response()->json($semesters, 200);
    }

    public function show(string $id): JsonResponse
    {
        $semester = Semester::find($id);
        
        if(!$semester)
            return response()->json([
                'message'=> 'Semester not found'
            ], 404);

        return response()->json($semester, 200);
    }

    public function store(Request $request): JsonResponse
    {
        if ($forbidden = $this->requireAdmin()) return $forbidden;

        $data = $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'start_time' => ['required', 'date'],
            'end_time'   => ['required', 'date', 'after:start_time'],
        ]);

        $semester = Semester::create($data);

        return response()->json($semester, 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if ($forbidden = $this->requireAdmin()) return $forbidden;

        $semester = Semester::findOrFail($id);

        $data = $request->validate([
            'name'       => ['sometimes', 'string', 'max:255'],
            'start_time' => ['sometimes', 'date'],
            'end_time'   => ['sometimes', 'date', 'after:start_time'],
        ]);

        $semester->update($data);

        return response()->json($semester);
    }

    public function setCurrent(string $id): JsonResponse
    {
        if ($forbidden = $this->requireAdmin()) return $forbidden;

        $semester = Semester::findOrFail($id);
        $semester->setCurrentSemester();

        return response()->json([], 204);
    }

    public function destroy(string $id): JsonResponse
    {
        if ($forbidden = $this->requireAdmin()) return $forbidden;

        $semester = Semester::findOrFail($id);
        $semester->delete();

        return response()->json([], 204);
    }

    public function restore(string $id): JsonResponse
    {
        if ($forbidden = $this->requireAdmin()) return $forbidden;

        $semester = Semester::onlyTrashed()->find($id);
        if(!$semester) 
            return response()->json([
                'message' => 'Semester not found'
            ],404);
        $semester->restore();

        return response()->json([], 204);
    }

    public function getCurrent(): JsonResponse
    {
        $semester = Semester::where('is_current', '1')->first();

        if(!$semester)
            return response()->json([
                'message'=> 'There is no current semesters!'
            ],400);

        return response()->json($semester, 200);
    }
}
