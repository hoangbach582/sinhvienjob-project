<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Phải là employer thì mới được gọi request này
        return auth('sanctum')->check() && auth('sanctum')->user()->role === 'employer';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'type' => 'required|in:internship,part_time,full_time,remote,collaborator',
            'vacancies' => 'nullable|integer|min:1',
            'industry' => 'nullable|string|max:255',
            'salary_min' => 'nullable|numeric|min:0|max:10000000',
            'salary_max' => 'nullable|numeric|min:0|max:10000000|gte:salary_min',
            'location' => 'nullable|string|max:255',
            'specific_address' => 'nullable|string|max:255',
            'working_hours' => 'nullable|string|max:255',
            'experience' => 'nullable|string|max:255',
            'education_level' => 'nullable|string|max:255',
            'gender' => 'nullable|in:any,male,female',
            'deadline' => 'nullable|date|after_or_equal:today',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Vui lòng nhập tiêu đề công việc.',
            'type.required' => 'Vui lòng chọn loại hình công việc.',
            'type.in' => 'Loại hình công việc không hợp lệ.',
            'description.required' => 'Vui lòng nhập mô tả công việc.',
            'salary_max.gte' => 'Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu.',
            'salary_min.max' => 'Vì đây là nền tảng dành cho sinh viên, mức lương tối đa không được vượt quá 10.000.000 VND.',
            'salary_max.max' => 'Vì đây là nền tảng dành cho sinh viên, mức lương tối đa không được vượt quá 10.000.000 VND.',
            'deadline.after_or_equal' => 'Hạn nộp hồ sơ phải từ hôm nay trở đi.'
        ];
    }
}
