<?php

namespace App\Exports;

use App\Models\Job;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ApplicationsByIndustryExport implements FromCollection, WithHeadings
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
        return Job::select('industry', DB::raw('count(*) as job_count'))
            ->whereBetween('created_at', [$this->startDate, $this->endDate])
            ->whereNotNull('industry')
            ->groupBy('industry')
            ->orderBy('job_count', 'desc')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Ngành nghề',
            'Số lượng tin tuyển dụng'
        ];
    }
}
