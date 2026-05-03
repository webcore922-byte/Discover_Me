import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import Swal from 'sweetalert2';

const POSITION_OPTIONS = [
  { value: "حارس مرمى", label: "حارس مرمى (GK)" },
  { value: "قلب دفاع", label: "قلب دفاع (CB)" },
  { value: "ظهير أيمن", label: "ظهير أيمن (RB)" },
  { value: "ظهير أيسر", label: "ظهير أيسر (LB)" },
  { value: "وسط مدافع", label: "وسط مدافع (CDM)" },
  { value: "وسط ملعب", label: "وسط ملعب (CM)" },
  { value: "صانع ألعاب", label: "صانع ألعاب (CAM)" },
  { value: "جناح أيمن", label: "جناح أيمن (RW)" },
  { value: "جناح أيسر", label: "جناح أيسر (LW)" },
  { value: "مهاجم صريح", label: "مهاجم صريح (ST)" },
  { value: "مهاجم وهمي", label: "مهاجم وهمي (CF)" },
];

const compressImage = (file, callback) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 400;
      const scaleSize = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
      callback(dataUrl);
    };
  };
};

const Profile = () => {
  const { user, logout, updatePlayerState } = useAuth();
  const location = useLocation();
  const [showCongrats, setShowCongrats] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  const [upgradeData, setUpgradeData] = useState({ nationalId: '', position: '', age: '', location: '', preferredFoot: '', videoUrl: '' });
  const [editData, setEditData] = useState({ currentClub: '', location: '', age: '', videoUrl: '', height: '', weight: '', preferredFoot: '', image: '' });

  useEffect(() => {
    if (location.state?.openUpgradeForm && user?.role !== 'admin') {
      setIsUpgrading(true);
    }
    if (user?.player) {
      setEditData({
        currentClub: user.player.currentClub || '',
        location: user.player.location || '',
        age: user.player.age || '',
        videoUrl: user.player.videoUrl || '',
        height: user.player.height || '',
        weight: user.player.weight || '',
        preferredFoot: user.player.preferredFoot || '',
        image: user.player.image || ''
      });
      if (user.player.status === 'approved') {
        const hasSeenCongrats = localStorage.getItem(`congrats_seen_${user.player.id}`);
        if (!hasSeenCongrats) {
          setShowCongrats(true);
          localStorage.setItem(`congrats_seen_${user.player.id}`, 'true');
        }
      }
    }
  }, [user, location]);

  if (!user) return null;
  const isPlayer = user.player; 
  const isAdmin = user.role === 'admin';
  const status = isPlayer ? user.player.status : null;

  const handleUpgradeSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({ title: 'جاري تسجيلك كلاعب...', allowOutsideClick: false, background: '#121212', color: '#fff', didOpen: () => Swal.showLoading() });
    const newPlayerPayload = {
      userEmail: user.email,
      name: user.username,
      ...upgradeData,
      currentClub: "لاعب حر",
      height: "175", weight: "70", rating: "0.0", status: "pending", tags: [],
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
      skills: { pace: 0, shooting: 0, passing: 0, dribbling: 0, defending: 0, physical: 0 }
    };
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/players`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPlayerPayload) });
      if (res.ok) {
        const createdPlayer = await res.json();
        updatePlayerState(createdPlayer);
        setIsUpgrading(false);
        Swal.fire({ title: 'مبروك يا بطل!', text: 'تم إرسال بياناتك للمراجعة', icon: 'success', background: '#121212', color: '#fff' });
      }
    } catch (err) {
      Swal.fire({ title: 'خطأ', text: 'فشل في الاتصال بالسيرفر', icon: 'error', background: '#121212', color: '#fff' });
    }
  };

  const handleSave = async () => {
    Swal.fire({ title: 'جاري الحفظ...', allowOutsideClick: false, background: '#121212', color: '#fff', didOpen: () => { Swal.showLoading(); } });
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/players/${user.player.id}`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(editData) 
      });
      if (!response.ok) throw new Error();
      const updatedPlayer = await response.json();
      updatePlayerState(updatedPlayer);
      Swal.fire({ title: 'تم الحفظ!', icon: 'success', background: '#121212', color: '#fff' });
    } catch (err) {
      Swal.fire({ title: 'خطأ', text: 'فشل الاتصال بالسيرفر', icon: 'error', background: '#121212' });
    }
  };

  const handleLogout = () => {
    Swal.fire({ title: 'خروج؟', icon: 'warning', showCancelButton: true, confirmButtonText: 'نعم', background: '#121212', color: '#fff' }).then((r) => { if (r.isConfirmed) logout(); });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] py-10 md:py-16 px-4 md:px-8 text-right font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-10">
        {isPlayer && (
          <div className="space-y-4">
            {showCongrats && (
              <div className="bg-green-500/20 border-2 border-green-500/40 p-8 rounded-[2.5rem] text-center shadow-[0_0_30px_rgba(34,197,94,0.2)] animate-pulse">
                <h2 className="text-2xl font-black text-green-500 uppercase tracking-tighter italic"> ✅ ألف مبروك يا كابتن! تم قبولك رسمياً كلاعب معتمد </h2>
              </div>
            )}
            {(status === 'pending' || status === 'rejected') && (
              <div className={`p-6 rounded-[2rem] border text-center shadow-xl transition-all ${status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                <p className="font-black italic text-lg uppercase tracking-tighter"> {status === 'pending' && "⚠️ ملفك الشخصي قيد المراجعة الفنية.. سيتم تفعيلك فور انتهاء التقييم."} {status === 'rejected' && `❌ تم رفض طلبك: ${user.player.rejectionReason || 'برجاء مراجعة بياناتك مهارياً.'}`} </p>
              </div>
            )}
          </div>
        )}
        <div className="glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-visible shadow-2xl">
          <div className="relative group cursor-pointer">
            <input
              type="file"
              id="profile-upload"
              hidden
              accept="image/*"
              onChange={(e) => {
                if (e.target.files[0]) {
                  compressImage(e.target.files[0], (compressedBase64) => {
                    setEditData({ ...editData, image: compressedBase64 });
                    if (user.player) updatePlayerState({ ...user.player, image: compressedBase64 });
                  });
                }
              }}
            />
            <label htmlFor="profile-upload" className="cursor-pointer block text-center">
              <div className="relative">
                <img 
                  src={editData.image || (isPlayer ? user.player.image : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`)} 
                  className="w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-[var(--color-gold-main)] p-1.5 z-10 bg-black shadow-[var(--gold-glow)] object-cover relative transition-opacity group-hover:opacity-80" 
                  alt="Profile" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <span className="text-white text-xs font-bold">تغيير الصورة</span>
                </div>
              </div>
              <p className="text-[var(--color-gold-main)] text-[10px] font-black uppercase mt-3 tracking-widest italic opacity-70">
                اضغط لتغيير الصورة
              </p>
            </label>
          </div>

          <div className="flex-1 text-center md:text-right z-10 overflow-visible">
            <h1 className="text-5xl md:text-7xl font-black italic uppercase mb-10 tracking-tight leading-[1.2] inline-block text-gradient-gold"> {isPlayer ? user.player.name : user.username} </h1>
            <div className="flex items-center gap-4 justify-center md:justify-start mt-2">
              <span className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[var(--color-gold-main)] text-sm font-black uppercase tracking-widest italic shadow-inner"> 
                {isAdmin ? 'Admin' : (isPlayer ? user.player.position : 'Member')} 
              </span>
              {isPlayer && (
                <span className={`px-5 py-2 rounded-full text-xs font-black uppercase border shadow-lg italic ${status === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : status === 'approved' ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'}`}>
                  {status === 'pending' && 'Pending'} {status === 'approved' && 'Approved'} {status === 'rejected' && 'Rejected'}
                </span>
              )}
            </div>
          </div>
          <button onClick={handleLogout} className="px-10 py-4 bg-red-500/10 border-2 border-red-500/20 text-red-500 text-xs font-black rounded-2xl hover:bg-red-500 hover:text-white transition-all z-10 italic"> تسجيل الخروج </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card rounded-[2.5rem] p-10 border border-white/10 shadow-xl space-y-8">
               <h3 className="text-[var(--color-gold-main)] font-black text-base uppercase tracking-widest border-b border-white/5 pb-5 italic">بيانات الحساب</h3>
               <div className="space-y-6"> <InfoBox label="اسم المستخدم" value={user.username} /> <InfoBox label="البريد الإلكتروني" value={user.email} /> <InfoBox label="رقم الهاتف" value={user.phone} /> </div>
            </div>
          </div>
          <div className="lg:col-span-8">
            {isPlayer ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
                  <EditableStatCard label="النادي الحالي" value={editData.currentClub} onChange={(v) => setEditData({...editData, currentClub: v})} /> 
                  <EditableStatCard label="المحافظة / المدينة" value={editData.location} onChange={(v) => setEditData({...editData, location: v})} /> 
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> 
                  <EditableStatCard label="السن" value={editData.age} onChange={(v) => setEditData({...editData, age: v})} /> 
                  <EditableStatCard label="الطول (سم)" value={editData.height} onChange={(v) => setEditData({...editData, height: v})} /> 
                  <EditableStatCard label="الوزن (كجم)" value={editData.weight} onChange={(v) => setEditData({...editData, weight: v})} /> 
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
                    <p className="text-[var(--color-text-gray)] text-[11px] font-black uppercase mb-3 italic tracking-widest px-2">القدم المفضلة</p>
                    <select value={editData.preferredFoot} onChange={(e) => setEditData({...editData, preferredFoot: e.target.value})} className="bg-transparent border-b-2 border-white/10 w-full text-2xl font-black text-white italic focus:border-[var(--color-gold-main)] outline-none pb-2 px-2 appearance-none cursor-pointer">
                      <option value="يمين" className="bg-[#121212]">يمين</option> <option value="يسار" className="bg-[#121212]">يسار</option> <option value="القدمين" className="bg-[#121212]">القدمين</option>
                    </select>
                  </div>
                  <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex flex-col justify-center">
                    <p className="text-[var(--color-text-gray)] text-[11px] font-black uppercase mb-2 tracking-widest italic">تقييم اللجنة الفنية</p>
                    <p className="text-3xl font-black text-[var(--color-gold-main)] italic tracking-tighter"> {status === 'pending' ? '--' : user.player.rating} / 10 </p>
                  </div>
                </div>
                <EditableStatCard label="لينك فيديو مهاراتك (Google Drive / YouTube)" value={editData.videoUrl} onChange={(v) => setEditData({...editData, videoUrl: v})} />
                <button onClick={handleSave} className="w-full bg-[var(--gold-gradient)] text-black font-black py-7 rounded-[2.5rem] shadow-[var(--gold-glow)] hover:scale-[1.01] active:scale-95 transition-all text-2xl uppercase border-b-8 border-black/20 italic"> تحديث بيانات اللاعب </button>
              </div>
            ) : (
              !isAdmin && (
                <div className="glass-card rounded-[3rem] p-12 md:p-16 border border-white/10 text-center relative overflow-hidden bg-white/[0.02]">
                  {!isUpgrading ? (
                    <>
                      <h2 className="text-4xl md:text-5xl font-black text-gradient-gold italic uppercase mb-6">Scout Mode</h2>
                      <p className="text-white/40 mb-10 font-bold">هل تود الانضمام لمنصة المواهب كلاعب؟</p>
                      <button onClick={() => setIsUpgrading(true)} className="bg-[var(--gold-gradient)] text-black font-black px-12 py-5 rounded-2xl shadow-[var(--gold-glow)] hover:scale-105 transition-all text-xl uppercase italic border-b-4 border-black/20"> سجل كلاعب الآن </button>
                    </>
                  ) : (
                    <form onSubmit={handleUpgradeSubmit} className="text-right space-y-6">
                      <h3 className="text-2xl font-black text-[var(--color-gold-main)] mb-6 italic uppercase border-b border-white/5 pb-4">إكمال بيانات اللاعب</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <UpgradeInput label="الرقم القومي" placeholder="14 رقم" onChange={v => setUpgradeData({...upgradeData, nationalId: v})} />
                        <UpgradeInput label="السن" placeholder="مثال: 20" onChange={v => setUpgradeData({...upgradeData, age: v})} />
                        <div className="space-y-2 text-right">
                          <label className="text-[var(--color-gold-main)] text-[10px] font-black uppercase tracking-widest mr-2">المركز</label>
                          <select required className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[var(--color-gold-main)] outline-none transition-all text-right appearance-none cursor-pointer" onChange={(e) => setUpgradeData({...upgradeData, position: e.target.value})}>
                            <option value="">اختر مركزك</option>
                            {POSITION_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-[#1e1e1e]">{opt.label}</option>)}
                          </select>
                        </div>
                        <UpgradeInput label="المحافظة" placeholder="مثال: القاهرة" onChange={v => setUpgradeData({...upgradeData, location: v})} />
                      </div>
                      <div className="space-y-2 text-right">
                        <label className="text-[var(--color-gold-main)] text-[10px] font-black uppercase tracking-widest mr-2">القدم المفضلة</label>
                        <select required className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[var(--color-gold-main)] outline-none transition-all text-right appearance-none cursor-pointer" onChange={(e) => setUpgradeData({...upgradeData, preferredFoot: e.target.value})}>
                          <option value="">اختر القدم</option> <option value="يمين" className="bg-[#1e1e1e]">يمين</option> <option value="يسار" className="bg-[#1e1e1e]">يسار</option> <option value="القدمين" className="bg-[#1e1e1e]">القدمين</option>
                        </select>
                      </div>
                      <UpgradeInput label="لينك فيديو مهاراتك" placeholder="Google Drive / YouTube" onChange={v => setUpgradeData({...upgradeData, videoUrl: v})} />
                      <div className="flex gap-4 mt-8">
                        <button type="submit" className="flex-1 bg-[var(--gold-gradient)] text-black font-black py-5 rounded-2xl text-xl uppercase italic">تأكيد البيانات</button>
                        <button type="button" onClick={() => setIsUpgrading(false)} className="px-8 py-5 bg-white/5 text-white/50 rounded-2xl font-black uppercase italic">إلغاء</button>
                      </div>
                    </form>
                  )}
                </div>
              )
            )}
            {isAdmin && !isPlayer && (
               <div className="glass-card rounded-[3rem] p-12 border border-white/10 text-center bg-white/[0.02]">
                  <h2 className="text-2xl font-black text-gradient-gold italic uppercase">Admin Dashboard Access</h2>
                  <p className="text-white/40 mt-2">لديك كامل الصلاحيات لإدارة المنصة من لوحة التحكم.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value }) => ( <div className="flex flex-col gap-1 border-r-4 border-[var(--color-gold-main)]/30 pr-5"> <span className="text-[var(--color-text-gray)] font-black text-[10px] uppercase tracking-widest italic block">{label}</span> <span className="text-white font-bold text-lg block italic">{value || '---'}</span> </div> );
const EditableStatCard = ({ label, value, onChange }) => ( <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 hover:border-[var(--color-gold-main)]/30 transition-all bg-white/[0.01] mt-4"> <p className="text-[var(--color-text-gray)] text-[11px] font-black uppercase mb-3 italic tracking-widest px-2">{label}</p> <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent border-b-2 border-white/10 w-full text-2xl font-black text-white italic focus:border-[var(--color-gold-main)] outline-none pb-2 px-2" /> </div> );
const UpgradeInput = ({ label, placeholder, onChange }) => ( <div className="space-y-2"> <label className="text-[var(--color-gold-main)] text-[10px] font-black uppercase tracking-widest mr-2">{label}</label> <input required type="text" placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[var(--color-gold-main)] outline-none transition-all text-right" /> </div> );

export default Profile;