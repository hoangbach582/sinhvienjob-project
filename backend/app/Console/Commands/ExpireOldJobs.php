<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Job;
use Carbon\Carbon;

class ExpireOldJobs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'jobs:expire-old';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Tự động đóng các tin tuyển dụng đã được duyệt quá 30 ngày';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Tính thời điểm 30 ngày trước
        $thirtyDaysAgo = Carbon::now()->subDays(30);

        // Lấy các tin đang ở trạng thái approved
        // Ưu tiên dùng reviewed_at (thời điểm admin duyệt), nếu null thì dùng created_at
        $jobs = Job::where('status', 'approved')
            ->where(function ($query) use ($thirtyDaysAgo) {
                $query->where('reviewed_at', '<', $thirtyDaysAgo)
                      ->orWhere(function ($q) use ($thirtyDaysAgo) {
                          $q->whereNull('reviewed_at')
                            ->where('created_at', '<', $thirtyDaysAgo);
                      });
            })
            ->get();

        $count = 0;

        foreach ($jobs as $job) {
            $job->update([
                'status' => 'closed',
                // Tùy chọn: có thể lưu thêm lý do đóng nếu cần thiết
                'rejected_reason' => 'Tin tuyển dụng tự động đóng do quá hạn 30 ngày hiển thị.'
            ]);
            $count++;
        }

        $this->info("Đã đóng thành công {$count} tin tuyển dụng quá hạn 30 ngày.");
    }
}
