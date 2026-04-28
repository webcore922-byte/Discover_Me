import React, { Suspense, lazy } from 'react';
import { scoutData } from './CoachesData';

const CoachesContent = () => {
  return (
    <div className="min-h-screen w-full bg-[var(--color-bg-main)] text-[var(--color-text-white)] p-6 md:p-10 font-sans flex flex-col" dir="rtl">
      
      <header className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
        <div className="text-2xl font-black italic tracking-tighter">
          SCOUT<span className="text-[var(--color-gold-main)]">PRO</span>
        </div>
        <div className="text-left md:text-right">
          <h1 className="text-3xl font-black text-gradient-gold">منظومة التقييم الفني</h1>
          <p className="text-[var(--color-text-gray)] text-sm mt-1">نخبة من المدربين والخبراء لتطوير واكتشاف المواهب.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow items-stretch">
        
        <div className="lg:col-span-3 flex flex-col gap-6">
          <Section title="المستشارون" className="flex-1">
             <div className="space-y-3">
                {scoutData.consultants.map(item => (
                   <div key={item.id} className="bg-[var(--color-bg-card)] p-4 rounded-xl border border-white/5 flex items-center justify-between group">
                      <div>
                         <p className="font-bold text-sm text-[var(--color-text-white)] group-hover:text-[var(--color-gold-main)] transition-colors">{item.name}</p>
                         <p className="text-[var(--color-gold-main)] text-[10px] opacity-70">{item.specialty}</p>
                      </div>
                      <img 
                        src={item.image} 
                        alt="" 
                        loading="lazy"
                        className="w-10 h-10 rounded-full border-2 border-[var(--color-gold-main)]/30 object-cover" 
                      />
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
                    <img 
                      src={coach.image} 
                      alt="" 
                      loading="lazy"
                      className="w-9 h-9 rounded-lg object-cover border border-white/10 group-hover:border-[var(--color-gold-main)]/50 transition-all" 
                    />
                    <div>
                      <p className="font-bold text-[13px] leading-tight">{coach.name}</p>
                      <p className="text-[var(--color-text-gray)] text-[10px] leading-tight">{coach.info}</p>
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
                <div key={member.id} className="relative p-5 rounded-2xl bg-gradient-to-br from-[#2c281e] to-[var(--color-bg-card)] border border-[var(--color-border)]/30 group overflow-hidden ">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-4">

                      <img 
                        src={member.image} 
                        alt="" 
                        loading="lazy"
                        className="w-16 h-16 rounded-xl border-2 border-[var(--color-gold-main)] object-cover shadow-lg rotate-2 group-hover:rotate-0 transition-transform" 
                      />
                      <div className="text-right">
                        <h3 className="font-bold text-lg leading-tight  ">{member.name}</h3>
                        <p className="text-[var(--color-gold-main)] text-xs font-medium uppercase tracking-widest">{member.role}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[var(--color-text-gray)] text-[11px] mb-4 leading-relaxed">{member.bio}</p>
                  <div className="flex flex-wrap gap-2">
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

      <footer className="mt-10 bg-[var(--color-bg-card)] p-10 rounded-[2rem] border border-white/5 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative h-32 flex items-center">
          <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold-main)]/60 to-transparent -translate-y-6 z-0"></div>
          <div className="flex w-full justify-between items-center z-10">
            <TimelinePoint label="تحليل الفيديو" icon="📹" active />
            <TimelinePoint label="مراجعة الخبراء" icon="⚖️" active />
            <TimelinePoint label="القرار" icon="🏆" isGold />
          </div>
        </div>
      </footer>
    </div>
  );
};

const Section = ({ title, children, className }) => (
  <div className={`bg-[#1e2122] p-5 rounded-3xl border border-white/5 flex flex-col ${className}`}>
    <div className="flex items-center gap-2 mb-6">
      <div className="w-2 h-6 bg-[var(--color-gold-main)] rounded-full shadow-[0_0_10px_var(--color-gold-main)]"></div>
      <h2 className="text-[var(--color-gold-main)] font-bold text-lg uppercase">{title}</h2>
    </div>
    <div className="flex-grow">{children}</div>
  </div>
);

const WorkStep = ({ title, desc }) => (
  <div className="relative">
    <div className="absolute -right-[27px] top-1 w-3 h-3 bg-[var(--color-gold-main)] rounded-full border-2 border-[var(--color-bg-main)] z-10 shadow-[0_0_8px_var(--color-gold-main)]"></div>
    <h4 className="font-bold text-sm text-[var(--color-text-white)]">{title}</h4>
    <p className="text-[var(--color-text-gray)] text-[10px] mt-1">{desc}</p>
  </div>
);

const TimelinePoint = ({ label, icon, active, isGold }) => (
  <div className="flex flex-col items-center gap-3 transition-transform hover:scale-110">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all duration-300 shadow-2xl ${
      isGold ? 'bg-[var(--color-gold-main)] border-[var(--color-gold-main)] text-black' : 
      active ? 'bg-[var(--color-bg-main)] border-[var(--color-gold-main)] text-[var(--color-gold-main)]' : 
      'bg-[var(--color-bg-main)] border-white/10 text-gray-700'
    }`}>
       {icon}
    </div>
    <p className={`text-[11px] font-black tracking-widest ${isGold ? 'text-[var(--color-gold-main)]' : 'text-white'}`}>{label}</p>
  </div>
);

const Coaches = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg-main)] flex items-center justify-center text-[var(--color-gold-main)]">جاري تحميل المدربين...</div>}>
      <CoachesContent />
    </Suspense>
  );
};

export default Coaches;