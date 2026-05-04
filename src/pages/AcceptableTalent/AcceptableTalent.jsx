
import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext/ThemeContext";

const Icons = {
  Trophy: () => (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-gold">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22h10c0-1.76-.85-3.25-2.03-3.79-.5-.23-.97-.66-.97-1.21v-2.34c3.41-.43 6-3.32 6-6.66V4H4v4c0 3.34 2.59 6.23 6 6.66Z" />
    </svg>
  ),
  ArrowDown: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
};

const AcceptableTalent = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      setError(null);

      const url = import.meta.env.VITE_API_URL;
      const req = await fetch(`${url}/players`);

      if (!req.ok) {
        throw new Error("فشل في الاتصال بالسيرفر");
      }

      const res = await req.json();
      setPlayers(res.filter(p => p.status === "approved"));
    } catch (e) {
      console.error(e);
      setError("تعذر تحميل البيانات حالياً، يرجى المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] py-12 px-4 lg:px-20 text-right transition-colors" dir="rtl">

      <header className="max-w-4xl mx-auto mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Icons.Trophy />
          <h1 className="text-gradient-gold text-3xl md:text-5xl font-black uppercase tracking-tighter">
            المواهب المقبولة
          </h1>
          <Icons.Trophy />
        </div>

        <p className="text-[var(--color-text-gray)] text-base md:text-lg max-w-2xl mx-auto font-bold leading-relaxed">
          استكشف قائمة بأفضل المواهب التي تم قبولها بعد اجتياز مراحل التقييم المختلفة.
        </p>
      </header>

      {error && (
        <div className="max-w-3xl mx-auto text-center py-24 px-6">
          <div className="relative bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-10 overflow-hidden shadow-2xl">

            <div className="absolute inset-0 opacity-10">
              <div className="w-72 h-72 bg-red-500 rounded-full blur-3xl mx-auto mt-10"></div>
            </div>

            <div className="relative z-10">

              <div className="text-red-500 text-5xl mb-6 animate-pulse">
                ⚠️
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-[var(--color-text-white)] mb-4">
                حدث خطأ غير متوقع
              </h2>

              <p className="text-[var(--color-text-gray)] text-lg mb-8 leading-relaxed">
                {error}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">

                <button
                  onClick={() => {
                    setLoading(true);
                    getData();
                  }}
                  className="px-8 py-3 rounded-xl font-black text-black bg-[var(--color-gold-main)] hover:scale-105 active:scale-95 transition-all shadow-lg"
                  style={{ boxShadow: "var(--gold-glow)" }}
                >
                  إعادة المحاولة
                </button>

                <button
                  onClick={() => window.history.back()}
                  className="px-8 py-3 rounded-xl font-black border border-[var(--color-border)] text-[var(--color-text-white)] hover:border-[var(--color-gold-main)] hover:text-[var(--color-gold-main)] transition-all"
                >
                  رجوع
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

      {loading && !error ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-80 bg-[var(--color-bg-card)] rounded-2xl animate-pulse border border-[var(--color-border)]/10 opacity-50"></div>
          ))}
        </div>
      ) : !error ? (
        <>
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {players.slice(0, visibleCount).map((player) => (
              <div
                key={player.id}
                className="glass-card p-5 rounded-2xl flex flex-col border-[var(--color-border)]/20 transition-all hover:border-[var(--color-gold-main)]/50"
                style={{ backgroundColor: 'var(--color-bg-card)' }}
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <h3 className="text-[var(--color-text-white)] text-lg font-black leading-tight truncate">
                        {player.name}
                      </h3>

                      <p className="text-[var(--color-gold-main)] text-[11px] font-black uppercase italic tracking-wider">
                        كرة قدم
                      </p>

                      <p className="text-[var(--color-text-gray)] text-[12px] font-bold">
                        {player.age} سنة
                      </p>

                      <p className="text-[var(--color-text-gray)] text-[12px] font-bold truncate">
                        📍 {player.location}
                      </p>

                      <div className="mt-2 text-[var(--color-text-gray)] text-[12px] font-bold">
                        التقييم:{" "}
                        <span className="text-[var(--color-gold-main)] font-black italic">
                          {player.rating || "9.0"}
                        </span>
                      </div>
                    </div>

                    <div className="w-20 h-24 rounded-xl overflow-hidden border border-[var(--color-border)]/20 shrink-0 shadow-lg bg-black/40">
                      <img
                        loading="lazy"
                        src={player.image}
                        alt={player.name}
                        className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2 h-16 overflow-hidden content-start border-t border-white/5 pt-3">
                    {player.tags?.map((tag, idx) => (
                      <span key={idx} className="bg-[var(--color-gold-main)] text-black px-2.5 py-1 rounded-md text-[10px] font-black">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => player.videoUrl && window.open(player.videoUrl, "_blank")}
                  className="w-full py-3.5 rounded-xl font-black text-black text-[11px] uppercase italic tracking-tighter hover:brightness-110 active:scale-95 transition-all shadow-lg"
                  style={{ backgroundColor: 'var(--color-gold-main)', boxShadow: 'var(--gold-glow)' }}
                >
                  شاهد الفيديو الخاص به
                </button>
              </div>
            ))}
          </div>

          {players.length > visibleCount && (
            <div className="flex justify-center mt-20 mb-6">
              <button
                onClick={handleLoadMore}
                className="group relative flex flex-col items-center gap-4 transition-all duration-500"
              >
                <span className="relative text-[var(--color-gold-main)] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] group-hover:tracking-[0.6em] transition-all duration-500">
                  انقر لعرض المزيد
                </span>

                <div className="relative w-14 h-14 rounded-full border border-[var(--color-border)]/20 flex items-center justify-center">
                  <Icons.ArrowDown />
                </div>
              </button>
            </div>
          )}
        </>
      ) : null}

    </div>
  );
};

export default AcceptableTalent;