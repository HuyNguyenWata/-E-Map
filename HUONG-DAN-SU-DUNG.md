# Hướng dẫn sử dụng eMap — VMS Frontend

Tài liệu này mô tả **từng bước thao tác cụ thể** để thực hiện mọi chức năng của `emap-demo` (frontend React của hệ thống VMS). Xem [README.md](README.md) để biết cách cài đặt/chạy dự án.

## Mục lục

1. [Đăng nhập](#1-đăng-nhập)
2. [Bố cục màn hình chính](#2-bố-cục-màn-hình-chính)
3. [Thao tác trên bản đồ](#3-thao-tác-trên-bản-đồ)
4. [Tìm kiếm & lọc camera trong danh sách](#4-tìm-kiếm--lọc-camera-trong-danh-sách)
5. [Đánh dấu camera yêu thích](#5-đánh-dấu-camera-yêu-thích)
6. [Thêm camera mới](#6-thêm-camera-mới)
7. [Sửa / Xoá camera](#7-sửa--xoá-camera)
8. [Tạo khu vực (Zone) mới](#8-tạo-khu-vực-zone-mới)
9. [Lọc camera theo Zone](#9-lọc-camera-theo-zone)
10. [Xem trực tiếp (Live)](#10-xem-trực-tiếp-live)
11. [Xem lại bản ghi (Playback)](#11-xem-lại-bản-ghi-playback)
12. [Xuất bản ghi ra file video](#12-xuất-bản-ghi-ra-file-video)
13. [Đánh dấu bookmark](#13-đánh-dấu-bookmark)
14. [Xem / tải clip sự kiện tự động](#14-xem--tải-clip-sự-kiện-tự-động)
15. [Xem lịch sử cảnh báo của 1 camera](#15-xem-lịch-sử-cảnh-báo-của-1-camera)
16. [Camera Wall — xem nhiều camera cùng lúc](#16-camera-wall--xem-nhiều-camera-cùng-lúc)
17. [Lưu / mở / xoá layout ưa thích](#17-lưu--mở--xoá-layout-ưa-thích)
18. [Tìm kiếm & giám sát theo bán kính](#18-tìm-kiếm--giám-sát-theo-bán-kính)
19. [ANPR — Thêm biển số vào danh sách đen/trắng](#19-anpr--thêm-biển-số-vào-danh-sách-đenTrắng)
20. [ANPR — Bật giám sát biển số theo Zone](#20-anpr--bật-giám-sát-biển-số-theo-zone)
21. [ANPR — Test nhận diện biển số từ ảnh](#21-anpr--test-nhận-diện-biển-số-từ-ảnh)
22. [ANPR — Truy vết lộ trình di chuyển của 1 biển số](#22-anpr--truy-vết-lộ-trình-di-chuyển-của-1-biển-số)
23. [Khuôn mặt — Đăng ký người mới](#23-khuôn-mặt--đăng-ký-người-mới)
24. [Khuôn mặt — Bật/tắt chống giả mạo](#24-khuôn-mặt--bậttắt-chống-giả-mạo)
25. [Khuôn mặt — Test nhận diện từ ảnh](#25-khuôn-mặt--test-nhận-diện-từ-ảnh)
26. [Khuôn mặt — Xuất báo cáo điểm danh Excel](#26-khuôn-mặt--xuất-báo-cáo-điểm-danh-excel)
27. [Hành vi — Đặt ngưỡng cảnh báo đám đông](#27-hành-vi--đặt-ngưỡng-cảnh-báo-đám-đông)
28. [Hành vi — Test đếm người / phát hiện vũ khí / phát hiện rác](#28-hành-vi--test-đếm-người--phát-hiện-vũ-khí--phát-hiện-rác)
29. [VCA — Vẽ line đếm/hàng rào ảo](#29-vca--vẽ-line-đếmhàng-rào-ảo)
30. [VCA — Vẽ vùng cấm (xâm nhập/lảng vảng)](#30-vca--vẽ-vùng-cấm-xâm-nhậplảng-vảng)
31. [VCA — Xoá line/vùng](#31-vca--xoá-linevùng)
32. [Quản lý người dùng — Tạo tài khoản mới](#32-quản-lý-người-dùng--tạo-tài-khoản-mới)
33. [Quản lý người dùng — Sửa quyền/zone/khung giờ, xoá user](#33-quản-lý-người-dùng--sửa-quyềnzonekhung-giờ-xoá-user)
34. [Sao lưu & khôi phục cấu hình hệ thống](#34-sao-lưu--khôi-phục-cấu-hình-hệ-thống)
35. [Chạy sao lưu tự động ngay lập tức](#35-chạy-sao-lưu-tự-động-ngay-lập-tức)
36. [Khởi động lại hệ thống thủ công](#36-khởi-động-lại-hệ-thống-thủ-công)
37. [Đổi ngôn ngữ giao diện](#37-đổi-ngôn-ngữ-giao-diện)

---

## 1. Đăng nhập

1. Mở app tại `http://localhost:5173` (hoặc URL đã deploy) — nếu chưa đăng nhập sẽ thấy ngay màn hình **Đăng nhập**.
2. Nhập **Tên đăng nhập** và **Mật khẩu** (tài khoản mặc định `admin` / `admin123` nếu chưa đổi).
3. Bấm nút **Đăng nhập**.
   - Nếu sai thông tin → hiện thông báo lỗi đỏ ngay dưới form, sửa lại và thử lại.
   - Thành công → chuyển thẳng vào màn hình chính (EMap).
4. Phiên đăng nhập được lưu lại (localStorage) — lần sau mở app sẽ vào thẳng màn hình chính mà không cần đăng nhập lại, cho tới khi bấm **Đăng xuất** hoặc token hết hạn.

## 2. Bố cục màn hình chính

Không cần thao tác gì — chỉ cần biết vị trí 3 vùng để làm theo các mục sau:

- **Cột trái**: thông tin tài khoản, nút quản lý người dùng, đăng xuất, các số liệu thống kê, danh sách Zone, bộ lọc và danh sách camera.
- **Ở giữa**: bản đồ toàn màn hình + thanh công cụ nổi.
- **Cột phải**: chỉ hiện nội dung sau khi bấm chọn 1 camera (từ danh sách hoặc bản đồ).

## 3. Thao tác trên bản đồ

**Phóng to/thu nhỏ, di chuyển bản đồ**: dùng chuột lăn để zoom, kéo-thả để di chuyển như Google Maps.

**Xem chi tiết 1 camera từ bản đồ**:
1. Tìm marker camera trên bản đồ (chấm/icon camera).
2. Bấm trực tiếp vào marker đó.
3. Cột phải hiện chi tiết camera, đồng thời camera được tự thêm vào Camera Wall (xem mục 16).

**Dùng thanh công cụ nổi (góc trên-phải bản đồ)**:
1. Bấm nút **Heatmap** để bật/tắt lớp nhiệt hiển thị mật độ sự kiện.
2. Bấm nút **Camera** để bật/tắt hiện marker camera trên bản đồ.
3. Bấm **Reset** để đưa bản đồ về vị trí/zoom mặc định.
4. Bấm **Fullscreen** để xem bản đồ toàn màn hình trình duyệt (bấm Esc để thoát).

## 4. Tìm kiếm & lọc camera trong danh sách

Ở cột trái, khu vực bộ lọc (nằm ngay trên danh sách camera):

1. Gõ từ khoá vào ô tìm kiếm (khớp theo tên hoặc địa chỉ camera) — danh sách bên dưới tự lọc theo thời gian thực.
2. Chọn 1 trong 3 nút trạng thái: **Tất cả / Online / Offline** để lọc theo trạng thái kết nối.
3. Mở dropdown **mức cảnh báo**, chọn **Tất cả / Critical / Warning / Không có cảnh báo** để lọc camera theo mức độ cảnh báo đang có.
4. Số lượng "kết quả/tổng" hiển thị ngay dưới bộ lọc để biết đang lọc còn bao nhiêu camera.
5. Để bỏ lọc, xoá từ khoá và chọn lại "Tất cả" ở cả 2 mục trên.

## 5. Đánh dấu camera yêu thích

1. Ở mỗi dòng camera trong danh sách, bấm vào icon ngôi sao (☆) bên trái tên camera → chuyển thành ⭐ (đã yêu thích). Bấm lại để bỏ yêu thích.
2. Trong panel chi tiết camera (cột phải), cũng có nút ⭐/☆ tương tự cạnh tên camera.
3. Để chỉ xem camera yêu thích: bấm nút toggle **"Chỉ hiện yêu thích"** ở đầu danh sách camera (cạnh tiêu đề, bên trái nút "+ Thêm"). Bấm lại để hiện toàn bộ camera.

## 6. Thêm camera mới

*Cần tài khoản có quyền quản lý camera — nếu không thấy nút này nghĩa là tài khoản không có quyền.*

1. Ở đầu danh sách camera (cột trái), bấm nút **"+ Thêm"**.
2. Trong form hiện ra, nhập **Tên camera** (bắt buộc) và **Địa chỉ**.
3. Chọn 1 trong 2 cách khai báo nguồn video:
   - **Cách A — Đã có URL stream sẵn**: điền trực tiếp vào ô **Stream URL** (dạng `http://.../index.m3u8`).
   - **Cách B — Có camera RTSP thật**: điền vào ô **"Nguồn RTSP camera thật"** theo dạng `rtsp://user:pass@ip:554/...`. Hệ thống sẽ tự đăng ký với MediaMTX và tự tính Stream URL, không cần điền ô Stream URL nữa (ô này sẽ bị khoá lại).
   - **Không biết địa chỉ RTSP?** Bấm nút **"🔍 Tìm camera ONVIF trong LAN"** → hệ thống quét mạng LAN vài giây → hiện danh sách IP camera ONVIF tìm được → bấm chọn 1 thiết bị để tự điền khung URL RTSP mẫu theo đúng IP đó (vẫn cần tự sửa lại user/mật khẩu/đường dẫn kênh theo tài liệu của hãng camera).
4. Nhập **Vĩ độ (lat)** và **Kinh độ (lng)** để xác định vị trí camera trên bản đồ (mặc định điền sẵn tọa độ trung tâm TP.HCM, cần sửa lại đúng vị trí thật).
5. (Tuỳ chọn) Chọn **Zone** camera này thuộc về, từ dropdown.
6. Bấm **"Thêm camera"**. Nếu thiếu thông tin bắt buộc, form sẽ báo lỗi đỏ và không cho submit.
7. Camera mới xuất hiện ngay trong danh sách và trên bản đồ.

## 7. Sửa / Xoá camera

*Cần tài khoản có quyền quản lý camera.*

**Sửa:**
1. Chọn 1 camera (bấm vào danh sách hoặc marker bản đồ) để mở panel chi tiết ở cột phải.
2. Bấm nút **"✏️ Sửa"** ở góc trên panel chi tiết.
3. Form hiện ra với dữ liệu hiện tại đã điền sẵn — sửa các trường cần thiết (tương tự các bước ở mục 6).
4. Bấm **"Lưu thay đổi"**.

**Xoá:**
1. Ở panel chi tiết camera, bấm nút **"🗑️ Xoá"**.
2. Hộp thoại xác nhận hiện ra ("Xoá camera ... ?") — bấm **OK** để xác nhận xoá, hoặc **Cancel** để huỷ.
3. Sau khi xoá, panel chi tiết tự đóng lại nếu đang xem đúng camera vừa xoá.

## 8. Tạo khu vực (Zone) mới

*Cần tài khoản có quyền quản lý zone.*

1. Trên thanh công cụ nổi ở bản đồ, bấm nút **"Vẽ vùng"** (nút sẽ chuyển sang trạng thái active).
2. Bấm lần lượt từng điểm trên bản đồ để tạo đường viền khu vực (**tối thiểu 3 điểm**, có thể vẽ hình dạng bất kỳ).
3. Khi đã vẽ đủ, form **"Đặt tên khu vực mới"** tự động mở ra.
4. Nhập **Tên khu vực** (bắt buộc, vd. "Bãi xe", "Kho", "Tòa nhà A") và **Mô tả** (tuỳ chọn).
5. Chọn 1 trong 5 **màu hiển thị** có sẵn bằng cách bấm vào chấm màu tương ứng.
6. Bấm **"Tạo khu vực"** để lưu. Nếu muốn huỷ vẽ giữa chừng, bấm lại nút "Vẽ vùng" (chuyển thành "Huỷ vẽ vùng") trên thanh công cụ.
7. Zone mới hiện ngay trên bản đồ (tô màu polygon) và trong danh sách Zone ở cột trái.

## 9. Lọc camera theo Zone

1. Ở cột trái, tìm danh sách **Zone** (dưới các biểu đồ thống kê).
2. Bấm vào tên 1 zone bất kỳ trong danh sách (hoặc bấm trực tiếp vào vùng polygon đó trên bản đồ) → danh sách camera bên dưới chỉ còn hiện camera thuộc zone đó.
3. Để quay lại xem tất cả camera, bấm nút **"Hiện tất cả"** phía trên danh sách Zone.

## 10. Xem trực tiếp (Live)

1. Chọn 1 camera bất kỳ (từ danh sách, bản đồ, hoặc kết quả tìm kiếm) để mở panel chi tiết ở cột phải.
2. Mặc định panel hiển thị video **trực tiếp** ngay phía trên (khung có tiêu đề "Live").
3. Có thể **zoom/pan** trực tiếp trên khung hình: dùng chuột lăn để zoom vào một vùng, kéo-thả để di chuyển khi đã zoom.

## 11. Xem lại bản ghi (Playback)

1. Mở panel chi tiết camera (như mục 10).
2. Cuộn xuống mục **"Bản ghi"** — danh sách các đoạn ghi hình theo camera đó hiện ra (kèm thời gian bắt đầu, thời lượng).
3. Bấm chọn 1 đoạn ghi trong danh sách.
4. Khung video phía trên tự động chuyển sang phát đoạn ghi đó, tiêu đề đổi thành **"Playback"**, kèm nút **"Về xem trực tiếp"**.
5. Bấm **"Về xem trực tiếp"** bất cứ lúc nào để quay lại xem live.

## 12. Xuất bản ghi ra file video

*Cần tài khoản có quyền xuất bản ghi.*

1. Trong danh sách **Bản ghi** (mục 11), tìm đoạn ghi cần xuất.
2. Bấm nút xuất/tải (icon export) cạnh đoạn ghi đó.
3. Hệ thống xử lý và tự động tải file `.mp4` về máy (tên file gồm tên camera + thời điểm bắt đầu).
4. Nếu đoạn ghi quá dài, hệ thống chỉ xuất được N phút đầu tiên và sẽ hiện thông báo rõ số phút đã xuất.

## 13. Đánh dấu bookmark

1. Mở panel chi tiết camera, cuộn tới mục **"Bookmark"**.
2. Đang xem **live** hoặc đang xem **playback** đều đánh dấu được — mốc thời gian sẽ tự lấy đúng theo chế độ đang xem (thời điểm hiện tại nếu là live, hoặc thời điểm của đoạn ghi nếu là playback).
3. Gõ nhãn mô tả vào ô nhập (vd. "Có người lạ ra vào").
4. Bấm **"Thêm bookmark"** hoặc nhấn phím **Enter**.
5. Bookmark mới hiện ngay trong danh sách, kèm thời gian tạo và người tạo. Bookmark do hệ thống tự tạo theo sự kiện AI sẽ có icon 🤖 thay vì tên người dùng.
6. Để xoá, bấm icon 🗑️ cạnh bookmark cần xoá.

## 14. Xem / tải clip sự kiện tự động

1. Mở panel chi tiết camera, cuộn tới mục **"🎬 Clip sự kiện tự động"**.
2. Danh sách clip được hệ thống tự tạo mỗi khi có cảnh báo AI (ANPR/khuôn mặt/hành vi/VCA) hiện tại đây — không cần thao tác tạo thủ công.
3. Kiểm tra trạng thái từng clip:
   - **⏳ Đang xử lý**: chờ thêm, chưa tải được.
   - **⚠️ Lỗi xuất clip**: di chuột vào để xem lý do lỗi.
   - Không có badge lỗi/đang xử lý = clip đã sẵn sàng.
4. Với clip sẵn sàng *(cần quyền xuất bản ghi)*: bấm nút **⬇️** để tải file `.mp4` về máy.
5. Bấm 🗑️ để xoá clip khỏi danh sách nếu không cần nữa.

## 15. Xem lịch sử cảnh báo của 1 camera

1. Mở panel chi tiết camera, cuộn xuống cuối tới mục **"Lịch sử cảnh báo"**.
2. Dùng dropdown lọc để chọn loại sự kiện muốn xem: **Tất cả / Fire / Person / Vehicle / Smoke**.
3. Dòng thời gian (timeline) bên dưới hiển thị các sự kiện/cảnh báo tương ứng theo thời gian, mới nhất ở trên.

## 16. Camera Wall — xem nhiều camera cùng lúc

1. Chọn bất kỳ camera nào (danh sách, bản đồ, tìm kiếm...) — mỗi lần chọn, camera đó **tự động được thêm** vào Camera Wall (không cần thao tác thêm thủ công).
2. Ở góc dưới-phải bản đồ có nút tròn **📺** hiện số lượng camera đã thêm — bấm vào đó để mở Camera Wall toàn màn hình.
3. Trong Camera Wall, dùng bộ điều khiển **kích thước lưới** (góc trên-trái) để chọn số ô hiển thị cùng lúc (ví dụ 2×2, 3×3, 4×4...).
4. Nếu số camera đã thêm nhiều hơn số ô của lưới đang chọn, hệ thống sẽ báo "Đang hiển thị X/Y camera" — tăng kích thước lưới lên để xem thêm.
5. Để bỏ 1 camera khỏi Camera Wall: di chuột vào ô video đó và bấm nút loại bỏ (icon ✕ trên ô).
6. Để xoá toàn bộ, bấm nút **"Clear All"** ở thanh trên cùng.
7. Bấm **"✕ Đóng"** để thoát Camera Wall, quay lại bản đồ (danh sách camera đã thêm vẫn được giữ để mở lại sau).

## 17. Lưu / mở / xoá layout ưa thích

Thực hiện trong màn hình **Camera Wall** (mục 16):

**Lưu layout hiện tại:**
1. Thêm các camera muốn có trong layout vào Camera Wall (bằng cách chọn từng camera như mục 16, bước 1).
2. Mở Camera Wall, bấm nút **"💾 Lưu layout"** (chỉ bấm được khi đã có ít nhất 1 camera).
3. Nhập tên layout khi được hỏi (vd. "Ca đêm khu A") rồi xác nhận.

**Mở lại 1 layout đã lưu:**
1. Trong Camera Wall, mở dropdown **"📂 Mở layout đã lưu..."**.
2. Chọn tên layout cần mở → danh sách camera của layout đó sẽ tự nạp vào Camera Wall (thay thế danh sách hiện tại).

**Xoá layout đã lưu:**
1. Mở dropdown **"🗑️ Xoá layout đã lưu..."**.
2. Chọn tên layout cần xoá — layout bị xoá khỏi danh sách lưu (không ảnh hưởng tới camera thật).

## 18. Tìm kiếm & giám sát theo bán kính

1. Trên thanh công cụ nổi ở bản đồ, bấm nút **"Bán kính"** để bật chế độ này (2 khung điều khiển hiện ở góc trên-trái bản đồ).
2. Chọn tâm bán kính bằng 1 trong 2 cách:
   - Gõ tên/địa chỉ camera vào **ô tìm kiếm**, bấm chọn 1 kết quả gợi ý → bản đồ tự zoom tới đó và đặt làm tâm.
   - Hoặc **bấm trực tiếp lên bản đồ** tại vị trí bất kỳ để đặt làm tâm.
3. Sau khi có tâm, khung **bán kính giám sát** hiện ra — chọn bán kính mong muốn: **100m / 500m / 1km / 2km** từ dropdown.
4. Danh sách camera nằm trong bán kính đó hiện ngay bên dưới, kèm trạng thái online/offline.
5. Bấm vào 1 camera trong danh sách để chọn camera đó (mở chi tiết ở cột phải + thêm vào Camera Wall).
6. Bấm nút **✕** trên khung bán kính để bỏ chọn tâm/tìm kiếm khác. Bấm lại nút "Bán kính" trên thanh công cụ (giờ hiện "Huỷ bán kính") để tắt hẳn chế độ này.

## 19. ANPR — Thêm biển số vào danh sách đen/trắng

*Cần quyền quản lý danh sách ANPR để thêm/xoá — nếu không có quyền chỉ xem được danh sách.*

1. Bấm nút **🚗 (ANPR)** trên thanh công cụ bản đồ để mở panel ANPR.
2. Ở cột trái, nhập **Biển số** vào ô đầu tiên (vd. `51F-371.95`).
3. Chọn loại danh sách: **🚫 Blacklist** (theo dõi/cảnh báo) hoặc **✅ Whitelist** (được phép).
4. (Tuỳ chọn) Nhập **Mô tả**.
5. Bấm **"+ Thêm vào danh sách"**.
6. Biển số mới hiện ngay trong danh sách bên dưới, kèm badge loại danh sách. Để xoá, bấm icon 🗑️ cạnh mục đó.

## 20. ANPR — Bật giám sát biển số theo Zone

*Cần quyền quản lý danh sách ANPR để bật/tắt.*

1. Trong panel ANPR (mở như mục 19), cuộn tới mục **"🛰️ Khoanh vùng giám sát"**.
2. Với mỗi zone trong danh sách, bấm vào công tắc (checkbox) bên phải để **bật/tắt giám sát** cho zone đó.
3. Khi bật, mọi biển số mà camera trong zone đó phát hiện được sẽ tự tạo cảnh báo — kể cả khi không nằm trong Blacklist.
4. Nếu tài khoản không có quyền, mục này chỉ hiển thị trạng thái (🛰️ Đang giám sát / Tắt) mà không đổi được.

## 21. ANPR — Test nhận diện biển số từ ảnh

1. Trong panel ANPR, ở cột giữa (**"📷 Nhận diện từ ảnh"**):
2. (Tuỳ chọn nhưng khuyến nghị) Chọn 1 **camera** để gắn kết quả — nếu bỏ trống, kết quả chỉ để tham khảo và sẽ **không** tạo cảnh báo/gửi email dù khớp Blacklist.
3. Bấm ô chọn file, chọn 1 ảnh có chứa biển số từ máy tính.
4. Ảnh xem trước hiện ngay bên dưới.
5. Bấm **"Nhận diện biển số"**.
6. Kết quả hiện danh sách biển số phát hiện được, kèm độ tin cậy (%) và badge cho biết có khớp Blacklist/Whitelist/vùng giám sát hay không.

## 22. ANPR — Truy vết lộ trình di chuyển của 1 biển số

1. Trong panel ANPR, ở cột phải (**feed detection gần đây**), tìm biển số muốn truy vết.
2. Bấm trực tiếp vào chữ biển số đó (có icon 🛰️, gạch chân) → panel chuyển sang chế độ hiển thị toàn bộ lịch sử phát hiện của riêng biển số đó.
3. Nếu có **từ 2 lần phát hiện trở lên có toạ độ camera**, nút **"🗺️ Vẽ lộ trình"** sẽ khả dụng — bấm vào đó.
4. Panel ANPR tự đóng lại, bản đồ hiện đường lộ trình di chuyển của biển số theo đúng thứ tự thời gian, đồng thời tự zoom vừa khít phạm vi lộ trình.
5. Để xoá lộ trình đang hiển thị trên bản đồ, bấm nút **✕** ở khung thông tin lộ trình (góc dưới-trái bản đồ).
6. Muốn quay lại xem toàn bộ feed (bỏ truy vết), mở lại panel ANPR và bấm **"✕ Bỏ truy vết"**.

## 23. Khuôn mặt — Đăng ký người mới

*Cần quyền quản lý đăng ký khuôn mặt.*

1. Bấm nút **🧑 (Khuôn mặt)** trên thanh công cụ bản đồ để mở panel.
2. Cuộn tới mục **"👥 Người đã đăng ký"**, nhập **Họ tên** và **Mô tả** (phòng ban/chức vụ, tuỳ chọn).
3. Bấm ô chọn file, chọn 1 ảnh chân dung rõ mặt của người cần đăng ký.
4. Bấm **"+ Đăng ký người mới"**.
5. Người mới hiện ngay trong danh sách bên dưới kèm ảnh đại diện. Để xoá, bấm icon 🗑️ cạnh người đó.

## 24. Khuôn mặt — Bật/tắt chống giả mạo

*Cần quyền quản lý đăng ký khuôn mặt.*

1. Trong panel Khuôn mặt, ở đầu cột trái có mục **"🛡️ Chống giả mạo khuôn mặt"**.
2. Bấm nút toggle để chuyển giữa **"✅ Đang BẬT"** và **"⭕ Đang TẮT"**.
3. Khi bật: ảnh in/màn hình phát lại sẽ không được tính điểm danh hợp lệ dù khớp đúng người, đồng thời tự tạo cảnh báo nghi giả mạo.

## 25. Khuôn mặt — Test nhận diện từ ảnh

1. Trong panel Khuôn mặt, ở cột giữa (**"📷 Nhận diện từ ảnh"**), chọn 1 ảnh có khuôn mặt từ máy tính.
2. Ảnh xem trước hiện ra.
3. Bấm **"Nhận diện khuôn mặt"**.
4. Kết quả hiện tên người khớp được (hoặc "Người lạ" nếu không khớp ai), độ tương đồng/độ tin cậy, và badge **"🚨 Nghi giả mạo"** nếu hệ thống phát hiện dấu hiệu giả mạo.

## 26. Khuôn mặt — Xuất báo cáo điểm danh Excel

1. Trong panel Khuôn mặt, ở mục **"📊 Điểm danh 7 ngày qua"** (cột trái), bấm nút **"📥 Xuất Excel"**.
2. Chờ vài giây để hệ thống xử lý — file `.xlsx` tự động tải về máy (tên file gồm ngày xuất).

## 27. Hành vi — Đặt ngưỡng cảnh báo đám đông

*Cần quyền quản lý cấu hình hành vi.*

1. Bấm nút **🏃 (Hành vi)** trên thanh công cụ bản đồ để mở panel.
2. Ở cột trái, mục **"⚙️ Ngưỡng cảnh báo đám đông"**, nhập số người mong muốn vào ô số (phải là số nguyên ≥ 1).
3. Bấm **"Lưu ngưỡng"**.
4. Từ đó, mỗi khi số người trong khung hình camera đạt/vượt ngưỡng này, hệ thống sẽ tự tạo cảnh báo "Đám đông tụ tập bất thường".

## 28. Hành vi — Test đếm người / phát hiện vũ khí / phát hiện rác

1. Trong panel Hành vi, ở cột giữa, (tuỳ chọn) chọn 1 **camera** để gắn kết quả — nếu bỏ trống thì kết quả chỉ để tham khảo, không tạo cảnh báo/email.
2. Chọn 1 ảnh từ máy tính (ảnh xem trước hiện ngay).
3. Bấm 1 trong 3 nút tương ứng:
   - **"👥 Đếm người"** → hiện số người phát hiện được, có vượt ngưỡng hay không.
   - **"🔫 Phát hiện vũ khí"** → hiện danh sách vũ khí phát hiện được kèm độ tin cậy; hễ có 1 kết quả là coi như Critical.
   - **"🗑️ Phát hiện rác"** → hiện danh sách vật dụng kiểu rác (chai, ly...) phát hiện được. Lần bấm đầu chỉ ghi nhận "mới thấy lần đầu"; **bấm lại đúng ảnh đó lần thứ 2** (mô phỏng ảnh chụp sau ~10s cùng vị trí) để hệ thống xác nhận vật bị bỏ lại và tạo cảnh báo.
4. Kết quả kèm badge cho biết đã tạo cảnh báo hay chưa (và có cần gắn camera mới tạo cảnh báo/email hay không).

## 29. VCA — Vẽ line đếm/hàng rào ảo

*Cần quyền quản lý VCA.*

1. Bấm nút **🚧 (VCA)** trên thanh công cụ bản đồ để mở panel.
2. Ở cột trái, chọn **camera** cần cấu hình — video trực tiếp của camera đó hiện ở cột giữa.
3. Bấm nút **"📏 Vẽ line"** (chuyển sang trạng thái đang vẽ, con trỏ đổi thành dấu cộng khi rê trên video).
4. Bấm điểm thứ nhất (A) rồi điểm thứ hai (B) trực tiếp trên khung video để đặt đường ảo.
5. Nhập **tên line** (vd. "Cổng vào").
6. Chọn chế độ:
   - **"Chỉ đếm"**: không cảnh báo, chỉ đếm số lượt qua theo từng chiều A→B và B→A.
   - **"Hàng rào ảo"**: tạo cảnh báo mỗi lượt có đối tượng đi qua.
7. Bấm **"💾 Lưu line"**. Muốn huỷ vẽ giữa chừng, bấm **"Huỷ"**.
8. Line mới hiện ngay trên video (màu xanh lá = chỉ đếm, đỏ = hàng rào ảo) và trong danh sách cột phải, số lượt qua A→B/B→A tự cập nhật mỗi 10 giây.

## 30. VCA — Vẽ vùng cấm (xâm nhập/lảng vảng)

*Cần quyền quản lý VCA.*

1. Trong panel VCA (mở như mục 29), chọn camera cần cấu hình.
2. Bấm nút **"⬛ Vẽ vùng"**.
3. Bấm lần lượt từng điểm trên video để tạo polygon (**tối thiểu 3 điểm**). Nếu bấm nhầm điểm cuối, dùng nút **"↩️ Bỏ điểm cuối"** để xoá điểm vừa đặt mà không cần vẽ lại từ đầu.
4. Nhập **tên vùng** (vd. "Khu vực cấm").
5. Tick chọn 1 hoặc cả 2 loại cảnh báo:
   - **"Cảnh báo xâm nhập"**: báo ngay khi có đối tượng vào vùng.
   - **"Cảnh báo lảng vảng sau"**: báo khi đối tượng ở lại vùng quá X giây — nhập số giây vào ô cạnh bên (mặc định 60s, tối thiểu 5s).
6. Bấm **"💾 Lưu vùng"**. Bấm **"Huỷ"** để bỏ toàn bộ thao tác đang vẽ.
7. Vùng mới hiện trên video (tô vàng) và trong danh sách "Vùng" ở cột phải.

## 31. VCA — Xoá line/vùng

1. Trong panel VCA, cột phải liệt kê danh sách **Line** và **Vùng** đã cấu hình cho camera đang chọn.
2. Bấm icon 🗑️ cạnh line/vùng cần xoá *(cần quyền quản lý VCA)*.
3. Line/vùng biến mất ngay khỏi danh sách và khỏi video.

## 32. Quản lý người dùng — Tạo tài khoản mới

*Cần quyền quản lý người dùng, mở bằng nút "Quản lý người dùng" ở cột trái (cạnh nút Đăng xuất).*

1. Bấm **"Quản lý người dùng"** để mở panel.
2. Ở cột trái, nhập **Tên đăng nhập**.
3. Chọn kiểu xác thực:
   - **"Mật khẩu cục bộ"**: hiện thêm ô **Mật khẩu**, nhập mật khẩu cho tài khoản.
   - **"AD/LDAP"**: không cần nhập mật khẩu (do máy chủ LDAP xác thực khi đăng nhập) — chỉ cần đảm bảo tên đăng nhập khớp đúng tài khoản LDAP thật.
4. Chọn **Role** từ dropdown — danh sách quyền của role đó sẽ hiện ngay bên dưới để kiểm tra trước khi tạo.
5. (Tuỳ chọn) Tick chọn các **Zone** để giới hạn camera user này được xem — bỏ trống toàn bộ nghĩa là được xem tất cả camera.
6. Bấm **"Tạo người dùng"**.
7. Tài khoản mới xuất hiện ngay trong danh sách người dùng ở cột phải.

## 33. Quản lý người dùng — Sửa quyền/zone/khung giờ, xoá user

Trong danh sách người dùng (cột phải của panel Quản lý người dùng), với mỗi user:

**Đổi role:**
1. Mở dropdown role ngay cạnh tên user, chọn role mới → lưu tự động ngay khi chọn.

**Đổi camera được xem theo Zone:**
1. Ở phần "Camera được xem" của user, tick/bỏ tick từng zone → lưu tự động ngay khi tick.

**Đặt khung giờ được dùng quyền:**
1. Nhập giờ bắt đầu vào ô đầu (định dạng giờ:phút).
2. Nhập giờ kết thúc vào ô thứ hai.
3. Bấm **"Lưu"** cạnh 2 ô giờ đó.
4. Để bỏ giới hạn giờ, xoá trống cả 2 ô rồi bấm "Lưu" lại.

**Xoá user:**
1. Bấm icon 🗑️ cạnh tên user cần xoá — xoá ngay không cần xác nhận thêm.

## 34. Sao lưu & khôi phục cấu hình hệ thống

Trong panel Quản lý người dùng, mục **"💾 Sao lưu & Khôi phục cấu hình"**:

**Xuất backup:**
1. Bấm **"📥 Xuất backup (.json)"**.
2. File `.json` (chứa camera, zone, danh sách đen/trắng ANPR, người đăng ký khuôn mặt, cấu hình AI — không gồm tài khoản người dùng/lịch sử) tự tải về máy.

**Khôi phục từ backup:**
1. Bấm vào ô chọn file bên dưới, chọn file `.json` backup đã có.
2. Hộp thoại cảnh báo hiện ra: khôi phục sẽ **xoá toàn bộ dữ liệu hiện tại** (camera, zone, danh sách ANPR, người đăng ký) và thay bằng nội dung file, không thể hoàn tác — bấm **OK** để tiếp tục hoặc **Cancel** để huỷ.
3. Nếu xác nhận, hệ thống khôi phục xong sẽ tự tải lại trang sau ~1.5 giây.

## 35. Chạy sao lưu tự động ngay lập tức

1. Trong mục **"🕒 Sao lưu tự động theo lịch"** (panel Quản lý người dùng), bấm nút **"▶ Chạy sao lưu ngay"**.
2. Chờ vài giây — bản backup mới xuất hiện ở đầu danh sách bên dưới, kèm thời gian tạo và dung lượng file.
3. (Không cần thao tác gì thêm để hệ thống tự sao lưu định kỳ — mặc định chạy mỗi 24h, tự giữ 14 bản gần nhất.)

## 36. Khởi động lại hệ thống thủ công

1. Trong mục **"🔁 Lập lịch tự khởi động lại hệ thống"**, xem trạng thái lịch hiện tại (đang bật/tắt, giờ/ngày đã cấu hình sẵn ở backend).
2. Nếu cần khởi động lại ngay để test, bấm nút **"⚠ Khởi động lại ngay (test/thủ công)"**.
3. Hộp thoại xác nhận hiện ra (cảnh báo mọi kết nối đang xem trực tiếp sẽ tạm gián đoạn vài giây) — bấm **OK** để xác nhận.
4. Hệ thống khởi động lại sau ~1 giây; thông báo kết quả hiện ngay dưới nút.

## 37. Đổi ngôn ngữ giao diện

1. Tìm nút chuyển ngôn ngữ (**LanguageSwitcher**) — có ở màn hình đăng nhập (góc trên) và ở cột trái màn hình chính (cạnh thông tin tài khoản).
2. Bấm vào đó và chọn ngôn ngữ mong muốn: **Tiếng Việt** hoặc **English**.
3. Toàn bộ giao diện chuyển ngôn ngữ ngay lập tức, không cần tải lại trang.

---

## Ghi chú về các service liên quan

`emap-demo` chỉ là giao diện — cần các service sau chạy song song để hoạt động đầy đủ (xem `.env`):

| Service | Biến `.env` | Chức năng |
|---|---|---|
| wata-backend | `VITE_API_BASE_URL` | API chính, xác thực, SignalR (cảnh báo realtime) |
| wata-anpr-service | `VITE_ANPR_SERVICE_URL` | Nhận diện biển số |
| wata-face-service | `VITE_FACE_SERVICE_URL` | Nhận diện khuôn mặt |
| wata-behavior-service | `VITE_BEHAVIOR_SERVICE_URL` | Đếm đám đông, phát hiện vũ khí/rác |

Nếu 1 trong các service trên không chạy, chức năng tương ứng (ANPR/Khuôn mặt/Hành vi) sẽ báo lỗi khi thao tác, các chức năng còn lại (bản đồ, camera, zone, user...) vẫn hoạt động bình thường qua `wata-backend`.
