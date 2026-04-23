import React from 'react';

const Fitness = () => {
  const sections = [
    {
      id: "endurance",
      title: "أولاً: تمارين التحمل",
      description: "قدرة اللاعب على الاستمرار طوال 90 دقيقة بنفس الرتم القوي وبدون تراجع مفاجئ في الأداء البدني.",
      points: [
        { label: "التدريب المتقطع (HIIT)", text: "التبديل بين الجري السريع والهرولة لتحسين الاستشفاء أثناء اللعب." },
        { label: "الجري المستمر", text: "لرفع كفاءة الجهاز الدوري التنفسي والقدرة على قطع مسافات طويلة." }
      ],
      image: "/endurance.jpg",
      reverse: false
    },
    {
      id: "speed",
      title: "ثانياً: تمارين السرعة والرشاقة",
      description: "تطوير رد الفعل، الانطلاقات المباغتة، والقدرة على تغيير الاتجاه بسلاسة دون فقدان التوازن.",
      points: [
        { label: "تمارين الأقماع", text: "الجري المتعرج لتطوير التوافق العضلي العصبي وسرعة القدمين." },
        { label: "الركض السريع (Sprints)", text: "تحسين التسارع في أول 10 أمتار، وهو ما يصنع الفارق في الكرات المشتركة." }
      ],
      image: "/speed.jpg",
      reverse: true
    },
    {
      id: "strength",
      title: "ثالثاً: القوة والانفجارية",
      description: "القوة هي درع اللاعب في الالتحامات البدنية، والسر في قوة القفز والتسديد البعيد.",
      points: [
        { label: "التمارين الانفجارية", text: "القفز فوق الصناديق (Box Jumps) لتحويل القوة العضلية إلى سرعة حركية." },
        { label: "تقوية الجذع (Core)", text: "تمارين البلانك والضغط لضمان ثبات الجسم عند الاحتكاك مع الخصوم." }
      ],
      image: "/strength.jpg",
      reverse: false
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-white)] font-sans" dir="rtl">
      
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-gold-main)] mb-6 uppercase tracking-wide">
            اللياقة البدنية
          </h1>
          <p className="text-[var(--color-text-gray)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            دليلك الشامل لتطوير الأداء البدني والوصول لمستوى المحترفين داخل المستطيل الأخضر.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 space-y-32">
        {sections.map((section, index) => (
          <div 
            key={index}
            id={section.id}
            className={`flex flex-col ${section.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}
          >
            
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <span className="text-[var(--color-gold-main)] font-bold tracking-widest text-sm block">
                   FOOTBALL FITNESS
                </span>
                <h2 className="text-4xl font-bold text-[var(--color-text-white)] leading-tight">
                  {section.title}
                </h2>
                <div className="h-1 w-20 bg-[var(--color-gold-main)]"></div>
              </div>

              <p className="text-[var(--color-text-gray)] text-xl leading-relaxed">
                {section.description}
              </p>

              <div className="space-y-6">
                {section.points.map((point, pIndex) => (
                  <div key={pIndex} className="group border-r-2 border-[var(--color-border)] pr-6 py-2 transition-colors hover:border-[var(--color-gold-main)]">
                    <h4 className="text-[var(--color-gold-main)] font-bold text-lg mb-1">
                      {point.label}
                    </h4>
                    <p className="text-[var(--color-text-gray)] leading-snug">
                      {point.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            
            <div className="w-full lg:w-1/2">
              <div className="relative">
                
                <div className="absolute top-4 right-4 w-full h-full border-2 border-[var(--color-gold-main)] rounded-lg -z-10"></div>
                
                <div className="relative overflow-hidden rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-2xl">
                  <img 
                    src={section.image} 
                    alt={section.title}
                    className="w-full h-[450px] object-cover transition-transform duration-500 hover:scale-105 grayscale hover:grayscale-0"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      
      <section className="py-24 px-4 bg-[var(--color-bg-card)] mt-20 border-t border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-[var(--color-gold-main)]">الخلاصة</h2>
          <p className="text-[var(--color-text-white)] text-2xl leading-relaxed max-w-3xl mx-auto">
            "الموهبة تمنحك الفرصة، لكن اللياقة البدنية هي التي تجعلك تستغلها حتى الدقيقة الأخيرة."
          </p>
        </div>
      </section>
    </div>
  );
};

export default Fitness;