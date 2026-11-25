import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Copy, 
  Check, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { profileData } from '../data/profile';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profileData.contactInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Vui lòng điền đầy đủ Tên, Email và Nội dung tin nhắn.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setErrorMessage('Địa chỉ email không đúng định dạng.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      /**
       * TÍCH HỢP GỬI THẬT:
       * Bạn có thể đổi URL dưới đây thành Formspree ID của bạn, ví dụ:
       * fetch("https://formspree.io/f/YOUR_FORM_ID", { method: "POST", ... })
       */
      // Mô phỏng gửi dữ liệu mượt mà
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Kích hoạt pháo hoa chúc mừng
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setStatus('idle');
      }, 6000);
    } catch {
      setStatus('error');
      setErrorMessage('Đã xảy ra lỗi khi gửi. Vui lòng gửi trực tiếp qua email cá nhân của tôi.');
    }
  };

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-xs font-mono text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KẾT NỐI VÀ HỢP TÁC</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Liên hệ với Tôi
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Bạn có một ý tưởng dự án hoặc muốn thảo luận cơ hội việc làm? Hãy gửi lời nhắn cho tôi ngay hôm nay!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact Info & Perks */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Hãy cùng tạo nên điều tuyệt vời!
                </h3>
                <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                  Tôi luôn cởi mở lắng nghe các dự án sáng tạo, các lời mời hợp tác Freelance, tư vấn giải pháp web hoặc tham gia phát triển sản phẩm công nghệ.
                </p>
              </div>

              {/* Direct Info Cards */}
              <div className="space-y-4">
                
                {/* Email Card with Copy Button */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400 uppercase font-mono">Email cá nhân</div>
                      <a 
                        href={`mailto:${profileData.contactInfo.email}`} 
                        className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                      >
                        {profileData.contactInfo.email}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-colors"
                    title="Sao chép Email"
                    aria-label="Sao chép Email"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Phone Card */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3.5 hover:border-indigo-500/40 transition-colors">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400 uppercase font-mono">Số điện thoại / WhatsApp</div>
                    <a 
                      href={`tel:${profileData.contactInfo.phone}`} 
                      className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                    >
                      {profileData.contactInfo.phone}
                    </a>
                  </div>
                </div>

                {/* Location Card */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3.5 hover:border-indigo-500/40 transition-colors">
                  <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400 uppercase font-mono">Địa điểm</div>
                    <div className="text-sm font-semibold text-white">
                      {profileData.contactInfo.location}
                    </div>
                  </div>
                </div>

              </div>

              {/* Working Hours Badge */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex items-start gap-3">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-200">
                  <span className="font-semibold text-white">Thời gian phản hồi:</span> Thường phản hồi trong vòng 2–6 giờ. Sẵn sàng tham gia các cuộc họp trực tuyến qua Google Meet hoặc Zoom.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="glass-card p-6 sm:p-8 rounded-3xl relative">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-mono font-medium text-gray-300">
                      Họ và tên <span className="text-pink-400">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                      required
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-mono font-medium text-gray-300">
                      Địa chỉ Email <span className="text-pink-400">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="emailcuaban@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Subject field */}
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-mono font-medium text-gray-300">
                    Chủ đề trao đổi
                  </label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Dự án Website / Hợp tác Freelance / Câu hỏi khác..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                  />
                </div>

                {/* Message field */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-mono font-medium text-gray-300">
                    Nội dung tin nhắn <span className="text-pink-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mô tả ý tưởng, yêu cầu tính năng hoặc thời gian dự kiến của bạn..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all resize-none"
                    required
                  />
                </div>

                {/* Error feedback */}
                {status === 'error' && (
                  <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Success feedback */}
                {status === 'success' && (
                  <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                    <span>Cảm ơn bạn! Tin nhắn đã được gửi thành công. Tôi sẽ liên hệ lại sớm nhất có thể.</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-glow-md hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Đang gửi tin nhắn...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Gửi tin nhắn ngay</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
