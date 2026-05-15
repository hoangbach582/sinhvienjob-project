<?php

namespace App\Exports;

use App\Models\Job;
use App\Models\Application;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Carbon\Carbon;

class DashboardSummaryExport implements FromCollection, WithHeadings, WithMapping
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function collection()
    {
        return Job::whereBetween('created_at', [$this->startDate, $this->endDate])
            ->withCount(['applications', 'applications as hired_count' => function($query) {
                $query->where('status', 'accepted');
            }])
            ->get();
    }

    public function headings(): array
    {
        return [
            'ID Công việc',
            'Tiêu đề',
            'Ngành nghề',
            'Địa điểm',
            'Trạng thái',
            'Ngày đăng',
            'Số đơn ứng tuyển',
            'Số người được nhận',
            'Tỷ lệ chuyển đổi (%)'
        ];
    }

    public function map($job): array
    {
        $conversionRate = $job->applications_count > 0 
            ? round(($job->hired_count / $job->applications_count) * 100, 2) 
            : 0;

        return [
            $job->id,
            $job->title,
            $job->industry,
            $job->location,
            $job->status,
            $job->created_at->toDateTimeString(),
            $job->applications_count,
            $job->hired_count,
            $conversionRate . '%'
        ];
    }
}
