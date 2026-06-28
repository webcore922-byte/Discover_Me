import React from 'react';

const InfoBox = ({ label, value }) => (
  <div className="flex flex-col gap-1 border-r-4 border-[var(--color-gold-main)]/30 pr-5">
    <span className="text-[var(--color-text-gray)] font-black text-[10px] uppercase tracking-widest italic block">
      {label}
    </span>
    <span className="text-white font-bold text-lg block italic">{value || '---'}</span>
  </div>
);

const AccountInfoCard = ({ user, isAdmin, adminType }) => (
  <div className="glass-card rounded-[2.5rem] p-10 border border-white/10 shadow-xl space-y-8">
    <h3 className="text-[var(--color-gold-main)] font-black text-base uppercase tracking-widest border-b border-white/5 pb-5 italic">
      بيانات الحساب الأساسية
    </h3>
    <div className="space-y-6">
      <InfoBox label="اسم المستخدم" value={user.username} />
      <InfoBox label="البريد الإلكتروني" value={user.email} />
      <InfoBox label="رقم الهاتف" value={user.phone} />
      <InfoBox
        label="صلاحية الحساب"
        value={isAdmin ? `حساب إداري (${adminType})` : 'حساب عضو عادي'}
      />
    </div>
  </div>
);

export default AccountInfoCard;