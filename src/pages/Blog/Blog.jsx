import React from "react";
import { useNavigate } from "react-router-dom";
const BlogSection = () => {
  const navigate = useNavigate();
  const articles = [
    {
      id: 1,
      title: "أسس التغذية السليمة للاعب",
      image: "/api/placeholder/400/250",
      path: "/proper-nutrition",
    },
    {
      id: 2,
      title: "طرق الوقاية من الإصابات الرياضية",
      image: "/api/placeholder/400/250",
      path: "/injury-prevention",
    },
    {
      id: 3,
      title: "تمارين اللياقة البدنية والتحمل",
      image: "/api/placeholder/400/250",
      path: "/fitness",
    },
    {
      id: 4,
      title: "أهمية الإعداد النفسي والذهني",
      image: "/api/placeholder/400/250",
      path: "/sports-psychology",
    },
    {
      id: 5,
      title: "مهارات اتخاذ القرار السريع",
      image: "/api/placeholder/400/250",
      path: "/decision-making-skills",
    },
    {
      id: 6,
      title: "الاحترافية والتسويق الشخصي",
      image: "/api/placeholder/400/250",
      path: "/professionalism-and-personal-marketing",
    },
  ];

  return (
    <div
      className="bg-[var(--color-bg-main)] min-h-screen p-8 font-sans"
      dir="rtl"
    >
      <div className="text-center mb-12">
        <h1 className="text-[var(--color-gold-main)] text-4xl font-bold mb-4">
          المدونة
        </h1>
        <p className="text-[var(--color-text-white)] max-w-2xl mx-auto">
          نقدم محتوى غني يشمل مقالات تعليمية، نصائح عملية، وأفكار تساعدك على
          تطوير مهاراتك وتحقيق أهدافك. يتم إعداد المحتوى بواسطة متخصصين لضمان
          الجودة والفائدة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-[var(--color-bg-main)] border border-[var(--color-gold-main)] rounded-xl overflow-hidden  group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover "
              />

              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            </div>

            <div className="p-5">
              <h3 className="text-[var(--color-gold-main)] text-xl font-semibold mb-8 h-14">
                {article.title}
              </h3>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2"></div>
                <button
                  className="text-[var(--color-text-white)] bg-[var(--color-gold-main)] px-4 py-1 rounded-full text-sm"
                  onClick={() => navigate(article.path)}
                >
                  اقرأ المزيد
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
