import React from "react";
import { Card, CardBody, Button, Typography } from "@material-tailwind/react";
import { HiOutlineDocumentText } from "react-icons/hi";

import img1 from "./picture/photo-1517836357463-d25dfeac3438.jfif";
import img2 from "./picture/photo-1542838132-92c53300491e.jfif";
import img3 from "./picture/photo-1456324504439-367cee3b3c32.jfif";
import img4 from "./picture/photo-1574629810360-7efbbe195018.jfif";
import img5 from "./picture/photo-1431324155629-1a6deb1dec8d.jfif";
import img6 from "./picture/photo-1542291026-7eec264c27ff.jfif";

const Blog = () => {
  const goldGradient = "var(--gold-gradient)";
  const bgCard = "var(--color-bg-card)";
  const borderColor = "var(--color-border)";

  const posts = [
    {
      title: "مقالة:الوقايه من الاصابات",

      img: img1,
    },
    {
      title: "مقالة: التغذيه السليمة",

      img: img2,
    },
    {
      title: "مقالة: علم النفس الرياضي",

      img: img3,
    },
    {
      title: "مقالة:اللياقه البدنية",

      img: img4,
    },
    {
      title: "مقالة: مهارات اتخاذ القرار",

      img: img5,
    },
    {
      title: "مقالة: الاحترافية والتسويق الشخصي",

      img: img6,
    },
  ];

  return (
    <div
      className="min-h-screen p-4 sm:p-8"
      dir="rtl"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="text-center mb-12">
        <h1
          className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent"
          style={{
            backgroundImage: goldGradient,
            display: "inline-block",
          }}
        >
          المدونة
        </h1>
        <p className="text-white text-xl md:text-2xl font-bold opacity-90 max-w-3xl mx-auto color-text-gray: #b0b0b0;">
          نقدم محتوى غني يشمل مقالات تعليمية، نصائح عملية، وأفكار تساعدك على
          تطوير مهاراتك. يتم اعداد المحتوى بواسطة متخصصين لضمان الجودة والفاىدة.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {posts.map((post, i) => (
          <Card
            key={i}
            className="overflow-hidden border shadow-none rounded-2xl "
            style={{ background: bgCard, borderColor: borderColor }}
          >
            <img
              src={post.img}
              className="h-48 w-full object-cover"
              alt={post.title}
            />
            <CardBody className="p-5">
              <Typography className="text-white text-xl md:text-2xl font-bold mb-6 leading-snug h-14 overflow-hidden">
                {post.title}
              </Typography>

              <Button
                size="sm"
                className="w-full font-bold py-1.5 text-xl shadow-none hover:shadow-lg transition-all"
                style={{ background: goldGradient, color: "#1A1D1E" }}
              >
                اقرأ المزيد
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blog;
