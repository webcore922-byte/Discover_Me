import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const SUGGESTED_TAGS = [
  "سرعة انفجارية", "مراوغ ماهر", "قناص أهداف", "صانع ألعاب ذكي", 
  "ارتقاء عالي", "دقة تمرير", "قوة بدنية", "قطع كرات", "تسديدات بعيدة"
];

const CheckVedio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]); 
  const [imgError, setImgError] = useState(false);
  const [userImage, setUserImage] = useState(null); 
  
  const [skills, setSkills] = useState({
    pace: 5, shooting: 5, passing: 5, dribbling: 5, defending: 5, physical: 5
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/players/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Player not found');
        return res.json();
      })
      .then(async data => {
        setPlayer(data);
        setImgError(false);

        if (data.userEmail) {
          try {
            const usersRes = await fetch(`${API_URL}/users`);
            if (usersRes.ok) {
              const allUsers = await usersRes.json();
              const matchedUser = allUsers.find(
                u => u.email?.trim().toLowerCase() === data.userEmail?.trim().toLowerCase()
              );
              if (matchedUser?.image) {
                setUserImage(matchedUser.image);
              }
            }
          } catch (e) {
            console.warn('مش قادر يجيب صورة اليوزر:', e);
          }
        }

        if(data.skills) setSkills(data.skills);
        if(data.tags) setSelectedTags(data.tags); 
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'خطأ في الوصول للاعب', background: '#1a1a1a', color: '#fff' });
        setLoading(false);
      });
  }, [id, API_URL]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tag]);
      } else {
        Swal.fire({ 
            title: 'الحد الأقصى 3 سمات فقط', 
            icon: 'warning', 
            background: '#1a1a1a', 
            color: '#fff',
            confirmButtonColor: '#D4AF37'
        });
      }
    }
  };

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

  const handleDecision = async (decision) => {
    const finalRating = calculateAverage();
    let rejectionReason = "";

    if (decision === 'rejected') {
      const { value: text } = await Swal.fire({
        title: 'سبب الرفض والملاحظات',
        input: 'textarea',
        inputPlaceholder: 'اكتب ما الذي يجب على اللاعب تحسينه (سيتم إرساله في الإيميل وحفظه بملفه)...',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#444',
        confirmButtonText: 'تأكيد الرفض',
        cancelButtonText: 'إلغاء',
        background: '#1a1a1a',
        color: '#fff',
      });
      
      if (text && text.trim() !== "") {
        rejectionReason = text;
      } else {
        return; 
      }
    } else {
      const result = await Swal.fire({
        title: 'اعتماد قبول فيديو اللاعب؟',
        text: `هل أنت متأكد من مراجعة وتصعيد اللاعب ${player.name} إلى مرحلة الفحص الميداني؟`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#444',
        confirmButtonText: 'نعم، اعتماد وقبول',
        cancelButtonText: 'إلغاء',
        background: '#1a1a1a',
        color: '#fff'
      });
      if (!result.isConfirmed) return;
    }

    Swal.fire({ 
        title: decision === 'approved' ? 'جاري تسجيل القبول وتصعيد اللاعب...' : 'جاري تسجيل الرفض وإرسال الإيميل...', 
        background: '#1a1a1a',
        color: '#fff',
        didOpen: () => Swal.showLoading() 
    });

    try {
      const response = await fetch(`${API_URL}/players/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: decision, 
          rating: finalRating,
          skills: skills,
          tags: selectedTags, 
          rejectionReason: decision === 'approved' ? '' : rejectionReason
        }),
      });

      if (response.ok) {
        const SERVICE_ID = "service_gcnbn55";
        const TEMPLATE_ID = "template_t4iawyc"; 
        const PUBLIC_KEY = "IrYz-yNKPjZh7J3t2";

        const templateParams = {
          player_email: player.userEmail || player.email,
          player_name: player.name,
          status: decision === 'approved' ? 'مقبول مبدئياً 🎉' : 'مرفوض ❌',
          message: decision === 'approved'
            ? `ألف مبروك يا بطل! 🎉 تم قبول فيديو مهاراتك الفنية بنجاح من قبل اللجنة المقيمة. ملفك الآن صُعّد رسميًا إلى مرحلة (انتظار تحديد موعد الاختبار الميداني) على المنصة وسيتم التواصل معك لجدولة التيست القادم! ⚽🌟`
            : `حظاً أوفر يا بطل، تم مراجعة فيديو مهاراتك الحالية ولم يحالفك الحظ لتخطي التقييم الفني المبدئي هذه المرة.. وذلك بسبب: ${rejectionReason}. 🛑 طور من مستواك الفني والبدني وركز في تدريباتك القادمة وبانتظار تقديمك لطلب جديد! 💪🔥`
        };

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

        await Swal.fire({ 
            icon: 'success', 
            title: decision === 'approved' ? 'تم قبول الفيديو وتصعيد اللاعب للميدان بنجاح! 🎉' : 'تم تسجيل الرفض وحفظ السبب بنجاح.',
            background: '#1a1a1a',
            color: '#fff'
        });
        
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'فشل في حفظ القرار الفني', background: '#1a1a1a', color: '#fff' });
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
    <div className="min-h-screen bg-[#0e1011] text-white p-4 md:p-10 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-[#D4AF37] rounded-full blur-md opacity-20 animate-pulse"></div>
            
            {(userImage || player.image) && !imgError ? (
              <img 
                src={userImage || player.image}
                className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-[#D4AF37] p-1 object-cover relative z-10" 
                alt={player.name}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-[#D4AF37] p-1 bg-[#D4AF37]/10 flex items-center justify-center relative z-10">
                <span className="text-5xl font-black text-[#D4AF37]">
                  {player.name?.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-right z-10">
            <h1 className="text-4xl md:text-6xl font-black text-[#D4AF37] italic uppercase tracking-tighter">
                {player.name}
            </h1>
            <p className="text-gray-400 font-bold text-lg mt-1">
                {player.position} • {player.age} سنة • {player.location === "20" ? "القاهرة" : player.location}
            </p>
            {player.status === 'rejected' && player.rejectionReason && (
              <p className="text-red-400 text-sm mt-2 font-medium bg-red-950/30 inline-block px-3 py-1 rounded-lg border border-red-900/30">
                ملاحظة الرفض الحالية: {player.rejectionReason}
              </p>
            )}
          </div>

          <div className="p-6 rounded-3xl border-l-4 border-[#D4AF37] bg-white/5 min-w-[140px] text-center">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Score</p>
            <p className="text-5xl font-black text-[#D4AF37] italic">{calculateAverage()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 bg-white/5 rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl">
            <h3 className="text-xl font-black text-[#D4AF37] uppercase mb-8 border-b border-white/5 pb-4 italic">
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

            <div className="mt-12 pt-8 border-t border-white/5">
              <h4 className="text-[10px] font-black text-yellow-500 uppercase mb-5 tracking-[0.2em] italic">Player Characteristics / سمات الموهبة (اختر 3)</h4>
              <div className="flex flex-wrap gap-3">
                {SUGGESTED_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                      selectedTags.includes(tag) 
                      ? 'bg-[#D4AF37] text-black border-transparent scale-105' 
                      : 'bg-white/5 text-gray-500 border-white/10 hover:border-yellow-500/50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-white italic uppercase mb-6 border-r-4 border-[#D4AF37] pr-4">فيديو مهارات اللاعب</h3>
                <p className="text-gray-400 text-sm mb-6 font-bold leading-relaxed">
                    يرجى مراجعة الفيديو المرفق على Google Drive بعناية وتحديد درجات التقييم الفني بالأعلى قبل إصدار قرار القبول أو الرفض الفوري.
                </p>
                <button 
                    onClick={handleOpenVideo}
                    className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[#D4AF37] font-black hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center gap-3 group"
                >
                    <span>OPEN DRIVE VIDEO</span>
                </button>
              </div>

              <div className="space-y-4 mt-12 pt-6 border-t border-white/10">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">اتخاذ قرار الاعتماد الفوري:</h4>
                
                <button 
                  onClick={() => handleDecision('approved')}
                  className="w-full bg-[#16a34a] text-white font-black py-5 rounded-2xl hover:bg-green-700 hover:scale-[1.01] active:scale-95 transition-all text-lg uppercase italic shadow-lg shadow-green-950/20"
                >
                  قبول اللاعب ✅
                </button>
                
                <button 
                  onClick={() => handleDecision('rejected')}
                  className="w-full bg-transparent border-2 border-red-500/40 text-red-500 font-black py-5 rounded-2xl hover:bg-red-600 hover:text-white transition-all text-lg uppercase"
                >
                  رفض مع إرسال الملاحظات ❌
                </button>
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
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-xl font-black text-[#D4AF37] italic">{value}</span>
    </div>
    <div className="relative h-2 flex items-center">
        <input 
            type="range" min="1" max="10" step="0.5"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
        />
    </div>
  </div>
);

export default CheckVedio;