import React, { useState, useEffect, Suspense } from 'react';

const CoachesContent = () => {
  const [scoutData, setScoutData] = useState({
    technical_committee: [],
    coaches: [],
    consultants: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [techRes, coachesRes, consRes] = await Promise.all([
          fetch(`${API_URL}/technical_committee`),
          fetch(`${API_URL}/coaches`),
          fetch(`${API_URL}/consultants`)
        ]);

        const responses = [techRes, coachesRes, consRes];
        const failedRes = responses.find(res => !res.ok);
        
        if (failedRes) {
          throw new Error(`خطأ في الاتصال بالسيرفر (كود: ${failedRes.status})`);
        }

        const isJson = techRes.headers.get("content-type")?.includes("application/json");
        if (!isJson) {
          throw new Error("لم يتم العثور على البيانات المطلوبة (تأكد من تشغيل الـ JSON Server)");
        }

        const techData = await techRes.json();
        const coachesData = await coachesRes.json();
        const consData = await consRes.json();

        setScoutData({
          technical_committee: techData,
          coaches: coachesData,
          consultants: consData
        });

      } catch (err) {
        if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
          setError("تعذر الوصول للسيرفر. تأكد من تشغيل الـ API واتصال الإنترنت.");
        } else {
          setError(err.message);
        }
        console.error("ScoutPro Debug:", err);
      } finally {
        setLoading(false);
      }
    };

    if (API_URL) {
      fetchData();
    } else {
      setError("رابط الـ API غير معرف (VITE_API_URL)");
      setLoading(false);
    }
  }, [API_URL]);

  if (loading) return (
    <div className="min-h-screen bg-[var(--color-bg-main)] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-[var(--color-gold-main)] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[var(--color-gold-main)] font-bold animate-pulse">جاري تحميل نخبة الخبراء...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[var(--color-bg-main)] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
      <div className="bg-[#1e2122] border border-red-500/30 p-10 rounded-[2rem] max-w-lg shadow-2xl">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-[var(--color-gold-main)] text-2xl font-black mb-4">حدث خطأ فني</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          {error} <br />
          <span className="text-[10px] mt-2 block opacity-50">تأكد من تشغيل json-server على البورت الصحيح</span>
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-[var(--color-gold-main)] to-[#b48a04] text-black px-10 py-3 rounded-full font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_5px_20px_rgba(234,179,8,0.3)]"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[var(--color-bg-main)] text-[var(--color-text-white)] p-6 md:p-10 font-sans flex flex-col" dir="rtl">
      
      <header className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
        <div className="text-right">
          <h1 className="text-3xl font-black text-gradient-gold uppercase tracking-tighter">
            SCOUT<span className="text-[var(--color-gold-main)]">PRO</span>
          </h1>
          <p className="text-[var(--color-text-gray)] text-sm mt-1 font-bold">منظومة التقييم الفني</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xl font-black text-white">نخبة الخبراء</p>
          <p className="text-[var(--color-text-gray)] text-xs mt-1 italic">لاكتشاف وتطوير المواهب الكروية</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow items-stretch">
        
        <div className="lg:col-span-3 flex flex-col gap-6">
          <Section title="المستشارون" className="flex-1">
            <div className="space-y-3">
                {scoutData.consultants.map(item => (
                  <div key={item.id} className="bg-[var(--color-bg-card)] p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-[var(--color-gold-main)]/30 transition-all">
                      <div className="text-right">
                        <p className="font-bold text-sm text-[var(--color-text-white)] group-hover:text-[var(--color-gold-main)] transition-colors">{item.name}</p>
                        <p className="text-[var(--color-gold-main)] text-[10px] opacity-70">{item.specialty}</p>
                      </div>
                      <img src={item.image} alt="" className="w-10 h-10 rounded-full border-2 border-[var(--color-gold-main)]/30 object-cover" />
                  </div>
                ))}
            </div>
          </Section>

          <Section title="آلية العمل" className="flex-1">
            <div className="relative border-r-2 border-[var(--color-border)]/30 pr-6 space-y-8 py-2">
                <WorkStep title="الفحص الفني" desc="تحليل أداء الموهبة المسجل" />
                <WorkStep title="مراجعة الخبراء" desc="إبداء الملاحظات الفنية دقيقة" />
                <WorkStep title="الاعتماد" desc="قرار اللجنة النهائي" />
            </div>
          </Section>
        </div>

        <div className="lg:col-span-4 h-full">
          <Section title="مدربي التخصصات" className="h-full">
            <div className="space-y-2 overflow-y-auto max-h-[580px] pr-2 custom-scrollbar">
              {scoutData.coaches.map(coach => (
                <div key={coach.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-card)] border border-white/5 hover:border-[var(--color-gold-main)]/40 transition-all group">
                  <div className="flex items-center gap-3">
                    <img src={coach.image} alt="" className="w-9 h-9 rounded-lg object-cover border border-white/10 group-hover:border-[var(--color-gold-main)]/50" />
                    <div className="text-right">
                      <p className="font-bold text-[13px] leading-tight">{coach.name}</p>
                      <p className="text-[var(--color-text-gray)] text-[10px] leading-tight mt-1">{coach.info}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="lg:col-span-5 h-full">
          <Section title="اللجنة العليا" className="h-full">
            <div className="space-y-4">
              {scoutData.technical_committee.map(member => (
                <div key={member.id} className="relative p-5 rounded-2xl bg-gradient-to-br from-[#2c281e] to-[var(--color-bg-card)] border border-[var(--color-border)]/30 group transition-all hover:scale-[1.01]">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-4">
                      <img src={member.image} alt="" className="w-16 h-16 rounded-xl border-2 border-[var(--color-gold-main)] object-cover shadow-lg rotate-2 group-hover:rotate-0 transition-transform" />
                      <div className="text-right">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-[var(--color-gold-main)] transition-colors">{member.name}</h3>
                        <p className="text-[var(--color-gold-main)] text-xs font-medium uppercase tracking-widest">{member.role}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[var(--color-text-gray)] text-[11px] mb-4 leading-relaxed text-right">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 justify-start">
                    {member.tags.map((tag, i) => (
                      <span key={i} className="text-[9px] text-gray-300 bg-black/40 px-3 py-1 rounded border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      <footer className="mt-10 bg-[var(--color-bg-card)] p-10 rounded-[2rem] border border-white/5">
        <div className="max-w-4xl mx-auto flex w-full justify-between items-center">
            <TimelinePoint label="تحليل الفيديو" icon="📹" active />
            <TimelinePoint label="مراجعة الخبراء" icon="⚖️" active />
            <TimelinePoint label="القرار النهائي" icon="🏆" isGold />
        </div>
      </footer>
    </div>
  );
};

const Section = ({ title, children, className }) => (
  <div className={`bg-[#1e2122] p-5 rounded-3xl border border-white/5 flex flex-col ${className}`}>
    <div className="flex items-center gap-2 mb-6 justify-end">
      <h2 className="text-[var(--color-gold-main)] font-bold text-lg uppercase">{title}</h2>
      <div className="w-2 h-6 bg-[var(--color-gold-main)] rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
    </div>
    <div className="flex-grow">{children}</div>
  </div>
);

const WorkStep = ({ title, desc }) => (
  <div className="relative text-right">
    <div className="absolute -right-[27px] top-1 w-3 h-3 bg-[var(--color-gold-main)] rounded-full border-2 border-[var(--color-bg-main)] z-10 shadow-[0_0_8px_var(--color-gold-main)]"></div>
    <h4 className="font-bold text-sm text-[var(--color-text-white)]">{title}</h4>
    <p className="text-[var(--color-text-gray)] text-[10px] mt-1">{desc}</p>
  </div>
);

const TimelinePoint = ({ label, icon, active, isGold }) => (
  <div className="flex flex-col items-center gap-3 transition-transform hover:scale-110">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all duration-300 ${
      isGold ? 'bg-[var(--color-gold-main)] border-[var(--color-gold-main)] text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 
      active ? 'bg-transparent border-[var(--color-gold-main)] text-[var(--color-gold-main)] shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 
      'bg-transparent border-white/10 text-gray-700'
    }`}>
      {icon}
    </div>
    <p className={`text-[11px] font-black tracking-widest ${isGold ? 'text-[var(--color-gold-main)]' : 'text-white'}`}>{label}</p>
  </div>
);

const Coaches = () => (
  <Suspense fallback={null}>
    <CoachesContent />
  </Suspense>
);

export default Coaches;