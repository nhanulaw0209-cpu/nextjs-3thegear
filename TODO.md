# Việc còn lại — 3ThéGear Band CMS

Site đã lên live tại https://3thegear.chartedconsultants.com/ (2026-07-12). Dưới đây là các việc còn thiếu, theo mức ưu tiên.

## Bắt buộc trước khi dùng thật (không chỉ demo)

- [ ] **Thông tin ngân hàng + QR thật** — hiện là dữ liệu demo ("Vietcombank (Demo)", số TK giả). Cập nhật qua Admin → Cài Đặt khi có thông tin thật.
- [ ] **Setlist thật** — 15 bài hát hiện tại (Ngày Đầu Tiên, Cưới Thôi, Waiting For You...) là demo/gợi ý, band cần cung cấp setlist thật cho từng loại tiệc. Sửa qua Admin → Dịch Vụ → chọn dịch vụ → Danh Sách Bài Hát.
- [x] **Domain production** — `prostage3tg.com` (+ `www`) đã trỏ về VPS (143.110.167.193), nginx + SSL (Certbot) đã cấu hình xong, cùng app với `3thegear.chartedconsultants.com` (port nội bộ 3050). Quyết định: **giữ song song cả 2 domain**, không redirect. Đã kiểm tra code (2026-07-14): không có `metadataBase`/OG tags/`NEXT_PUBLIC_*` nào hardcode domain — chỉ có 1 comment ở `prisma/seed.ts:209` nhắc domain cũ, không ảnh hưởng chức năng. Không cần sửa gì.

## Nên làm

- [ ] **Thông báo khi có booking mới** — admin phải tự vào tab "Đặt Lịch" để kiểm tra, chưa có email/SMS báo khi khách đặt lịch hoặc báo đã chuyển khoản. Có thể nối Resend (đã cài `resend` package nhưng chưa dùng).
- [ ] **Email xác nhận cho khách** — khách đặt lịch xong chưa nhận được email xác nhận.
- [ ] **Bảo mật đăng nhập admin** — mật khẩu chỉ check phía client (theo pattern memoire-saigon), API `/api/admin/*` không tự kiểm tra quyền, không giới hạn số lần đăng nhập sai. Cân nhắc làm chặt hơn nếu dữ liệu booking/thanh toán quan trọng.
- [ ] **Video cho Gallery** — hiện chỉ có ảnh thật (20 ảnh), chưa có video nào (tính năng upload video đã có sẵn, chỉ cần admin upload).

## Có thể để sau

- [ ] Đặt lịch nhiều ngày liên tiếp (hiện chỉ hỗ trợ 1 ngày/booking)
- [ ] Phân quyền nhiều admin (hiện chỉ 1 mật khẩu dùng chung)
- [ ] SEO/metadata riêng cho từng trang dịch vụ, favicon, ảnh chia sẻ mạng xã hội

## Thông tin vận hành (đã deploy)

- Server: `143.110.167.193`, containers `thegear-app-1` (port nội bộ 3050) + `thegear-db-1` (Postgres 14, port nội bộ 5460)
- Source + config trên server: `/root/docker-images/thegear/`
- Mật khẩu admin production: xem `.env` trên server (`ADMIN_PASSWORD`) — **khác** mật khẩu demo local (`thegear2026`)
- Backup nginx config bản tĩnh cũ: `/etc/nginx/sites-available/3thegear.chartedconsultants.com.bak-static-20260712` trên server (phòng khi cần revert)
- Deploy thủ công (chưa có CI/CD tự động) — muốn cập nhật code lên live thì cần lặp lại: build lại image trên server + `docker compose up -d --build`
