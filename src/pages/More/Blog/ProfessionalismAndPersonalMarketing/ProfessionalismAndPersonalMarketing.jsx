import React from 'react';

const ProfessionalismAndPersonalMarketing = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-white)] font-sans" dir="rtl">
      
      
      <div className="relative py-24 px-6 border-b border-[var(--color-border)]/20 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-8xl font-black text-[var(--color-gold-main)] leading-none mb-6">
            سوق <br /> نفسك.
          </h1>
          <p className="text-2xl text-[var(--color-text-gray)] max-w-xl font-light">
            في كرة القدم الحديثة، مستواك في الملعب هو نصف الحكاية.. النصف الآخر هو كيف يراك العالم.
          </p>
        </div>
        
        <div className="absolute top-10 left-[-5%] text-[15rem] font-black text-white/5 select-none pointer-events-none uppercase">
          Elite
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-20">
        
       
        <div className="mb-24 text-center">
          <p className="text-3xl font-medium leading-relaxed italic">
            "الأندية لا تبحث فقط عن <span className="text-[var(--color-gold-main)]">موهبة</span>، بل تبحث عن <span className="text-[var(--color-gold-main)]">استثمار</span> ناجح."
          </p>
        </div>

        
        <div className="grid lg:grid-cols-3 gap-8 mb-32">
          
          
          <div className="bg-[var(--color-bg-card)] p-10 rounded-3xl border border-[var(--color-border)]/20 hover:border-[var(--color-gold-main)] transition-all duration-500 group">
            <div className="w-14 h-14 bg-[var(--color-gold-main)] rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-12 transition-transform">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">الملف الشخصي (CV)</h3>
            <p className="text-[var(--color-text-gray)] leading-loose">
              جهز سيرة ذاتية رياضية تحتوي على أرقامك الحقيقية (عدد الدقائق، الأهداف، التمريرات الحاسمة) وصور واضحة لك في المباريات.
            </p>
          </div>

          
          <div className="bg-[var(--color-bg-card)] p-10 rounded-3xl border border-[var(--color-border)]/20 hover:border-[var(--color-gold-main)] transition-all duration-500 group">
            <div className="w-14 h-14 bg-[var(--color-gold-main)] rounded-2xl flex items-center justify-center mb-8 -rotate-3 group-hover:-rotate-12 transition-transform">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">فيديو المهارات</h3>
            <p className="text-[var(--color-text-gray)] leading-loose">
              لا ترسل فيديوهات طويلة ومملة. ركز على أهم 3 دقائق تظهر فيها قدرتك على اتخاذ القرار، المهارة الفنية، والتحول الدفاعي.
            </p>
          </div>

          
          <div className="bg-[var(--color-bg-card)] p-10 rounded-3xl border border-[var(--color-border)]/20 hover:border-[var(--color-gold-main)] transition-all duration-500 group">
            <div className="w-14 h-14 bg-[var(--color-gold-main)] rounded-2xl flex items-center justify-center mb-8 rotate-6 group-hover:rotate-0 transition-transform">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">الانضباط الرقمي</h3>
            <p className="text-[var(--color-text-gray)] leading-loose">
              حساباتك على السوشيال ميديا هي واجهتك. الكشافون يراقبون تصرفاتك خارج الملعب للتأكد من عقليتك الاحترافية.
            </p>
          </div>

        </div>

        
        <div className="grid lg:grid-cols-2 gap-12 items-center bg-[var(--color-bg-card)] rounded-[3rem] p-8 lg:p-16 border border-[var(--color-border)]/10 shadow-3xl">
          <div>
            <h2 className="text-4xl font-bold mb-6">جاهز لجذب <span className="text-[var(--color-gold-main)]">الوكلاء؟</span></h2>
            <p className="text-[var(--color-text-gray)] text-lg mb-8 leading-relaxed">
              تعلم كيف تكتب رسالة احترافية لمدربي الأندية ووكلاء اللاعبين، وما هو الوقت المثالي للتواصل معهم.
            </p>
          </div>
          <div className="relative group overflow-hidden rounded-2xl">
             <img 
              src="/ProfessionalismAndPersonalMarketing.jpg" 
              alt="Professional Player Portrait" 
              className="w-full h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
             />
             <div className="absolute inset-0 bg-[var(--color-gold-main)]/10"></div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ProfessionalismAndPersonalMarketing;