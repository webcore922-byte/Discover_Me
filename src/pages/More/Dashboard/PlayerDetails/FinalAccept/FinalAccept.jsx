import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const FinalAccept = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [userImage, setUserImage] = useState(null); 
  const [playerStatus, setPlayerStatus] = useState(''); 

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
        setPlayerStatus(data.status || ''); 

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
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'خطأ في الوصول للاعب', background: '#1a1a1a', color: '#fff' });
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

  const handleDecision = async (decision) => {
    const targetStatus = decision === 'accepted' ? 'final_accepted' : 'final_rejected';

    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: decision === 'accepted' 
        ? `هل تود اعتماد "القبول النهائي" للاعب ${player.name} وإرسال بريد إلكتروني له؟` 
        : `هل تود اعتماد "الرفض النهائي" للاعب ${player.name} وإرسال بريد إلكتروني له؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: decision === 'accepted' ? '#16a34a' : '#dc2626',
      cancelButtonColor: '#444',
      confirmButtonText: decision === 'accepted' ? 'نعم، قبول نهائي' : 'نعم، رفض نهائي',
      cancelButtonText: 'إلغاء',
      background: '#1a1a1a',
      color: '#fff'
    });

    if (!result.isConfirmed) return;

    Swal.fire({ 
        title: 'جاري تسجيل القرار النهائي وإرسال الإيميل...', 
        background: '#1a1a1a',
        color: '#fff',
        didOpen: () => Swal.showLoading() 
    });

    try {
      const response = await fetch(`${API_URL}/players/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }), 
      });

      if (response.ok) {
        const SERVICE_ID = "service_gcnbn55";
        const TEMPLATE_ID = "template_t4iawyc"; 
        const PUBLIC_KEY = "IrYz-yNKPjZh7J3t2";

        const templateParams = {
          player_email: player.userEmail || player.email,
          player_name: player.name,
          status: decision === 'accepted' ? 'مقبول نهائياً 🏆' : 'مرفوض نهائياً ❌',
          message: decision === 'accepted'
            ? `ألف مبروك يا بطل! 🎉 أداءك في التقييم كان ممتازاً، وتم قبولك نهائياً في منصة اكتشفني! ملفك الآن متاح لجميع الكشافين والأندية، جاهز لبدء رحلتك الاحترافية الحقيقية! ⚽🌟`
            : `حظاً أوفر يا بطل، تقييمك الحالي لم يتخطى شروط القبول النهائي بنجاح. لكن دي مش النهاية، طور من مهاراتك الفنية والبدنية واستعد لتقديم طلب جديد قريباً! 💪🔥`
        };

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        setPlayerStatus(targetStatus);

        Swal.fire({ 
            icon: 'success', 
            title: decision === 'accepted' ? 'تم القبول النهائي بنجاح!' : 'تم الرفض النهائي بنجاح',
            background: '#1a1a1a',
            color: '#fff'
        });
        
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'خطأ في حفظ القرار الفني', background: '#1a1a1a', color: '#fff' });
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
          </div>

          <div className="p-6 rounded-3xl border-l-4 border-[#D4AF37] bg-white/5 min-w-[140px] text-center">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Score</p>
            <p className="text-5xl font-black text-[#D4AF37] italic">{calculateAverage()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* قسم عرض التقييم الفني فقط (Read-Only) */}
          <div className="lg:col-span-7 bg-white/5 rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl">
            <h3 className="text-xl font-black text-[#D4AF37] uppercase mb-8 border-b border-white/5 pb-4 italic">
                Technical Assessment / التقييم الفني
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <SkillDisplay label="السرعة (Pace)" value={skills.pace} />
              <SkillDisplay label="التسديد (Shooting)" value={skills.shooting} />
              <SkillDisplay label="التمرير (Passing)" value={skills.passing} />
              <SkillDisplay label="المراوغة (Dribbling)" value={skills.dribbling} />
              <SkillDisplay label="الدفاع (Defending)" value={skills.defending} />
              <SkillDisplay label="اللياقة (Physical)" value={skills.physical} />
            </div>

            {player.tags && player.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/5">
                <h4 className="text-[10px] font-black text-yellow-500 uppercase mb-5 tracking-[0.2em] italic">Player Characteristics / سمات الموهبة</h4>
                <div className="flex flex-wrap gap-3">
                  {player.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-xl text-[11px] font-bold bg-[#D4AF37] text-black"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 h-full flex flex-col justify-between space-y-8">
              <div>
                <h3 className="text-lg font-black text-white italic uppercase mb-6 border-r-4 border-[#D4AF37] pr-4">فيديو مهارات اللاعب</h3>
                <button 
                    onClick={handleOpenVideo}
                    className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[#D4AF37] font-black hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center gap-3"
                >
                    <span>OPEN DRIVE VIDEO</span>
                </button>
              </div>

              <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 space-y-4">
                <h4 className="text-sm font-black text-yellow-500 uppercase tracking-wider italic">القرار النهائي للمنصة</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  بناءً على مراجعة ملف اللاعب والفيديو المعروض، يرجى اتخاذ القرار الحاسم بقبول اللاعب نهائياً لبدء تسويقه أو رفضه.
                </p>
                
                {(playerStatus === 'final_accepted' || playerStatus === 'final_rejected') ? (
                  <div className="text-center py-2 flex flex-col gap-2 items-center">
                    <span className={`w-full py-3 rounded-xl font-bold text-sm ${playerStatus === 'final_accepted' ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-red-600/20 text-red-400 border border-red-500/30'}`}>
                      تم الحفظ الفعلي: {playerStatus === 'final_accepted' ? 'قبول نهائي 🎉' : 'رفض نهائي ❌'}
                    </span>
                    <button 
                      onClick={() => setPlayerStatus('')} 
                      className="text-[11px] text-amber-500 underline hover:text-amber-400 transition-colors mt-1"
                    >
                      تعديل القرار الحالي
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4 pt-2">
                    <button 
                      onClick={() => handleDecision('accepted')}
                      className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl text-sm transition-colors uppercase italic tracking-wider shadow-lg shadow-green-900/20"
                    >
                      قبول نهائي
                    </button>
                    <button 
                      onClick={() => handleDecision('rejected')}
                      className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-sm transition-colors uppercase italic tracking-wider shadow-lg shadow-red-900/20"
                    >
                      رفض نهائي
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const SkillDisplay = ({ label, value }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-xl font-black text-[#D4AF37] italic">{value}</span>
    </div>
    <div className="relative h-2 bg-white/10 rounded-lg overflow-hidden">
      <div 
        className="h-full bg-[#D4AF37] transition-all duration-500" 
        style={{ width: `${(value / 10) * 100}%` }}
      />
    </div>
  </div>
);

export default FinalAccept;