import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import Swal from '../../utils/swalAlert';
const POSITION_OPTIONS = [{
  value: "حارس مرمى",
  label: "حارس مرمى (GK)"
}, {
  value: "قلب دفاع",
  label: "قلب دفاع (CB)"
}, {
  value: "ظهير أيمن",
  label: "ظهير أيمن (RB)"
}, {
  value: "ظهير أيسر",
  label: "ظهير أيسر (LB)"
}, {
  value: "وسط مدافع",
  label: "وسط مدافع (CDM)"
}, {
  value: "وسط ملعب",
  label: "وسط ملعب (CM)"
}, {
  value: "صانع ألعاب",
  label: "صانع ألعاب (CAM)"
}, {
  value: "جناح أيمن",
  label: "جناح أيمن (RW)"
}, {
  value: "جناح أيسر",
  label: "جناح أيسر (LW)"
}, {
  value: "مهاجم صريح",
  label: "مهاجم صريح (ST)"
}, {
  value: "مهاجم وهمي",
  label: "مهاجم وهمي (CF)"
}];
const InputField = ({
  label,
  name,
  placeholder,
  type = "text",
  className,
  value,
  onChange
}) => <div className={`space-y-3 ${className}`}>
    <label className="block text-[var(--color-gold-main)] text-sm md:text-lg font-black uppercase tracking-widest mr-2 text-right">
      {label}
    </label>
    <input type={type} name={name} value={value} placeholder={placeholder} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 text-[var(--color-text-white)] focus:border-[var(--color-gold-main)] outline-none transition-all text-sm md:text-base text-right" onChange={onChange} />
  </div>;
const Register = () => {
  const [isPlayer, setIsPlayer] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    fullName: '',
    nationalId: '',
    age: '',
    position: '',
    location: '',
    preferredFoot: '',
    videoUrl: ''
  });
  const {
    register
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.state?.registerAsPlayer) {
      setIsPlayer(true);
    }
  }, [location]);
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const showValidationError = message => {
    Swal.fire({
      title: 'مطلوب إدخال بيانات',
      text: message,
      icon: 'warning',
      confirmButtonColor: '#D4AF37',
      confirmButtonText: 'متابعة التعديل',
      customClass: {
        popup: 'border border-[var(--color-gold-main)]/30 rounded-3xl'
      }
    });
  };
  const handleRegister = async e => {
    e.preventDefault();
    const username = formData.username?.trim();
    const password = formData.password?.trim();
    const email = formData.email?.trim().toLowerCase();
    const phone = formData.phone?.trim();
    if (!username) return showValidationError('يرجى إدخال اسم المستخدم لإتمام التسجيل.');
    if (!password) return showValidationError('يرجى تعيين كلمة المرور الخاصة بحسابك.');
    if (!email) return showValidationError('يرجى إدخال البريد الإلكتروني للتواصل.');
    if (!phone) return showValidationError('يرجى إدخال رقم الهاتف المحمول.');
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return Swal.fire({
        title: 'بريد إلكتروني غير صالح',
        text: 'يرجى إدخال بريد إلكتروني صحيح بالصيغة: example@mail.com',
        icon: 'error',
        confirmButtonColor: '#D4AF37'
      });
    }
    if (password.length < 8) {
      return Swal.fire({
        title: 'كلمة المرور قصيرة',
        text: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.',
        icon: 'warning',
        confirmButtonColor: '#D4AF37'
      });
    }
    if (!/[A-Z]/.test(password)) {
      return Swal.fire({
        title: 'كلمة المرور ضعيفة',
        text: 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل (A-Z).',
        icon: 'warning',
        confirmButtonColor: '#D4AF37'
      });
    }
    if (!/[0-9]/.test(password)) {
      return Swal.fire({
        title: 'كلمة المرور ضعيفة',
        text: 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل.',
        icon: 'warning',
        confirmButtonColor: '#D4AF37'
      });
    }
    if (isPlayer) {
      if (!formData.fullName?.trim()) return showValidationError('يرجى إدخال الاسم بالكامل كما هو مسجل في الأوراق الرسمية.');
      if (!formData.nationalId?.trim()) return showValidationError('يرجى إدخال الرقم القومي المكون من 14 رقمًا.');
      if (!/^\d{14}$/.test(formData.nationalId.trim())) {
        return Swal.fire({
          title: 'رقم قومي غير صحيح',
          text: 'الرقم القومي يجب أن يكون 14 رقمًا بالظبط.',
          icon: 'error',
          confirmButtonColor: '#D4AF37'
        });
      }
      if (!formData.age?.trim()) return showValidationError('يرجى تحديد السن الحالي للاعب.');
      if (!formData.position) return showValidationError('يرجى اختيار مركز اللعب الرئيسي.');
      if (!formData.location?.trim()) return showValidationError('يرجى تحديد محافظة الإقامة الحالية.');
      if (!formData.preferredFoot) return showValidationError('يرجى تحديد القدم المفضلة للعب.');
      if (!formData.videoUrl?.trim()) return showValidationError('يرجى إدراج رابط فيديو يوضح المهارات الكروية الخاصة بك.');
    }
    const cleanedData = {
      ...formData,
      username,
      password,
      email,
      phone
    };
    Swal.fire({
      title: 'جاري إنشاء الحساب',
      text: 'يرجى الانتظار ثوانٍ معدودة...',
      didOpen: () => Swal.showLoading()
    });
    try {
      const res = await register(cleanedData, isPlayer);
      Swal.close();
      if (res.success) {
        Swal.fire({
          title: 'تم التسجيل بنجاح',
          text: 'تم إنشاء حسابك في المنصة بنجاح.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        setTimeout(() => navigate('/profile'), 1500);
      } else {
        Swal.fire({
          title: 'فشل التسجيل',
          text: res.message,
          icon: 'error',
          background: '#1a1a1a'
        });
      }
    } catch {
      Swal.close();
      Swal.fire({
        title: 'خطأ في النظام',
        text: 'حدث خطأ تقني، يرجى المحاولة لاحقاً.',
        icon: 'error',
        background: '#1a1a1a'
      });
    }
  };
  return <div className="min-h-screen bg-[var(--color-bg-main)] flex items-center justify-center py-12 px-4 md:px-10" dir="rtl">
      <div className="w-full max-w-5xl">
        <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-14 border border-white/10 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-gradient-gold italic uppercase tracking-widest">Join ScoutPro</h2>
          </div>
          <form onSubmit={handleRegister} className="space-y-8" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="اسم المستخدم" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
              <InputField label="كلمة المرور" name="password" type="password" placeholder="8 حروف + حرف كبير + رقم" value={formData.password} onChange={handleChange} />
              <InputField label="البريد الإلكتروني" name="email" type="email" placeholder="example@mail.com" value={formData.email} onChange={handleChange} />
              <InputField label="رقم الموبايل" name="phone" placeholder="01xxxxxxxxx" value={formData.phone} onChange={handleChange} />
            </div>

            <div className={`flex items-center justify-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${isPlayer ? 'border-[var(--color-gold-main)] bg-[var(--color-gold-main)]/10' : 'border-white/10 bg-white/5'}`} onClick={() => setIsPlayer(!isPlayer)}>
              <span className={`text-sm font-black uppercase italic tracking-widest ${isPlayer ? 'text-[var(--color-gold-main)]' : 'text-white/60'}`}>
                {isPlayer ? '✓ نمط التسجيل الحالي: حساب لاعب محترف' : 'هل ترغب في التسجيل كلاعب؟ (اضغط هنا)'}
              </span>
            </div>

            {isPlayer && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-white/5 pt-10">
                <InputField label="الاسم بالكامل" name="fullName" placeholder="الاسم ثلاثي" className="md:col-span-2 lg:col-span-2" value={formData.fullName} onChange={handleChange} />
                <InputField label="الرقم القومي" name="nationalId" placeholder="14 رقم" value={formData.nationalId} onChange={handleChange} />
                <InputField label="السن" name="age" placeholder="19" value={formData.age} onChange={handleChange} />
                <div className="space-y-3">
                  <label className="block text-[var(--color-gold-main)] text-sm md:text-lg font-black uppercase tracking-widest mr-2 text-right">المركز</label>
                  <select name="position" className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 text-[var(--color-text-white)] focus:border-[var(--color-gold-main)] outline-none transition-all text-sm md:text-base text-right appearance-none cursor-pointer" onChange={handleChange} value={formData.position}>
                    <option value="">اختر مركزك</option>
                    {POSITION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <InputField label="المحافظة" name="location" placeholder="القاهرة" value={formData.location} onChange={handleChange} />
                <div className="space-y-3">
                  <label className="block text-[var(--color-gold-main)] text-sm md:text-lg font-black uppercase tracking-widest mr-2 text-right">القدم المفضلة</label>
                  <select name="preferredFoot" className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 text-[var(--color-text-white)] focus:border-[var(--color-gold-main)] outline-none transition-all text-sm md:text-base text-right appearance-none cursor-pointer" onChange={handleChange} value={formData.preferredFoot}>
                    <option value="">اختر القدم</option>
                    <option value="يمين">يمين</option>
                    <option value="يسار">يسار</option>
                    <option value="القدمين">القدمين</option>
                  </select>
                </div>
                <InputField label="لينك فيديو مهاراتك" name="videoUrl" placeholder="Google Drive Link" className="md:col-span-2 lg:col-span-3" value={formData.videoUrl} onChange={handleChange} />
              </div>}

            <button type="submit" className="w-full bg-[var(--gold-gradient)] text-black font-black py-5 md:py-6 rounded-xl md:rounded-2xl shadow-[var(--gold-glow)] hover:scale-[1.01] active:scale-95 transition-all text-xl md:text-2xl uppercase italic">
              {isPlayer ? 'تأكيد بروفايل اللاعب' : 'تأكيد الحساب الجديد'}
            </button>
          </form>
        </div>
      </div>
    </div>;
};
export default Register;
