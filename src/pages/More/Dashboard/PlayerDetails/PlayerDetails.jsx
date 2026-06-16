import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const SUGGESTED_TAGS = [
  "سرعة انفجارية", "مراوغ ماهر", "قناص أهداف", "صانع ألعاب ذكي", 
  "ارتقاء عالي", "دقة تمرير", "قوة بدنية", "قطع كرات", "تسديدات بعيدة"
];

const PlayerDetails = () => {
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

  const [fieldTest, setFieldTest] = useState({
    date: '', time: '', location: '', coachName: '', isDone: false, finalStatus: ''
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
        if(data.fieldTest) {
          setFieldTest({
            date: data.fieldTest.date || '',
            time: data.fieldTest.time || '',
            location: data.fieldTest.location || '',
            coachName: data.fieldTest.coachName || '',
            isDone: data.fieldTest.isDone || false,
            finalStatus: data.fieldTest.finalStatus || ''
          });
        }
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

  const handleFieldTestDecision = async (decision) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: decision === 'accepted' 
        ? `هل تود اعتماد "القبول النهائي" للاعب ${player.name} وإرسال بريد إلكتروني له؟` 
        : `هل تود اعتماد "الرفض الميداني" للاعب ${player.name} وإرسال بريد إلكتروني له؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: decision === 'accepted' ? '#16a34a' : '#dc2626',
      cancelButtonColor: '#444',
      confirmButtonText: decision === 'accepted' ? 'نعم، قبول نهائي' : 'نعم، رفض الميدان',
      cancelButtonText: 'إلغاء',
      background: '#1a1a1a',
      color: '#fff'
    });

    if (!result.isConfirmed) return;

    Swal.fire({ 
        title: 'جاري تسجيل القرار النهائي...', 
        background: '#1a1a1a',
        color: '#fff',
        didOpen: () => Swal.showLoading() 
    });

    const updatedFieldTest = {
      ...fieldTest,
      isDone: true,
      finalStatus: decision
    };

    try {
      const response = await fetch(`${API_URL}/players/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fieldTest: updatedFieldTest,
          status: decision === 'accepted' ? 'final_accepted' : 'final_rejected'
        }),
      });

      if (response.ok) {
        const SERVICE_ID = "service_gcnbn55";
        const TEMPLATE_ID = "template_t4iawyc"; 
        const PUBLIC_KEY = "IrYz-yNKPjZh7J3t2";

        const templateParams = {
          player_email: player.userEmail || player.email,
          player_name: player.name,
          status: decision === 'accepted' ? 'مقبول نهائياً 🏆' : 'مرفوض ❌',
          message: decision === 'accepted'
            ? `ألف مبروك يا بطل! 🎉 أداءك في الاختبار الميداني كان ممتازاً، وتم قبولك نهائياً في منصة اكتشفني! جاهز لبدء رحلتك الاحترافية الحقيقية مع الأندية! ⚽🌟`
            : `حظاً أوفر يا بطل، اختبارك الميداني لم يتخطى التقييم الحالي بنجاح. لكن دي مش النهاية، طور من مهاراتك الفنية والبدنية واستعد لتقديم طلب اختبار جديد قريباً! 💪🔥`
        };

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        setFieldTest(updatedFieldTest);

        Swal.fire({ 
            icon: 'success', 
            title: decision === 'accepted' ? 'تم القبول النهائي وإرسال الإيميل!' : 'تم الرفض النهائي وإرسال الإيميل',
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

  const handleAction = async (actionType) => {
    const finalRating = calculateAverage();
    let rejectionReason = player.rejectionReason || "";

    if (actionType === 'rejected') {
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

    let nextStatus = actionType === 'approved' ? 'approved' : 'rejected';
    let currentFieldTest = { ...fieldTest };

    if (fieldTest.date.trim() && fieldTest.location.trim()) {
      nextStatus = 'approved';
      currentFieldTest.isDone = false;
      currentFieldTest.finalStatus = '';
    }

    try {
      const response = await fetch(`${API_URL}/players/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: nextStatus, 
          rating: finalRating,
          skills: skills,
          tags: selectedTags, 
          rejectionReason: nextStatus === 'approved' ? '' : rejectionReason, 
          fieldTest: currentFieldTest
        }),
      });

      if (response.ok) {
        const SERVICE_ID = "service_gcnbn55";
        const TEMPLATE_ID = "template_t4iawyc"; 
        const PUBLIC_KEY = "IrYz-yNKPjZh7J3t2";

        const templateParams = {
          player_email: player.userEmail || player.email,
          player_name: player.name,
          status: nextStatus === 'approved' ? 'مقبول ومحول للميدان (موعد جديد) ✅' : 'مرفوض ❌',
          message: nextStatus === 'approved' 
            ? `ألف مبروك يا بطل! 🌟 تم تحديد / تحديث موعد اختبارك الميداني من جديد: المكان: ${currentFieldTest.location} | التاريخ: ${currentFieldTest.date} | الوقت: ${currentFieldTest.time || 'سيتم تحديده'}. جهز نفسك لتثبت موهبتك في الملعب! 🔥`
            : `للأسف يا بطل، طلبك المرة دي لم يحالفه الحظ.. وده كان بسبـب: ${rejectionReason || 'عدم استيفاء الشروط الحالية'}. 🛑 استمر في التمرين، واحنا واثقين إننا هنشوفك أقوى المرة الجاية! 💪🔥`,
        };

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

        Swal.fire({ 
            icon: 'success', 
            title: nextStatus === 'approved' ? 'تم حفظ موعد الاختبار ونقل اللاعب للميدان بنجاح!' : 'تم الرفض وإرسال الملاحظات',
            background: '#1a1a1a',
            color: '#fff'
        });
        
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'فشل في عملية الحفظ والتعديل', background: '#1a1a1a', color: '#fff' });
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
                    يرجى مراجعة الفيديو المرفق على Google Drive قبل اتخاذ قرار القبول أو الرفض لضمان دقة التقييم.
                </p>
                <button 
                    onClick={handleOpenVideo}
                    className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[#D4AF37] font-black hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center gap-3 group"
                >
                    <span>OPEN DRIVE VIDEO</span>
                </button>
              </div>

              {/* قسم الموعد المعدل بالكامل ليكون Picker تلقائي */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                <h4 className="text-sm font-black text-[#D4AF37]">تحديد / تعديل موعد الإختبار الميداني</h4>
                
                {/* 1. إدخال التاريخ بنوع date */}
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">تاريخ الاختبار</label>
                  <input 
                    type="date" 
                    value={fieldTest.date} 
                    onChange={e => setFieldTest({...fieldTest, date: e.target.value})} 
                    className="w-full bg-[#16191b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37] calendar-dark-theme cursor-pointer" 
                  />
                </div>
                
                {/* 2. إدخال التوقيت بنوع time */}
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">توقيت الاختبار</label>
                  <input 
                    type="time" 
                    value={fieldTest.time} 
                    onChange={e => setFieldTest({...fieldTest, time: e.target.value})} 
                    className="w-full bg-[#16191b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37] clock-dark-theme cursor-pointer" 
                  />
                </div>
                
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">مكان وملعب الاختبار</label>
                  <input type="text" value={fieldTest.location} placeholder="مثال: نادي الجزيرة، القاهرة" onChange={e => setFieldTest({...fieldTest, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">اسم الكشاف المسؤول</label>
                  <input type="text" value={fieldTest.coachName} placeholder="مثال: كابتن محمد سمير" onChange={e => setFieldTest({...fieldTest, coachName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]" />
                </div>
              </div>

              {fieldTest.date && fieldTest.location && (
                <div className="mt-6 pt-6 border-t border-white/10 space-y-3 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <h4 className="text-xs font-black text-yellow-500 uppercase tracking-wider">تقييم المدرب للاختبار الميداني المباشر</h4>
                  <p className="text-[11px] text-gray-400">حدد قرار اللجنة النهائي الفني بعد متابعة حضور وأداء اللاعب الفعلي على أرضية الملعب:</p>
                  
                  {fieldTest.finalStatus ? (
                    <div className="text-center py-2 flex flex-col gap-2 items-center">
                      <span className={`px-4 py-2 rounded-xl font-bold text-xs ${fieldTest.finalStatus === 'accepted' ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-red-600/20 text-red-400 border border-red-500/30'}`}>
                        القرار الحالي: {fieldTest.finalStatus === 'accepted' ? 'قبول نهائي 🎉' : 'رفض نهائي ❌'}
                      </span>
                      <button 
                        onClick={() => setFieldTest({ ...fieldTest, finalStatus: '' })} 
                        className="text-[10px] text-amber-500 underline"
                      >
                        تغيير القرار الفني
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3 pt-1">
                      <button 
                        onClick={() => handleFieldTestDecision('accepted')}
                        className="flex-1 py-2.5 bg-green-600 text-white font-bold rounded-xl text-xs hover:bg-green-700 transition-colors"
                      >
                        قبول نهائي للّاعب
                      </button>
                      <button 
                        onClick={() => handleFieldTestDecision('rejected')}
                        className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 transition-colors"
                      >
                        رفض نهائي
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4 mt-10">
                <button 
                  onClick={() => handleAction('approved')}
                  className="w-full bg-[#D4AF37] text-black font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all text-lg uppercase italic"
                >
                  حفظ التحديثات وموعد الاختبار
                </button>
                
                {player.status !== 'approved' && player.status !== 'final_accepted' && (
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

export default PlayerDetails;