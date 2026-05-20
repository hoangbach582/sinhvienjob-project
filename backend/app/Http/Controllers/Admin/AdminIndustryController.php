<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Industry;
use App\Models\Job;
use Illuminate\Support\Str;
use App\Http\Requests\IndustryRequest;

class AdminIndustryController extends Controller
{
    /**
     * Lấy danh sách ngành nghề
     */
    public function index(Request $request)
    {
        $query = Industry::withCount('jobs');

        // Tìm kiếm theo tên
        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'LIKE', '%' . $request->search . '%');
        }

        // Lọc theo trạng thái
        if ($request->filled('status') && $request->status != 'all') {
            $isActive = $request->status === 'active' ? true : false;
            $query->where('is_active', $isActive);
        }

        // Sắp xếp
        $sortBy = $request->input('sort_by', 'created_at'); // jobs_count, name, status, created_at
        $sortOrder = $request->input('sort_order', 'desc');

        if (in_array($sortBy, ['name', 'is_active', 'created_at', 'jobs_count'])) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Phân trang
        $perPage = $request->input('per_page', 10);
        $industries = $query->paginate($perPage);

        return response()->json($industries);
    }

    /**
     * Thêm mới ngành nghề
     */
    public function store(IndustryRequest $request)
    {

        $slug = $request->slug ? Str::slug($request->slug) : Str::slug($request->name);

        $industry = Industry::create([
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json([
            'message' => 'Thêm ngành nghề thành công',
            'industry' => $industry
        ], 201);
    }

    /**
     * Cập nhật ngành nghề
     */
    public function update(IndustryRequest $request, $id)
    {
        $industry = Industry::findOrFail($id);

        $oldName = $industry->name;
        $newName = $request->name;
        $slug = $request->slug ? Str::slug($request->slug) : Str::slug($newName);

        $industry->update([
            'name' => $newName,
            'slug' => $slug,
            'description' => $request->description,
            'is_active' => $request->is_active ?? $industry->is_active,
        ]);

        // Nếu tên ngành thay đổi, cập nhật luôn các job đang dùng ngành cũ
        if ($oldName !== $newName) {
            Job::where('industry', $oldName)->update(['industry' => $newName]);
        }

        return response()->json([
            'message' => 'Cập nhật ngành nghề thành công',
            'industry' => $industry
        ]);
    }

    /**
     * Thay đổi trạng thái ẩn/hiện
     */
    public function toggleStatus($id)
    {
        $industry = Industry::findOrFail($id);
        
        $industry->is_active = !$industry->is_active;
        $industry->save();

        return response()->json([
            'message' => 'Cập nhật trạng thái thành công',
            'industry' => $industry
        ]);
    }

    /**
     * Xóa ngành nghề
     */
    public function destroy($id)
    {
        $industry = Industry::findOrFail($id);
        
        // Kiểm tra xem có công việc nào đang dùng ngành này không
        $jobsCount = Job::where('industry', $industry->name)->count();
        
        if ($jobsCount > 0) {
            return response()->json([
                'message' => 'Không thể xóa ngành nghề này vì đang có ' . $jobsCount . ' tin tuyển dụng sử dụng.'
            ], 400);
        }

        $industry->delete();

        return response()->json([
            'message' => 'Đã xóa ngành nghề thành công'
        ]);
    }
}
