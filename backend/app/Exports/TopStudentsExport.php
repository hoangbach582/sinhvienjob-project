<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class TopStudentsExport implements FromCollection, WithHeadings
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
        return DB::table('student_profiles')
            ->select(
                'student_profiles.full_name',
                DB::raw('count(applications.id) as app_count'),
                DB::raw('sum(case when applications.status = "accepted" then 1 else 0 end) as hired_count')
            )
            ->leftJoin('applications', 'student_profiles.id', '=', 'applications.student_id')
            ->whereBetween('applications.created_at', [$this->startDate, $this->endDate])
            ->groupBy('student_profiles.id', 'student_profiles.full_name')
            ->orderBy('app_count', 'desc')
            ->get()
            ->map(function ($student) {
                return [
                    'full_name' => $student->full_name,
                    'app_count' => $student->app_count,
                    'hired_count' => $student->hired_count,
                    'hired_rate' => ($student->app_count > 0 ? round(($student->hired_count / $student->app_count) * 100, 2) : 0) . '%'
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Họ và tên Sinh viên',
            'Số đơn ứng tuyển',
            'Số việc làm đã nhận',
            'Tỷ lệ trúng tuyển'
        ];
    }
}
