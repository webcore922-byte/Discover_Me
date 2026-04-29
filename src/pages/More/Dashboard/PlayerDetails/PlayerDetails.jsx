import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PlayerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState(""); // لحفظ المهارة الجديدة أثناء الكتابة
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${API_URL}/players/${id}`)
      .then(res => res.json())
      .then(data => {
        setPlayer(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  // دالة لحفظ التعديلات في السيرفر
  const updatePlayerTags = async (updatedTags) => {
    try {
      const res = await fetch(`${API_URL}/players/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: updatedTags }),
      });
      if (res.ok) {
        setPlayer({ ...player, tags: updatedTags });
        Swal.fire({
          title: 'تم التحديث!',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          background: '#1a1a1a',
          color: '#fff'
        });
      }
    } catch (err) {
      Swal.fire({ title: 'خطأ', text: 'فشل تحديث المهارات', icon: 'error' });
    }
  };

  // إضافة مهارة جديدة
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim() !== "") {
      const currentTags = player.tags || [];
      if (!currentTags.includes(newTag.trim())) {
        const updatedTags = [...currentTags, newTag.trim()];
        updatePlayerTags(updatedTags);
        setNewTag("");
      }
    }
  };

  // حذف مهارة
  const removeTag = (tagToRemove) => {
    const updatedTags = player.tags.filter(tag => tag !== tagToRemove);
    updatePlayerTags(updatedTags);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[var(--color-gold-main)]">Loading...</div>;
  if (!player) return <div className="text-white text-center py-20">اللاعب غير موجود</div>;

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <button onClick={() => navigate(-1)} className="text-[var(--color-gold-main)] font-black flex items-center gap-2 hover:opacity-70 transition-all uppercase text-sm tracking-widest">
          ← العودة للوحة التحكم
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* بيانات اللاعب */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-[2.5rem] border border-white/10 text-center bg-white/[0.02]">
              <img src={player.image} className="w-48 h-48 rounded-full mx-auto border-4 border-[var(--color-gold-main)] p-1 shadow-[var(--gold-glow)] mb-6 object-cover" alt="" />
              <h1 className="text-3xl font-black italic text-gradient-gold">{player.name}</h1>
              <p className="text-white/50 font-bold uppercase tracking-widest text-xs mt-2">{player.position}</p>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 space-y-4 bg-white/[0.01]">
               <DetailRow label="النادي الحالي" value={player.currentClub} />
               <DetailRow label="السن" value={player.age} />
               <DetailRow label="الطول" value={`${player.height} سم`} />
               <DetailRow label="القدم" value={player.preferredFoot} />
               <DetailRow label="المدينة" value={player.location} />
            </div>
          </div>

          {/* الفيديو والمهارات */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="glass-card rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl aspect-video bg-black">
              {getEmbedUrl(player.videoUrl) ? (
                <iframe width="100%" height="100%" src={getEmbedUrl(player.videoUrl)} frameBorder="0" allowFullScreen></iframe>
              ) : (
                <div className="h-full flex items-center justify-center text-white/20 font-black uppercase">لا يوجد فيديو متاح</div>
              )}
            </div>

            {/* نظام تعديل المهارات الفنية */}
            <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02]">
              <h3 className="text-[var(--color-gold-main)] font-black uppercase tracking-widest mb-6 flex justify-between items-center">
                المهارات الفنية (Tags)
                <span className="text-[10px] text-white/30 font-normal">اضغط Enter للإضافة / X للحذف</span>
              </h3>
              
              {/* خانة إضافة مهارة جديدة */}
              <input 
                type="text"
                placeholder="أضف مهارة جديدة... (مثال: سريع، قناص)"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 mb-6 outline-none focus:border-[var(--color-gold-main)] transition-all"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
              />

              <div className="flex flex-wrap gap-3">
                {player.tags && player.tags.map((tag, index) => (
                  <div key={index} className="group relative flex items-center gap-2 px-5 py-2 bg-[var(--color-gold-main)]/10 border border-[var(--color-gold-main)]/20 rounded-xl">
                    <span className="font-bold italic text-white/90">{tag}</span>
                    <button 
                      onClick={() => removeTag(tag)}
                      className="text-red-500 hover:text-red-700 font-black ml-2 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-white/5 pb-3">
    <span className="text-white/40 font-bold text-xs uppercase">{label}</span>
    <span className="text-white font-black italic">{value || '---'}</span>
  </div>
);

export default PlayerDetails;