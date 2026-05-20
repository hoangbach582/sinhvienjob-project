<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndustryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Khi update, request() có industry parameter là ID của industry (hoặc chuỗi nếu dùng ID)
        $industryId = $this->route('industry');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                // Bỏ qua soft deleted nếu muốn cho phép tạo lại
                Rule::unique('industries')->ignore($industryId)->whereNull('deleted_at'),
            ],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('industries')->ignore($industryId)->whereNull('deleted_at'),
            ],
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ];
    }

    /**
     * Custom messages
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Vui lòng nhập tên ngành nghề.',
            'name.unique' => 'Tên ngành nghề này đã tồn tại.',
            'name.max' => 'Tên ngành nghề không được vượt quá 255 ký tự.',
            'slug.unique' => 'Slug (đường dẫn) này đã tồn tại.',
        ];
    }
}
