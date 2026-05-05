import React, { useState } from 'react';
import Swal from 'sweetalert2';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'تم إرسال رسالتك بنجاح',
      text: 'سيتواصل معك فريق اكتشفني في أقرب وقت ممكن.',
      icon: 'success',
      background: 'var(--color-bg-main)',
      color: 'var(--color-text-white)',
      confirmButtonText: 'تم',
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };


  const Icons = {
    Mail: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    Map: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
    Send: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-white)] p-6 md:p-12 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 text-gradient-gold">
            Contact Us / تواصل معنا
          </h1>
          <p className="text-[var(--color-text-gray)] text-lg md:text-xl font-medium max-w-2xl mx-auto italic">
            هل لديك استفسار؟ نحن هنا لمساعدتك في رحلة اكتشاف موهبتك.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          
          <div className="lg:col-span-4">
            <div className="glass-card hover-gold-card p-8 rounded-[2rem] h-full card-shine relative overflow-hidden">
              <h3 className="text-2xl font-black mb-10 border-r-4 border-[var(--color-gold-main)] pr-4 italic">معلوماتنا</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--color-bg-main)] rounded-xl border border-[var(--color-border)] icon-gold">
                    <Icons.Mail />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--color-text-gray)] uppercase tracking-widest">البريد الإلكتروني</p>
                    <p className="font-bold text-lg">support@ektshefny.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--color-bg-main)] rounded-xl border border-[var(--color-border)] icon-gold">
                    <Icons.Phone />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--color-text-gray)] uppercase tracking-widest">رقم الهاتف</p>
                    <p className="font-bold text-lg">+20 103 461 0910</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--color-bg-main)] rounded-xl border border-[var(--color-border)] icon-gold">
                    <Icons.Map />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--color-text-gray)] uppercase tracking-widest">الموقع</p>
                    <p className="font-bold text-lg">القاهرة، مصر</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="lg:col-span-8">
            <div className="glass-card p-8 md:p-12 rounded-[2rem] shadow-2xl relative border border-[var(--color-border)]/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[var(--color-text-gray)] uppercase mr-2 italic">الاسم الكامل</label>
                    <input 
                      type="text" required value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border)]/30 rounded-2xl p-4 focus:outline-none focus:border-[var(--color-gold-main)] focus:shadow-[var(--gold-glow)] transition-all"
                      placeholder="أدخل اسمك..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[var(--color-text-gray)] uppercase mr-2 italic">البريد الإلكتروني</label>
                    <input 
                      type="email" required value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border)]/30 rounded-2xl p-4 focus:outline-none focus:border-[var(--color-gold-main)] focus:shadow-[var(--gold-glow)] transition-all text-left"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-[var(--color-text-gray)] uppercase mr-2 italic">الموضوع</label>
                  <input 
                    type="text" required value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border)]/30 rounded-2xl p-4 focus:outline-none focus:border-[var(--color-gold-main)] focus:shadow-[var(--gold-glow)] transition-all"
                    placeholder="سبب التواصل..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-[var(--color-text-gray)] uppercase mr-2 italic">الرسالة</label>
                  <textarea 
                    rows="5" required value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border)]/30 rounded-2xl p-4 focus:outline-none focus:border-[var(--color-gold-main)] focus:shadow-[var(--gold-glow)] transition-all resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[var(--gold-gradient)] text-black font-black py-5 rounded-2xl shadow-[var(--gold-glow)] hover:scale-[1.01] active:scale-95 transition-all text-lg uppercase italic flex items-center justify-center gap-3"
                >
                  <span>إرسال الرسالة</span>
                  <div className="w-5 h-5"><Icons.Send /></div>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;