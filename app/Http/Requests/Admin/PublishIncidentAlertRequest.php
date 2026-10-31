<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PublishIncidentAlertRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:150'],
            'severity' => ['required', Rule::in(['advisory', 'watch', 'warning', 'critical'])],
            'barangays' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
            'expires_at' => ['required', 'date', 'after:now'],
        ];
    }
}
