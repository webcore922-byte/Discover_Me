import { GiDiamondTrophy } from "react-icons/gi";
import React, { useEffect, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi"; 
import { MdOutlineErrorOutline } from "react-icons/md"; 

const AcceptableTalent = () => {
  const [players, setPlayers] = useState([]);
  const [loadplayers, setLoadPlayers] = useState(true);
  const [errorplayers, setErrorPlayers] = useState(null);
  const [VideoError, setVideoError] = useState(false);
  const getData = async () => {
    try {
      const url = import.meta.env.VITE_API_URL;
      const req = await fetch(`${url}/players`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const res = await req.json();
      setPlayers(res);
      setLoadPlayers(false);
    } catch (e) {
      setErrorPlayers("حدث خطأ في تحميل البيانات، يرجى المحاولة لاحقاً");
      setLoadPlayers(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);


return (
    <div
      className="min-h-screen bg-[url('../bg_Acceptable_talent.jpeg')] bg-fixed bg-cover bg-center relative"
      dir="rtl"
    >
      <div className="relative z-10 py-8 px-6 lg:px-20 text-right">
        <div className="max-w-4xl mx-auto mb-4 -mt-6 text-center flex flex-col items-center">
          <h1 className="text-gradient-gold text-xl md:text-4xl font-bold mb-4 tracking-tight drop-shadow-md flex items-center justify-center gap-3">
            <GiDiamondTrophy className="text-xl md:text-3xl icon-gold" />
            <span>المواهب المقبولة</span>
          </h1>

          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-4">
            هنا يمكنك استكشاف قائمة بأفضل المواهب التي تم قبولها بعد اجتياز مراحل التقييم المختلفة.
            <br />
            يتم اختبار هذه المواهب بناءً على معايير دقيقة تشمل الأداء، الإبداع، والقدرة على التطور.
            <br />
            هذه الصفحة تعكس مستوى الجودة الذي نسعى إليه داخل المنصة.
          </p>

          <div className="flex items-center justify-center mt-6 w-full max-w-[300px]">
            <div className="h-[3px] flex-grow bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
            <div className="mx-3 rotate-45 w-2 h-2 border border-[#D4AF37] transform"></div>
            <div className="h-[3px] flex-grow bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
          </div>
        </div>
      </div>

      {loadplayers &&  (
        <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white/5 border border-[#D4AF37]/10 rounded-2xl p-5 animate-pulse">
              <div className="flex justify-between gap-4 mb-6">
                <div className="w-1/2 space-y-3 text-right">
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-3 bg-white/5 rounded w-2/3"></div>
                  <div className="h-3 bg-white/5 rounded w-1/2"></div>
                </div>
                <div className="w-1/2 aspect-[4/5] bg-white/10 rounded-xl"></div>
              </div>
              <div className="h-12 bg-white/10 rounded-xl"></div>
            </div>
          ))}
        </div>
      )}
      {errorplayers && (
        <div className="relative max-w-[90%] sm:max-w-md mx-auto mt-10 px-2">
          <div className="absolute inset-0 bg-[#D4AF37] opacity-[0.05] blur-[40px] sm:blur-[60px] rounded-full"></div>
          <div className="relative overflow-hidden bg-[#1a1d1e]/95 border border-[#D4AF37]/20 backdrop-blur-xl rounded-[1.25rem] sm:rounded-[1.5rem] p-5 sm:p-8 text-center shadow-2xl">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">عذراً، حدث خطأ ما</h3>
            <p className="text-gray-400 text-[12px] sm:text-[13px] mb-6">{errorplayers}</p>
           <button
  onClick={() => { setLoadPlayers(true); setErrorPlayers(null); getData(); }}
  className="px-8 py-2.5 bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#aa771c] rounded-lg font-bold text-black flex items-center gap-2 mx-auto"
>
  <HiOutlineRefresh className="text-lg animate-spin-hover" /> 
  إعادة المحاولة
</button>
          </div>
        </div>
      )}
      
        <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-14">
          {players
            .filter((player) => player.status == "approved")
            .map(({ id, name, position, location, rating, image, tags, age, videoUrl }) => (
              <div
                key={id}
                className="bg-[var(--color-bg-card)] border border-[#D4AF37]/20 rounded-2xl p-5 shadow-2xl hover:border-[#D4AF37]/60 transition-all duration-300 group"
              >
                <div className="flex flex-row items-start justify-between gap-4 mb-6">
                  <div className="w-1/2 flex flex-col gap-1 text-right">
                    <h3 className="text-white text-lg font-bold truncate leading-none">{name}</h3>
                    <p className="text-[#D4AF37] text-xs font-semibold mt-1">{position}</p>
                    <p className="text-gray-400 text-[13px]">{age} : سنة</p>
                    <div className="flex items-center gap-1 text-gray-500 text-[11px] mt-1">
                      <span className="text-[#D4AF37]">📍</span>
                      <span>{location}</span>
                    </div>
                    <div className="mt-3 py-1 px-2 bg-black/30 rounded-md border border-white/5 inline-block w-fit text-right">
                      <p className="text-gray-300 text-[10px] font-mono">
                        <span className="text-gray-500 italic ml-1">:التقييم</span>
                        {rating}
                      </p>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="aspect-[4/5] overflow-hidden rounded-xl border border-white/10">
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-row flex-wrap gap-2 mb-6 justify-start">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="bg-black/40 text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded text-[10px] font-bold">
                      {tag}
                    </span>
                  ))}
                </div>

               <button
               onClick={() => {
                 if (videoUrl) {
                  window.open(videoUrl, "_blank");
                  } else {
                  setVideoError(true);
                  setTimeout(() => setVideoError(false), 3000);
                     }
                     }}
                         className="w-full py-3 rounded-xl font-bold text-[#1a1d1e] bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#aa771c] hover:scale-105 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                               >
                          شاهد الفيديو الخاص به           
                      </button>
              </div>
            ))}
        </div>
       
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${VideoError ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}`}>
        <div className="bg-[#1a1d1e]/90 backdrop-blur-md border border-[#D4AF37]/50 px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.7)] flex items-center gap-3">
          <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>
          <p className="text-[#D4AF37] text-sm font-bold">عذراً، الفيديو غير متاح حاليًا</p>
        </div>
      </div> 
    </div> 
  );
};
export default AcceptableTalent;