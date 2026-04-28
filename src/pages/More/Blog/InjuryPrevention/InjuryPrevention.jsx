import React, { Suspense, lazy } from 'react';

const InjuryPreventionContent = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-white)] font-sans selection:bg-[var(--color-gold-main)] selection:text-black">
      
      <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-32">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase text-right">
              حصن <span className="text-[var(--color-gold-main)]">جسدك</span> <br /> 
              لبقاء أطول في الملعب
            </h1>
            <p className="text-xl text-[var(--color-text-gray)] leading-relaxed max-w-xl mb-10 border-r-4 border-[var(--color-gold-main)] pr-6 text-right">
              الموهبة وحدها لا تكفي إذا كنت ستقضي نصف الموسم في العيادة. الإصابة ليست حظاً سيئاً، بل هي نتيجة لإهمال تفاصيل احترافية.
            </p>
            <div className="flex gap-4 justify-end">
              <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] px-6 py-3 rounded-tr-3xl">
                <span className="block text-[var(--color-gold-main)] font-bold text-2xl">90%</span>
                <span className="text-xs text-[var(--color-text-gray)] uppercase">نسبة الحماية بالوقاية</span>
              </div>
              <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] px-6 py-3 rounded-bl-3xl">
                <span className="block text-[var(--color-gold-main)] font-bold text-2xl">24/7</span>
                <span className="text-xs text-[var(--color-text-gray)] uppercase">استشفاء عضلي</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 order-1 lg:order-2 relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[var(--color-gold-main)] opacity-10 rounded-full blur-3xl"></div>
            <div className="relative z-10 rounded-[40px] overflow-hidden border-2 border-[var(--color-border)] rotate-3">
              <img 
                src="/injury-prevention.jpeg" 
                alt="Injury Prevention" 
                loading="lazy"
                className="w-full h-[500px] object-cover scale-110"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-32">
          <div className="group relative bg-[var(--color-bg-card)] p-12 rounded-[2rem] border-t-4 border-[var(--color-gold-main)] shadow-2xl text-right">
            <div className="absolute top-8 right-8 text-6xl font-black text-white/5 group-hover:text-[var(--color-gold-main)]/10 transition-colors">01</div>
            <h3 className="text-2xl font-bold text-[var(--color-gold-main)] mb-6">الإحماء الديناميكي</h3>
            <p className="text-[var(--color-text-gray)] text-lg leading-loose">
              توقف عن الإطالات الثابتة وأنت "بارد". الإحماء الصحيح هو الذي يرفع حرارة العضلات ويحاكي حركات المباراة الحقيقية لتجهيز الجهاز العصبي.
            </p>
          </div>

          <div className="group relative bg-[var(--color-bg-card)] p-12 rounded-[2rem] border-b-4 border-[var(--color-gold-main)] shadow-2xl md:mt-12 text-right">
            <div className="absolute top-8 right-8 text-6xl font-black text-white/5 group-hover:text-[var(--color-gold-main)]/10 transition-colors">02</div>
            <h3 className="text-2xl font-bold text-[var(--color-gold-main)] mb-6">قوة الـ Core والمفاصل</h3>
            <p className="text-[var(--color-text-gray)] text-lg leading-loose">
              عضلات بطن وظهر قوية تعني ثباتاً أكبر عند تغيير الاتجاه. التقوية العضلية هي "الدرع" الذي يحمي أربطة الركبة والكاحل من التمزق.
            </p>
          </div>
        </div>

        <div className="relative bg-[var(--color-gold-main)] text-black p-12 lg:p-20 rounded-br-[100px] overflow-hidden mb-32 text-right">
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1"></div>
                <div className="order-1 lg:order-2">
                    <h2 className="text-4xl font-black mb-6 uppercase italic">نصيحة الخبراء</h2>
                    <p className="text-xl font-medium leading-relaxed">
                        "الاستشفاء ليس وقتاً ضائعاً، بل هو جزء من التمرين. جسدك يبني نفسه أثناء الراحة، وليس أثناء الركض."
                    </p>
                </div>
            </div>
            <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-wrap gap-2">
                {[...Array(20)].map((_, i) => <div key={i} className="w-20 h-20 border border-black"></div>)}
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 border-t border-[var(--color-border)]/30 pt-16 text-right">
            <div>
                <h4 className="text-[var(--color-gold-main)] font-black text-lg mb-4 uppercase">التغذية الوقائية</h4>
                <p className="text-[var(--color-text-gray)]">المعادن والفيتامينات ليست كماليات، نقص المغنسيوم قد يؤدي لشد عضلي يتحول لتمزق في ثانية.</p>
            </div>
            <div>
                <h4 className="text-[var(--color-gold-main)] font-black text-lg mb-4 uppercase">جودة المعدات</h4>
                <p className="text-[var(--color-text-gray)]">حذائك هو وسيلة الاتصال بالأرض؛ الحذاء المستهلك يفقد امتصاص الصدمات ويؤذي العمود الفقري.</p>
            </div>
            <div>
                <h4 className="text-[var(--color-gold-main)] font-black text-lg mb-4 uppercase">الوعي بالجسد</h4>
                <p className="text-[var(--color-text-gray)]">تعلم التمييز بين "ألم التطور العضلي" وبين "ألم الإصابة الوشيكة". توقف فوراً إذا شعرت بنغزة حادة.</p>
            </div>
        </div>

      </main>
    </div>
  );
};

const InjuryPrevention = () => {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[var(--color-bg-main)] flex items-center justify-center">
          <div className="w-16 h-1 bg-[var(--color-gold-main)] animate-pulse rounded"></div>
        </div>
      }
    >
      <InjuryPreventionContent />
    </Suspense>
  );
};

export default InjuryPrevention;