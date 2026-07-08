import React from 'react';
const EditableStatCard = ({
  label,
  value,
  onChange,
  readOnly
}) => <div className={`glass-card p-8 rounded-[2.5rem] border border-white/5 transition-all bg-white/[0.01] mt-4 ${!readOnly && 'hover:border-[var(--color-gold-main)]/30'}`}>
    <p className="text-[var(--color-text-gray)] text-[11px] font-black uppercase mb-3 italic tracking-widest px-2">
      {label}
    </p>
    <input type="text" value={value} readOnly={readOnly} onChange={e => !readOnly && onChange(e.target.value)} className={`bg-transparent border-b-2 border-white/10 w-full text-2xl font-black text-[var(--color-text-white)] italic outline-none pb-2 px-2 ${readOnly ? 'border-dashed border-white/5 opacity-70 cursor-not-allowed' : 'focus:border-[var(--color-gold-main)]'}`} />
  </div>;
const PlayerEditForm = ({
  user,
  status,
  editData,
  setEditData,
  handleSave
}) => <div className="space-y-8">
    {status === 'rejected' && <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-[2rem] text-orange-400 text-sm font-bold text-center italic">
        يمكنك تحديث فيديو المهارات الخاص بك ليتم إعادة تقييم طلبك مرة أخرى
      </div>}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EditableStatCard label="النادي الحالي" value={editData.currentClub} onChange={v => setEditData({
      ...editData,
      currentClub: v
    })} />
      <EditableStatCard label="المحافظة" value={editData.location} onChange={v => setEditData({
      ...editData,
      location: v
    })} />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <EditableStatCard label="السن" value={editData.age} onChange={v => setEditData({
      ...editData,
      age: v
    })} />
      <EditableStatCard label="الطول (سم)" value={editData.height} onChange={v => setEditData({
      ...editData,
      height: v
    })} />
      <EditableStatCard label="الوزن (كجم)" value={editData.weight} onChange={v => setEditData({
      ...editData,
      weight: v
    })} />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
        <p className="text-[var(--color-text-gray)] text-[11px] font-black uppercase mb-3 italic tracking-widest px-2">
          القدم المفضلة
        </p>
        <select value={editData.preferredFoot} onChange={e => setEditData({
        ...editData,
        preferredFoot: e.target.value
      })} className="bg-transparent border-b-2 border-white/10 w-full text-2xl font-black text-[var(--color-text-white)] italic focus:border-[var(--color-gold-main)] outline-none pb-2 px-2 appearance-none cursor-pointer">
          <option value="يمين" className="bg-[var(--color-bg-card)]">يمين</option>
          <option value="يسار" className="bg-[var(--color-bg-card)]">يسار</option>
          <option value="القدمين" className="bg-[var(--color-bg-card)]">القدمين</option>
        </select>
      </div>
      <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex flex-col justify-center">
        <p className="text-[var(--color-text-gray)] text-[11px] font-black uppercase mb-2 tracking-widest italic">
          التقييم الفني
        </p>
        <p className="text-3xl font-black text-[var(--color-gold-main)] italic tracking-tighter">
          {status === 'pending' ? '--' : `${user.player.rating} / 10`}
        </p>
      </div>
    </div>

    <EditableStatCard label="لينك فيديو مهاراتك (Google Drive / YouTube)" value={editData.videoUrl} onChange={v => setEditData({
    ...editData,
    videoUrl: v
  })} />

    <button onClick={handleSave} className="w-full bg-[var(--gold-gradient)] text-black font-black py-7 rounded-[2.5rem] shadow-[var(--gold-glow)] hover:scale-[1.01] active:scale-95 transition-all text-2xl uppercase border-b-8 border-black/20 italic">
      تحديث بيانات اللاعب
    </button>
  </div>;
export default PlayerEditForm;
