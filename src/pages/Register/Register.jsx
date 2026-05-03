import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import Swal from 'sweetalert2';

const POSITION_OPTIONS = [
  { value: "حارس مرمى", label: "حارس مرمى (GK)" },
  { value: "قلب دفاع", label: "قلب دفاع (CB)" },
  { value: "ظهير أيمن", label: "ظهير أيمن (RB)" },
  { value: "ظهير أيسر", label: "ظهير أيسر (LB)" },
  { value: "وسط مدافع", label: "وسط مدافع (CDM)" },
  { value: "وسط ملعب", label: "وسط ملعب (CM)" },
  { value: "صانع ألعاب", label: "صانع ألعاب (CAM)" },
  { value: "جناح أيمن", label: "جناح أيمن (RW)" },
  { value: "جناح أيسر", label: "جناح أيسر (LW)" },
  { value: "مهاجم صريح", label: "مهاجم صريح (ST)" },
  { value: "مهاجم وهمي", label: "مهاجم وهمي (CF)" },
];

const InputField = ({ label, name, placeholder, type = "text", className, value, onChange }) => (
  <div className={`space-y-3 ${className}`}>
    <label className="block text-[var(--color-gold-main)] text-sm md:text-lg font-black uppercase tracking-widest mr-2 text-right">
      {label}
    </label>
    <input 
      type={type} 
      required
      name={name}
      value={value || ''} 
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 text-white focus:border-[var(--color-gold-main)] outline-none transition-all text-sm md:text-base text-right"
      onChange={onChange}
    />
  </div>
);

const Register = () => {
  const [isPlayer, setIsPlayer] = useState(false);
  const [formData, setFormData] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.registerAsPlayer) {
      setIsPlayer(true);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const email = formData.email || "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({ title: 'البريد الإلكتروني غير صحيح', text: 'برجاء إدخال بريد إلكتروني صالح', icon: 'error', background: '#1a1a1a', color: '#fff', confirmButtonColor: '#D4AF37' });
      return;
    }
    const password = formData.password || "";
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      Swal.fire({ title: 'كلمة المرور ضعيفة', html: `<div style="text-align: right; direction: rtl;">يجب 8 حروف، حرف كبير، ورقم.</div>`, icon: 'warning', background: '#1a1a1a', color: '#fff', confirmButtonColor: '#D4AF37' });
      return; 
    }
    Swal.fire({ title: 'جاري إنشاء الحساب', background: '#1a1a1a', color: '#fff', didOpen: () => { Swal.showLoading(); } });
    try {
      const res = await register(formData, isPlayer);
      Swal.close();
      if (res.success) {
        Swal.fire({ title: 'مبروك يا بطل!', icon: 'success', timer: 1500, showConfirmButton: false, background: '#1a1a1a' });
        setTimeout(() => navigate('/profile'), 1500);
      } else {
        Swal.fire({ title: 'فشل التسجيل', text: res.message, icon: 'error', background: '#1a1a1a' });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({ title: 'خطأ تقني', icon: 'error', background: '#1a1a1a' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] flex items-center justify-center py-12 px-4 md:px-10" dir="rtl">
      <div className="w-full max-w-5xl">
        <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-14 border border-white/10 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-gradient-gold italic uppercase tracking-widest">Join ScoutPro</h2>
          </div>
          <form onSubmit={handleRegister} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="اسم المستخدم" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
              <InputField label="كلمة المرور" name="password" type="password" placeholder="8 حروف + حرف كبير + رقم" value={formData.password} onChange={handleChange} />
              <InputField label="البريد الإلكتروني" name="email" type="email" placeholder="example@mail.com" value={formData.email} onChange={handleChange} />
              <InputField label="رقم الموبايل" name="phone" placeholder="01xxxxxxxxx" value={formData.phone} onChange={handleChange} />
            </div>
            <div 
              className={`flex items-center justify-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${isPlayer ? 'border-[var(--color-gold-main)] bg-[var(--color-gold-main)]/10' : 'border-white/10 bg-white/5'}`}
              onClick={() => setIsPlayer(!isPlayer)}
            >
              <span className={`text-sm font-black uppercase italic tracking-widest ${isPlayer ? 'text-[var(--color-gold-main)]' : 'text-white/60'}`}>
                {isPlayer ? '✓ أنت تسجل كلاعب موهوب' : 'هل أنت موهبة كروية؟ (اضغط هنا)'}
              </span>
            </div>
            {isPlayer && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-white/5 pt-10">
                <InputField label="الاسم بالكامل" name="fullName" placeholder="الاسم ثلاثي" className="md:col-span-2 lg:col-span-2" value={formData.fullName} onChange={handleChange} />
                <InputField label="الرقم القومي" name="nationalId" placeholder="14 رقم" value={formData.nationalId} onChange={handleChange} />
                <InputField label="السن" name="age" placeholder="19" value={formData.age} onChange={handleChange} />
                <div className="space-y-3">
                  <label className="block text-[var(--color-gold-main)] text-sm md:text-lg font-black uppercase tracking-widest mr-2 text-right">المركز</label>
                  <select name="position" required className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 text-white focus:border-[var(--color-gold-main)] outline-none transition-all text-sm md:text-base text-right appearance-none cursor-pointer" onChange={handleChange} value={formData.position || ''}>
                    <option value="">اختر مركزك</option>
                    {POSITION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <InputField label="المحافظة" name="location" placeholder="القاهرة" value={formData.location} onChange={handleChange} />
                <div className="space-y-3">
                  <label className="block text-[var(--color-gold-main)] text-sm md:text-lg font-black uppercase tracking-widest mr-2 text-right">القدم المفضلة</label>
                  <select name="preferredFoot" required className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 text-white focus:border-[var(--color-gold-main)] outline-none transition-all text-sm md:text-base text-right appearance-none cursor-pointer" onChange={handleChange} value={formData.preferredFoot || ''}>
                    <option value="">اختر القدم</option>
                    <option value="يمين">يمين</option>
                    <option value="يسار">يسار</option>
                    <option value="القدمين">القدمين</option>
                  </select>
                </div>
                <InputField label="لينك فيديو مهاراتك" name="videoUrl" placeholder="Google Drive Link" className="md:col-span-2 lg:col-span-3" value={formData.videoUrl} onChange={handleChange} />
              </div>
            )}
            <button type="submit" className="w-full bg-[var(--gold-gradient)] text-black font-black py-5 md:py-6 rounded-xl md:rounded-2xl shadow-[var(--gold-glow)] hover:scale-[1.01] active:scale-95 transition-all text-xl md:text-2xl uppercase italic">
              {isPlayer ? 'تأكيد بروفايل اللاعب' : 'تأكيد الحساب الجديد'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;