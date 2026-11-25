/**
 * =========================================================================
 * SKILLS & TECH STACK DATA CONFIGURATION
 * =========================================================================
 * Quản lý danh sách các kỹ năng kỹ thuật, công cụ và nhóm công nghệ.
 */

export interface SkillItem {
  name: string;
  category: "frontend" | "backend" | "tools" | "ai_other";
  level: string; // e.g., "Thành thạo", "Nâng cao", "Trung cấp"
  percentage: number; // 0 -> 100 cho thanh tiến độ
  color: string;
  icon: string;
}

export interface SkillCategory {
  id: "all" | "frontend" | "backend" | "tools" | "ai_other";
  name: string;
  description: string;
}

export const skillCategories: SkillCategory[] = [
  { id: "all", name: "Tất cả", description: "Toàn bộ hệ sinh thái công nghệ tôi sử dụng" },
  { id: "frontend", name: "Frontend", description: "Xây dựng giao diện web phản hồi nhanh, mượt mà và đẹp mắt" },
  { id: "backend", name: "Backend & DB", description: "Hệ thống máy chủ, RESTful APIs và quản trị dữ liệu" },
  { id: "tools", name: "Tools & Design", description: "Công cụ thiết kế UI/UX, quản lý mã nguồn và triển khai" },
  { id: "ai_other", name: "AI & Khác", description: "Trí tuệ nhân tạo cơ bản, xử lý ảnh và công nghệ phụ trợ" },
];

export const skillsData: SkillItem[] = [
  // --- FRONTEND ---
  {
    name: "React.js",
    category: "frontend",
    level: "Thành thạo",
    percentage: 92,
    color: "#61DAFB",
    icon: "Atom"
  },
  {
    name: "Next.js",
    category: "frontend",
    level: "Nâng cao",
    percentage: 88,
    color: "#FFFFFF",
    icon: "Globe"
  },
  {
    name: "TypeScript",
    category: "frontend",
    level: "Nâng cao",
    percentage: 85,
    color: "#3178C6",
    icon: "FileCode2"
  },
  {
    name: "JavaScript (ES6+)",
    category: "frontend",
    level: "Thành thạo",
    percentage: 94,
    color: "#F7DF1E",
    icon: "Code2"
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    level: "Thành thạo",
    percentage: 95,
    color: "#38BDF8",
    icon: "Palette"
  },
  {
    name: "HTML5 / CSS3",
    category: "frontend",
    level: "Thành thạo",
    percentage: 96,
    color: "#E34F26",
    icon: "Layout"
  },
  {
    name: "Framer Motion",
    category: "frontend",
    level: "Nâng cao",
    percentage: 84,
    color: "#EC4899",
    icon: "Sparkles"
  },

  // --- BACKEND & DATABASE ---
  {
    name: "Node.js & Express",
    category: "backend",
    level: "Nâng cao",
    percentage: 82,
    color: "#5FA04E",
    icon: "Server"
  },
  {
    name: "PHP & Laravel",
    category: "backend",
    level: "Nâng cao",
    percentage: 85,
    color: "#FF2D20",
    icon: "Layers"
  },
  {
    name: "Python",
    category: "backend",
    level: "Trung cấp",
    percentage: 80,
    color: "#3776AB",
    icon: "Terminal"
  },
  {
    name: "MySQL / MariaDB",
    category: "backend",
    level: "Nâng cao",
    percentage: 86,
    color: "#4479A1",
    icon: "Database"
  },
  {
    name: "PostgreSQL",
    category: "backend",
    level: "Nâng cao",
    percentage: 78,
    color: "#4169E1",
    icon: "DatabaseBackup"
  },
  {
    name: "Supabase & Firebase",
    category: "backend",
    level: "Nâng cao",
    percentage: 84,
    color: "#3ECF8E",
    icon: "Cloud"
  },

  // --- TOOLS & DESIGN ---
  {
    name: "Figma (UI/UX)",
    category: "tools",
    level: "Thành thạo",
    percentage: 90,
    color: "#F24E1E",
    icon: "Figma"
  },
  {
    name: "Git & GitHub",
    category: "tools",
    level: "Thành thạo",
    percentage: 90,
    color: "#F05032",
    icon: "GitBranch"
  },
  {
    name: "Postman",
    category: "tools",
    level: "Nâng cao",
    percentage: 85,
    color: "#FF6C37",
    icon: "Send"
  },
  {
    name: "Vercel / Cloudflare",
    category: "tools",
    level: "Nâng cao",
    percentage: 88,
    color: "#A855F7",
    icon: "UploadCloud"
  },
  {
    name: "VS Code & Linters",
    category: "tools",
    level: "Thành thạo",
    percentage: 95,
    color: "#007ACC",
    icon: "Code"
  },

  // --- AI & OTHERS ---
  {
    name: "Computer Vision / OpenCV",
    category: "ai_other",
    level: "Trung cấp",
    percentage: 75,
    color: "#5C3EE8",
    icon: "Eye"
  },
  {
    name: "MediaPipe & AI Integration",
    category: "ai_other",
    level: "Trung cấp",
    percentage: 72,
    color: "#06B6D4",
    icon: "Cpu"
  },
  {
    name: "RESTful API Architecture",
    category: "ai_other",
    level: "Nâng cao",
    percentage: 88,
    color: "#10B981",
    icon: "Network"
  }
];

export const marqueeTechnologies: string[] = [
  "React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", 
  "Python", "PHP Laravel", "MySQL", "PostgreSQL", "Figma", 
  "Supabase", "Git", "Framer Motion", "Vercel"
];
