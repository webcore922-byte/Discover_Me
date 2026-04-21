const Home = () => {
  const layoutOffset = "137.6px";

  
  const goldGradient = "from-[#fcf6ba] via-[#d4af37] to-[#aa8b2c]";
  
  
  const hoverGoldGradient = "hover:from-[#d4af37] hover:via-[#aa8b2c] hover:to-[#8a6216]";

  return (
    <main className="relative text-white overflow-hidden" dir="rtl">
      <section 
        className="relative flex items-center justify-start bg-cover bg-center px-6 md:px-24"
        style={{ 
          backgroundImage: "url('/bg_home_Ar.jpeg')",
          height: `calc(100vh - ${layoutOffset})` 
        }} 
      >
        <div className="absolute inset-y-0 right-0 w-full md:w-2/3 bg-gradient-to-l from-black/70 via-black/20 to-transparent"></div>

        <div className="relative z-10 text-right max-w-2xl">
          <h3 className="text-base md:text-xl text-gray-300 mb-2 font-medium">
            اصنع حلمك
          </h3>
          
          <h1 className={`text-3xl md:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-l ${goldGradient} bg-clip-text text-transparent`}>
            موهبتك مش هتضيع ... <br />
            العالم مستني يشوفك!
          </h1>
          
          <p className="text-base md:text-2xl text-gray-300 mb-10 leading-relaxed">
            اكتشف موهبتك، وابدأ رحلتك نحو الاحتراف الحقيقي
          </p>

          <div className="flex flex-col gap-3 w-fit">
            <button
              className={`bg-gradient-to-l ${goldGradient} ${hoverGoldGradient}
              text-black px-6 md:px-12 py-2 md:py-3
              rounded-lg font-bold text-sm md:text-xl
              shadow-lg transition-all duration-500 ease-in-out
              transform hover:scale-[1.02]`}
            >
              رفع مهاراتك الآن
            </button>
            
            <button
              className={`bg-gradient-to-l ${goldGradient} ${hoverGoldGradient}
              text-black px-6 md:px-12 py-2 md:py-3
              rounded-lg font-bold text-sm md:text-xl
              shadow-lg transition-all duration-500 ease-in-out
              transform hover:scale-[1.02]`}
            >
              استكشف المواهب
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;