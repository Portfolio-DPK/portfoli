/**
 * =========================================================================
 * EXPERIENCE & EDUCATION DATA CONFIGURATION
 * =========================================================================
 * Hiển thị ở phần About (hai cột Education / Experience). Nội dung khớp với CV.
 */

export interface TimelineItem {
  id: string;
  type: "experience" | "education";
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  current?: boolean;
}

export const timelineData: TimelineItem[] = [
  // --- HỌC VẤN ---
  {
    id: "edu-1",
    type: "education",
    title: "Hệ thống thông tin quản lý, chuyên ngành Kinh doanh số và Trí tuệ nhân tạo",
    organization: "Trường Đại học Kinh tế - Luật, ĐHQG TP.HCM (UEL)",
    location: "TP. Hồ Chí Minh, Việt Nam",
    period: "2023 - 2027 (dự kiến)",
    current: true,
    description: "GPA 3.2/4.0. Chương trình kết hợp hệ thống thông tin quản lý, kinh doanh số và trí tuệ nhân tạo.",
    responsibilities: [],
    skills: ["Hệ thống thông tin quản lý", "Kinh doanh số", "Trí tuệ nhân tạo"]
  }
];

