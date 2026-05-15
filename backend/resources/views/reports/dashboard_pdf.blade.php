<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Báo cáo Thống kê - SinhVienJob</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 20px; font-weight: bold; color: #3B6FE8; }
        .date { color: #666; margin-top: 5px; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #eee; padding: 8px; text-align: left; }
        th { background-color: #f8fafc; color: #64748b; }
        .stat-grid { display: block; margin-bottom: 20px; }
        .stat-box { display: inline-block; width: 30%; border: 1px solid #eee; padding: 10px; border-radius: 5px; margin-right: 10px; }
        .stat-val { font-size: 18px; font-weight: bold; color: #1e293b; }
        .stat-lbl { font-size: 11px; color: #64748b; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">BÁO CÁO THỐNG KÊ HỆ THỐNG</div>
        <div class="date">Thời gian: {{ $start_date }} đến {{ $end_date }}</div>
    </div>

    <div class="section">
        <div class="section-title">1. Tổng quan</div>
        <div class="stat-grid">
            <div class="stat-box">
                <div class="stat-lbl">Tổng tin đăng</div>
                <div class="stat-val">{{ $overview['total_jobs'] }}</div>
            </div>
            <div class="stat-box">
                <div class="stat-lbl">Tổng đơn ứng tuyển</div>
                <div class="stat-val">{{ $overview['total_applications'] }}</div>
            </div>
            <div class="stat-box">
                <div class="stat-lbl">Số việc làm thành công</div>
                <div class="stat-val">{{ $overview['total_hired'] }}</div>
            </div>
        </div>
    </div>

    <div class="section" style="margin-top: 50px;">
        <p style="text-align: right; font-style: italic; color: #999;">Báo cáo được tạo tự động lúc {{ $generated_at }}</p>
    </div>
</body>
</html>
