import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import Swal from 'sweetalert2';

const Profile = () => {
  const { user, logout, updatePlayerState } = useAuth();
  const [showCongrats, setShowCongrats] = useState(false);
  
  const [editData, setEditData] = useState({
    currentClub: '',
    location: '',
    age: '',
    videoUrl: '',
    height: '',
    weight: '',
    preferredFoot: ''
  });

  useEffect(() => {
    if (user?.player) {
      setEditData({
        currentClub: user.player.currentClub || '',
        location: user.player.location || '',
        age: user.player.age || '',
        videoUrl: user.player.videoUrl || '',
        height: user.player.height || '',
        weight: user.player.weight || '',
        preferredFoot: user.player.preferredFoot || ''
      });

      if (user.player.status === 'approved') {
        const hasSeenCongrats = localStorage.getItem(`congrats_seen_${user.player.id}`);
        if (!hasSeenCongrats) {
          setShowCongrats(true);
          localStorage.setItem(`congrats_seen_${user.player.id}`, 'true');
        }
      }
    }
  }, [user]);

  if (!user) return null;
  const isPlayer = user.player; 
  const status = isPlayer ? user.player.status : null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
          confirmAndSaveImage(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmAndSaveImage = (base64String) => {
    Swal.fire({
      title: 'تغيير الصورة الشخصية؟',
      imageUrl: base64String,
      imageWidth: 150,
      imageHeight: 150,
      showCancelButton: true,
      confirmButtonText: 'حفظ التعديل',
      background: '#121212',
      color: '#fff',
      confirmButtonColor: '#D4AF37'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const response = await fetch(`${API_URL}/players/${user.player.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64String }),
          });
          if (!response.ok) throw new Error();
          const updatedPlayer = await response.json();
          updatePlayerState(updatedPlayer);
          Swal.fire({ title: 'تم التحديث!', icon: 'success', background: '#121212', color: '#fff' });
        } catch (err) {
          Swal.fire({ title: 'خطأ', text: 'فشل في رفع الصورة', icon: 'error', background: '#121212' });
        }
      }
    });
  };

  const handleSave = async () => {
    Swal.fire({ title: 'جاري الحفظ...', allowOutsideClick: false, background: '#121212', color: '#fff', didOpen: () => { Swal.showLoading(); } });
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/players/${user.player.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
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
                <h2 className="text-2xl font-black text-green-500 uppercase tracking-tighter italic">
                  ✅ ألف مبروك يا كابتن! تم قبولك رسمياً كلاعب معتمد
                </h2>
              </div>
            )}

            {(status === 'pending' || status === 'rejected') && (
              <div className={`p-6 rounded-[2rem] border text-center shadow-xl transition-all ${
                status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                <p className="font-black italic text-lg uppercase tracking-tighter">
                  {status === 'pending' && "⚠️ ملفك الشخصي قيد المراجعة الفنية.. سيتم تفعيلك فور انتهاء التقييم."}
                  {status === 'rejected' && `❌ تم رفض طلبك: ${user.player.rejectionReason || 'برجاء مراجعة بياناتك مهارياً.'}`}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-visible shadow-2xl">
          <div className="relative group cursor-pointer" onClick={() => document.getElementById('imageInput').click()}>
            <div className="absolute inset-0 bg-[var(--gold-gradient)] rounded-full blur opacity-0 group-hover:opacity-40 transition-all duration-500"></div>
            <img 
              src={isPlayer ? user.player.image : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
              className="w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-[var(--color-gold-main)] p-1.5 z-10 bg-black shadow-[var(--gold-glow)] object-cover relative transition-transform group-hover:scale-105" 
              alt="Profile" 
            />
            <input type="file" id="imageInput" className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="flex-1 text-center md:text-right z-10 overflow-visible">
            
            <h1 className="text-5xl md:text-7xl font-black italic uppercase mb-10 tracking-tight leading-[1.2] inline-block"
                style={{
                  background: 'linear-gradient(to bottom, #D4AF37 10%, #FFF2AD 50%, #B8860B 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  paddingLeft: '0.5em',
                  paddingRight: '0.5em',
                  marginLeft: '-0.5em',
                  marginRight: '-0.5em',
                  filter: 'drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.6))',
                  WebkitBoxDecorationBreak: 'clone'
                }}>
              {isPlayer ? user.player.name : user.username}
            </h1>
            
            <div className="flex items-center gap-4 justify-center md:justify-start mt-2">
              <span className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[var(--color-gold-main)] text-sm font-black uppercase tracking-widest italic shadow-inner">
                  {isPlayer ? user.player.position : 'Member'}
              </span>
              {isPlayer && (
                <span className={`px-5 py-2 rounded-full text-xs font-black uppercase border shadow-lg italic ${
                  status === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' :
                  status === 'approved' ? 'bg-green-500/20 text-green-500 border-green-500/30' :
                  'bg-red-500/20 text-red-500 border-red-500/30'
                }`}>
                  {status === 'pending' && 'Pending'}
                  {status === 'approved' && 'Approved'}
                  {status === 'rejected' && 'Rejected'}
                </span>
              )}
            </div>
          </div>

          <button onClick={handleLogout} className="px-10 py-4 bg-red-500/10 border-2 border-red-500/20 text-red-500 text-xs font-black rounded-2xl hover:bg-red-500 hover:text-white transition-all z-10 italic">
            تسجيل الخروج
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card rounded-[2.5rem] p-10 border border-white/10 shadow-xl space-y-8">
               <h3 className="text-[var(--color-gold-main)] font-black text-base uppercase tracking-widest border-b border-white/5 pb-5 italic">بيانات الحساب</h3>
               <div className="space-y-6">
                 <InfoBox label="اسم المستخدم" value={user.username} />
                 <InfoBox label="البريد الإلكتروني" value={user.email} />
                 <InfoBox label="رقم الهاتف" value={user.phone} />
               </div>
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
                  <EditableStatCard label="القدم المفضلة" value={editData.preferredFoot} onChange={(v) => setEditData({...editData, preferredFoot: v})} />
                  <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex flex-col justify-center">
                    <p className="text-[var(--color-text-gray)] text-[11px] font-black uppercase mb-2 tracking-widest italic">تقييم اللجنة الفنية</p>
                    <p className="text-3xl font-black text-[var(--color-gold-main)] italic tracking-tighter">
                      {status === 'pending' ? '--' : user.player.rating} / 10
                    </p>
                  </div>
                </div>
                <button onClick={handleSave} className="w-full bg-[var(--gold-gradient)] text-black font-black py-7 rounded-[2.5rem] shadow-[var(--gold-glow)] hover:scale-[1.01] active:scale-95 transition-all text-2xl uppercase border-b-8 border-black/20 italic">
                  تحديث بيانات اللاعب
                </button>
              </div>
            ) : (
              <div className="glass-card rounded-[3rem] p-24 border border-white/10 text-center">
                <h2 className="text-5xl font-black text-gradient-gold italic uppercase">Scout Mode</h2>
                <p className="text-white/40 mt-4 font-bold">أنت الآن تتصفح ككشاف مواهب</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const InfoBox = ({ label, value }) => (
  <div className="flex flex-col gap-1 border-r-4 border-[var(--color-gold-main)]/30 pr-5 overflow-visible">
    <span className="text-[var(--color-text-gray)] font-black text-[10px] uppercase tracking-widest italic block" style={{ paddingRight: '2px' }}>{label}</span>
    <span className="text-white font-bold text-lg block italic" style={{ paddingRight: '2px' }}>{value || '---'}</span>
  </div>
);


const EditableStatCard = ({ label, value, onChange }) => (
  <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 hover:border-[var(--color-gold-main)]/30 transition-all bg-white/[0.01] overflow-visible">
    <p className="text-[var(--color-text-gray)] text-[11px] font-black uppercase mb-3 italic tracking-widest px-2 block" style={{ paddingRight: '10px' }}>{label}</p>
    <input 
      type="text" value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent border-b-2 border-white/10 w-full text-2xl font-black text-white italic focus:border-[var(--color-gold-main)] outline-none pb-2 transition-all px-2"
      style={{ paddingRight: '10px' }}
    />
  </div>
);

export default Profile;