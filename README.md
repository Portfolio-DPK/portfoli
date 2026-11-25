# Đỗ Phúc Khang · Portfolio

**Ứng tuyển: Thực tập sinh Business Analyst / AI Business Analyst**

Sinh viên Hệ thống thông tin quản lý, chuyên ngành Kinh doanh số và Trí tuệ nhân tạo, Trường Đại học Kinh tế - Luật (ĐHQG TP.HCM). Đây là mã nguồn trang portfolio cá nhân của mình.

*Personal portfolio of Đỗ Phúc Khang, a Management Information Systems student looking for a Business Analyst / AI Business Analyst internship.*

- 🌐 Website: *(đang cập nhật, link Vercel sẽ có ở đây)*
- 📄 CV: [Tiếng Anh](public/DoPhucKhang_CV_EN.pdf)
- 💼 LinkedIn: [linkedin.com/in/khang-đỗ-phúc](https://www.linkedin.com/in/khang-%C4%91%E1%BB%97-ph%C3%BAc-868b38451/)
- 🐙 GitHub: [github.com/phuckhang2903](https://github.com/phuckhang2903)
- ✉️ Email: khangphuc111@gmail.com

---

## Dự án tiêu biểu

| Dự án | Môn học | Vai trò | Link |
|---|---|---|---|
| **FitFuel+**: hệ thống quản lý phòng gym tích hợp AI | Phân tích web kinh doanh | Trưởng nhóm (5 thành viên) | [Demo](https://doan-webkinhdoanh.vercel.app/) · [Repository](https://github.com/PTWebKD/full-stack) |
| **WanderHUB**: website lịch trình du lịch TP.HCM bằng AI | Thương mại điện tử | Trưởng nhóm (5 thành viên) | [Demo](https://wanderhub416tmdt.vercel.app/) · [Repository](https://github.com/Thuongmaidientu416/FE) |

**FitFuel+**: bộ tài liệu phân tích nghiệp vụ gồm 73 yêu cầu chức năng, 19 yêu cầu phi chức năng, use case cho 3 vai trò, ERD 53 thực thể, sơ đồ luồng dữ liệu, quy tắc nghiệp vụ và 10 quy trình BPMN; phân tích hai ứng dụng AI (gợi ý dinh dưỡng, danh sách chăm sóc hội viên có nguy cơ rời bỏ).

**WanderHUB**: thiết kế mô hình kinh doanh và luồng mua hàng cho dịch vụ lịch trình do AI tạo: 3 gói freemium, thanh toán chuyển khoản QR có bước xác minh, tự đánh giá giao diện theo 10 nguyên tắc dễ dùng của Nielsen.

## Kỹ năng

- **Phân tích nghiệp vụ:** yêu cầu chức năng và phi chức năng, use case, quy tắc nghiệp vụ
- **Mô hình hoá:** BPMN, ERD, sơ đồ luồng dữ liệu (draw.io)
- **AI:** phân tích ứng dụng AI vào nghiệp vụ; dựng giao diện và bản mẫu web bằng vibe coding (công cụ AI)
- **Làm việc nhóm:** dẫn dắt nhóm 5 người, phân công và theo dõi tiến độ, thống nhất tài liệu

---

## Về trang web này

Một trang duy nhất, gồm:

- **Home:** cảnh thành phố đêm vẽ bằng code, có gió, nhiều lớp chuyển động khi cuộn. Người Nhện treo ngược làm công tắc: kéo dây xuống để bật đèn thành phố, đầu xoay theo chuột, bấm vào có biểu cảm.
- **About:** giới thiệu, học vấn, ảnh chân dung (rê chuột để hiện bộ đồ Người Nhện) và nút xem CV.
- **Music:** danh sách nhạc mình hay nghe khi làm việc, phát qua trình nhúng YouTube.
- **Portfolio:** thẻ dự án kèm ảnh chụp, mô tả và link demo.
- **Contact:** thông tin liên hệ và form gửi tin nhắn.

Trang được dựng với sự hỗ trợ của công cụ AI.

**Công nghệ:** React 19 · Vite · TypeScript · Tailwind CSS · GSAP + ScrollTrigger · Lenis · Framer Motion

### Chạy trên máy

Cần cài [Node.js](https://nodejs.org/) bản 20 trở lên.

```bash
npm install
npm run dev      # mở http://localhost:5173
npm run build    # bản build trong thư mục dist/
```

### Sửa nội dung

Nội dung nằm trong `src/data/`, không cần sửa component:

| File | Nội dung |
|---|---|
| `profile.ts` | Tên, giới thiệu, liên hệ, link CV |
| `projects.ts` | Danh sách dự án |
| `experience.ts` | Học vấn |
| `showcase.ts` | Chứng chỉ, giải thưởng (đang để trống) |
| `music.ts` | Danh sách bài hát (mã video YouTube) |

Form liên hệ mặc định mở ứng dụng email của người xem. Để gửi thẳng vào hộp thư, tạo form trên [Formspree](https://formspree.io/) rồi thêm `VITE_FORMSPREE_ID=<mã form>` vào file `.env`.

### Ghi nhận

- Bố cục và hiệu ứng lấy cảm hứng từ portfolio của [Eka Wahyu Maulidan](https://ekawahyu-portofolio.vercel.app/).
- Hình minh hoạ Người Nhện thuộc về tác giả gốc; Spider-Man là nhân vật của Marvel. Trang này là dự án cá nhân, phi thương mại.
- Nhạc phát qua trình nhúng chính thức của YouTube, bản quyền thuộc các nghệ sĩ và đơn vị phát hành.
