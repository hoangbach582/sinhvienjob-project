<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Employer;
use App\Models\StudentProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * AdminAccountController
 * Quản lý tài khoản Nhà tuyển dụng và Sinh viên
 */
class AdminAccountController extends Controller
{
    /**
     * GET /api/admin/accounts
     * Lấy danh sách tài khoản (employer hoặc student)
     * Query: type, status, search, date_from, date_to, page
     */
    public function index(Request $request)
    {
        $type      = $request->query('type', 'employer');    // employer | student
        $status    = $request->query('status');              // active|pending|locked|rejected|''
        $search    = $request->query('search');
        $dateFrom  = $request->query('date_from');
        $dateTo    = $request->query('date_to');
        $perPage   = 15;

        // --- Query cơ bản ---
        $query = User::query()
            ->where('role', $type === 'employer' ? 'employer' : 'student')
            ->when($status,   fn($q) => $q->where('status', $status))
            ->when($dateFrom, fn($q) => $q->whereDate('created_at', '>=', $dateFrom))
            ->when($dateTo,   fn($q) => $q->whereDate('created_at', '<=', $dateTo));

        // --- Tìm kiếm ---
        if ($search) {
            if ($type === 'employer') {
                $query->where(function ($q) use ($search) {
                    $q->where('email', 'like', "%{$search}%")
                      ->orWhereHas('employer', fn($sq) =>
                          $sq->where('company_name', 'like', "%{$search}%")
                      );
                });
            } else {
                $query->where(function ($q) use ($search) {
                    $q->where('email', 'like', "%{$search}%")
                      ->orWhereHas('studentProfile', fn($sq) =>
                          $sq->where('full_name', 'like', "%{$search}%")
                      );
                });
            }
        }

        // --- Eager load quan hệ & đếm ---
        if ($type === 'employer') {
            $query->with(['employer'])
                  ->withCount(['employer as jobs_count' => fn($q) =>
                      $q->join('jobs', 'employers.id', '=', 'jobs.employer_id')
                  ]);
        } else {
            $query->with(['studentProfile'])
                  ->withCount('applications as applications_count');
        }

        $paginated = $query->orderByDesc('created_at')->paginate($perPage);

        return response()->json($paginated);
    }

    /**
     * GET /api/admin/accounts/{id}
     * Chi tiết 1 tài khoản
     */
    public function show($id)
    {
        $user = User::with(['employer', 'studentProfile'])->findOrFail($id);

        $data = $user->toArray();

        if ($user->role === 'employer') {
            // Đếm jobs & applications
            $data['jobs_count']         = $user->employer?->jobs()->count() ?? 0;
            $data['applications_count'] = DB::table('applications')
                ->join('jobs', 'applications.job_id', '=', 'jobs.id')
                ->where('jobs.employer_id', $user->employer?->id)
                ->count();
            // 5 tin tuyển dụng gần đây
            $data['recent_jobs'] = $user->employer?->jobs()
                ->select('id', 'title', 'status', 'created_at')
                ->latest()
                ->take(5)
                ->get();
        } else {
            $data['applications_count'] = $user->applications()->count();
            $data['hired_count']        = $user->applications()->where('status', 'hired')->count();
            // Kỹ năng (nếu có bảng skills)
            $data['skills'] = $user->studentProfile?->skills ?? [];
        }

        return response()->json(['data' => $data]);
    }

    /**
     * PATCH /api/admin/accounts/{id}/approve
     * Duyệt tài khoản nhà tuyển dụng (pending → active)
     */
    public function approve($id)
    {
        $user = User::findOrFail($id);

        if ($user->status !== 'pending') {
            return response()->json(['message' => 'Tài khoản không ở trạng thái chờ duyệt.'], 422);
        }

        $user->update(['status' => 'active']);

        // TODO: gửi email thông báo cho nhà tuyển dụng

        return response()->json(['message' => 'Đã duyệt tài khoản thành công.', 'data' => $user]);
    }

    /**
     * PATCH /api/admin/accounts/{id}/status
     * Cập nhật trạng thái: active | locked
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,locked',
        ]);

        $user = User::findOrFail($id);
        $user->update(['status' => $request->status]);

        $label = $request->status === 'locked' ? 'Khóa' : 'Mở khóa';
        return response()->json(['message' => "{$label} tài khoản thành công.", 'data' => $user]);
    }

    /**
     * DELETE /api/admin/accounts/{id}
     * Xóa tài khoản (soft delete nếu dùng SoftDeletes, hoặc force delete)
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Xóa profile liên quan
        $user->employer?->delete();
        $user->studentProfile?->delete();
        $user->tokens()->delete(); // Thu hồi token Sanctum

        $user->delete();

        return response()->json(['message' => 'Đã xóa tài khoản thành công.']);
    }

    /**
     * POST /api/admin/accounts/bulk-action
     * Bulk actions: approve | lock | unlock | delete
     */
    public function bulkAction(Request $request)
    {
        $request->validate([
            'ids'    => 'required|array',
            'ids.*'  => 'required|string',
            'action' => 'required|in:approve,lock,unlock,delete',
        ]);

        $ids    = $request->ids;
        $action = $request->action;
        $users  = User::whereIn('id', $ids)->get();

        foreach ($users as $user) {
            match ($action) {
                'approve' => $user->update(['status' => 'active']),
                'lock'    => $user->update(['status' => 'locked']),
                'unlock'  => $user->update(['status' => 'active']),
                'delete'  => $user->delete(),
            };
        }

        return response()->json([
            'message' => "Đã thực hiện hành động '{$action}' cho " . count($ids) . " tài khoản.",
        ]);
    }

    /**
     * GET /api/admin/accounts/export
     * Xuất Excel (dưới dạng file CSV UTF-8 kèm BOM để Excel đọc tiếng Việt không lỗi)
     */
    public function export(Request $request)
    {
        $type   = $request->query('type', 'employer');
        $status = $request->query('status');
        $search = $request->query('search');

        $query = User::query()
            ->where('role', $type === 'employer' ? 'employer' : 'student')
            ->when($status, fn($q) => $q->where('status', $status));

        if ($search) {
            if ($type === 'employer') {
                $query->where(function ($q) use ($search) {
                    $q->where('email', 'like', "%{$search}%")
                      ->orWhereHas('employer', fn($sq) =>
                          $sq->where('company_name', 'like', "%{$search}%")
                      );
                });
            } else {
                $query->where(function ($q) use ($search) {
                    $q->where('email', 'like', "%{$search}%")
                      ->orWhereHas('studentProfile', fn($sq) =>
                          $sq->where('full_name', 'like', "%{$search}%")
                      );
                });
            }
        }

        if ($type === 'employer') {
            $query->with(['employer'])
                  ->withCount(['employer as jobs_count' => fn($q) =>
                      $q->join('jobs', 'employers.id', '=', 'jobs.employer_id')
                  ]);
            $users = $query->orderByDesc('created_at')->get();

            $headers = [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="danh_sach_nha_tuyen_dung_' . time() . '.csv"',
            ];

            $callback = function () use ($users) {
                $file = fopen('php://output', 'w');
                // Xuất BOM UTF-8 để Excel hiển thị đúng dấu Tiếng Việt
                fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
                
                fputcsv($file, ['ID', 'Tên công ty', 'Email', 'Ngày đăng ký', 'Số tin đã đăng', 'Trạng thái']);
                foreach ($users as $user) {
                    fputcsv($file, [
                        $user->id,
                        $user->employer?->company_name ?? $user->name,
                        $user->email,
                        $user->created_at ? $user->created_at->format('d/m/Y H:i') : '',
                        $user->jobs_count ?? 0,
                        $user->status
                    ]);
                }
                fclose($file);
            };
        } else {
            $query->with(['studentProfile'])
                  ->withCount('applications as applications_count');
            $users = $query->orderByDesc('created_at')->get();

            $headers = [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="danh_sach_ung_vien_' . time() . '.csv"',
            ];

            $callback = function () use ($users) {
                $file = fopen('php://output', 'w');
                // Xuất BOM UTF-8
                fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

                fputcsv($file, ['ID', 'Họ tên', 'Email', 'Ngày đăng ký', 'Số đơn đã nộp', 'Trạng thái']);
                foreach ($users as $user) {
                    fputcsv($file, [
                        $user->id,
                        $user->studentProfile?->full_name ?? $user->name,
                        $user->email,
                        $user->created_at ? $user->created_at->format('d/m/Y H:i') : '',
                        $user->applications_count ?? 0,
                        $user->status
                    ]);
                }
                fclose($file);
            };
        }

        return response()->stream($callback, 200, $headers);
    }
}
