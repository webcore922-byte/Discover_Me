import React, { Suspense, lazy } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { FaTrophy, FaFutbol, FaStar, FaAward } from "react-icons/fa";
import { useTheme } from "../../../context/ThemeContext/ThemeContext";
const SuccessStoriesMoContent = () => {
   const { theme } = useTheme();
    const lightimage = "bg-[url('./bg_success_stories_light_3.jpeg')]";
    const darkimage = "bg-[url('./bg_success_stories_3.jpeg')]";
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans bg-[var(--color-bg-main)]">
   
      <img
        src={theme === "light" ? "./bg_success_stories_light_3.jpeg" : "./bg_success_stories_3.jpeg"}
        className="w-full h-full object-cover object-bottom  fixed inset-0 z-0 max-w-full"
        alt="Success Stories Background"
        loading="lazy"
      />
      <div className="relative z-10 min-h-screen flex flex-col px-3 sm:px-4 md:px-8 pb-10">
        
        <div className="flex-shrink-0 pt-4 mb-5">
          <Typography
            variant="h1"
            className="text-gradient-gold text-2xl md:text-5xl font-bold text-center drop-shadow-lg py-2"
          >
            قصص النجاح
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.2fr_1fr] gap-4 md:gap-6 items-center mb-16 md:mb-24">
          
          <Card className="min-w-0 relative border border-[var(--color-border)] bg-[var(--color-bg-card)] rounded-2xl backdrop-blur-[2px] p-4 shadow-none flex flex-col items-center h-[550px] overflow-hidden">
  
  <Typography variant="h4" className="text-gradient-gold font-bold text-center text-lg md:text-xl mb-10 flex-shrink-0">
    الإنجازات الفردية
  </Typography>

  <div className="w-full grid grid-cols-2 border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-bg-card)] mb-10 flex-shrink-0">
    <div className="flex flex-col items-center justify-center p-4 sm:p-2 border-b border-l border-[var(--color-border)]">
      <div className="flex items-center gap-1 mb-1">
        <FaTrophy className="text-[var(--color-gold-main)] text-[10px] md:text-xs" />
        <Typography className="text-gradient-gold font-bold text-base">الألقاب</Typography>
      </div>
      <Typography className="text-[var(--color-text-white)] font-bold text-xs md:text-sm">10</Typography>
    </div>
    <div className="flex flex-col items-center justify-center border-b border-[var(--color-border)]">
      <div className="flex items-center gap-1 mb-1">
        <FaFutbol className="text-[var(--color-gold-main)] text-[10px] md:text-xs" />
        <Typography className="text-gradient-gold font-bold text-base">الأهداف</Typography>
      </div>
      <Typography className="text-[var(--color-text-white)] font-bold text-xs md:text-sm">256</Typography>
    </div>
    <div className="flex flex-col items-center justify-center p-4 sm:p-2 border-l border-[var(--color-border)]">
      <div className="flex items-center gap-1 mb-1">
        <FaAward className="text-[var(--color-gold-main)] text-[10px] md:text-xs" />
        <Typography className="text-gradient-gold font-bold text-base">أخرى</Typography>
      </div>
      <Typography className="text-[var(--color-text-white)] font-bold text-xs md:text-sm">12</Typography>
    </div>
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center gap-1 mb-1">
        <FaStar className="text-[var(--color-gold-main)] text-[10px] md:text-xs" />
        <Typography className="text-gradient-gold font-bold text-sm">صناعة الأهداف</Typography>
      </div>
      <Typography className="text-[var(--color-text-white)] font-bold text-xs md:text-sm">+100</Typography>
    </div>
  </div>

<div className="w-full grid grid-cols-2 grid-rows-2 gap-2 md:gap-3 content-start">
  

  <div className="w-30 h-24  rounded-lg border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-card)]">
    <img src="./Achievement 1.webp" alt="Achievement 1" className="w-full h-full object-contain" loading="lazy" />
  </div>
  
  <div className="w-30 h-24 rounded-lg border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-card)]">
    <img src="./OIP.webp" alt="Achievement 2" className="w-full h-full object-contain" loading="lazy" />
  </div>

  <div className="w-30 h-24 rounded-lg border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-card)]">
    <img src="./Achievement 3.webp" alt="Achievement 3" className="w-full h-full object-contain" loading="lazy" />
  </div>

  <div className=" w-30 h-24 rounded-lg border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-card)]">
    <img src="./Achievement 4.webp" alt="Achievement 4" className="w-full h-full object-contain" loading="lazy" />
  </div>

</div>
</Card>

<Card className="min-w-0 relative border border-[var(--color-border)] bg-[var(--color-bg-card)] rounded-2xl backdrop-blur-[2px] p-5 shadow-none flex flex-col min-h-[550px] overflow-hidden">
  
  <Typography variant="h4" className="text-gradient-gold font-bold text-center text-lg md:text-2xl mb-6 flex-shrink-0">
    مسيرة بطل
  </Typography>

  <div className="flex flex-col gap-4 flex-grow">

  
  <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-4 items-stretch mb-3">
  
  <Card className="border border-[var(--color-border)] bg-[var(--color-bg-card)] rounded-xl p-4 shadow-none flex flex-col h-full min-w-0 ">
    <Typography className="text-gradient-gold font-bold mb-1 text-right text-sm md:text-base">
      من المقاولون إلى ليفربول
    </Typography>
    <Typography className="dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] text-xs md:text-base leading-relaxed text-right">
      بدأت المسيرة من نادي المقاولون العرب، ومنه انطلق إلى بازل السويسري حيث تُوج بلقب الدوري. خاض بعدها تجارب احترافية في أندية تشيلسي، وفيورنتينا، وروما، ساهمت في صقل موهبته قبل العودة للدوري الإنجليزي من بوابة ليفربول في صفقة تاريخية عام 2017.
    </Typography>
  </Card>

  <div className="rounded-xl border border-[var(--color-border)] overflow-hidden flex min-w-0">
    <img 
      src="./hero 1.jpeg" 
      alt="Mohamed Salah" 
      loading="lazy"
      className="w-full h-full object-cover" 
    />
  </div>
</div>

    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-4 items-stretch">
      
      <div className="rounded-xl border border-[var(--color-border)] overflow-hidden min-h-[120px] flex min-w-0 order-2 md:order-1">
        <img src="./hero 2.jpeg" alt="" className="w-full h-full object-cover" loading="lazy"/>
      </div>

      <Card className="border border-[var(--color-border)] bg-[var(--color-bg-card)] rounded-xl p-4 shadow-none flex flex-col h-fit min-w-0 order-1 md:order-2">
        <Typography className="text-gradient-gold font-bold mb-1 text-right text-sm md:text-base">
          بطل ليفربول الأسطوري
        </Typography>
        <Typography className="dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] text-xs md:text-base leading-relaxed text-right">
          في قلعة 'الأنفيلد'، صنع صلاح تاريخاً استثنائياً؛ حيث قاد الفريق لاستعادة لقب الدوري الإنجليزي بعد غياب دام 30 عاماً، كما حقق لقب دوري أبطال أوروبا، وأصبح الهداف التاريخي للنادي في عهد الدوري الممتاز.
        </Typography>
      </Card>
    </div>
  </div>
</Card>

<Card className="min-w-0 relative border border-[var(--color-border)] bg-[var(--color-bg-card)] rounded-2xl p-4 shadow-none flex flex-col h-[550px] overflow-hidden">
  
  <div className="relative w-full flex-grow flex items-center justify-center min-h-0 overflow-hidden">
    <img
      src="./Mo.jpeg"
      alt="Mohamed Salah"
      className="max-w-full max-h-full object-contain z-0" 
      loading="lazy"
    />
  
    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--color-bg-card)] to-transparent z-10"></div>
  </div>

  <div className="relative z-20 mt-2 flex-shrink-0">
    <div className="flex flex-col items-end w-full">
      
      <Typography className="text-gradient-gold font-bold text-right text-base md:text-lg mb-2 px-1">
        محمد صلاح - رحلة الفخر
      </Typography>


      <Card className="w-full border border-[var(--color-border)] bg-[var(--color-bg-card)] rounded-xl p-5 md:p-6 shadow-inner ">
        <Typography className="dark:text-[var(--color-text-gray)] text-[var(--color-text-main)]  sm:text-xs md:text-sm leading-relaxed text-right ">
    لم تكن رحلة محمد صلاح مجرد نجاح رياضي، بل هي قصة إصرار بدأت برحلة يومية شاقة من قريته إلى القاهرة. يمثل صلاح الآن نموذجاً عالمياً للطموح، فقد أثبت أن العمل الجاد والإيمان بالهدف هما الطريق للوصول من الملاعب الناشئة إلى قمة الكرة العالمية
        </Typography>
      </Card>

    </div>
  </div>

</Card>
        </div>
      </div>
    </div>
  );
};

const SuccessStoriesMo = () => {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[var(--color-bg-main)] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[var(--color-gold-main)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <SuccessStoriesMoContent />
    </Suspense>
  );
};

export default SuccessStoriesMo;