import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { CheckCircle2, ExternalLink, Mail, MapPin, Phone, Send } from 'lucide-react';
import { profileData } from '../data/profile';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

gsap.registerPlugin(ScrollTrigger);

/**
 * "Send me a message" form.
 *  - With a Formspree form id (VITE_FORMSPREE_ID in a .env file) the message is delivered straight to your inbox.
 *  - Without it the form falls back to opening the visitor's mail app with the message pre-filled,
 *    so it works from day one with no setup.
 */
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID as string | undefined;

type Status = 'idle' | 'sending' | 'sent' | 'error';

const iconFor = (name: string) => {
  const n = name.toLowerCase();
  if (n === 'github') return <GithubIcon className="w-7 h-7" />;
  if (n === 'linkedin') return <LinkedinIcon className="w-7 h-7 text-[#0a66c2]" />;
  if (n === 'phone') return <Phone className="w-6 h-6 text-emerald-600" />;
  return <Mail className="w-6 h-6 text-[#2563eb]" />;
};

export const Contact: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const to = profileData.contactInfo.email;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-card]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 80 },
          { opacity: 1, y: 0, ease: 'none', scrollTrigger: { trigger: el, start: `top ${102 + i * 4}%`, end: 'top 60%', scrub: true } },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const done = () => {
    setStatus('sent');
    setForm({ name: '', email: '', message: '' });
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, colors: ['#2563eb', '#60a5fa', '#f9a8d4', '#fde68a'] });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim() || status === 'sending') return;
    if (FORMSPREE_ID) {
      setStatus('sending');
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
        });
        if (!res.ok) throw new Error('bad status');
        done();
      } catch {
        setStatus('error');
      }
      return;
    }
    // no backend configured: open the visitor's mail app with everything filled in
    const subject = encodeURIComponent(`Portfolio message from ${form.name || 'a visitor'}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name || 'Anonymous'}${form.email ? ` (${form.email})` : ''}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    done();
  };

  const field =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-800 outline-none transition focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-blue-100';

  return (
    <section
      id="contact"
      ref={root}
      className="relative z-20 px-[5%] lg:px-[10%] pt-10 pb-10 text-gray-800"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <h2 data-card className="mb-10 text-center text-4xl font-extrabold text-gray-800 sm:text-5xl">
        Let&apos;s Connect
      </h2>

      <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
        {/* find me */}
        <div data-card className="rounded-[28px] bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,.1)]">
          <h3 className="mb-1 text-2xl font-extrabold">Find Me</h3>
          <p className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-4 w-4" /> {profileData.contactInfo.location}
          </p>
          <ul className="divide-y divide-gray-200">
            {profileData.socialLinks.map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target={s.url.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-4 transition-transform hover:translate-x-1"
                >
                  <span className="grid h-10 w-10 place-items-center">{iconFor(s.name)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-bold">{s.name}</span>
                    <span className="block truncate text-xs text-gray-500">{s.label}</span>
                  </span>
                  <ExternalLink className="h-4 w-4 text-gray-400 transition-colors group-hover:text-[#2563eb]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* message form */}
        <form data-card onSubmit={submit} className="rounded-[28px] bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,.1)] sm:p-10">
          <h3 className="mb-1 text-2xl font-extrabold">Send me a message</h3>
          <p className="mb-6 text-sm leading-6 text-gray-500">Have an opportunity or a question? Leave a note and I&apos;ll reply as soon as I can.</p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="c-name">Your name</label>
              <input id="c-name" value={form.name} onChange={set('name')} placeholder="Jane Nguyen" autoComplete="name" className={field} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="c-email">Your email</label>
              <input id="c-email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" className={field} />
            </div>
          </div>

          <label className="mb-2 mt-5 block text-sm font-semibold" htmlFor="c-msg">Message</label>
          <textarea id="c-msg" value={form.message} onChange={set('message')} rows={6} placeholder="Write your message..." className={`${field} resize-none`} required />

          <button
            type="submit"
            disabled={status === 'sending'}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1d4ed8] active:translate-y-0 disabled:opacity-60"
          >
            <Send className="h-4 w-4" /> {status === 'sending' ? 'Sending...' : 'Send message'}
          </button>

          <div aria-live="polite" className="mt-4 min-h-[24px] text-sm">
            {status === 'sent' && (
              <p className="flex items-center gap-2 font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> {FORMSPREE_ID ? 'Thanks! Your message has been sent.' : 'Your mail app should open with the message ready to send.'}
              </p>
            )}
            {status === 'error' && (
              <p className="font-semibold text-rose-600">
                Something went wrong. Please email me directly at{' '}
                <a className="underline" href={`mailto:${to}`}>{to}</a>.
              </p>
            )}
          </div>
        </form>
      </div>

      <footer className="mt-16 border-t border-gray-300/70 pt-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} <span className="font-semibold text-gray-800">{profileData.name}</span>. All Rights Reserved.
      </footer>
    </section>
  );
};
