import React from 'react';

const EditableStatCard = ({ label, value, readOnly }) => (
  <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] mt-4">
    <p className="text-[var(--color-text-gray)] text-[11px] font-black uppercase mb-3 italic tracking-widest px-2">
      {label}
    </p>
    <input
      type="text"
      value={value}
      readOnly={readOnly}
      className="bg-transparent border-b-2 border-dashed border-white/5 opacity-70 cursor-not-allowed w-full text-2xl font-black text-white italic outline-none pb-2 px-2"
    />
  </div>
);

const AdminPanel = ({ adminType, editData }) => (
  <div className="space-y-8">
    <div className="bg-amber-500/10 border-2 border-[var(--color-gold-main)]/30 p-5 rounded-[2rem] text-[var(--color-gold-main)] font-black text-sm text-center italic tracking-wide shadow-lg">
      🛡️ لوحة التحكم والصلاحيات الفنية الخاصة بنوع الإدارة
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EditableStatCard label="المسمى الإداري (نوع الـ Role)" value={editData.currentClub} readOnly={true} />
      <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex flex-col justify-center">
        <p className="text-[var(--color-text-gray)] text-[11px] font-black uppercase mb-2 tracking-widest italic">
          مستوى الصلاحية بالنظام
        </p>
        <p className="text-3xl font-black text-[var(--color-gold-main)] italic tracking-tighter">
          صلاحيات كاملة لـ ({adminType})
        </p>
      </div>
    </div>
    <div className="glass-card rounded-[2.5rem] p-8 border border-white/10 text-center bg-white/[0.02]">
      <h2 className="text-xl font-black text-gradient-gold italic uppercase">
        نظام إدارة الكشافين نشط لـ ({adminType})
      </h2>
      <p className="text-white/40 mt-2 text-xs">
        يمكنك بصفتك ({adminType}) الإشراف الكامل، فحص طلبات اللاعبين، وتوزيع المهام الفنية والميدانية فوراً.
      </p>
    </div>
  </div>
);

export default AdminPanel;