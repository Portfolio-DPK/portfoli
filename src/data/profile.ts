/**
 * =========================================================================
 * PROFILE DATA CONFIGURATION
 * =========================================================================
 * Bạn có thể dễ dàng thay đổi thông tin cá nhân của mình tại đây.
 * Mọi thay đổi trong file này sẽ tự động cập nhật lên giao diện trang web.
 */

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  label: string;
}

export interface ProfileData {
  name: string;
  shortName: string;
  avatar: string;
  cvUrl: string;
  cvUrlVi: string;
  status: string;
  availableForWork: boolean;
  typewriterRoles: string[];
  tagline: string;
  shortDescription: string;
  about: {
    greeting: string;
    paragraphs: string[];
    highlights: string[];
  };
  contactInfo: {
    email: string;
    phone: string;
    location: string;
    workingHours: string;
    freelanceStatus: string;
  };
  stats: StatItem[];
  socialLinks: SocialLink[];
}

export const profileData: ProfileData = {
  // Tên hiển thị chính
  name: "Đỗ Phúc Khang",
  shortName: "Khang",
  
  // Đường dẫn ảnh đại diện (đặt ảnh vào thư mục public/images/)
  avatar: "/images/avatar.svg",
  
  // Link tải CV (đặt file pdf trong thư mục public/ hoặc link Google Drive)
  cvUrl: "/DoPhucKhang_CV_EN.pdf",
  cvUrlVi: "/DoPhucKhang_CV_VI.pdf",
  
  // Trạng thái công việc hiện tại
  status: "Đang tìm vị trí thực tập BA / AI BA",
  availableForWork: true,

  // Các vai trò chạy hiệu ứng gõ chữ (Typewriter) trên Hero section
  typewriterRoles: [
    "Business Analyst Intern (đang tìm)",
    "AI Business Analyst",
    "Digital Business Student"
  ],

  // Khẩu hiệu ngắn
  tagline: "Kết nối nhu cầu kinh doanh với giải pháp dữ liệu và trí tuệ nhân tạo.",

  // Đoạn mô tả nổi bật trên Hero Section
  shortDescription: "Sinh viên Hệ thống thông tin quản lý, định hướng Business Analyst và AI Business Analyst: làm rõ yêu cầu, mô hình hoá quy trình và phân tích cách ứng dụng AI vào nghiệp vụ.",

  // Giới thiệu chi tiết trong Section About
  about: {
    greeting: "Xin chào! Tôi là Đỗ Phúc Khang 👋",
    paragraphs: [
      "Tôi là sinh viên ngành Hệ thống thông tin quản lý, chuyên ngành Kinh doanh số và Trí tuệ nhân tạo tại Trường Đại học Kinh tế - Luật, ĐHQG TP.HCM (GPA 3.2/4.0). Tôi là trưởng nhóm 5 người ở hai đồ án: xây dựng bộ tài liệu phân tích nghiệp vụ (yêu cầu, use case, BPMN, ERD, quy tắc nghiệp vụ), phân tích hướng ứng dụng AI vào quy trình kinh doanh và tự dựng giao diện demo bằng vibe coding. Tôi đang tìm cơ hội thực tập Business Analyst.",
      "Tôi quan tâm đến việc tìm hiểu bài toán của doanh nghiệp, phân tích và làm rõ yêu cầu, mô hình hoá quy trình nghiệp vụ, rồi đề xuất giải pháp có ứng dụng dữ liệu và AI để đưa ra quyết định tốt hơn.",
      "Nhờ công việc part-time ở quán cà phê trong thời gian học đại học, tôi quen việc làm việc với khách hàng: khơi gợi nhu cầu, lắng nghe và ham học hỏi."
    ],
    highlights: [
      "Viết yêu cầu chức năng và phi chức năng, use case, user story, quy tắc nghiệp vụ; lấy yêu cầu qua phỏng vấn và khảo sát",
      "Mô hình hoá BPMN, DFD, ERD, class diagram bằng draw.io; giao diện mẫu trên Figma (cơ bản)",
      "SQL cơ bản; Excel cơ bản (pivot table, hàm tra cứu)",
      "Phân tích ứng dụng AI vào nghiệp vụ; dựng bản mẫu web bằng vibe coding",
      "Dẫn dắt nhóm 5 người: phân công, theo dõi tiến độ, thống nhất tài liệu"
    ]
  },
  // Thông tin liên hệ
  contactInfo: {
    email: "khangphuc111@gmail.com",
    phone: "0783873820",
    location: "TP. Hồ Chí Minh, Việt Nam",
    workingHours: "Thứ 2 - Thứ 6 (giờ hành chính)",
    freelanceStatus: "Đang tìm cơ hội thực tập Business Analyst / AI Business Analyst"
  },

  // Các con số thống kê (hiện không hiển thị trên giao diện, chỉnh theo số liệu thật của bạn nếu dùng)
  stats: [],

  // Các liên kết liên hệ (hiện trong mục "Find Me" ở phần Contact)
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/phuckhang2903",
      icon: "Github",
      label: "github.com/phuckhang2903"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/khang-%C4%91%E1%BB%97-ph%C3%BAc-868b38451/",
      icon: "Linkedin",
      label: "linkedin.com/in/khang-đỗ-phúc"
    },
    {
      name: "Email",
      url: "mailto:khangphuc111@gmail.com",
      icon: "Mail",
      label: "khangphuc111@gmail.com"
    },
    {
      name: "Phone",
      url: "tel:+84783873820",
      icon: "Phone",
      label: "078 387 3820"
    }
  ]
};


