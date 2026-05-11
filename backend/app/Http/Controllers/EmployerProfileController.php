<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmployerProfileController extends Controller
{
    /**
     * Lấy thông tin profile của nhà tuyển dụng hiện tại
     */
    public function show(Request $request)
    {
        $user = $request->user();
        
        if ($user->role !== 'employer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $employer = $user->employer;

        if (!$employer) {
            // Nếu chưa có profile, trả về object rỗng với các trường mặc định để frontend không bị lỗi
            return response()->json([
                'company_name' => '',
                'industry' => '',
                'website' => '',
                'description' => '',
                'logo_url' => null
            ]);
        }

        return response()->json($employer);
    }

    /**
     * Cập nhật thông tin profile của nhà tuyển dụng
     */
    public function update(Request $request)
    {
        $user = $request->user();
        
        if ($user->role !== 'employer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'website' => 'nullable|url|max:255',
            'description' => 'nullable|string|max:2000',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // max 2MB
        ]);

        $employer = $user->employer;

        if (!$employer) {
            // Trong trường hợp đăng ký nhưng chưa có profile (thường là đã có qua event/observer, nhưng đề phòng)
            $employer = $user->employer()->create([
                'company_name' => $validated['company_name']
            ]);
        }

        // Xử lý upload logo
        if ($request->hasFile('logo')) {
            // Xóa logo cũ nếu có
            if ($employer->logo_url) {
                // Xóa file cũ
                $oldPath = str_replace(asset('storage/'), '', $employer->logo_url);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $path = $request->file('logo')->store('company_logos', 'public');
            $employer->logo_url = asset('storage/' . $path);
        } elseif ($request->input('logo') === 'null' || $request->input('logo') === '') {
            // Xóa logo cũ nếu yêu cầu từ frontend
            if ($employer->logo_url) {
                $oldPath = str_replace(asset('storage/'), '', $employer->logo_url);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
                $employer->logo_url = null;
            }
        }

        $employer->company_name = $validated['company_name'];
        if (isset($validated['industry'])) {
            $employer->industry = $validated['industry'];
        }
        if (isset($validated['website'])) {
            $employer->website = $validated['website'];
        }
        if (array_key_exists('description', $validated)) {
            $employer->description = $validated['description'];
        }

        $employer->save();

        return response()->json([
            'message' => 'Cập nhật thông tin công ty thành công',
            'employer' => $employer
        ]);
    }
}
