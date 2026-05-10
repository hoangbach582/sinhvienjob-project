<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Xác minh địa chỉ Email</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        .footer { margin-top: 20px; font-size: 12px; color: #777; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Xin chào!</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại SinhVienJob. Để hoàn tất quá trình đăng ký, vui lòng xác minh địa chỉ email của bạn bằng cách nhấp vào nút bên dưới:</p>
        
        <p style="text-align: center;">
            <a href="{{ $url }}" class="btn" style="color: #fff;">Xác minh Email</a>
        </p>

        <p>Nếu nút bấm không hoạt động, bạn có thể copy và dán đường dẫn sau vào trình duyệt:</p>
        <p style="word-break: break-all;"><a href="{{ $url }}">{{ $url }}</a></p>

        <p>Liên kết xác minh này sẽ hết hạn sau 24 giờ.</p>

        <p>Nếu bạn không tạo tài khoản, bạn không cần làm gì thêm.</p>

        <div class="footer">
            Trân trọng,<br>
            Đội ngũ SinhVienJob
        </div>
    </div>
</body>
</html>
