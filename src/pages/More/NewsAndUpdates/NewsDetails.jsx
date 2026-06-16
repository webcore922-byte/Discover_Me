import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, Activity, Bookmark } from 'lucide-react';

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${API_URL}/newsAndUpdates/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("الخبر غير موجود");
        return res.json();
      })
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e1011] flex items-center justify-center text-[#D4AF37] font-bold relative">
         <div className="absolute inset-0 bg-black/60 z-0" />
         <span className='relative z-10 animate-pulse'>جاري تحميل التقرير الفني الموحد...</span>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-[#0e1011] flex flex-col items-center justify-center text-white gap-4 p-4 text-center">
        <Bookmark className='w-12 h-12 text-gray-600' />
        <p className="text-lg font-bold text-gray-400">عذراً، لم نتمكن من العثور على هذا التقرير في الأرشيف!</p>
        <button onClick={() => navigate('/news')} className="px-5 py-2.5 bg-[#D4AF37] text-black font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-[#bfa032] transition-colors cursor-pointer">
          <ArrowRight className='w-4 h-4' /> العودة للأخبار
        </button>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-[#0e1011] text-white py-12 px-4 sm:px-6 md:px-8 lg:px-12 font-sans relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed w-full bit-overflow-x-hidden"
      style={{ backgroundImage: "url('/bg_prizes_and_competitions (2).jpeg')" }}
      dir="rtl"
    >
      {/* طبقة التعتيم الخلفية لضمان وضوح النصوص */}
      <div className="absolute inset-0 bg-black/85 pointer-events-none z-0" />

      {/* حاوية الخبر الممتدة عريضاً */}
      <div className="max-w-7xl mx-auto relative z-10 space-y-10 w-full overflow-hidden">
        
        {/* زر العودة العلوي */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs text-gray-300 hover:text-[#D4AF37] transition-all bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/5 cursor-pointer w-fit group"
        >
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /> العودة للتحديثات والتقارير
        </button>

        {/* جسم المقال الرئيسي */}
        <div className="bg-[#16191b]/95 border border-[#D4AF37]/10 rounded-3xl p-5 md:p-10 lg:p-12 space-y-12 shadow-2xl backdrop-blur-md w-full overflow-hidden">
          
          {/* هيدر الخبر الممتد */}
          <div className="space-y-5 border-b border-white/5 pb-8 w-full overflow-hidden">
            <div className="flex justify-center sm:justify-start">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-3.5 py-1.5 rounded-md text-xs font-black tracking-wide">
                {news.tag}
              </span>
            </div>
            {/* تم إضافة break-words لمنع العناوين الطويلة جداً من كسر التصميم */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight text-white drop-shadow-md text-center sm:text-right break-words whitespace-normal">
              {news.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 md:gap-6 text-xs text-gray-400 font-light pt-2">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/[0.02] break-all"><Calendar className="w-4 h-4 text-[#D4AF37]" /> {news.date}</span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/[0.02] break-words"><User className="w-4 h-4 text-[#D4AF37]" /> بواسطة: {news.author}</span>
            </div>
          </div>

          {/* محتوى المقال المقسم ذكياً بالـ Flexbox لمنع التداخل تماماً */}
          {/* تم إبدال text-justify بـ text-right لتجنب مشاكل التمدد على الموبايل، وإضافة break-words */}
          <div className="space-y-10 text-gray-200 text-sm md:text-base lg:text-lg leading-relaxed font-light text-right break-words w-full overflow-hidden">
            
            {/* الجزء الأول: الملخص وصورة الغلاف الأساسية بجانب بعضهما */}
            <div className="flex flex-col-reverse md:flex-row gap-6 lg:gap-10 items-start w-full">
              {/* النص الافتتاحي */}
              <div className="flex-1 w-full min-w-0">
                {/* whitespace-pre-line للحفاظ على النزول لسطر جديد لو النص جاي من الـ API بمسافات أسطر */}
                <p className="bg-black/20 p-5 md:p-6 rounded-2xl border border-white/[0.02] h-full break-words whitespace-pre-line">
                  <Bookmark className='w-5 h-5 text-[#D4AF37] inline-block ml-2 mt-[-3px]' />
                  {news.summary}
                </p>
              </div>
              
              {/* صورة الغلاف الأساسية بحجم محدد ومتناسق */}
              {news.image && (
                <div className="w-full md:w-[35%] lg:w-[30%] h-56 md:h-64 rounded-2xl overflow-hidden border border-white/5 shadow-xl shrink-0 group">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              )}
            </div>
            
            {/* السكاشن الموحدة المتكررة */}
            <div className="space-y-12 pt-4 w-full">
              {news.sections && news.sections.map((section, index) => (
                <div key={index} className="border-r-2 border-[#D4AF37]/40 pr-4 md:pr-6 space-y-4 group w-full min-w-0">
                  
                  {/* عنوان السكشن الفني */}
                  <h3 className="text-lg md:text-xl font-bold text-[#D4AF37] flex items-center gap-2 transition-colors group-hover:text-white break-words">
                    <Activity className="w-4 h-4 md:w-5 md:h-5 text-[#D4AF37]" /> {section.heading}
                  </h3>
                  
                  {/* محتوى السكشن: نص وصورة جنب بعض بالـ Flexbox */}
                  <div className="flex flex-col md:flex-row gap-6 items-start w-full">
                    
                    {/* النص: يأخذ المساحة المتبقية كاملة مع منع الخروج التام */}
                    {/* min-w-0 مهم جداً داخل الـ flex container عشان يسمح للنص يصغر وينزل سطر بدل ما يطرد الحاوية برة */}
                    <div className="flex-1 text-gray-300 font-light text-sm md:text-base lg:text-lg leading-relaxed break-words whitespace-pre-line min-w-0 text-right">
                      {section.content}
                    </div>

                    {/* الصورة الاختيارية للسكشن: تظهر على اليسار بحجم ثابت ومتناسق وبدون تداخل */}
                    {section.sectionImage && (
                      <div className="w-full md:w-[30%] lg:w-[25%] h-40 md:h-44 rounded-2xl overflow-hidden border border-white/5 shadow-md shrink-0 group/img">
                        <img 
                          src={section.sectionImage} 
                          alt={section.heading} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" 
                        />
                      </div>
                    )}

                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

        {/* فوتر التقرير التفصيلي */}
        <div className="text-center pt-6 border-t border-white/10 text-[11px] text-gray-500 font-light relative z-10 pb-6">
          جميع التقارير الفنية والأخبار المرفوعة حصرية ومعتمدة من اللجنة الفنية لـ منصة اكتشفني 🇪🇬
        </div>
        
      </div>
    </div>
  );
};

export default NewsDetails;