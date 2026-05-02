import React, { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@material-tailwind/react";

const SuccessStoriesContent = () => {
  const lightimage = "bg-[url('../bg-success_stories-light.png')]";
  const darkimage = "bg-[url('../bg_success_stories.jpeg')]";
  const navigate = useNavigate();
  const stories = [
    {
      id: 1,
      name: "محمد صلاح",
      title: "رحلة الفخر",
      path: "/success-stories-mo",
      description:
        "محمد صالح - رحلة الفخر والعطاء. إنه نموذج للاعب الذي جمع بين الموهبة والأخلاق العالية، وأصبح مصدر فخر للأمة العربية كلها.",
      image: "/success-stories-mo.webp",
    
    },
    {
      id: 2,
      name: "ليونيل ميسي",
      title: "أسطورة الإرادة",
      path: "/success-stories-leo",
      description:
        "ليونيل ميسي - أسطورة الإرادة منذ الصغر. رغم التحديات الصحية التي واجهها، لم يستسلم أبداً وأثبت أن الإرادة القوية تصنع المستحيل. قصته تلهم الملايين حول العالم.",
      image: "/success-stories-leo.jpeg",
    },
    {
      id: 3,
      name: "كريستيانو رونالدو",
      title: "قمة التحدي",
      path: "/success-stories-cr",
      description:
        "كريستيانو رونالدو - قمة التحدي والنجاح المستدام. بدأ رحلته من الصفر ووصل إلى القمة بإصراره . إن قصته ليست فقط للإعجاب، بل لتكون مصدر إلهام لكل من يسعى لتحقيق حلمه.",
      image: "/success-stories-cr.webp",
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-[url('../bg_success_stories-light.png')] 
    dark:bg-[url('../bg_success_stories.jpeg')]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Typography
            variant="h1"
            className="text-4xl md:text-5xl font-bold text-[var(--color-gold-main)] mb-4"
          >
            قصص النجاح
          </Typography>
          <div className="w-24 h-1 bg-[var(--color-gold-main)] mx-auto mb-6 rounded-full"></div>
          <Typography
            variant="lead"
            className="dark:text-[var(--color-text-white)] max-w-3xl mx-auto text-sm text-[var(--color-text-main)]"
          >
            النجاح ليس صدفة، بل هو نتيجة جهد مستمر ودعم صحيح. في هذا القسم،
            نسلط الضوء على قصص أشخاص بدأوا بإرادة قوية وحققوا نجاحات ملحوظة. هذه
            القصص ليست فقط للعرض، بل لتكون مصدر إلهام لكل من يسعى لتحقيق حلمه.
          </Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <Card
              key={story.id}
              className="relative bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden group"
            >
              <CardHeader
                shadow={false}
                floated={false}
                className="relative h-48 overflow-hidden rounded-none"
              >
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full object-cover  "
                />
              </CardHeader>

              <CardBody>
                <Typography
                  variant="h3"
                  className="text-2xl font-bold text-[var(--color-gold-main)] mb-2"
                >
                  {story.name} - {story.title}
                </Typography>
                <Typography className="dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] 
                mb-4 leading-relaxed">
                  {story.description}
                </Typography>

                <Button
                  variant="outlined"
                  onClick={() => {
                    navigate(story.path);
                    window.scrollTo(0, 0);
                  }}
                  className="border-[var(--color-gold-main)] w-52 flex items-center justify-center mx-auto 
                   text-[var(--color-bg-main)] bg-[var(--color-gold-main)] transition-all text-lg duration-300 rounded-full"
                >
                  اقرأ القصة بالكامل
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const SuccessStories = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-bg-main)] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[var(--color-gold-main)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <SuccessStoriesContent />
    </Suspense>
  );
};

export default SuccessStories;