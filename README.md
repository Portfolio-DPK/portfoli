# 🚀 Portfolio Cá Nhân Hiện Đại (Dark Minimalist Theme)

Website portfolio cá nhân một trang (single-page) hiện đại, tối giản, chủ đề tối (Dark Theme), tích hợp nhiều hiệu ứng chuyển động mượt mà (Framer Motion + Lenis Smooth Scroll) và thiết kế chuẩn Glassmorphism.

Được mô phỏng và nâng cấp toàn diện dựa theo phong cách gốc: [ekawahyu-portofolio.vercel.app](https://ekawahyu-portofolio.vercel.app/).

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend Core:** [React 19](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **Animation & Transitions:** [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scrolling:** [Lenis Smooth Scroll](https://lenis.darkroom.engineering/)
- **Icons:** [Lucide React](https://lucide.dev/) + SVG Social Icons tối ưu
- **Hiệu ứng chúc mừng:** Canvas Confetti khi gửi liên hệ thành công
- **Triển khai:** Tương thích 100% với [Vercel](https://vercel.com/) (Zero Configuration)

---

## 📂 Cấu Trúc Thư Mục Dữ Liệu (Dễ Dàng Thay Thế)

Toàn bộ nội dung của trang web được tách biệt hoàn toàn trong thư mục `src/data/`. Bạn **không cần phải sửa mã nguồn component**, chỉ cần chỉnh sửa các file TypeScript sau:

```
src/data/
├── profile.ts       # Thông tin cá nhân, tên, vai trò gõ chữ (typewriter), giới thiệu, mạng xã hội, số liệu thống kê
├── skills.ts        # Danh sách kỹ năng, nhóm công nghệ (Frontend, Backend, Tools, AI), % thành thục
├── projects.ts      # Danh sách dự án (ảnh, tên, mô tả ngắn/dài, tag, link Demo, link GitHub, tính năng chi tiết)
├── experience.ts    # Mốc thời gian kinh nghiệm làm việc và học vấn
└── certificates.ts  # Danh sách chứng chỉ, đơn vị cấp, ngày cấp, mã xác nhận
```

### 🖼️ Thư mục hình ảnh (`public/images/`)
- `public/images/avatar.svg` (hoặc `.png`/`.jpg`): Ảnh đại diện cá nhân
- `public/images/projects/`: Ảnh chụp màn hình / bìa dự án
- `public/images/certificates/`: Ảnh chứng chỉ
- `public/Meta.png`: Ảnh hiển thị khi chia sẻ link lên Facebook, Zalo, Twitter, LinkedIn

---

## 💻 Hướng Dẫn Chạy Cục Bộ (Local)

### 1. Yêu cầu hệ thống
- Đã cài đặt [Node.js](https://nodejs.org/) (khuyên dùng bản LTS v18 trở lên).

### 2. Cài đặt dependencies
Mở terminal trong thư mục dự án và chạy:
```bash
npm install
```

### 3. Khởi chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Trình duyệt sẽ mở tại `http://localhost:5173`. Bạn có thể chỉnh sửa code hoặc nội dung và xem kết quả thay đổi tức thì (HMR).

### 4. Build kiểm tra bản phát hành (Production Build)
```bash
npm run build
npm run preview
```

---

## 🌐 Hướng Dẫn Deploy Lên Vercel (Miễn Phí 100%)

Dự án đã có sẵn file `vercel.json` tối ưu hóa cho Vite Single-Page Application.

### Cách 1: Deploy qua GitHub (Khuyên dùng - Tự động cập nhật khi push code)
1. Đẩy toàn bộ mã nguồn lên một repository mới trên [GitHub](https://github.com/):
   ```bash
   git init
   git add .
   git commit -m "feat: portfolio initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
2. Truy cập [vercel.com](https://vercel.com/) và đăng nhập bằng tài khoản GitHub.
3. Bấm **"Add New..."** -> **"Project"**.
4. Chọn repository bạn vừa tải lên và bấm **"Import"**.
5. Vercel sẽ tự động nhận diện **Vite**:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Bấm nút **"Deploy"**. Trong 30 giây, website của bạn sẽ online với tên miền miễn phí dạng `your-portfolio.vercel.app`.

### Cách 2: Deploy trực tiếp bằng Vercel CLI (Không cần qua GitHub)
Trong terminal tại thư mục dự án:
```bash
npx vercel
```
Làm theo các bước hỏi nhanh trên terminal (chọn Yes cho các thiết lập mặc định).

---

## 🎨 Tùy Chỉnh Nâng Cao

- **Đổi màu chủ đạo (Accent Colors):** Mở file `tailwind.config.js` hoặc `src/index.css` để đổi mã màu gradient (`#8B5CF6`, `#6366F1`, `#06B6D4`...).
- **Form gửi tin nhắn:** Trong `src/components/Contact.tsx`, bạn có thể nối vào endpoint [Formspree](https://formspree.io/) hoặc [EmailJS](https://www.emailjs.com/) để nhận thông báo trực tiếp về hòm thư điện tử cá nhân.
