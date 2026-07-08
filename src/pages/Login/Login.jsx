import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import Swal from '../../utils/swalAlert';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const {
    login
  } = useAuth();
  const handleLogin = async e => {
    e.preventDefault();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password.trim();
    if (!email) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى إدخال البريد الإلكتروني الخاص بك لتسجيل الدخول.',
        icon: 'warning',
        confirmButtonColor: '#D4AF37',
        confirmButtonText: 'موافق',
        customClass: {
          popup: 'border border-[var(--color-gold-main)]/30 rounded-3xl'
        }
      });
      return;
    }
    if (!password) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى إدخال كلمة المرور المربوطة بالحساب.',
        icon: 'warning',
        confirmButtonColor: '#D4AF37',
        confirmButtonText: 'موافق',
        customClass: {
          popup: 'border border-[var(--color-gold-main)]/30 rounded-3xl'
        }
      });
      return;
    }
    const res = await login(email, password);
    if (res.success) {
      Swal.fire({
        title: 'تم تسجيل الدخول بنجاح',
        text: 'جاري تهيئة لوحة التحكم ونقل الحساب...',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        iconColor: '#D4AF37'
      });
    } else {
      Swal.fire({
        title: 'فشل عملية الدخول',
        text: res.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة، يرجى إعادة المحاولة.',
        icon: 'error',
        confirmButtonColor: '#D4AF37',
        confirmButtonText: 'إعادة المحاولة'
      });
    }
  };
  return <div className="min-h-screen bg-[var(--color-bg-main)] flex items-center justify-center p-2 sm:p-4" dir="rtl">
      <div className="w-full max-w-[480px] relative group px-2">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[var(--color-gold-main)] opacity-10 blur-[60px] rounded-full"></div>

        <div className="glass-card rounded-[2rem] p-5 sm:p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gradient-gold italic tracking-tighter uppercase text-center">LOGIN</h2>
            <p className="text-[9px] md:text-xs tracking-[0.2em] uppercase mt-1 opacity-60 text-center">ScoutPro System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6" noValidate>
            <div className="space-y-2">
              <label className="block text-[var(--color-gold-main)] text-sm md:text-lg font-black uppercase tracking-widest mr-1 text-right">
                البريد الإلكتروني
              </label>
              <input type="email" value={formData.email} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[var(--color-text-white)] focus:border-[var(--color-gold-main)] outline-none transition-all text-sm md:text-base text-right" placeholder="أدخل البريد الإلكتروني" onChange={e => setFormData({
              ...formData,
              email: e.target.value
            })} />
            </div>

            <div className="space-y-2">
              <label className="block text-[var(--color-gold-main)] text-sm md:text-lg font-black uppercase tracking-widest mr-1 text-right">
                كلمة المرور
              </label>
              <input type="password" value={formData.password} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[var(--color-text-white)] focus:border-[var(--color-gold-main)] outline-none transition-all text-sm md:text-base text-right" placeholder="أدخل كلمة المرور" onChange={e => setFormData({
              ...formData,
              password: e.target.value
            })} />
              <div className="text-left">
                <Link to="/forgot-password" className="text-[11px] md:text-xs text-gray-400 hover:text-[var(--color-gold-main)] transition-all">
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            <button type="submit" className="w-full bg-[var(--gold-gradient)] text-black font-black py-4 md:py-6 rounded-xl md:rounded-2xl shadow-[var(--gold-glow)] hover:scale-[1.01] active:scale-95 transition-all text-lg md:text-2xl uppercase border-b-4 border-black/20 mt-2">
              دخول النظام
            </button>
          </form>

          <div className="mt-6 md:mt-10 text-center border-t border-white/5 pt-5 md:pt-8">
            <Link to="/register" className="inline-block px-5 py-2 rounded-lg border border-white/10 text-[var(--color-gold-main)] font-black text-[9px] md:text-xs uppercase hover:bg-[var(--color-gold-main)] hover:text-black transition-all">
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>
    </div>;
};
export default Login;
