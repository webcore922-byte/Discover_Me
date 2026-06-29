import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const ScoutPipeline = () => {
  const steps = [
    { label: "رفع الفيديو", icon: "📹" },
    { label: "المراجعة الفنية", icon: "🔍" },
    { label: "التقييم الرقمي", icon: "📊" },
    { label: "اختبار الميدان", icon: "⚽" },
    { label: "القرار النهائي", icon: "🏆" }
  ];

  return (
    <div className="mt-24 w-full">
      <h3 className="text-center text-gradient-gold font-black text-xl mb-12 tracking-[0.2em] uppercase">مراحل القبول الاحترافية</h3>
      <div className="relative flex justify-between items-center max-w-5xl mx-auto px-4">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[var(--color-border)] timeline-line -z-0"></div>
        {steps.map((step, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center group">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-2xl shadow-[var(--gold-glow)] group-hover:scale-110 group-hover:border-[var(--color-gold-main)] transition-all duration-300">
              {step.icon}
            </div>
            <p className="mt-4 text-[10px] font-bold text-[var(--color-text-gray)] group-hover:text-[var(--color-gold-main)] transition-colors">{step.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CoachesContent = () => {
  const [scoutData, setScoutData] = useState({ field_testers: [], coaches: [], consultants: [] });
  const [loading, setLoading] = useState(true);

  const showErrorAlert = () => {
    Swal.fire({
      title: '<span style="color: var(--color-gold-main); font-weight: 900; letter-spacing: 2px;">نظام الصيانة</span>',
      html: `
        <div style="color: var(--color-text-gray); margin-bottom: 25px; font-size: 14px; line-height: 1.6;">
          عذراً، تعذر الاتصال بخوادم <b>ScoutPro</b>. <br/> يرجى التأكد من استقرار الشبكة والمحاولة لاحقاً.
        </div>
        <div style="font-size: 40px; margin-bottom: 20px;">📡</div>
      `,
      showCancelButton: true,
      confirmButtonText: 'إعادة المحاولة',
      cancelButtonText: 'الرجوع',
      buttonsStyling: false,
      customClass: {
        popup: 'glass-card border-l-4 border-l-[var(--color-gold-main)] p-6',
        actions: 'flex gap-6 w-full justify-center mt-6',
        confirmButton: 'px-10 py-3 bg-gradient-to-r from-[var(--color-btn-start)] to-[var(--color-btn-end)] text-black font-black rounded-xl hover:scale-105 transition-all shadow-[var(--gold-glow)]',
        cancelButton: 'px-10 py-3 bg-white/5 text-[var(--color-text-white)] font-bold rounded-xl hover:bg-white/10 transition-all border border-[var(--color-border)]'
      },
      background: 'var(--color-bg-card)',
      backdrop: `rgba(0,0,0,0.9)`,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) window.location.reload();
      else if (result.dismiss === Swal.DismissReason.cancel) window.history.back();
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tRes, cRes, consRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/field_testers`),
          fetch(`${import.meta.env.VITE_API_URL}/coaches`),
          fetch(`${import.meta.env.VITE_API_URL}/consultants`)
        ]);
        
        if (!tRes.ok || !cRes.ok || !consRes.ok) throw new Error("Failed to fetch");

        setScoutData({
          field_testers: await tRes.json(),
          coaches: await cRes.json(),
          consultants: await consRes.json()
        });
      } catch (err) {
        showErrorAlert();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[var(--color-bg-main)] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-t-2 border-[var(--color-gold-main)] rounded-full animate-spin mb-6"></div>
      <p className="text-gradient-gold font-black text-xl tracking-[0.2em] animate-pulse italic uppercase">ScoutPro Loading</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-6 md:p-12 font-sans" dir="rtl">
      <header className="mb-16 border-b border-[var(--color-border)]/20 pb-10 text-center">
        <h1 className="text-6xl font-black italic text-gradient-gold tracking-tighter">SCOUTPRO</h1>
        <p className="text-[var(--color-text-gray)] text-[11px] tracking-[0.5em] uppercase mt-3 font-bold opacity-70">Technical Evaluation System</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="flex flex-col gap-6">
          <h2 className="text-[var(--color-gold-main)] font-black text-sm uppercase tracking-widest border-r-4 border-[var(--color-gold-main)] pr-4">المستشارون</h2>
          {scoutData.consultants.map(c => (
            <div key={c.id} className="glass-card p-5 rounded-2xl flex items-center gap-4 hover-gold-card card-shine">
              <img src={c.image} alt={c.name} className="w-14 h-14 rounded-full border border-[var(--color-border)]" />
              <div>
                <p className="font-bold text-[var(--color-text-white)]">{c.name}</p>
                <p className="text-[var(--color-gold-main)] text-[10px] font-bold">{c.specialty}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <h2 className="col-span-full text-[var(--color-gold-main)] font-black text-sm uppercase tracking-widest border-r-4 border-[var(--color-gold-main)] pr-4">المختبرون الميدانيون</h2>
          {scoutData.field_testers.map(f => (
            <div key={f.id} className="glass-card p-6 rounded-[2rem] hover-gold-card card-shine border-[var(--color-border)]/10">
              <div className="flex gap-4 mb-4">
                <img src={f.image} alt={f.name} className="w-16 h-16 rounded-2xl border-2 border-[var(--color-border)]" />
                <div>
                  <h3 className="font-bold text-[var(--color-text-white)]">{f.name}</h3>
                  <p className="text-[var(--color-gold-main)] text-[10px] font-black">{f.specialty}</p>
                </div>
              </div>
              <p className="dark:text-[var(--color-text-gray)] text-[11px] leading-relaxed mb-4 text-[--color-bg-main]">{f.bio}</p>
              <div className="flex flex-wrap gap-2">
                {f.tags.map(t => <span key={t} className="text-[9px] text-[var(--color-gold-main)] border border-[var(--color-border)]/30 px-3 py-1 rounded-full">{t}</span>)}
              </div>
            </div>
          ))}
        </section>
      </div>

      <ScoutPipeline />
    </div>
  );
};

export default CoachesContent;