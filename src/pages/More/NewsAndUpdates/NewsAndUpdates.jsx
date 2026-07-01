import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2'; 

const NewsAndUpdates = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // دالة جلب البيانات من الـ API
  const fetchNews = () => {
    setLoading(true);
    fetch(`${API_URL}/newsAndUpdates`)
      .then((res) => {
        if (!res.ok) throw new Error("تعذر جلب البيانات من السيرفر");
        return res.json();
      })
      .then((data) => {
        const fetchedData = Array.isArray(data) ? data : (data.newsAndUpdates || []);
        
        // لو الـ API اشتغل بس مفيش داتا خالص
        if (fetchedData.length === 0) {
          showEmptyAlert();
        }
        
        setNewsList(fetchedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setLoading(false);
        showErrorAlert(); 
      });
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // 1️⃣ أليرت خطأ الاتصال (لو السيرفر واقع أو مفيش نت)
  const showErrorAlert = () => {
    Swal.fire({
      title: '<span style="color: #ffffff; font-family: sans-serif;">عذراً، فشل الاتصال بالخادم!</span>',
      html: '<p style="color: #a3a3a3; font-size: 14px; font-family: sans-serif;">واجهنا مشكلة أثناء جلب التحديثات الأخيرة. يرجى التحقق من اتصالك بالإنترنت أو المحاولة لاحقاً.</p>',
      icon: 'error',
      iconColor: '#ea580c',
      background: '#16191b', 
      showCancelButton: true,
      confirmButtonText: 'إعادة المحاولة 🔄',
      cancelButtonText: 'تصفح المنصة', 
      confirmButtonColor: '#D4AF37', 
      cancelButtonColor: '#1f2427',
      customClass: {
        popup: 'rounded-3xl border border-[#D4AF37]/20 shadow-2xl backdrop-blur-md'
      },
      buttonsStyling: true,
      reverseButtons: true 
    }).then((result) => {
      if (result.isConfirmed) {
        fetchNews(); // إعادة المحاولة الفورية
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigate('/'); // 🌟 التوجيه الفوري للصفحة الرئيسية عند الضغط على تصفح المنصة
      }
    });
  };

  // 2️⃣ أليرت في حال كان الأرشيف فارغاً
  const showEmptyAlert = () => {
    Swal.fire({
      title: '<span style="color: #D4AF37; font-family: sans-serif;">الأرشيف خالٍ حالياً!</span>',
      html: '<p style="color: #a3a3a3; font-size: 14px; font-family: sans-serif;">لم يتم نشر أي تقارير فنية أو أخبار جديدة اليوم. تابعنا لاحقاً.</p>',
      icon: 'info',
      iconColor: '#D4AF37',
      background: '#16191b',
      confirmButtonText: 'مفهوم',
      confirmButtonColor: '#D4AF37',
      customClass: {
        popup: 'rounded-3xl border border-[#D4AF37]/20 shadow-2xl'
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-[#0e1011] bg:[var(--color-bg-main)] flex items-center justify-center text-[#D4AF37] font-bold">
        جاري تحميل آخر الأخبار والتحديثات...
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen dark:bg-[#0e1011] bg:[var(--color-bg-main)] dark:text-white text:[var(--color-text-gray)] py-12 px-4 md:px-8 lg:px-16 font-sans relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/bg_prizes_and_competitions (2).jpeg')" }}
      dir="rtl"
    >
      <div className="absolute inset-0 bg-black/75 pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto space-y-12 relative z-10">
        
        {/* هيدر الصفحة الرئيسي */}
        <div className="text-center space-y-2 max-w-2xl mx-auto pt-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#D4AF37] text-xl">✨</span>
            <h1 className="text-3xl md:text-5xl font-black tracking-wide dark:text-white drop-shadow-md">
              الأخبار والتحديثات
            </h1>
            <span className="text-[#D4AF37] text-xl">✨</span>
          </div>
          <p className="dark:text-gray-400 text-xs md:text-sm font-light leading-relaxed">
            تابع أولاً بأول كواليس تصفية المواهب، قرارات اللجنة الفنية، وآخر المفاجآت والاتفاقيات الحصرية لمنصة اكتشفني.
          </p>
        </div>

        {/* شبكة كروت الأخبار المنسقة */}
        {newsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.map((news) => (
              <div 
                key={news.id}
                className="bg-[#16191b]/80 border border-[#D4AF37]/20 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#D4AF37]/60 transition-all duration-300 shadow-xl backdrop-blur-md relative"
              >
                <div>
                  <div className="h-48 w-full overflow-hidden relative border-b border-white/5">
                    <img 
                      src={news.image} 
                      alt={news.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 bg-[#D4AF37] text-black text-[10px] font-black px-2.5 py-1 rounded-md shadow-md">
                      {news.tag || "أخبار المنصة"}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-4 text-[11px] dark:text-gray-400 font-light">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> {news.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#D4AF37]" /> {news.author}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                      {news.title}
                    </h3>

                    <p className="dark:text-gray-300 text-xs font-light leading-relaxed line-clamp-3">
                      {news.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button 
                    type="button"
                    onClick={() => navigate(`/news/${news.id}`)}
                    className="w-full py-2.5 px-4 rounded-xl font-extrabold text-black text-xs transition-all duration-300 relative z-20 cursor-pointer overflow-hidden flex items-center justify-center gap-1.5 hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(212,175,55,0.2)]"
                    style={{ background: 'linear-gradient(to right, #D4AF37, #bfa032)' }}
                  >
                    اقرأ المزيد عن الخبر
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:translate-x-[-2px]" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* واجهة احتياطية هادئة في حال انقطاع البيانات */
          <div className="text-center py-20 dark:text-gray-500 text-sm font-light">
            لا توجد بيانات متاحة لعرضها حالياً.
          </div>
        )}

      </div>

      <div className="text-center pt-16 text-[11px] dark:text-gray-500 font-light relative z-10">
        منصة اكتشفني تضمن تكافؤ الفرص لجميع المواهب الناشئة بمصر 🇪🇬
      </div>
    </div>
  );
};

export default NewsAndUpdates;