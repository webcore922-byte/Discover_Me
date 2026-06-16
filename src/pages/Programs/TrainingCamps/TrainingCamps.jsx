import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Award } from 'lucide-react';
import Swal from 'sweetalert2';

const TrainingCamps = () => {
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiURL}/camps`); 
        
        if (!response.ok) {
          throw new Error('لم نتمكن من الاتصال بالخادم حالياً');
        }
        
        const data = await response.json();
        
        if (data.camps) {
          setCamps(data.camps);
        } else if (Array.isArray(data)) {
          setCamps(data);
        } else {
          throw new Error('صيغة البيانات المستلمة غير مدعومة');
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        
        Swal.fire({
          title: '<span style="color: #fff; font-size: 22px;">عذراً، تعذر تحميل المعسكرات!</span>',
          html: '<p style="color: var(--color-text-gray); font-size: 15px;">يبدو أن هناك مشكلة في الاتصال بالـ API أو أن البيانات غير متوفرة حالياً.</p>',
          icon: 'error',
          iconColor: '#d4af37',
          background: 'rgba(26, 29, 30, 0.95)',
          backdrop: 'rgba(0, 0, 0, 0.8)',
          showCancelButton: true,
          confirmButtonText: 'إعادة المحاولة 🔄',
          cancelButtonText: 'العودة للصفحة السابقة 🔙',
          confirmButtonColor: 'var(--color-gold-main)',
          cancelButtonColor: '#333',
          buttonsStyling: true,
          customClass: {
            popup: 'glass-card gold-glow-border rounded-2xl',
            confirmButton: 'px-5 py-2 rounded-xl font-bold text-black',
            cancelButton: 'px-5 py-2 rounded-xl font-bold text-white'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            setLoading(true);
            window.location.reload();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            window.history.back();
          }
        });
      }
    };

    fetchCamps();
  }, []);

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url('bg_prizes_and_competitions.jpeg')` }}
      >
        <div className="absolute inset-0 bg-black/80 pointer-events-none" />
        <div className="relative z-10 animate-spin-slow rounded-full h-16 w-16 border-t-2 border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  return (
    <section 
      dir="rtl" 
      className="min-h-screen text-white py-16 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat bg-fixed overflow-hidden"
      style={{ backgroundImage: `url('bg_prizes_and_competitions.jpeg')` }}
    >
      {/* طبقة التعتيم الخلفية */}
      <div className="absolute inset-0 bg-black/75 pointer-events-none z-0" />

      {/* الهيدر العلوي للملف والصفحة */}
      <div className="max-w-7xl mx-auto mb-16 text-center relative z-10">
        <div className="inline-block relative">
          <span className="absolute -top-6 -right-8 text-xl text-[#d4af37] opacity-70">✨</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-wide text-white">
            المعسكرات التدريبية
          </h2>
          <span className="absolute -bottom-2 -left-8 text-xl text-[#d4af37] opacity-70">✨</span>
        </div>
        <p className="text-[#b0b0b0] mt-2 text-sm md:text-base max-w-md mx-auto" style={{ color: 'var(--color-text-gray)' }}>
          اختر المعسكر المناسب لك وانضم إلينا الآن لتطوير مهاراتك الرياضية
        </p>
      </div>

      {/* شبكة الكروت (Grid) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 mb-16">
        {camps.map((camp) => (
          <div
            key={camp.id}
            className="glass-card hover-gold-card card-shine rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative group"
          >
            <div>
              {/* صورة المعسكر */}
              <div className="w-full h-48 rounded-xl overflow-hidden mb-5 relative group">
                <img
                  src={camp.image}
                  alt={camp.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=500";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>

              {/* عناوين الكارت */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold mb-1 text-white">{camp.title}</h3>
                <h4 className="text-sm text-[#d4af37] font-medium" style={{ color: 'var(--color-gold-main)' }}>
                  {camp.subtitle}
                </h4>
              </div>

              {/* تفاصيل المعسكر */}
              <div className="space-y-3 text-right text-sm border-t border-gray-800/60 pt-4 mb-4">
                <div className="flex items-start gap-2">
                  <Award className="icon-gold w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">
                    <span className="text-[#d4af37] font-semibold pl-1">يركز على:</span>
                    {Array.isArray(camp.focus) ? camp.focus.join('، ') : camp.focus}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="icon-gold w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">
                    <span className="text-[#d4af37] font-semibold pl-1">المكان:</span>
                    {camp.location}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="icon-gold w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">
                    <span className="text-[#d4af37] font-semibold pl-1">المواعيد:</span>
                    {camp.schedule}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="icon-gold w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-400 text-xs leading-relaxed">
                    <span className="text-[#d4af37] text-sm font-semibold pl-1">التفاصيل:</span>
                    {camp.details}
                  </p>
                </div>
              </div>
            </div>

            {/* العناصر التفاعلية السفلية للكارت */}
            <div className="space-y-4">
              
              {/* زر التسجيل - تمت إعادته لكامل العرض الفخم مع تأثير الـ Hover */}
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); 
                  console.log(`تم اختيار معسكر: ${camp.title}`);
                  navigate('/training-camps/form');
                }}
                className="w-full py-3 px-4 rounded-xl font-extrabold text-black text-sm tracking-wide transition-all duration-300 relative z-20 cursor-pointer overflow-hidden group/btn block hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                style={{
                  background: 'linear-gradient(to right, var(--color-btn-start), var(--color-btn-end))',
                }}
              >
                {/* تأثير اللمعان الذي يتحرك بانسيابية فور الحوم فوق الزر */}
                <span className="absolute inset-0 w-full h-full bg-white/25 transform -skew-x-12 -translate-x-full group-hover/btn:transition-transform group-hover/btn:duration-700 group-hover/btn:translate-x-full pointer-events-none" />
                
                <span className="flex items-center justify-center gap-1.5 relative z-10">
                  سجل الآن في المعسكر ✨ ⚽
                </span>
              </button>

              {/* قسم المدرب */}
              <div className="pt-3 border-t border-gray-800/60">
                <div className="flex items-center justify-between bg-black/20 p-2 rounded-xl border border-gray-800/40">
                  <div className="text-right">
                    <p className="text-[10px] text-[#d4af37]" style={{ color: 'var(--color-gold-main)' }}>المدرب المسؤول</p>
                    <p className="text-xs font-bold text-white">{camp.coach?.name}</p>
                  </div>
                  <img
                    src={camp.coach?.image}
                    alt={camp.coach?.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#a68946]"
                    style={{ borderColor: 'var(--color-border)' }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100";
                    }}
                  />
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* فوتر المنصة */}
      <div className="text-center pt-6 border-t border-white/10 text-[11px] text-gray-400 font-light relative z-10">
        منصة اكتشفني تضمن تكافؤ الفرص لجميع المواهب الناشئة بمصر 🇪🇬
      </div>
    </section>
  );
};

export default TrainingCamps;