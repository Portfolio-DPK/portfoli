/**
 * Data used by the Portfolio section (tabs: Projects / Certificates / Awards).
 * - Projects come straight from ./projects.ts — add or edit them there.
 * - Certificates & awards are empty for now. To add one, put its image in /public/uploads and push an entry, e.g.
 *
 *   cert('cert-1', 'Tên chứng chỉ', 'Đơn vị cấp', '/uploads/ten-anh.jpg', '2025')
 */
import { projectsData, type ProjectItem } from './projects';
import type { CertificateItem } from './certificates';

export const showcaseProjects: ProjectItem[] = projectsData;

export const cert = (id: string, title: string, issuer: string, image: string, year: string): CertificateItem => ({
  id,
  title,
  issuer,
  issueDate: year,
  credentialUrl: '#',
  credentialId: id.toUpperCase(),
  image,
  skills: [],
});

export const showcaseCertificates: CertificateItem[] = [];

export const showcaseAwards: CertificateItem[] = [];
