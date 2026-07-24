# Đối chiếu yêu cầu hệ thống phần mềm

Tài liệu này đối chiếu bộ yêu cầu kỹ thuật "Hệ thống phần mềm" (dạng spec/thầu, mô phỏng theo phần mềm VMS thương mại như Milestone/Synology) với những gì hệ thống hiện tại (`wata-backend`, `emap-demo`, `wata-anpr-service`, `wata-face-service`, `wata-behavior-service`) đã thực sự làm được, dựa trên việc đọc trực tiếp source code.

**Lưu ý quan trọng**: đây là hệ thống **tự phát triển (custom/in-house)**, không phải phần mềm thương mại đóng gói mua license từ hãng thứ 3. Vì vậy một số yêu cầu trong spec (vốn mô tả đặc điểm của phần mềm VMS thương mại có sẵn) không áp dụng được theo đúng nghĩa đen cho một hệ thống tự viết.

Chú thích trạng thái: ✅ Đã có · ⚠️ Có một phần / khác cách tiếp cận · ❌ Chưa có / không áp dụng được.

---

## 1. Yêu cầu chung

| Yêu cầu | Trạng thái | Ghi chú |
|---|---|---|
| Giao diện Việt/Anh | ✅ | `src/i18n/locales/vi.ts`, `en.ts`, component `LanguageSwitcher` |
| Chứng nhận sở hữu trí tuệ, đăng ký bản quyền tác giả | ❌ | Thủ tục pháp lý (đăng ký với Cục Bản quyền tác giả), không phải việc của code — cần tự làm riêng nếu muốn dự thầu |
| Là phần mềm thương mại có bản quyền, mua 1 lần, không phí bảo trì hàng năm | ❌ | Hệ thống tự viết (in-house), không phải mua license hãng thứ 3 — về bản chất **ngược tinh thần** yêu cầu này, vốn mô tả đặc điểm phần mềm VMS thương mại có sẵn |
| Quản lý không giới hạn server/site/camera | ⚠️ | Kiến trúc hiện tại là **1 server duy nhất** (1 VMS.Api + 1 MediaMTX), chưa có khái niệm nhiều site/server liên kết nhau |
| Chấp nhận H.264/H.265/MJPEG/MPEG-4, độ phân giải HD/FullHD/4K | ✅ | Qua MediaMTX (`mediamtx.yml`) — passthrough RTSP, không transcode nên phụ thuộc camera nguồn |
| Tích hợp >90 hãng camera, hybrid Analog+IP | ⚠️ | Hỗ trợ mọi camera RTSP chuẩn + auto-discover ONVIF (WS-Discovery), nhưng chưa test/certify theo danh sách hãng cụ thể; không có driver riêng cho DVR/camera Analog (không hybrid) |
| Windows Server 2012/2016, Windows 7/8/10/11 | ⚠️ | Backend .NET 8 dùng `UseWindowsService` (chạy được như Windows Service), nhưng .NET 8 chính thức chỉ hỗ trợ từ Windows 10/Server 2016 trở lên |
| Desktop app, Monitoring app, Web browser, Mobile iOS/Android | ⚠️ | Có **Web client** (`emap-demo`, chạy trên Chrome/Edge/Firefox). Từng có **Desktop client WPF** (`wata-desktop-client`) nhưng **đã bị xoá** theo yêu cầu trước đó — hiện KHÔNG còn desktop app. Chưa có Monitoring app riêng, chưa có app Mobile iOS/Android |
| Giám sát CPU/RAM/băng thông/ổ cứng, tình trạng ghi hình camera | ⚠️ | `SystemHealthMonitorService` đã lấy CPU/RAM/Ổ đĩa (Windows PerformanceCounter) đẩy qua SignalR — chưa có băng thông mạng, chưa track riêng "thời gian ghi hình" từng camera (chỉ có trạng thái online/offline) |
| Tích hợp API/SDK bên thứ 3 | ⚠️ | Có REST API (`VMS.Api` controllers) nhưng chưa đóng gói SDK chính thức (không có Client Kit cho VB.NET/Delphi/C++) |
| HTTP API đơn giản hoá cho bên thứ 3 | ✅ | Toàn bộ tương tác đã là REST/JSON qua HTTP |

## 2. Yêu cầu phần mềm Server

### Cấu hình server

| Yêu cầu | Trạng thái | Ghi chú |
|---|---|---|
| Chạy dạng Windows service | ✅ | `src/VMS.Api/Program.cs` dùng `UseWindowsService` |
| Sao lưu cấu hình tự động + thủ công | ✅ | Export backup thủ công + sao lưu tự động 24h, giữ 14 bản gần nhất |
| Khôi phục cấu hình thủ công | ✅ | Restore từ file `.json` backup (panel Quản lý người dùng) |
| Nâng cấp từ xa, đặt lại cấu hình | ❌ | Không có cơ chế remote upgrade/deploy phiên bản mới |
| Watchdog Service | ✅ | `WatchdogService.cs` (theo dõi kết nối DB, tự thoát tiến trình khi lỗi liên tục) + script supervisor cho dev; triển khai thật cần cấu hình thêm SCM Recovery Actions |

### Hỗ trợ hình ảnh

| Yêu cầu | Trạng thái |
|---|---|
| H.264, H.265, MPEG4, MJPEG, JPEG | ✅ qua MediaMTX |
| RTSP, HTTP | ✅ (RTSP nguồn, HTTP/HLS phát ra client) |

### Thuộc tính lưu trữ

| Yêu cầu | Trạng thái | Ghi chú |
|---|---|---|
| Tự động lập lịch sao lưu file lưu trữ | ⚠️ | Có sao lưu **cấu hình hệ thống**, không phải sao lưu **file video** sang nơi khác — video chỉ lưu trên đĩa server theo chính sách `recordDeleteAfter` |
| Ghi hình theo lịch biểu / thiết lập riêng | ⚠️ | Có `RecordingMode` + `RecordingModeService`, cần xác nhận thêm có lịch biểu theo giờ/ngày cụ thể hay chỉ theo chế độ (liên tục/motion/event) |
| Ghi theo chuyển động/sự kiện | ✅ | Ghi liên tục qua MediaMTX + AutoBookmark/EventClip theo sự kiện AI |
| Ghi luồng phụ (dual-stream) | ❌ | Mỗi camera chỉ có 1 luồng RTSP/HLS |
| Mã hoá AES 128/256 cho file ghi hình | ❌ | File `.mp4`/segment lưu dạng thường, không mã hoá |
| Lưu trữ riêng theo kênh/nhóm/luồng | ⚠️ | Mỗi camera có thư mục riêng (theo path MediaMTX), chưa có cấu hình lưu trữ riêng theo nhóm (chỉ phân theo Zone ở mức hiển thị) |
| Đánh dấu thủ công/tự động/bán tự động | ✅ | Bookmark thủ công + `AutoBookmarkService` (🤖 tự tạo theo sự kiện AI) |
| Edge Recording (ONVIF Profile G) | ❌ | Chưa có |

### Khả năng giám sát

| Yêu cầu | Trạng thái | Ghi chú |
|---|---|---|
| Nhiều client PC giám sát cùng lúc | ✅ | Web client, nhiều tab/máy đều gọi chung 1 backend |
| Tự động bật lại chế độ xem trước đó khi tắt/mở lại | ✅ | `GET /api/auth/me` + `PUT /api/auth/me/last-view` — tự khôi phục Camera Wall (xem [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md) mục 16) |
| Tự động xuất hình ra nhiều màn hình khác nhau cùng máy | ❌ | Tính năng multi-monitor tầng OS/desktop app — không áp dụng cho web client, và desktop client đã bị xoá |
| Web Browser, Mobile app iOS/Android | ⚠️ | Chỉ có Web; chưa có app mobile riêng |

### Watchdog

✅ Đã có ở tầng service (`WatchdogService`) + `ScheduledRestartService` (lập lịch khởi động lại định kỳ, cấu hình qua `appsettings.json`). Chưa có Watchdog riêng cho "Monitoring app" vì monitoring app chưa tồn tại.

### Module VCA

✅ Đã có khá đầy đủ — `VcaPanel` (frontend) + `VcaController` (backend): vẽ line (đếm/tripwire theo 2 chiều A→B/B→A), vẽ vùng (cảnh báo xâm nhập + lảng vảng theo số giây tuỳ chỉnh). ⚠️ Chưa có riêng "vùng không phát hiện" (exclusion zone) và "lọc theo hướng đối tượng" dạng nâng cao.

### SDK/API

⚠️ Có REST API đầy đủ cho các nghiệp vụ, nhưng chưa đóng gói thành SDK chính thức, chưa hỗ trợ multi-IDE (VB.NET/Delphi) như spec mô tả.

### AD & LDAP

⚠️ Một phần — `LdapAuthService` hỗ trợ **bind trực tiếp** để xác thực khi đăng nhập. **Chưa có**: trích xuất danh sách user từ AD, đồng bộ nhiều nhóm AD, tự động đồng bộ tài khoản bị xoá/tạo mới.

### E-Maps

⚠️ Khác cách tiếp cận — hệ thống dùng bản đồ địa lý thực (OpenStreetMap qua OpenLayers) với marker camera/zone/heatmap/tìm bán kính, **không phải** upload ảnh sơ đồ mặt bằng (JPG/PNG/BMP tới 8.25MP) như spec mô tả. Về nghiệp vụ tương tác (click xem camera, cảnh báo realtime trên bản đồ, heatmap) thì đã có đầy đủ.

### Video wall

⚠️ Khác quy mô — có "Camera Wall" (lưới NxN trong 1 cửa sổ trình duyệt, tối đa cấu hình 32×32). Đây là **grid xem nhiều camera trong 1 màn hình**, KHÔNG phải "Video Wall" đúng nghĩa doanh nghiệp (đẩy layout ra nhiều màn hình vật lý/nhiều máy tính khác nhau, điều khiển từ xa qua client riêng, chia sẻ tức thời giữa các video wall). Yêu cầu "100 màn hình, 20 hàng/cột" **chưa có**.

### Mô-đun nhận dạng biển số xe (ANPR)

✅ Có gần đủ — black/white list, cảnh báo theo khớp danh sách, truy vết lộ trình trên bản đồ, khoanh vùng địa lý giám sát. Không giới hạn cứng số camera/số biển số (tự lưu DB).

### Mô-đun nhận dạng khuôn mặt

✅ Có — nhận diện nhiều khuôn mặt/ảnh, so khớp kiểu "1-to-N" với danh sách đã đăng ký, chống giả mạo (anti-spoofing/liveness), lưu ảnh vào DB, điểm danh + báo cáo Excel. ⚠️ Chưa xác nhận có PTZ tự động quét nhiều khu vực để tìm khuôn mặt.

---

## 3. Bảng 6 module license

| # | Module | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | Quản lý camera | ✅ Phần lớn đã có | Xem/ghi/xem lại, ONVIF discovery, PTZ (UI đã có, cần xác nhận backend đã điều khiển PTZ thật chưa), zoom digital, layout tuỳ chỉnh, backup/export mp4, lập lịch restart, phân quyền theo camera/chức năng/giờ, cảnh báo mất kết nối, đa ngôn ngữ, bookmark, favorite camera, favorite view, auto-popup + âm thanh khi có sự kiện. ⚠️ Thiếu: app Android/iOS, xử lý đa nhiệm GPU (không thấy code GPU/CUDA), quản lý theo "Ổ cứng" cụ thể (chỉ theo dung lượng chung, chưa cân bằng tải nhiều ổ) |
| 2 | ANPR | ✅ Đã có đủ | |
| 3 | AI khuôn mặt | ⚠️ Phần lớn đã có | Thiếu PTZ tự quét nhiều khu vực |
| 4 | AI hành vi (đám đông/rác/vũ khí) | ✅ Đã có đủ | |
| 5 | E-Map | ⚠️ Có nghiệp vụ tương tác | Dùng bản đồ địa lý thay vì bản đồ số tự vẽ/upload |
| 6 | Dashboard thông minh | ✅ Đã có | Biểu đồ sự kiện, xu hướng tăng/giảm theo zone, sức khoẻ CPU/RAM/HDD |

---

## 4. Tóm tắt — điểm cần lưu ý nhất

1. **Nhóm không thể đáp ứng theo đúng nghĩa vì bản chất là hệ thống tự viết**: chứng nhận sở hữu trí tuệ/bản quyền tác giả, "phần mềm thương mại mua 1 lần không phí bảo trì", chứng nhận tương thích >90 hãng camera, hybrid Analog/IP thật sự.
2. **Thiếu hẳn, cần làm thêm nếu muốn đạt**: Mobile app iOS/Android, Monitoring app riêng, Video Wall đa màn hình/đa máy thật sự, mã hoá AES cho file ghi hình, Edge Recording ONVIF Profile G, đồng bộ nhóm AD/LDAP, ghi luồng phụ (dual-stream), SDK đóng gói chính thức.
3. **Desktop client đã từng có nhưng bị xoá** theo yêu cầu trước đó — nếu spec này dùng để chào thầu, cần cân nhắc khôi phục hoặc làm lại.
4. **Điểm mạnh thực sự vượt spec cơ bản**: bộ 4 module AI (ANPR, Face, Behavior, VCA) đã tích hợp sẵn trong cùng hệ thống, không cần license riêng như các hãng VMS thương mại — đây có thể là điểm khác biệt cạnh tranh nếu trình bày đúng cách thay vì cố khớp 100% với spec dạng sao chép từ phần mềm VMS thương mại có sẵn.
