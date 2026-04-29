import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const PlayerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [skills, setSkills] = useState({
    pace: 5, shooting: 5, passing: 5, dribbling: 5, defending: 5, physical: 5
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${API_URL}/players/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Player not found');
        return res.json();
      })
      .then(data => {
        setPlayer(data);
        if(data.skills) setSkills(data.skills);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'خطأ في الوصول للاعب', background: 'var(--color-bg-main)', color: '#fff' });
        setLoading(false);
      });
  }, [id, API_URL]);

  const handleOpenVideo = () => {
    let url = player.videoUrl;
    if (!url) return;
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/[-\w]{25,}/);
      if (fileId) {
        url = `https://drive.google.com/file/d/${fileId[0]}/view`;
      }
    }
    window.open(url, '_blank');
  };

  const calculateAverage = () => {
    const values = Object.values(skills);
    const sum = values.reduce((a, b) => a + b, 0);
    return (sum / values.length).toFixed(1);
  };

  const handleAction = async (status) => {
    const finalRating = calculateAverage();
    let rejectionReason = "";

    if (status === 'rejected') {
      const { value: text } = await Swal.fire({
        title: 'سبب الرفض والملاحظات',
        input: 'textarea',
        inputPlaceholder: 'ما الذي يجب على اللاعب تحسينه؟',
        showCancelButton: true,
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#D4AF37',
        cancelButtonColor: '#ff4444',
      });
      if (text) rejectionReason = text;
      else return;
    }

    Swal.fire({ 
        title: 'جاري التحديث وإرسال الإيميل...', 
        background: '#1a1a1a',
        color: '#fff',
        didOpen: () => Swal.showLoading() 
    });

    try {
      const response = await fetch(`${API_URL}/players/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          rating: finalRating,
          skills: skills,
          rejectionReason: rejectionReason 
        }),
      });

      if (response.ok) {
        const SERVICE_ID = "service_gcnbn55";
        const TEMPLATE_ID = "template_t4iawyc"; 
        const PUBLIC_KEY = "IrYz-yNKPjZh7J3t2";

        const templateParams = {
          player_email: player.userEmail,
          player_name: player.name,
          status: status === 'approved' ? 'مقبول ✅' : 'مرفوض ❌',
          message: status === 'approved' 
            ? `ألف مبروك يا بطل! 🌟 تم قبول انضمامك لعائلة 'اكتشفني' بنجاح! ⚽ رحلتك نحو النجومية بدأت دلوقتي.. جهز مهاراتك، الملاعب مستنية موهبتك! 🔥 ادخل دلوقتي وورينا سحرك! 🚀`
            : `للأسف يا بطل، طلبك المرة دي لم يحالفه الحظ.. وده كان بسبـب: ${rejectionReason || 'عدم استيفاء الشروط الحالية'}. 🛑 لكن دي مش النهاية! دي مجرد بداية جديدة ليك عشان تشتغل على مهاراتك أكتر وتطور مستواك في الملعب. ⚽ استمر في التمرين، واحنا واثقين إننا هنشوفك أقوى المرة الجاية! 💪🔥`,
        };

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

        Swal.fire({ 
            icon: 'success', 
            title: status === 'approved' ? 'تم القبول وإرسال الإيميل' : 'تم الرفض وإرسال الملاحظات',
            background: '#1a1a1a',
            color: '#fff'
        });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'فشل في العملية.. تأكد من السيرفر', background: '#1a1a1a', color: '#fff' });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-yellow-500 text-xl animate-pulse italic font-black">EKTASHENFI LOADING...</div>
    </div>
  );

  if (!player) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
      <h2>اللاعب غير موجود!</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-white)] p-4 md:p-10 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-[var(--gold-gradient)] rounded-full blur-md opacity-20 animate-pulse"></div>
            <img src={player.image} className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-[var(--color-gold-main)] p-1 object-cover relative z-10" alt="" />
          </div>
          
          <div className="flex-1 text-center md:text-right z-10">
            <h1 className="text-4xl md:text-6xl font-black text-gradient-gold italic uppercase tracking-tighter">
                {player.name}
            </h1>
            <p className="text-[var(--color-text-gray)] font-bold text-lg mt-1">
                {player.position} • {player.age} سنة • {player.location}
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border-l-4 border-[var(--color-gold-main)] bg-white/5 min-w-[140px] text-center">
            <p className="text-[10px] font-black uppercase text-[var(--color-text-gray)] mb-1 tracking-widest">Score</p>
            <p className="text-5xl font-black text-gradient-gold italic">{calculateAverage()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 glass-card rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl">
            <h3 className="text-xl font-black text-gradient-gold uppercase mb-8 border-b border-white/5 pb-4 italic">
                Technical Assessment / التقييم الفني
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <SkillSlider label="السرعة (Pace)" value={skills.pace} onChange={(v) => setSkills({...skills, pace: v})} />
              <SkillSlider label="التسديد (Shooting)" value={skills.shooting} onChange={(v) => setSkills({...skills, shooting: v})} />
              <SkillSlider label="التمرير (Passing)" value={skills.passing} onChange={(v) => setSkills({...skills, passing: v})} />
              <SkillSlider label="المراوغة (Dribbling)" value={skills.dribbling} onChange={(v) => setSkills({...skills, dribbling: v})} />
              <SkillSlider label="الدفاع (Defending)" value={skills.defending} onChange={(v) => setSkills({...skills, defending: v})} />
              <SkillSlider label="اللياقة (Physical)" value={skills.physical} onChange={(v) => setSkills({...skills, physical: v})} />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 bg-white/[0.02] h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-white italic uppercase mb-6 border-r-4 border-[var(--color-gold-main)] pr-4">فيديو مهارات اللاعب</h3>
                <p className="text-[var(--color-text-gray)] text-sm mb-6 font-bold leading-relaxed">
                    يرجى مراجعة الفيديو المرفق على Google Drive قبل اتخاذ قرار القبول أو الرفض لضمان دقة التقييم.
                </p>
                <button 
                    onClick={handleOpenVideo}
                    className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[var(--color-gold-main)] font-black hover:bg-[var(--gold-gradient)] hover:text-black transition-all flex items-center justify-center gap-3 group"
                >
                    <span>OPEN DRIVE VIDEO</span>
                    <svg className="w-5 h-5 group-hover:translate-x-[-3px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </button>
              </div>

              <div className="space-y-4 mt-10">
                <button 
                  onClick={() => handleAction('approved')}
                  className="w-full bg-[var(--gold-gradient)] text-black font-black py-5 rounded-2xl shadow-[var(--gold-glow)] hover:scale-[1.02] active:scale-95 transition-all text-lg uppercase italic"
                >
                  {player.status === 'approved' ? 'Update Evaluation Data' : 'Approve & Accept'}
                </button>
                
                {player.status !== 'approved' && (
                  <button 
                    onClick={() => handleAction('rejected')}
                    className="w-full bg-transparent border-2 border-red-500/30 text-red-500 font-black py-5 rounded-2xl hover:bg-red-500 hover:text-white transition-all text-lg uppercase"
                  >
                    Reject with Feedback
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const SkillSlider = ({ label, value, onChange }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-black text-[var(--color-text-gray)] uppercase tracking-widest">{label}</span>
      <span className="text-xl font-black text-[var(--color-gold-main)] italic">{value}</span>
    </div>
    <div className="relative h-2 flex items-center">
        <input 
            type="range" min="1" max="10" step="0.5"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-gold-main)]"
        />
    </div>
  </div>
);

export default PlayerDetails;