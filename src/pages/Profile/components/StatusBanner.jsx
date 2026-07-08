import React from 'react';
const StatusBanner = ({
  user,
  status,
  showCongrats,
  isPlayer
}) => {
  if (!user.player) return null;
  if (showCongrats && isPlayer && status === 'approved') {
    return <div className="bg-green-500/20 border-2 border-green-500/40 p-8 rounded-[2.5rem] text-center shadow-[0_0_30px_rgba(34,197,94,0.2)] animate-pulse">
        <h2 className="text-2xl font-black text-green-500 uppercase tracking-tighter italic">
          ✅ ألف مبروك يا كابتن! تم قبولك رسمياً كلاعب معتمد
        </h2>
      </div>;
  }
  if (showCongrats && isPlayer && status === 'final_accepted') {
    return <div className="bg-blue-500/20 border-2 border-blue-500/40 p-8 rounded-[2.5rem] text-center shadow-[0_0_30px_rgba(59,130,246,0.2)] animate-pulse">
        <h2 className="text-2xl font-black text-blue-400 uppercase tracking-tighter italic">
          🏆 مبروك يا أسطورة! تم قبولك نهائياً كلاعب محترف
        </h2>
      </div>;
  }
  if (status === 'pending') {
    return <div className="p-6 rounded-[2rem] border text-center shadow-xl bg-yellow-500/10 border-yellow-500/20 text-yellow-500">
        <p className="font-black italic text-lg uppercase tracking-tighter">
          ⚠️ ملفك الشخصي قيد المراجعة الفنية.. سيتم تفعيلك فور انتهاء التقييم.
        </p>
      </div>;
  }
  if (status === 'rejected') {
    return <div className="p-6 rounded-[2rem] border text-center shadow-xl bg-red-500/10 border-red-500/20 text-red-500">
        <p className="font-black italic text-lg uppercase tracking-tighter">
          ❌ تم رفض طلبك: {user.player.rejectionReason || 'برجاء مراجعة بياناتك مهارياً.'}
        </p>
      </div>;
  }
  if (status === 'final_rejected') {
    return <div className="p-6 rounded-[2rem] border text-center shadow-xl bg-orange-500/10 border-orange-500/20 text-orange-400 space-y-3">
        <p className="font-black italic text-xl uppercase tracking-tighter">
          🚫 للأسف لم تجتز الاختبار هذه المرة
        </p>
        {user.player.rejectionReason && <p className="text-sm font-bold opacity-80">
            السبب: {user.player.rejectionReason}
          </p>}
        <p className="text-sm font-bold opacity-70 leading-relaxed">
          💪 لا تستسلم! اعمل على تطوير مهاراتك وحسّن مستواك الفني، ثم أعد التقديم على الاختبار مرة أخرى.
          <br />
          كل أسطورة بدأت من الصفر — المثابرة هي الفرق.
        </p>
      </div>;
  }
  return null;
};
export default StatusBanner;
