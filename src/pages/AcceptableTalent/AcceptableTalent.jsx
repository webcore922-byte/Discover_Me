import { GiDiamondTrophy } from "react-icons/gi";


const AcceptableTalent = () => {
 
  return (
    
    <div 
      className="min-h-screen bg-[url('./bg_Acceptable_talent.jpeg')] bg-fixed bg-cover bg-center relative" 
      dir="rtl"
    >


      <div className="relative z-10 py-8 px-6 lg:px-20 text-right">
        
<div className="max-w-4xl mx-auto mb-10 -mt-6 text-center flex flex-col items-center ">
 
  <h1 className="text-gradient-gold text-xl md:text-3xl font-bold mb-4 tracking-tight drop-shadow-md flex items-center justify-center gap-3">
    <GiDiamondTrophy className="text-xl md:text-2xl text-gradient-gold" />
    <span>المواهب المقبولة</span>
  </h1>

  <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-4">
    هنا يمكنك استكشاف قائمة بأفضل المواهب التي تم قبولها بعد اجتياز مراحل التقييم المختلفة.<br />
    يتم اختبار هذه المواهب بناءً على معايير دقيقة تشمل الأداء، الإبداع، والقدرة على التطور. هذه<br />
    الصفحة تعكس مستوى الجودة الذي نسعى إليه داخل المنصة.
  </p>


  <div className="flex items-center justify-center mt-6 w-full max-w-[300px]">
    <div className="h-[3px] flex-grow bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
    <div className="mx-3 rotate-45 w-2 h-2 border border-[#D4AF37] transform"></div>
    <div className="h-[3px] flex-grow bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
  </div>
</div>


      </div>
    </div>
  );
};

export default AcceptableTalent;