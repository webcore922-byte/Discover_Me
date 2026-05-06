import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@material-tailwind/react";
import { HomeIcon, TrophyIcon } from "@heroicons/react/24/outline";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] flex items-center justify-center px-6 py-12 overflow-hidden relative" dir="rtl">
      
      <div className="absolute top-[-5%] left-[-5%] w-64 md:w-96 h-64 md:h-96 bg-[var(--color-gold-main)] opacity-[0.03] rounded-full blur-[80px] md:blur-[120px]" />
      <div className="absolute bottom-[-5%] right-[-5%] w-80 md:w-[30rem] h-80 md:h-[30rem] bg-[var(--color-gold-main)] opacity-[0.06] rounded-full blur-[100px] md:blur-[150px]" />

      <div className="max-w-4xl w-full text-center relative z-10">
        
        <div className="relative inline-block mb-4 md:mb-0">
          <h1 className="text-[clamp(10rem,30vw,22rem)] font-black italic leading-none tracking-tighter text-gradient-gold opacity-[0.12] select-none">
            404
          </h1>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-card px-5 py-3 md:px-10 md:py-6 rounded-2xl md:rounded-full border-white/10 shadow-2xl rotate-[-2deg] md:rotate-[-3deg] gold-glow-border mx-4">
              <p className="text-lg sm:text-xl md:text-3xl font-black text-white italic uppercase tracking-widest flex items-center justify-center gap-2 md:gap-4 whitespace-nowrap">
                <span className="text-[var(--color-gold-main)] text-2xl md:text-4xl animate-pulse">🚩</span> 
                أنت في منطقة التسلل
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 md:mt-6 space-y-4 md:space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white italic uppercase tracking-tight leading-tight">
             أضعت الطريق للملعب؟
          </h2>
          <p className="text-[var(--color-text-gray)] text-base sm:text-lg md:text-2xl font-medium max-w-[90%] md:max-w-2xl mx-auto leading-relaxed md:leading-loose">
            "لا تدع هذه الهجمة الضائعة توقفك، حلمك الاحترافي لا يزال مستمراً.. عد للمسار الصحيح ودعنا نكتشف موهبتك."
          </p>
        </div>

        <div className="mt-10 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8">
          <Link to="/" className="w-full sm:w-auto">
            <Button 
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[var(--gold-gradient)] text-black font-black text-lg md:text-xl py-5 md:py-6 px-8 md:px-14 rounded-2xl shadow-[var(--gold-glow)] hover:scale-[1.03] active:scale-95 transition-all italic border-b-4 md:border-b-8 border-black/20"
            >
              <HomeIcon className="h-6 w-6" />
              العودة لمنصة الانطلاق
            </Button>
          </Link>

          <Link to="/contact-us" className="w-full sm:w-auto">
            <Button 
              size="lg"
              variant="outlined"
              className="w-full sm:w-auto flex items-center justify-center gap-3 border-[var(--color-border)] text-[var(--color-gold-main)] font-black text-lg md:text-xl py-5 md:py-6 px-8 md:px-14 rounded-2xl hover:bg-white/5 transition-all italic shadow-inner"
            >
              <TrophyIcon className="h-6 w-6 icon-pulse" />
              الدعم الفني
            </Button>
          </Link>
        </div>


        <div className="mt-16 md:mt-24 flex justify-center items-center gap-4 md:gap-8 opacity-40">
            <div className="h-[1px] flex-1 max-w-[60px] md:max-w-[100px] timeline-line"></div>
            <div className="flex gap-2 md:gap-3">
               <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-[var(--color-gold-main)] animate-bounce"></div>
               <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-[var(--color-gold-main)] animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-[var(--color-gold-main)] animate-bounce [animation-delay:-0.3s]"></div>
            </div>
            <div className="h-[1px] flex-1 max-w-[60px] md:max-w-[100px] timeline-line"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;