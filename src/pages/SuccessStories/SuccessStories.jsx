import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  CardBody,
  CardHeader,
  Avatar,
} from "@material-tailwind/react";

const SuccessStories = () => {
  const navigate = useNavigate();
  const stories = [
  
       {
      id: 1,
      name: "محمد صالح",
      title: "رحلة الفخر",
      path: "/success-stories-mo",
      description:
        "محمد صالح - رحلة الفخر والعطاء. إنه نموذج للاعب الذي جمع بين الموهبة والأخلاق العالية، وأصبح مصدر فخر للأمة العربية كلها.",
      image: "/success-stories-mo.jpeg",
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
      image: "/success-stories-cr.jpeg",
    },
   
  ];

  return (
<div
  className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-[url('../bg_success_stories.jpeg')]">  
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
            className="text-[var(--color-text-white)] max-w-3xl mx-auto text-sm"
          >
            النجاح ليس صدفة، بل هو نتيجة جهد مستمر ودعم صحيح. في هذا القسم،
            نسلط الضوء على قصص أشخاص بدأوا بإرادة قوية وحققوا نجاحات ملحوظة.
            هذه القصص ليست فقط للعرض، بل لتكون مصدر إلهام لكل من يسعى لتحقيق
            حلمه.
          </Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <Card
              key={story.id}
              className="relative bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
            >
              <CardHeader
                shadow={false}
                floated={false}
                className="relative h-56 overflow-hidden rounded-none"
              >
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full object-cover "
                />
              </CardHeader>

              <CardBody >
                <Typography
                  variant="h3"
                  className="text-2xl font-bold text-[var(--color-gold-main)] mb-2"
                >
                  {story.name} - {story.title}
                </Typography>
                <Typography className="text-[var(--color-text-gray)] mb-4 leading-relaxed">
                  {story.description}
                </Typography>
                
                <Button
                  variant="outlined"
                  onClick={() => navigate(story.path)}
                  className="border-[var(--color-gold-main)] w-52 flex items-center justify-center mx-auto 
                   text-[var(--color-bg-main)] bg-[var(--color-gold-main)] transition-all text-lg  duration-300 rounded-full"
                  
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

export default SuccessStories;