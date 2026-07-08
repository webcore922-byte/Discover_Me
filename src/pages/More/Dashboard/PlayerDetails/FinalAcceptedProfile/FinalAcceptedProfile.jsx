import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, MapPin, Ruler, Weight, Footprints, Shirt, Star, Video } from 'lucide-react';
import Swal from '../../../../../utils/swalAlert';
import { authHeader } from '../../../../../utils/authHeader';
const FinalAcceptedProfile = ({
  player,
  userImage,
  API_URL
}) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const skills = player.skills || {};
  const calculateAverage = () => {
    const values = Object.values(skills);
    if (!values.length) return player.rating || 0;
    const sum = values.reduce((a, b) => a + (Number(b) || 0), 0);
    return (sum / values.length).toFixed(1);
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
  const handleDeletePermanently = async () => {
    const result = await Swal.fire({
      title: 'حذف نهائي من كشف المقبولين',
      html: `هل أنت متأكد إنك عايز تحذف <strong style="color:#D4AF37">${player.name}</strong> نهائياً من قائمة اللاعبين المقبولين؟<br/><span style="font-size:12px;color:#f87171;">لا يمكن التراجع عن هذا الإجراء.</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذفه نهائياً',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#444'
    });
    if (!result.isConfirmed) return;
    try {
      setDeleting(true);
      const res = await fetch(`${API_URL}/players/${player.id}`, {
        method: 'DELETE',
        headers: authHeader()
      });
      if (res.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'تم حذف اللاعب نهائياً من الكشف'
        });
        navigate('/dashboard');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'حدث خطأ أثناء الحذف'
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'خطأ في الاتصال بالسيرفر'
      });
    } finally {
      setDeleting(false);
    }
  };
  return <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-gray)] p-4 md:p-10 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">

        {}
        <div className="bg-[var(--color-bg-card)] rounded-[2.5rem] p-8 border border-[var(--color-border)]/30 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-[var(--card-shadow)]">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-20 animate-pulse"></div>
            {(userImage || player.image) && !imgError ? <img src={userImage || player.image} className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-emerald-500 p-1 object-cover relative z-10" alt={player.name} onError={() => setImgError(true)} /> : <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-emerald-500 p-1 bg-emerald-500/10 flex items-center justify-center relative z-10">
                <span className="text-5xl font-black text-emerald-500">
                  {player.name?.charAt(0)}
                </span>
              </div>}
          </div>

          <div className="flex-1 text-center md:text-right z-10">
            <span className="inline-block mb-2 px-3 py-1 rounded-lg text-[11px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              مقبول نهائي 🎉
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-[var(--color-gold-main)] italic uppercase tracking-tighter">
              {player.name}
            </h1>
            <p className="text-[var(--color-text-gray)] font-bold text-lg mt-1">
              {player.position} • {player.age} سنة • {player.location}
            </p>
            {player.userEmail && <p className="text-sm mt-1 text-[var(--color-text-gray)]">{player.userEmail}</p>}
          </div>

          <div className="p-6 rounded-3xl border-l-4 border-emerald-500 bg-[var(--color-bg-main)]/40 min-w-[140px] text-center">
            <p className="text-[10px] font-black uppercase text-[var(--color-text-gray)] mb-1 tracking-widest">Score</p>
            <p className="text-5xl font-black text-emerald-500 italic">{calculateAverage()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {}
          <div className="lg:col-span-7 bg-[var(--color-bg-card)] rounded-[2.5rem] p-8 md:p-10 border border-[var(--color-border)]/20 shadow-[var(--card-shadow)] space-y-10">
            <div>
              <h3 className="text-xl font-black text-[var(--color-gold-main)] uppercase mb-6 border-b border-[var(--color-border)]/20 pb-4 italic">
                بيانات اللاعب
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoItem icon={MapPin} label="المحافظة" value={player.location} />
                <InfoItem icon={Shirt} label="النادي الحالي" value={player.currentClub} />
                <InfoItem icon={Ruler} label="الطول" value={player.height ? `${player.height} سم` : null} />
                <InfoItem icon={Weight} label="الوزن" value={player.weight ? `${player.weight} كجم` : null} />
                <InfoItem icon={Footprints} label="القدم المفضلة" value={player.preferredFoot} />
                <InfoItem icon={Star} label="التقييم العام" value={player.rating} />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-[var(--color-gold-main)] uppercase mb-8 border-b border-[var(--color-border)]/20 pb-4 italic">
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
            </div>

            {player.tags && player.tags.length > 0 && <div className="pt-8 border-t border-[var(--color-border)]/20">
                <h4 className="text-[10px] font-black text-[var(--color-gold-main)] uppercase mb-5 tracking-[0.2em] italic">Player Characteristics / سمات الموهبة</h4>
                <div className="flex flex-wrap gap-3">
                  {player.tags.map(tag => <span key={tag} className="px-4 py-2 rounded-xl text-[11px] font-bold bg-[var(--color-gold-main)] text-black">
                      {tag}
                    </span>)}
                </div>
              </div>}

            {player.fieldTest?.date && <div className="pt-8 border-t border-[var(--color-border)]/20">
                <h4 className="text-[10px] font-black text-[var(--color-gold-main)] uppercase mb-5 tracking-[0.2em] italic">تفاصيل الاختبار الميداني</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <InfoItem label="التاريخ" value={player.fieldTest.date} />
                  <InfoItem label="التوقيت" value={player.fieldTest.time} />
                  <InfoItem label="الملعب" value={player.fieldTest.location} />
                  <InfoItem label="الكشاف المسؤول" value={player.fieldTest.coachName} />
                </div>
              </div>}
          </div>

          {}
          <div className="lg:col-span-5">
            <div className="bg-[var(--color-bg-card)] rounded-[2.5rem] p-8 border border-[var(--color-border)]/20 h-full flex flex-col justify-between space-y-8 shadow-[var(--card-shadow)]">
              <div>
                <h3 className="text-lg font-black text-[var(--color-text-white)] italic uppercase mb-6 border-r-4 border-[var(--color-gold-main)] pr-4 flex items-center gap-2">
                  <Video className="w-4 h-4" /> فيديو مهارات اللاعب
                </h3>
                <button onClick={handleOpenVideo} disabled={!player.videoUrl} className="w-full py-5 bg-[var(--color-bg-main)]/30 border border-[var(--color-border)]/30 rounded-2xl text-[var(--color-gold-main)] font-black hover:bg-[var(--color-gold-main)] hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed">
                  <span>OPEN DRIVE VIDEO</span>
                </button>
              </div>

              <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/20 space-y-4">
                <h4 className="text-sm font-black text-red-400 uppercase tracking-wider italic flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> حذف اللاعب من كشف المقبولين
                </h4>
                <p className="text-xs text-[var(--color-text-gray)] leading-relaxed">
                  هذا الإجراء بيمسح ملف اللاعب نهائياً من قاعدة البيانات ومن كشف المقبولين، ومينفعش يترجع تاني.
                </p>
                <button onClick={handleDeletePermanently} disabled={deleting} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-sm transition-colors uppercase italic tracking-wider shadow-lg shadow-red-900/20 disabled:opacity-60 flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  {deleting ? 'جاري الحذف...' : 'حذف نهائي من الكشف'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>;
};
const InfoItem = ({
  icon: Icon,
  label,
  value
}) => {
  if (value === undefined || value === null || value === '') return null;
  return <div className="bg-[var(--color-bg-main)]/40 border border-[var(--color-border)]/10 rounded-xl p-3">
      <p className="text-[10px] text-gray-500 font-bold mb-1 flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3 text-[#D4AF37]" />} {label}
      </p>
      <p className="text-sm text-[var(--color-text-white)] font-medium">{value}</p>
    </div>;
};
const SkillDisplay = ({
  label,
  value
}) => <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-black text-[var(--color-text-gray)] uppercase tracking-widest">{label}</span>
      <span className="text-xl font-black text-[var(--color-gold-main)] italic">{value ?? 0}</span>
    </div>
    <div className="relative h-2 bg-[var(--color-border)]/20 rounded-lg overflow-hidden">
      <div className="h-full bg-[var(--color-gold-main)] transition-all duration-500" style={{
      width: `${(value || 0) / 10 * 100}%`
    }} />
    </div>
  </div>;
export default FinalAcceptedProfile;
