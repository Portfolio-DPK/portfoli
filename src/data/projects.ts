/**
 * =========================================================================
 * PROJECTS DATA CONFIGURATION
 * =========================================================================
 * Quản lý danh sách dự án, thumbnail, liên kết GitHub và Live Demo.
 * Nội dung dưới đây được viết từ README / tài liệu thật trong hai repo GitHub của bạn.
 * Việc cần tự cập nhật: `role` (vai trò cụ thể của bạn), `year`, và ảnh chụp màn hình thật nếu có.
 */

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  category: "all" | "frontend" | "fullstack" | "uiux" | "ai";
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  features: string[];
  challenges?: string;
  role?: string;
  year: string;
}

export const projectCategories = [
  { id: "all", label: "Tất cả" },
  { id: "fullstack", label: "Full-Stack" },
  { id: "frontend", label: "Frontend" },
  { id: "uiux", label: "UI/UX Design" },
  { id: "ai", label: "AI / Python" },
];

export const projectsData: ProjectItem[] = [
  {
    id: "fitfuel-plus",
    title: "FitFuel+ — Quản lý phòng gym tích hợp AI",
    subtitle: "Đồ án phân tích và thiết kế hệ thống cho một phòng tập gym",
    description:
      "Hệ thống quản lý phòng gym gồm vòng đời hội viên, cửa hàng dinh dưỡng và dụng cụ, AI gợi ý dinh dưỡng và chăm sóc hội viên có nguy cơ rời bỏ. Kèm bộ tài liệu BA đầy đủ: yêu cầu, use case, ERD, BPMN.",
    longDescription:
      "FitFuel+ là hệ thống quản lý phòng tập gym (một phòng tập, single-tenant) xoay quanh bốn trụ cột: vòng đời hội viên, cửa hàng dinh dưỡng và dụng cụ, AI engine (gợi ý dinh dưỡng, hàng đợi chăm sóc cho hội viên có nguy cơ rời bỏ) và gamification (điểm thưởng FitCoin, mốc thành tích, giới thiệu bạn bè). Dự án có ba nhóm người dùng (chủ phòng tập, hội viên, khách) và đi kèm một bộ tài liệu phân tích nghiệp vụ chi tiết: bài toán, yêu cầu chức năng và phi chức năng, use case, mô hình dữ liệu, sơ đồ luồng dữ liệu, quy tắc nghiệp vụ và các sơ đồ BPMN.",
    image: "/uploads/proj-fitfuel.jpg",
    tags: ["Business Analysis", "Use Case", "BPMN", "ERD", "Yêu cầu FR/NFR"],
    category: "fullstack",
    liveUrl: "https://doan-webkinhdoanh.vercel.app/",
    githubUrl: "https://github.com/PTWebKD/full-stack",
    featured: true,
    year: "Đồ án môn Phân tích web kinh doanh",
    role: "Trưởng nhóm (5 thành viên)",
    features: [
      "Bộ yêu cầu gồm khoảng 73 yêu cầu chức năng (FR) và 19 yêu cầu phi chức năng (NFR)",
      "Use case và phân quyền cho ba vai trò: chủ phòng tập, hội viên, khách",
      "Mô hình dữ liệu ERD (53 thực thể), từ điển dữ liệu, DFD và quy tắc nghiệp vụ",
      "Hơn 10 sơ đồ BPMN: dùng thử, thành viên, onboarding AI, nhật ký tập, gia hạn, giới thiệu, mua và thuê dụng cụ",
      "AI engine: gợi ý dinh dưỡng và hàng đợi chăm sóc (AI Care Queue) cho hội viên có nguy cơ rời bỏ",
      "Gamification với FitCoin, thanh toán sandbox VNPay/MoMo nằm trong yêu cầu hệ thống",
      "Giao diện demo do mình tự dựng bằng vibe coding (công cụ AI)"
    ],
    challenges:
      "Giới hạn phạm vi cho một phòng tập (single-tenant) trong thời gian 6 tuần của một nhóm nhỏ, nhưng vẫn phải bao phủ trọn vòng đời hội viên, bán hàng và AI. Tài liệu đặt ra các mục tiêu đo lường như thanh toán của khách dưới 2 phút và gợi ý dinh dưỡng dưới 2 giây."
  },
  {
    id: "wanderhub",
    title: "WanderHUB — Lịch trình du lịch TP.HCM bằng AI",
    subtitle: "Website thương mại điện tử bán dịch vụ lịch trình du lịch theo yêu cầu",
    description:
      "Ứng dụng web bán dịch vụ lịch trình du lịch do AI tạo cho TP. Hồ Chí Minh, mô hình freemium với ba gói dịch vụ, thanh toán bằng chuyển khoản QR, đặt tài xế và theo dõi hành trình trên bản đồ.",
    longDescription:
      "WanderHUB nhắm đến du khách, đặc biệt là người lần đầu đến TP. Hồ Chí Minh và những người thấy tour truyền thống quá cứng nhắc. Người dùng nhập tâm trạng, ngân sách, khung giờ, khu vực, sở thích và phương tiện, hệ thống tạo lịch trình từ danh sách địa điểm đối tác có thật. Vì dịch vụ được bán theo yêu cầu chứ không phải một danh mục hàng hoá có sẵn, trang web bỏ giỏ hàng và tìm kiếm, và xây dựng luồng từ công cụ lập lịch trình đến chọn gói và thanh toán. Mô hình kinh doanh là freemium: người dùng miễn phí được tạo số lượng lịch trình giới hạn rồi được chuyển đến trang gói dịch vụ. Tài liệu thiết kế website có phần tự đánh giá theo các nguyên tắc dễ dùng của Nielsen.",
    image: "/uploads/proj-wanderhub.jpg",
    tags: ["Thương mại điện tử", "Mô hình freemium", "Trải nghiệm người dùng", "Thiết kế luồng mua hàng"],
    category: "fullstack",
    liveUrl: "https://wanderhub416tmdt.vercel.app/",
    githubUrl: "https://github.com/Thuongmaidientu416/FE",
    featured: true,
    year: "Đồ án môn Thương mại điện tử",
    role: "Trưởng nhóm (5 thành viên)",
    features: [
      "Mô hình freemium ba gói (Free, Basic, Premium, Du khách quốc tế); mua gói bằng chuyển khoản QR kèm bước xác minh thanh toán",
      "Công cụ lập lịch trình AI theo tâm trạng, ngân sách, khung giờ, khu vực, sở thích, phương tiện",
      "Đặt tài xế tự động phân công và theo dõi hành trình trên bản đồ",
      "Chatbot AI nổi, đề xuất đối tác trả phí tách bạch khỏi gợi ý theo nhu cầu",
      "Website một trang (SPA) với hơn 10 trang: giới thiệu, gói dịch vụ, khám phá, đánh giá, liên hệ, đăng nhập, lập lịch trình",
      "Báo cáo thiết kế có tự đánh giá theo 10 nguyên tắc dễ dùng của Nielsen",
      "Giao diện demo do mình tự dựng bằng vibe coding (công cụ AI)"
    ],
    challenges:
      "Bán một dịch vụ vô hình theo yêu cầu thay vì một danh mục hàng hoá, nên phải thiết kế lại luồng mua hàng quanh công cụ lập lịch trình và tách bạch quảng cáo trả phí với gợi ý thật sự theo nhu cầu để giữ niềm tin của người dùng."
  }
];



