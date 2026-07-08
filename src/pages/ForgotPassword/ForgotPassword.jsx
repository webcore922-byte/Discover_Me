import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from '../../utils/swalAlert';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSendCode = async e => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      Swal.fire({
        title: 'تنبيه',
        text: 'من فضلك ادخل بريدك الإلكتروني.',
        icon: 'warning',
        confirmButtonColor: '#D4AF37'
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: trimmedEmail
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        Swal.fire({
          title: 'حدث خطأ',
          text: data.message || 'تعذر إرسال الرمز، حاول مرة أخرى.',
          icon: 'error',
          confirmButtonColor: '#D4AF37'
        });
        return;
      }
      Swal.fire({
        title: 'تم إرسال الرمز 📩',
        text: data.message || 'تحقق من بريدك الإلكتروني، الرمز صالح لمدة 10 دقائق.',
        icon: 'success',
        confirmButtonColor: '#D4AF37'
      });
      setStep(2);
    } catch {
      Swal.fire({
        title: 'حدث خطأ في الاتصال',
        text: 'تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
        icon: 'error',
        confirmButtonColor: '#D4AF37'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async e => {
    e.preventDefault();
    if (!code.trim()) {
      Swal.fire({
        title: 'تنبيه',
        text: 'من فضلك ادخل الرمز اللي وصلك على الإيميل.',
        icon: 'warning',
        confirmButtonColor: '#D4AF37'
      });
      return;
    }
    if (newPassword.length < 6) {
      Swal.fire({
        title: 'تنبيه',
        text: 'كلمة المرور الجديدة لازم تكون 6 أحرف على الأقل.',
        icon: 'warning',
        confirmButtonColor: '#D4AF37'
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: 'تنبيه',
        text: 'كلمة المرور وتأكيدها مش متطابقين.',
        icon: 'warning',
        confirmButtonColor: '#D4AF37'
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
          newPassword
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        Swal.fire({
          title: 'حدث خطأ',
          text: data.message || 'تعذر تغيير كلمة المرور.',
          icon: 'error',
          confirmButtonColor: '#D4AF37'
        });
        return;
      }
      Swal.fire({
        title: 'تم تغيير كلمة المرور بنجاح ✅',
        text: 'تقدر تسجل دخولك دلوقتي بكلمة المرور الجديدة.',
        icon: 'success',
        confirmButtonColor: '#D4AF37',
        confirmButtonText: 'تسجيل الدخول'
      }).then(() => navigate('/login'));
    } catch {
      Swal.fire({
        title: 'حدث خطأ في الاتصال',
        text: 'تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
        icon: 'error',
        confirmButtonColor: '#D4AF37'
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-[var(--color-bg-main)] flex items-center justify-center p-2 sm:p-4" dir="rtl">
      <div className="w-full max-w-[480px] relative group px-2">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[var(--color-gold-main)] opacity-10 blur-[60px] rounded-full"></div>

        <div className="glass-card rounded-[2rem] p-5 sm:p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gradient-gold italic tracking-tighter uppercase text-center">
              نسيت كلمة المرور؟
            </h2>
            <p className="text-[9px] md:text-xs tracking-[0.2em] uppercase mt-1 opacity-60 text-center">
              {step === 1 ? 'STEP 1 — إدخال البريد الإلكتروني' : 'STEP 2 — الرمز وكلمة المرور الجديدة'}
            </p>
          </div>

          {step === 1 ? <form onSubmit={handleSendCode} className="space-y-4 md:space-y-6" noValidate>
              <p className="text-center text-xs md:text-sm text-gray-400 leading-relaxed">
                ادخل بريدك الإلكتروني المسجل، وهنبعتلك رمز مكوّن من 6 أرقام عشان تقدر تغيّر كلمة المرور.
              </p>
              <div className="space-y-2">
                <label className="block text-[var(--color-gold-main)] text-sm md:text-lg font-black uppercase tracking-widest mr-1 text-right">
                  البريد الإلكتروني
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[var(--color-text-white)] focus:border-[var(--color-gold-main)] outline-none transition-all text-sm md:text-base text-right" placeholder="أدخل البريد الإلكتروني" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[var(--gold-gradient)] text-black font-black py-4 md:py-6 rounded-xl md:rounded-2xl shadow-[var(--gold-glow)] hover:scale-[1.01] active:scale-95 transition-all text-lg md:text-2xl uppercase border-b-4 border-black/20 mt-2 disabled:opacity-60">
                {loading ? 'جاري الإرسال...' : 'إرسال الرمز'}
              </button>
            </form> : <form onSubmit={handleResetPassword} className="space-y-4 md:space-y-6" noValidate>
              <p className="text-center text-xs md:text-sm text-gray-400 leading-relaxed">
                وصلك رمز على <span className="text-[var(--color-gold-main)] font-bold">{email}</span>، ادخله تحت مع كلمة المرور الجديدة.
              </p>

              <div className="space-y-2">
                <label className="block text-[var(--color-gold-main)] text-sm md:text-lg font-black uppercase tracking-widest mr-1 text-right">
                  الرمز
                </label>
                <input type="text" inputMode="numeric" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[var(--color-text-white)] focus:border-[var(--color-gold-main)] outline-none transition-all text-center text-2xl tracking-[0.5em] font-black" placeholder="------" />
              </div>

              <div className="space-y-2">
                <label className="block text-[var(--color-gold-main)] text-sm md:text-lg font-black uppercase tracking-widest mr-1 text-right">
                  كلمة المرور الجديدة
                </label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[var(--color-text-white)] focus:border-[var(--color-gold-main)] outline-none transition-all text-sm md:text-base text-right" placeholder="6 أحرف على الأقل" />
              </div>

              <div className="space-y-2">
                <label className="block text-[var(--color-gold-main)] text-sm md:text-lg font-black uppercase tracking-widest mr-1 text-right">
                  تأكيد كلمة المرور
                </label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[var(--color-text-white)] focus:border-[var(--color-gold-main)] outline-none transition-all text-sm md:text-base text-right" placeholder="أعد كتابة كلمة المرور" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[var(--gold-gradient)] text-black font-black py-4 md:py-6 rounded-xl md:rounded-2xl shadow-[var(--gold-glow)] hover:scale-[1.01] active:scale-95 transition-all text-lg md:text-2xl uppercase border-b-4 border-black/20 mt-2 disabled:opacity-60">
                {loading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
              </button>

              <button type="button" onClick={() => setStep(1)} className="w-full text-center text-xs text-gray-400 hover:text-[var(--color-gold-main)] transition-all">
                لم يصلك الرمز؟ إعادة الإرسال بإيميل آخر
              </button>
            </form>}

          <div className="mt-6 md:mt-10 text-center border-t border-white/5 pt-5 md:pt-8">
            <Link to="/login" className="inline-block px-5 py-2 rounded-lg border border-white/10 text-[var(--color-gold-main)] font-black text-[9px] md:text-xs uppercase hover:bg-[var(--color-gold-main)] hover:text-black transition-all">
              الرجوع لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>;
};
export default ForgotPassword;
