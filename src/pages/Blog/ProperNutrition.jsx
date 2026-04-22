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
        <p className="max-w-3xl mx-auto text-xl md:text-2xl text-[var(--color-text-gray)] font-light leading-relaxed">
          دليلك الشامل لتحقيق أقصى أداء بدني داخل الملعب من خلال نظام غذائي
          احترافي متكامل
        </p>
      </section>

      <section className="max-w-6xl mx-auto border border-[var(--color-border)] bg-[var(--color-bg-card)] rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row items-stretch mb-20 shadow-2xl transition-all duration-500 hover:border-[var(--color-gold-main)]">
        <div className="lg:w-1/2 overflow-hidden h-96 lg:h-auto">
          <img
            src="..\public\food_img.png"
            alt="Nutrition"
            className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
          />
        </div>
        <div
          className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center text-right"
          dir="rtl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-1 w-6 bg-[var(--color-gold-main)] rounded-full"></div>
            <h2 className="text-4xl font-black text-[var(--color-gold-main)]">
              مقدمة
            </h2>
          </div>
          <p className="leading-loose text-xl md:text-2xl text-[var(--color-text-gray)]">
            تُعدّ التغذية عنصرًا أساسيًا في تحسين الأداء الرياضي. لا يعتمد
            النجاح على المهارة فقط، بل يرتبط مباشرة بنوعية الوقود الذي تمنحه
            لجسمك. لتعزيز الاستشفاء وتقليل الإصابات، يجب أن تتبع نهج المحترفين
            في اختيار وجباتك.
          </p>
        </div>
      </section>

      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20"
        dir="rtl"
      >
        {[
          {
            icon: <GiSoccerBall />,
            title: "أساسيات التغذية",
            text: "يعتمد النظام الغذائي للاعب كرة القدم على تحقيق التوازن بين العناصر الغذائية الأساسية، وهي الكربوهيدرات، البروتينات، والدهون، بالإضافة إلى الفيتامينات والمعادن. تُعد الكربوهيدرات المصدر الرئيسي للطاقة، حيث يحتاج اللاعب إلى كميات كافية منها للحفاظ على نشاطه طوال المباراة. أما البروتينات فهي ضرورية لبناء العضلات وإصلاح الأنسجة بعد التمارين والمباريات. وتلعب الدهون الصحية دورًا مهمًا في توفير طاقة إضافية ودعم وظائف الجسم الحيوية. كما لا يمكن إغفال أهمية الفيتامينات والمعادن مثل الحديد والكالسيوم والمغنيسيوم، والتي تساعد في تحسين الأداء العضلي وتقوية العظام. ويُعتبر شرب الماء بانتظام من أهم العوامل للحفاظ على ترطيب الجسم ومنع الجفاف.",
          },
          {
            icon: <FaBolt />,
            title: "قبل المباراة",
            text: "تُعتبر الوجبة التي تسبق المباراة من أهم الوجبات، حيث تؤثر بشكل مباشر على مستوى طاقة اللاعب أثناء اللعب. يُفضل أن تكون هذه الوجبة غنية بالكربوهيدرات وسهلة الهضم، مثل الأرز أو المكرونة أو الخبز مع مصادر بروتين خفيفة. يجب تناول هذه الوجبة قبل المباراة بثلاث إلى أربع ساعات، مع تجنب الأطعمة الدسمة أو الثقيلة التي قد تسبب شعورًا بعدم الراحة. كما يُنصح بشرب كميات كافية من الماء لضمان ترطيب الجسم قبل بدء المباراة. وفي بعض الحالات، يمكن تناول وجبة خفيفة قبل المباراة بساعة واحدة، مثل الفواكه أو الزبادي، للحصول على دفعة إضافية من الطاقة.",
          },
          {
            icon: <FaRunning />,
            title: "أثناء المباراة",
            text: "خلال المباراة، يفقد الجسم كميات كبيرة من السوائل والأملاح بسبب التعرق، مما قد يؤدي إلى انخفاض الأداء إذا لم يتم تعويضها. لذلك يُنصح بشرب الماء أو المشروبات الرياضية بين الشوطين. في المباريات الطويلة أو ذات الشدة العالية، قد يحتاج اللاعب إلى تناول مصادر سريعة للطاقة مثل الموز أو التمر، حيث تساعد هذه الأطعمة في الحفاظ على مستوى الجلوكوز في الدم.",
          },
          {
            icon: <MdFitnessCenter />,
            title: "بعد المباراة",
            text: "تُعد مرحلة ما بعد المباراة من أهم المراحل التي تؤثر على جاهزية اللاعب للمباريات القادمة. يحتاج الجسم في هذه المرحلة إلى تعويض الطاقة المفقودة وإصلاح الأنسجة العضلية. يُنصح بتناول وجبة تحتوي على مزيج من الكربوهيدرات والبروتين خلال أول ساعة بعد المباراة، مثل الدجاج مع الأرز أو البيض مع الخبز. كما يجب الاستمرار في شرب الماء لتعويض السوائل المفقودة. تساعد هذه الخطوة على تقليل التعب العضلي وتسريع عملية التعافي، مما ينعكس بشكل إيجابي على الأداء في التمارين والمباريات التالية.",
          },
          {
            icon: <FaUtensils />,
            title: "النظام اليومي",
            text: "يجب أن يتضمن النظام الغذائي اليومي للاعب وجبات متوازنة موزعة على مدار اليوم. يُفضل تناول ثلاث وجبات رئيسية مع وجبتين خفيفتين بينهما للحفاظ على مستوى الطاقة. تشمل الوجبات الأساسية مصادر متنوعة من الكربوهيدرات مثل الحبوب الكاملة، والبروتينات مثل اللحوم والدواجن والأسماك، بالإضافة إلى الخضروات والفواكه التي توفر الفيتامينات والمعادن. كما يُنصح بتجنب الأطعمة السريعة والمشروبات الغازية، نظرًا لتأثيرها السلبي على اللياقة البدنية والصحة العامة.",
          },
          {
            icon: <FaLightbulb />,
            title: "نصيحة الخبراء",
            text: "تؤكد الدراسات الرياضية الحديثة أن الابتعاد التام عن الأطعمة السريعة والمشروبات الغازية ليس مجرد خيار صحي، بل هو ضرورة قصوى لضمان لياقة بدنية تدوم طويلاً. هذه الأطعمة الغنية بالدهون المشبعة والسكريات المعالجة تسبب خمولاً لحظياً وتؤثر سلباً على سرعة الاستجابة العضلية أثناء المباريات. بدلاً من ذلك، ينصح الخبراء بالتركيز على الوجبات المنزلية الغنية بالعناصر الطبيعية التي تمد الجسم بطاقة مستدامة وتسرع من عملية الاستشفاء العضلي بعد المجهود البدني الشاق، مما يضمن للاعب البقاء في قمة مستواه الفني والبدني طوال الموسم الكروي.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="group p-10 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-bg-card)] transition-all duration-500 hover:-translate-y-3 flex flex-col items-center text-center shadow-xl hover:bg-[#2a2e2f]"
          >
            <div className="text-6xl mb-8 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 text-[var(--color-gold-main)]">
              {item.icon}
            </div>
            <h3 className="text-2xl font-black mb-4 text-[var(--color-text-white)]">
              {item.title}
            </h3>
            <p className="text-lg leading-relaxed text-[var(--color-text-gray)]">
              {item.text}
            </p>
          </div>
        ))}
      </section>

      <div
        className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 mb-20"
        dir="rtl"
      >
        <div className="p-10 rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FaLightbulb size={120} color="var(--color-gold-main)" />
          </div>
          <h2 className="text-4xl font-black mb-8 flex items-center gap-4 text-[var(--color-gold-main)]">
            نصائح هامة
          </h2>
          <ul className="space-y-6 text-xl">
            {[
              "احرص على شرب الماء بانتظام طوال اليوم",
              "لا تهمل وجبة الإفطار أبداً",
              "تجنب الأطعمة الدسمة قبل المباريات",
              "تناول وجبة الاستشفاء فور انتهاء التمرين",
            ].map((li, i) => (
              <li key={i} className="flex items-center gap-4 group/item">
                <span className="w-3 h-3 rounded-full bg-[var(--color-gold-main)] group-hover/item:scale-150 transition-transform"></span>
                <span className="text-[var(--color-text-gray)] group-hover/item:text-[var(--color-text-white)] transition-colors">
                  {li}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-10 rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FaExclamationTriangle size={120} color="#ef4444" />
          </div>
          <h2 className="text-4xl font-black mb-8 flex items-center gap-4 text-red-500">
            أخطاء شائعة
          </h2>
          <ul className="space-y-6 text-xl">
            {[
              "تأخير وجبة ما قبل المباراة لوقت متأخر",
              "الاعتماد على المكملات وتجاهل الطعام الطبيعي",
              "شرب الماء فقط عند الشعور بالعطش الشديد",
              "الامتناع عن الكربوهيدرات خوفاً من الوزن",
            ].map((li, i) => (
              <li
                key={i}
                className="flex items-center gap-4 border-r-4 border-red-500/30 pr-6 group/item"
              >
                <span className="text-[var(--color-text-gray)] group-hover/item:text-[var(--color-text-white)] transition-colors">
                  {li}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 text-center border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-[0_0_50px_rgba(212,175,55,0.05)]">
        <h2 className="text-4xl font-black mb-8 text-[var(--color-gold-main)] italic">
          الخـاتـمـة
        </h2>
        <p className="text-xl md:text-3xl leading-loose text-[var(--color-text-gray)] font-medium">
          في النهاية، تُعتبر التغذية السليمة حجر الأساس لأي لاعب كرة قدم يسعى
          إلى تطوير مستواه وتحقيق أفضل أداء ممكن. فالنظام الغذائي المتوازن لا
          يساعد فقط على تحسين الأداء داخل الملعب، بل يساهم أيضًا في الحفاظ على
          الصحة العامة وتقليل خطر الإصابات. لذلك فإن الالتزام بعادات غذائية
          صحيحة يُعد استثمارًا حقيقيًا في مستقبل اللاعب الرياضي.
        </p>
      </footer>
    </div>
  );
};

export default ProperNutrition;
