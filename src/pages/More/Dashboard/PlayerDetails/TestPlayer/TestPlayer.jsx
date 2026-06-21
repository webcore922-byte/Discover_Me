import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const TestPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const handleSaveFieldTest = async () => {
    if (!fieldTest.date.trim() || !fieldTest.location.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'برجاء إدخال التاريخ والموقع أولاً',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#D4AF37'
      });
      return;
    }

    Swal.fire({ 
        title: 'جاري حفظ موعد الاختبار وجدولة اللاعب الميداني...', 
        background: '#1a1a1a',
        color: '#fff',
        didOpen: () => Swal.showLoading() 
    });

    try {
      const response = await fetch(`${API_URL}/players/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'approved', 
          fieldTest: {
            ...fieldTest,
            isDone: false
          }
        }),
      });

      if (response.ok) {
        const SERVICE_ID = "service_gcnbn55";
        const TEMPLATE_ID = "template_t4iawyc"; 
        const PUBLIC_KEY = "IrYz-yNKPjZh7J3t2";

        const templateParams = {
          player_email: player.userEmail || player.email,
          player_name: player.name,
          status: 'تمت جدولة موعد الاختبار الميداني 📅',
          message: `ألف مبروك يا بطل! 🌟 تم رسمياً تحديد وتأكيد موعد اختبارك الميداني: المكان والملعب: ${fieldTest.location} | التاريخ: ${fieldTest.date} | التوقيت: ${fieldTest.time || 'سيتم تحديده بدقة لاحقاً'} | الكابتن الكشاف المسؤول: ${fieldTest.coachName || 'اللجنة الفنية'}. جهز حقيبتك الرياضية واستعد لتثبت نفسك أمام الكشافين في الملعب! 🔥⚽`,
        };

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

        Swal.fire({ 
            icon: 'success', 
            title: 'تم حفظ الجدول ونقل اللاعب لقائمة الجاهزين للاختبار بنجاح! 📅', 
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
              <SkillDisplay label="السرعة (Pace)" value={skills.pace} />
              <SkillDisplay label="التسديد (Shooting)" value={skills.shooting} />
              <SkillDisplay label="التمرير (Passing)" value={skills.passing} />
              <SkillDisplay label="المراوغة (Dribbling)" value={skills.dribbling} />
              <SkillDisplay label="الدفاع (Defending)" value={skills.defending} />
              <SkillDisplay label="اللياقة (Physical)" value={skills.physical} />
            </div>

            {/* عرض السمات المميزة الحالية للاعب */}
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

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-white italic uppercase mb-6 border-r-4 border-[#D4AF37] pr-4">فيديو مهارات اللاعب</h3>
                <p className="text-gray-400 text-sm mb-6 font-bold leading-relaxed">
                    يرجى مراجعة الفيديو المرفق على Google Drive للاطلاع على مهارات اللاعب قبل التوجه للاختبار الميداني.
                </p>
                <button 
                    onClick={handleOpenVideo}
                    className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[#D4AF37] font-black hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center gap-3 group"
                >
                    <span>OPEN DRIVE VIDEO</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                <h4 className="text-sm font-black text-[#D4AF37]">تحديد / تعديل موعد الإختبار الميداني</h4>
                
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">تاريخ الاختبار</label>
                  <input 
                    type="date" 
                    value={fieldTest.date} 
                    onChange={e => setFieldTest({...fieldTest, date: e.target.value})} 
                    className="w-full bg-[#16191b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37] cursor-pointer" 
                  />
                </div>
                
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">توقيت الاختبار</label>
                  <input 
                    type="time" 
                    value={fieldTest.time} 
                    onChange={e => setFieldTest({...fieldTest, time: e.target.value})} 
                    className="w-full bg-[#16191b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37] cursor-pointer" 
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

              <div className="space-y-4 mt-10">
                <button 
                  onClick={handleSaveFieldTest}
                  className="w-full bg-[#D4AF37] text-black font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all text-lg uppercase italic shadow-md shadow-amber-500/20"
                >
                  حفظ وإرسال موعد الاختبار
                </button>
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

export default TestPlayer;