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
          throw new Error(`خطأ في استجابة النظام (Status: ${failedRes.status})`);
        }

        const isJson = techRes.headers.get("content-type")?.includes("application/json");
        if (!isJson) {
          throw new Error("تنسيق البيانات غير صالح. تأكد من تشغيل الـ JSON Server.");
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
          setError("عجز النظام عن الاتصال بقاعدة البيانات. يرجى التحقق من اتصالك بالإنترنت أو حالة السيرفر.");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (API_URL) {
      fetchData();
    } else {
      setError("لم يتم العثور على عنوان الـ API (VITE_API_URL)");
      setLoading(false);
    }
  }, [API_URL]);

  if (loading) return (
    <div className="min-h-screen bg-[var(--color-bg-main)] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-t-2 border-[var(--color-gold-main)] rounded-full animate-spin mb-6 shadow-[var(--gold-glow)]"></div>
      <p className="text-gradient-gold font-black text-xl tracking-[0.2em] animate-pulse italic uppercase">ScoutPro Loading</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[var(--color-bg-main)] flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="relative w-full max-w-2xl">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[var(--color-gold-main)] opacity-10 blur-[80px] rounded-full"></div>
        
        <div className="glass-card rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden border-red-500/20">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <span className="text-4xl animate-bounce">📡</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text-white)] mb-4 tracking-tighter">
              حدث خطأ في <span className="text-gradient-gold">النظام</span>
            </h2>
            <p className="text-[var(--color-text-gray)] text-lg mb-10 leading-relaxed max-w-sm font-medium">
              {error}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center">
              
              <button 
                onClick={() => window.location.reload()}
                className="relative group overflow-hidden bg-[var(--gold-gradient)] p-[2px] rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-95 w-full sm:w-64"
              >
                <div className="bg-[var(--color-bg-main)] group-hover:bg-transparent transition-colors duration-300 rounded-[10px] px-6 py-4">
                  <span className="relative z-10 text-[var(--color-gold-main)] group-hover:text-black font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 justify-center">
                    <span className="animate-spin-slow inline-block text-base">🔄</span>
                    إعادة محاولة الاتصال
                  </span>
                </div>
              </button>

              <button 
                onClick={() => window.history.back()}
                className="relative group overflow-hidden bg-white/10 p-[2px] rounded-xl transition-all duration-300 hover:bg-[var(--gold-gradient)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 w-full sm:w-64"
              >
                <div className="bg-[var(--color-bg-main)] group-hover:bg-transparent transition-colors duration-300 rounded-[10px] px-6 py-4">
                  <span className="relative z-10 text-white group-hover:text-black font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 justify-center">
                    <span className="text-base group-hover:translate-x-1 transition-transform">➡️</span>
                    الرجوع للقائمة السابقة
                  </span>
                </div>
              </button>

            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-white/5 flex justify-between items-center text-[9px] text-[var(--color-text-gray)] font-bold tracking-[0.3em] uppercase">
            <span>System Log: 505_ERR</span>
            <span className="text-[var(--color-gold-main)] opacity-50 italic">ScoutPro Security Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[var(--color-bg-main)] text-[var(--color-text-white)] p-6 md:p-10 font-sans flex flex-col" dir="rtl">
      
      <header className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
        <div className="text-right">
          <h1 className="text-4xl font-black text-gradient-gold uppercase tracking-tighter italic">
            SCOUTPRO
          </h1>
          <p className="text-[var(--color-text-gray)] text-[10px] tracking-[0.4em] uppercase mt-1 font-black opacity-70">
            Technical Evaluation System
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xl font-black text-white">نخبة الخبراء</p>
          <p className="text-[var(--color-text-gray)] text-[11px] mt-1 font-medium italic opacity-60">لاكتشاف وتطوير المواهب الكروية</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow items-stretch">
        
        <div className="lg:col-span-3 flex flex-col gap-6">
          <Section title="المستشارون" className="flex-1">
            <div className="space-y-3">
                {scoutData.consultants.map(item => (
                  <div key={item.id} className="glass-card hover-gold-card p-4 rounded-2xl flex items-center justify-between group">
                      <div className="text-right">
                        <p className="font-bold text-sm text-[var(--color-text-white)] group-hover:text-[var(--color-gold-main)] transition-colors">{item.name}</p>
                        <p className="text-[var(--color-gold-main)] text-[10px] font-bold opacity-70">{item.specialty}</p>
                      </div>
                      <img src={item.image} alt="" className="w-10 h-10 rounded-full border-2 border-[var(--color-border)] object-cover shadow-[var(--gold-glow)]" />
                  </div>
                ))}
            </div>
          </Section>

          <Section title="آلية العمل" className="flex-1">
            <div className="relative border-r border-[var(--color-border)]/30 pr-6 space-y-8 py-2">
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
                <div key={coach.id} className="glass-card hover-gold-card p-3 rounded-xl flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <img src={coach.image} alt="" className="w-10 h-10 rounded-xl object-cover border border-white/10 group-hover:border-[var(--color-gold-main)]/50" />
                    <div className="text-right">
                      <p className="font-bold text-[13px] text-[var(--color-text-white)]">{coach.name}</p>
                      <p className="text-[var(--color-text-gray)] text-[10px] mt-1 font-medium">{coach.info}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="lg:col-span-5 h-full">
          <Section title="اللجنة العليا" className="h-full">
            <div className="space-y-5">
              {scoutData.technical_committee.map(member => (
                <div key={member.id} className="card-shine glass-card hover-gold-card p-6 rounded-[2rem] border-white/5 relative group">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <img src={member.image} alt="" className="w-16 h-16 rounded-2xl border-2 border-[var(--color-border)] object-cover shadow-[var(--gold-glow)] group-hover:rotate-3 transition-transform duration-500" />
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[var(--color-gold-main)] rounded-full border-4 border-[#1a1d1e] icon-pulse"></div>
                      </div>
                      <div className="text-right">
                        <h3 className="font-bold text-xl text-[var(--color-text-white)] tracking-tight">{member.name}</h3>
                        <p className="text-[var(--color-gold-main)] text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">{member.role}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[var(--color-text-gray)] text-[11px] mb-4 leading-relaxed text-right font-medium">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 justify-start">
                    {member.tags.map((tag, i) => (
                      <span key={i} className="text-[9px] text-[var(--color-gold-main)] font-black bg-[var(--color-gold-main)]/5 px-4 py-1.5 rounded-full border border-[var(--color-gold-main)]/20">
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

      <footer className="mt-12 glass-card p-12 rounded-[3rem] border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] timeline-line"></div>
        <div className="max-w-4xl mx-auto flex w-full justify-between items-center relative z-10">
            <TimelinePoint label="تحليل الفيديو" icon="📹" active />
            <TimelinePoint label="مراجعة الخبراء" icon="⚖️" active />
            <TimelinePoint label="القرار النهائي" icon="🏆" isGold />
        </div>
      </footer>
    </div>
  );
};

const Section = ({ title, children, className }) => (
  <div className={`glass-card p-6 rounded-[2.5rem] flex flex-col ${className}`}>
    <div className="flex items-center gap-3 mb-8 justify-end">
      <h2 className="text-gradient-gold font-black text-lg uppercase tracking-tighter">{title}</h2>
      <div className="w-1.5 h-6 bg-[var(--color-gold-main)] rounded-full shadow-[var(--gold-glow)]"></div>
    </div>
    <div className="flex-grow">{children}</div>
  </div>
);

const WorkStep = ({ title, desc }) => (
  <div className="relative text-right group">
    <div className="absolute -right-[26px] top-1.5 w-2.5 h-2.5 bg-[var(--color-bg-main)] border-2 border-[var(--color-gold-main)] rounded-full z-10 shadow-[var(--gold-glow)] group-hover:scale-125 transition-transform"></div>
    <h4 className="font-black text-[13px] text-[var(--color-text-white)] tracking-wide">{title}</h4>
    <p className="text-[var(--color-text-gray)] text-[10px] mt-1 font-medium">{desc}</p>
  </div>
);

const TimelinePoint = ({ label, icon, active, isGold }) => (
  <div className="flex flex-col items-center gap-4 transition-all hover:scale-110">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border transition-all duration-500 ${
      isGold ? 'bg-[var(--gold-gradient)] border-[var(--color-gold-main)] text-black shadow-[var(--gold-glow)]' : 
      active ? 'bg-white/5 border-[var(--color-gold-main)]/50 text-[var(--color-gold-main)] shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 
      'bg-transparent border-white/10 text-gray-700'
    }`}>
      {icon}
    </div>
    <p className={`text-[10px] font-black tracking-[0.2em] uppercase ${isGold ? 'text-[var(--color-gold-main)]' : 'text-[var(--color-text-white)] opacity-60'}`}>{label}</p>
  </div>
);

const Coaches = () => (
  <Suspense fallback={null}>
    <CoachesContent />
  </Suspense>
);

export default Coaches;