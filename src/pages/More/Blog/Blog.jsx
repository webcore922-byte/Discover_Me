import React from "react";
import { useNavigate } from "react-router-dom";
const Blog = () => {
  const navigate = useNavigate();
  const articles = [
    {
      id: 1,
      title: "أسس التغذية السليمة للاعب",
      image: "/proper-nutrition.jpeg",
      path: "/proper-nutrition",
    },
    {
      id: 2,
      title: "طرق الوقاية من الإصابات الرياضية",
      image: "/injury-prevention.jpeg",
      path: "/injury-prevention",
    },
    {
      id: 3,
      title: "تمارين اللياقة البدنية والتحمل",
      image: "/fitness.jpeg",
      path: "/fitness",
    },
    {
      id: 4,
      title: "أهمية الإعداد النفسي والذهني",
      image: "/mental-preparation.jpeg",
      path: "/sports-psychology",
    },
    {
      id: 5,
      title: "مهارات اتخاذ القرار السريع",
      image: "/decision-making.jpeg",
      path: "/decision-making-skills",
    },
    {
      id: 6,
      title: "الاحترافية والتسويق الشخصي",
      image: "/professionalism.jpeg",
      path: "/professionalism-and-personal-marketing",
    },
  ];

  return (
    <div className="bg-[var(--color-bg-main)] min-h-screen p-8 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-[var(--color-gold-main)] text-5xl font-bold mb-4">
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
            <div className="relative h-56 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-60 object-cover "
              />
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

export default Blog;
