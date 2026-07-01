import React from 'react';

const ProfileHeader = ({
  user,
  isAdmin,
  adminType,
  editData,
  status,
  handleLogout,
  handleProfileImageChange,
}) => {
  const adminInitials = user.username
    ? user.username.trim().substring(0, 2).toUpperCase()
    : 'AD';

  const getStatusBadge = () => {
    if (!user.player) return null;
    const statusMap = {
      pending:        { bg: 'bg-yellow-500/20', text: 'text-yellow-500', border: 'border-yellow-500/30', label: 'Pending ⏳' },
      approved:       { bg: 'bg-green-500/20',  text: 'text-green-500',  border: 'border-green-500/30',  label: 'Approved ✅' },
      rejected:       { bg: 'bg-red-500/20',    text: 'text-red-500',    border: 'border-red-500/30',    label: 'Rejected ❌' },
      final_accepted: { bg: 'bg-blue-500/20',   text: 'text-blue-400',   border: 'border-blue-500/30',   label: 'Final Accepted 🏆' },
      final_rejected: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', label: 'Final Rejected 🚫' },
    };
    const s = statusMap[status] || statusMap['pending'];
    return (
      <span className={`px-5 py-2 rounded-full text-xs font-black uppercase border shadow-lg italic ${s.bg} ${s.text} ${s.border}`}>
        {s.label}
      </span>
    );
  };

  const getRoleLabel = () => {
    if (isAdmin) return `👑 مدير المنصة (${adminType})`;
    if (status === 'final_accepted') return `🏆 لاعب محترف: ${user.player?.position}`;
    if (user.player) return `⚽ لاعب: ${user.player?.position}`;
    if (status === 'pending') return `⏳ مستخدم (طلب لاعب: Pending)`;
    if (status === 'rejected') return `❌ مستخدم (طلب لاعب: Rejected)`;
    if (status === 'final_rejected') return `🚫 مستخدم (طلب لاعب: Final Rejected)`;
    return '👤 عضو (Member)';
  };

  return (
    <div className="glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-visible shadow-2xl">
      <div className="relative group">
        <input
          type="file"
          id="profile-upload"
          hidden
          accept="image/*"
          disabled={isAdmin}
          onChange={handleProfileImageChange}
        />
        <label
          htmlFor={!isAdmin ? 'profile-upload' : undefined}
          className={`block text-center ${!isAdmin ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <div className="relative">
            {isAdmin ? (
              <div className="w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-[var(--color-gold-main)] z-10 bg-black shadow-[var(--gold-glow)] flex items-center justify-center relative font-sans text-4xl md:text-5xl font-black text-[var(--color-gold-main)] italic tracking-wider">
                {adminInitials}
              </div>
            ) : (
              <>
                <img
                  src={
                    editData.image ||
                    (user.player ? user.player.image : user.image) ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                  }
                  className="w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-[var(--color-gold-main)] p-1.5 z-10 bg-black shadow-[var(--gold-glow)] object-cover relative transition-opacity group-hover:opacity-80"
                  alt="Profile"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <span className="text-white text-xs font-bold">تغيير الصورة</span>
                </div>
              </>
            )}
          </div>
          {!isAdmin && (
            <p className="text-[var(--color-gold-main)] text-[10px] font-black uppercase mt-3 tracking-widest italic opacity-70">
              اضغط لتغيير الصورة
            </p>
          )}
        </label>
      </div>

      <div className="flex-1 text-center md:text-right z-10 overflow-visible">
        <h1 className="text-5xl md:text-7xl font-black italic uppercase mb-10 tracking-tight leading-[1.2] inline-block text-gradient-gold">
          {user.player ? user.player.name : user.username}
        </h1>
        <div className="flex items-center gap-4 justify-center md:justify-start mt-2 flex-wrap">
          <span className="px-6 py-2 bg-gradient-to-r from-amber-500/30 to-yellow-500/20 border-2 border-[var(--color-gold-main)] rounded-full text-[var(--color-gold-main)] text-sm font-black uppercase tracking-widest italic shadow-[0_0_15px_rgba(212,175,55,0.3)] animate-pulse">
            {getRoleLabel()}
          </span>
          {!isAdmin && getStatusBadge()}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="px-10 py-4 bg-red-500/10 border-2 border-red-500/20 text-red-500 text-xs font-black rounded-2xl hover:bg-red-500 hover:text-white transition-all z-10 italic"
      >
        تسجيل الخروج
      </button>
    </div>
  );
};

export default ProfileHeader;