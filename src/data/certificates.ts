/**
 * =========================================================================
 * CERTIFICATES & ACHIEVEMENTS DATA CONFIGURATION
 * =========================================================================
 * Quản lý danh sách các chứng chỉ, bằng cấp và thành tích đạt được.
 */

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issuerLogo?: string;
  issueDate: string;
  credentialUrl: string;
  credentialId: string;
  image: string;
  skills: string[];
}

export const certificatesData: CertificateItem[] = [
  {
    id: "cert-1",
    title: "Google Cloud Computing Foundations",
    issuer: "Google Cloud & Dicoding",
    issueDate: "2024",
    credentialUrl: "https://www.dicoding.com/",
    credentialId: "GCCF-2024-EKW",
    image: "/images/certificates/cert1.svg",
    skills: ["Cloud Architecture", "Compute Engine", "Cloud Storage", "GCP Fundamentals"]
  },
  {
    id: "cert-2",
    title: "Belajar Dasar Pemrograman Web",
    issuer: "Dicoding Indonesia",
    issueDate: "2023",
    credentialUrl: "https://www.dicoding.com/",
    credentialId: "DICODING-WEB-2023",
    image: "/images/certificates/cert2.svg",
    skills: ["HTML5 Semantic", "CSS3 Flexbox & Grid", "Responsive Design", "Web Accessibility"]
  },
  {
    id: "cert-3",
    title: "Belajar Membuat Front-End Web untuk Pemula",
    issuer: "Dicoding Indonesia",
    issueDate: "2023",
    credentialUrl: "https://www.dicoding.com/",
    credentialId: "DICODING-FE-2023",
    image: "/images/certificates/cert3.svg",
    skills: ["JavaScript DOM", "Web Storage API", "Event Handling", "Single Page Applications"]
  },
  {
    id: "cert-4",
    title: "Responsive Web Design Certification",
    issuer: "freeCodeCamp",
    issueDate: "2023",
    credentialUrl: "https://www.freecodecamp.org/",
    credentialId: "FCC-RWD-CERT-8849",
    image: "/images/certificates/cert4.svg",
    skills: ["CSS Variables", "Media Queries", "UI Accessibility", "Modern Layouts"]
  },
  {
    id: "cert-5",
    title: "UI/UX Design Specialization & Prototyping",
    issuer: "Interaction Design & Coursera",
    issueDate: "2024",
    credentialUrl: "https://www.coursera.org/",
    credentialId: "COURSERA-UIUX-2024",
    image: "/images/certificates/cert5.svg",
    skills: ["User Research", "Wireframing", "Figma Design System", "Usability Testing"]
  },
  {
    id: "cert-6",
    title: "Python for Data Science & Machine Learning",
    issuer: "Udemy Academy",
    issueDate: "2023",
    credentialUrl: "https://www.udemy.com/",
    credentialId: "UDEMY-PY-ML-9921",
    image: "/images/certificates/cert6.svg",
    skills: ["Python", "NumPy & Pandas", "OpenCV", "Scikit-Learn"]
  }
];
