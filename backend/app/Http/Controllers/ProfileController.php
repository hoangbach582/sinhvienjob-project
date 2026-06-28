<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentProfile;
use App\Models\Skill;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    // 1. Hàm lấy thông tin Hồ sơ
    public function getProfile(Request $request)
    {
        $user = $request->user();
        
        // Tìm profile của sinh viên, kèm theo email từ bảng users và các kỹ năng
        $profile = StudentProfile::with('skills')->where('user_id', $user->id)->first();
        
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
            'portfolio_url' => 'nullable|url|max:255',
            'education' => 'nullable|string',
            'experience' => 'nullable|string',
            'projects' => 'nullable|string',
            'skills' => 'nullable|string',
        ]);

        // Cập nhật các trường Text thông thường
        $profile->full_name = $request->full_name;
        $profile->phone = $request->phone;
        $profile->bio = $request->bio;
        $profile->portfolio_url = $request->portfolio_url;

        // Parse JSON fields sent via FormData
        if ($request->has('education')) {
            $profile->education = json_decode($request->education, true);
        }
        if ($request->has('experience')) {
            $profile->experience = json_decode($request->experience, true);
        }
        if ($request->has('projects')) {
            $profile->projects = json_decode($request->projects, true);
        }

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

        // Xử lý skills
        if ($request->has('skills')) {
            $skillsData = json_decode($request->skills, true); // mảng dạng [{skill_id, name, level}]
            if (is_array($skillsData)) {
                $syncData = [];
                foreach ($skillsData as $skill) {
                    $skillId = null;
                    if (!empty($skill['skill_id'])) {
                        $skillId = $skill['skill_id'];
                    } elseif (!empty($skill['name'])) {
                        // Find or create skill by name
                        $dbSkill = Skill::firstOrCreate(['name' => trim($skill['name'])]);
                        $skillId = $dbSkill->id;
                    }
                    
                    if ($skillId) {
                        $syncData[$skillId] = ['level' => $skill['level'] ?? 'beginner'];
                    }
                }
                $profile->skills()->sync($syncData);
            }
        }

        // Tải lại profile để trả về data mới nhất
        $profile->load('skills');

        return response()->json([
            'message' => 'Cập nhật hồ sơ thành công!',
            'profile' => $profile
        ]);
    }
}