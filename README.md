# eMap — VMS Frontend

Frontend React + TypeScript + Vite cho hệ thống VMS: bản đồ camera (Leaflet/MapLibre), xem live/playback (HLS), quản lý zone, xem cảnh báo ANPR/khuôn mặt/hành vi theo thời gian thực (SignalR).

## Yêu cầu

- Node.js 18+
- Backend ([wata-backend](../wata-backend)) đang chạy tại `http://localhost:5080` (hoặc chỉnh `.env`)

## Cài đặt & chạy

```bash
npm install
cp .env.example .env   # chỉnh URL nếu backend/service không chạy ở localhost
npm run dev
```

Mặc định chạy tại `http://localhost:5173`. Đăng nhập bằng tài khoản admin mặc định `admin / admin123` (seed từ backend, đổi khi triển khai thật).

## Scripts

| Lệnh | Ý nghĩa |
|---|---|
| `npm run dev` | Chạy dev server (HMR) |
| `npm run build` | Type-check (`tsc -b`) rồi build production vào `dist/` |
| `npm run preview` | Preview bản build production |
| `npm run lint` | Lint bằng oxlint |

## Biến môi trường (`.env`)

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5080` | URL backend .NET (VMS.Api) |
| `VITE_ANPR_SERVICE_URL` | `http://localhost:8001` | URL service nhận diện biển số |
| `VITE_FACE_SERVICE_URL` | `http://localhost:8002` | URL service nhận diện khuôn mặt |
| `VITE_BEHAVIOR_SERVICE_URL` | `http://localhost:8003` | URL service phát hiện đám đông/vũ khí |

## Các service liên quan

- [wata-backend](../wata-backend) — API chính, xác thực, SignalR
- [wata-anpr-service](../wata-anpr-service) — nhận diện biển số
- [wata-face-service](../wata-face-service) — nhận diện khuôn mặt
- [wata-behavior-service](../wata-behavior-service) — đếm đám đông, phát hiện vũ khí
