import React, { Suspense, lazy } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext/ThemeContext';

const DecisionMakingContent = () => {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-white)] font-sans" dir="rtl">
      
      <div className="relative h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img 
          src="/decision-making.jpeg" 
          alt="Football Strategy" 
          loading="lazy"
          className="absolute inset-0 w-full h-full lg:h-fit object-cover"
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--color-gold-main)] mb-4 drop-shadow-2xl">
            مهارة اتخاذ القرار
          </h1>
          <p className="text-xl dark:text-[var(--color-text-gray)] text-[var(--color-bg-main)] max-w-2xl mx-auto">
            الفرق بين "لاعب الكرة" العادي و"النجم" الذي يصنع الفارق في أجزاء من الثانية.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        
        <section className="mb-16">
          <p className="text-xl leading-relaxed dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] border-r-4 border-[var(--color-border)] pr-6">
            هل سألت نفسك يوماً لماذا يبدو العباقرة وكأنهم يلعبون في زمن أبطأ من الباقين؟ 
            السر ليس في السرعة البدنية فقط، بل في سرعة <span className="text-[var(--color-gold-main)] font-bold text-2xl px-1">اتخاذ القرار</span>. 
            في كرة القدم، القرار الصحيح الذي يتأخر ثانية واحدة يتحول فوراً لقرار خاطئ.
          </p>
        </section>

        <div className="bg-[var(--color-bg-card)] p-10 rounded-2xl border border-[var(--color-border)]/30 mb-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-gold-main)]"></div>
          <h2 className="text-2xl font-bold text-[var(--color-gold-main)] mb-6 flex items-center gap-3">
             ما هو "اتخاذ القرار" في الملعب؟
          </h2>
          <p className="dark:text-[var(--color-text-white)] text-[var(--color-text-main)] text-lg leading-loose opacity-90">
            هو العملية الذهنية التي يختار فيها اللاعب أفضل تصرف ممكن (تمرير، تسديد، مراوغة، أو تمركز) 
            بناءً على المعلومات التي يجمعها من الملعب، وفي أقل جزء من الثانية تحت ضغط الخصم العالي.
          </p>
        </div>

        <h2 className="text-3xl font-bold mb-10 text-center text-[var(--color-gold-main)]">مثلث اتخاذ القرار الناجح</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { title: "المسح (Scanning)", desc: "قبل أن تصلك الكرة، يجب أن تكون قد نظرت حولك 3 مرات لمعرفة أماكن الزملاء والخصم." },
            { title: "الإدراك (Perception)", desc: "فهم المساحات الخالية. أين هي الثغرة؟ ومن هو الزميل الذي في وضعية تسمح له بالتقدم؟" },
            { title: "التنفيذ (Execution)", desc: "هنا يأتي دور المهارة الفنية، فما فائدة القرار العبقري إذا كنت لا تملك دقة التنفيذ?" }
          ].map((item, index) => (
            <div key={index} className="bg-[var(--color-bg-card)] p-8 rounded-xl border dark:border-[var(--color-border)]/20 border-[var(--color-gold-main)] text-center group">
              <div className="dark:text-[var(--color-border)] text-[var(--color-gold-main)] text-4xl mb-4 font-black">0{index + 1}</div>
              <h3 className="text-[var(--color-gold-main)] text-xl font-bold mb-3">{item.title}</h3>
              <p className="dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-12 mb-20">
          <h2 className="text-3xl font-bold text-[var(--color-gold-main)] border-b border-[var(--color-border)] pb-4 inline-block">خطوات عملية لتطوير مهاراتك</h2>
          
          <div className="grid gap-8">
            <div className="flex flex-col md:flex-row gap-6 bg-[var(--color-bg-card)]/50 p-6 rounded-lg border-r-2 border-[var(--color-gold-main)]">
              <span className="text-[var(--color-gold-main)] font-bold text-2xl">01</span>
              <div>
                <h4 className="text-xl font-bold mb-2 uppercase tracking-wide dark:text-[var(--color-text-white)] text-[var(--color-gold-main)]">ارفع رأسك عن الكرة</h4>
                <p className="dark:text-[var(--color-text-gray)] text-[var(--color-text-main)]">تدرب على استلام الكرة وتحريكها دون النظر إليها مباشرة. الكرة في مكانها، لكن الخصم يتحرك بسرعة.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 bg-[var(--color-bg-card)]/50 p-6 rounded-lg border-r-2 border-[var(--color-gold-main)]">
              <span className="text-[var(--color-gold-main)] font-bold text-2xl">02</span>
              <div>
                <h4 className="text-xl font-bold mb-2 uppercase tracking-wide dark:text-[var(--color-text-white)] text-[var(--color-gold-main)]">مبدأ السهل الممتنع</h4>
                <p className="dark:text-[var(--color-text-gray)] text-[var(--color-text-main)]">أحياناً يكون القرار الأفضل هو التمريرة الأبسط. لا تحاول تعقيد اللعب إذا كان التمرير للخلف سيفتح ثغرة جديدة.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[var(--color-bg-card)] to-[var(--color-bg-main)] p-12 rounded-3xl border border-[var(--color-border)]/40 text-center mb-20 shadow-inner">
          <p className="text-2xl md:text-3xl italic font-serif text-[var(--color-gold-main)] leading-snug">
            "كرة القدم تُلعب بالعقل أولاً.. القدم مجرد أداة لتنفيذ أوامر العقل."
          </p>
        </div>

        <div className="bg-[var(--color-bg-card)] p-10 rounded-2xl border-2 border-[var(--color-gold-main)] text-center shadow-[0_10px_40px_rgba(212,175,55,0.1)]">
          <h3 className="dark:text-[var(--color-text-white)] text-[var(--color-gold-main)] text-3xl font-bold mb-4">هل أنت مستعد لتكون "عقل" فريقك؟</h3>
          <p className="dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] mb-8 max-w-md mx-auto text-lg">
            ابدأ اليوم بتطبيق تمارين المسح البصري في تدريباتك وراقب كيف سيتغير مستوى رؤيتك للملعب.
          </p>
        </div>

      </div>
    </div>
  );
};

const DecisionMakingSkills = () => {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[var(--color-bg-main)] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[var(--color-gold-main)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <DecisionMakingContent />
    </Suspense>
  );
};

export default DecisionMakingSkills;