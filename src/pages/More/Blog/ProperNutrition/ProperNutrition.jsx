import { GiSoccerBall } from "react-icons/gi";
import {
  FaBolt,
  FaRunning,
  FaUtensils,
  FaExclamationTriangle,
  FaLightbulb,
} from "react-icons/fa";
import { MdFitnessCenter } from "react-icons/md";

const ProperNutrition = () => {
  return (
    <div className="min-h-screen px-4 md:px-10 py-16 font-sans bg-[var(--color-bg-main)] text-[var(--color-text-white)] selection:bg-[var(--color-gold-main)] selection:text-black">
      
      <section className="text-center mb-20">
        <h1 className="text-5xl md:text-8xl font-black mb-8 text-[var(--color-gold-main)] tracking-tight leading-tight">
          التغذية السليمة <br /> للاعبي كرة القدم
        </h1>
        <p className="max-w-3xl mx-auto text-xl md:text-2xl dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] font-light leading-relaxed">
          دليلك الشامل لتحقيق أقصى أداء داخل الملعب من خلال نظام غذائي احترافي متكامل
        </p>
      </section>

      <section className="max-w-6xl mx-auto border border-[var(--color-border)] bg-[var(--color-bg-card)] rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row items-stretch mb-20 shadow-2xl transition-all duration-500 hover:border-[var(--color-gold-main)]">
        
        <div className="lg:w-1/2 overflow-hidden h-96 lg:h-auto">
          <img
            src="/food_img.png"
            alt="Football Nutrition"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
          />
        </div>

        <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center text-right" dir="rtl">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-1 w-6 bg-[var(--color-gold-main)] rounded-full"></div>
            <h2 className="text-4xl font-black text-[var(--color-gold-main)]">
              مقدمة
            </h2>
          </div>

          <p className="leading-loose text-xl md:text-2xl text-[var(--color-text-gray)]">
            تُعدّ التغذية عنصرًا أساسيًا في تحسين الأداء الرياضي. لا يعتمد النجاح على المهارة فقط، بل يرتبط مباشرة بنوعية الوقود الذي تمنحه لجسمك.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20" dir="rtl">

        {[
          {
            icon: <GiSoccerBall />,
            title: "أساسيات التغذية",
            text: "التوازن بين الكربوهيدرات والبروتينات والدهون هو أساس الأداء الرياضي.",
          },
          {
            icon: <FaBolt />,
            title: "قبل المباراة",
            text: "وجبة غنية بالكربوهيدرات قبل 3–4 ساعات لضمان طاقة ثابتة.",
          },
          {
            icon: <FaRunning />,
            title: "أثناء المباراة",
            text: "تعويض السوائل والأملاح للحفاظ على الأداء والتركيز.",
          },
          {
            icon: <MdFitnessCenter />,
            title: "بعد المباراة",
            text: "بروتين + كربوهيدرات لاستعادة العضلات بسرعة.",
          },
          {
            icon: <FaUtensils />,
            title: "النظام اليومي",
            text: "وجبات متوازنة مع تقليل الأكل السريع والمشروبات الغازية.",
          },
          {
            icon: <FaLightbulb />,
            title: "نصيحة الخبراء",
            text: "الأكل الطبيعي أفضل من أي مكملات لتحقيق أداء ثابت.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="p-10 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-bg-card)] flex flex-col items-center text-center shadow-xl"
          >
            <div className="text-6xl mb-8 text-[var(--color-gold-main)]">
              {item.icon}
            </div>

            <h3 className="text-2xl font-black mb-4 dark:text-[var(--color-text-white)] text-[var(--color-text-main)]">
              {item.title}
            </h3>

            <p className="text-lg leading-relaxed text-[var(--color-text-gray)]">
              {item.text}
            </p>
          </div>
        ))}

      </section>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 mb-20" dir="rtl">
        
        <div className="p-10 rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FaLightbulb size={120} color="var(--color-gold-main)" />
          </div>

          <h2 className="text-4xl font-black mb-8 text-[var(--color-gold-main)]">
            نصائح هامة
          </h2>

          <ul className="space-y-6 text-xl">
            {[
              "شرب الماء باستمرار",
              "عدم إهمال الإفطار",
              "تجنب الأكل الثقيل قبل المباراة",
              "الاستشفاء بعد التمرين مباشرة",
            ].map((li, i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="w-3 h-3 rounded-full bg-[var(--color-gold-main)]"></span>
                <span className="text-[var(--color-text-gray)]">{li}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-10 rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-2xl relative overflow-hidden group">
          
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FaExclamationTriangle size={120} color="#ef4444" />
          </div>

          <h2 className="text-4xl font-black mb-8 text-red-500">
            أخطاء شائعة
          </h2>

          <ul className="space-y-6 text-xl">
            {[
              "تأخير الأكل قبل المباراة",
              "الاعتماد على المكملات فقط",
              "إهمال شرب الماء",
              "تجنب الكربوهيدرات",
            ].map((li, i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="text-[var(--color-text-gray)]">{li}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <footer className="max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 text-center border-2 border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <h2 className="text-4xl font-black mb-8 text-[var(--color-gold-main)] italic">
          الخاتمة
        </h2>

        <p className="text-xl md:text-3xl leading-loose text-[var(--color-text-gray)] font-medium">
          التغذية السليمة هي أساس الأداء الرياضي والاستمرارية في المستوى العالي.
        </p>
      </footer>

    </div>
  );
};

export default ProperNutrition;