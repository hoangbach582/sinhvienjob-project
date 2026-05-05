<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentProfile;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    // 1. Hàm lấy thông tin Hồ sơ
    public function getProfile(Request $request)
    {
        $user = $request->user();
        
        // Tìm profile của sinh viên, kèm theo email từ bảng users
        $profile = StudentProfile::where('user_id', $user->id)->first();
        
        if (!$profile) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ'], 404);
        }

        // Gắn thêm email vào data trả về để hiển thị
        $profile->email = $user->email;

        return response()->json($profile);
    }

    // 2. Hàm cập nhật Hồ sơ (Nhận text và File)
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $profile = StudentProfile::where('user_id', $user->id)->first();

        if (!$profile) {
            return response()->json(['message' => 'Không tìm thấy hồ sơ'], 404);
        }

        // Kiểm tra dữ liệu đầu vào (Validate)
        $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Ảnh tối đa 2MB
            'cv' => 'nullable|mimes:pdf|max:5120', // CV phải là PDF, tối đa 5MB
        ]);

        // Cập nhật các trường Text thông thường
        $profile->full_name = $request->full_name;
        $profile->phone = $request->phone;
        $profile->bio = $request->bio;

        // Xử lý lưu File Avatar (nếu có tải lên)
        if ($request->hasFile('avatar')) {
            // Xóa file cũ nếu có (tùy chọn để tiết kiệm dung lượng)
            // if ($profile->avatar) { Storage::disk('public')->delete(str_replace('/storage/', '', parse_url($profile->avatar, PHP_URL_PATH))); }
            
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $profile->avatar = asset('storage/' . $avatarPath); // Lưu dạng URL đầy đủ
        }

        // Xử lý lưu File CV (nếu có tải lên)
        if ($request->hasFile('cv')) {
            $cvPath = $request->file('cv')->store('cvs', 'public');
            $profile->cv_url = asset('storage/' . $cvPath); // Lưu dạng URL đầy đủ
        }

        $profile->save();

        return response()->json([
            'message' => 'Cập nhật hồ sơ thành công!',
            'profile' => $profile
        ]);
    }
}