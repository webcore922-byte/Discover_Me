import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, User, Mail, Crown, Trophy, Ban, Gift, Calendar, MapPin, Star, Video, Tag } from 'lucide-react';

// أسماء المهارات بالعربي، مهارات الفيفا كارد القياسية
const SKILL_LABELS = {
  pace: 'السرعة',
  shooting: 'التسديد',
  passing: 'التمرير',
  dribbling: 'المراوغة',
  defending: 'الدفاع',
  physical: 'القوة البدنية',
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'won':
      return (
        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/20 flex items-center gap-1 w-fit">
          <Trophy className="w-3.5 h-3.5" /> فاز بالدوري
        </span>
      );
    case 'rejected':
      return (
        <span className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-500/20 flex items-center gap-1 w-fit">
          <Ban className="w-3.5 h-3.5" /> مرفوض
        </span>
      );
    default:
      return (
        <span className="bg-gray-500/10 text-gray-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/5 w-fit">
          قيد المراجعة
        </span>
      );
  }
};

// بطاقة بسيطة لعرض حقل واحد (عمر / مكان / تقييم...)
const StatCard = ({ icon: Icon, label, value }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="bg-black/30 border border-white/5 rounded-xl p-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#D4AF37]" />
      </div>
      <div>
        <p className="text-[10px] text-gray-500 font-bold mb-0.5">{label}</p>
        <p className="text-sm text-white font-medium">{value}</p>
      </div>
    </div>
  );
};

// شريط تقدم لمهارة واحدة (مثلاً السرعة: 10 من 10)
const SkillBar = ({ label, value }) => {
  const numericValue = Number(value) || 0;
  const percent = Math.max(0, Math.min(100, (numericValue / 10) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-300 font-bold">{label}</span>
        <span className="text-[#D4AF37] font-black">{value}</span>
      </div>
      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full bg-gradient-to-l from-[#D4AF37] to-[#bfa032] rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const PlayerProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const submission = location.state?.submission;

  // مفيش بيانات وصلت للصفحة (مثلاً اليوزر فتح اللينك مباشرة من غير ما يدوس على "عرض البروفايل")
  if (!submission) {
    return (
      <div className="min-h-screen bg-[#0e1011] text-white flex flex-col items-center justify-center gap-4 px-4" dir="rtl">
        <User className="w-12 h-12 text-gray-600" />
        <p className="text-gray-400 font-bold text-sm">لا توجد بيانات بروفايل لعرضها.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 bg-[#D4AF37] text-black rounded-xl font-black text-sm hover:bg-[#bfa032] transition-all flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" /> العودة
        </button>
      </div>
    );
  }

  const {
    userName,
    userEmail,
    userage,
    userlocation,
    userrate,
    userskills,
    uservideo,
    leagueTitle,
    status,
    awardedPrize,
  } = submission;

  const displayName = userName || 'غير معروف';

  // userskills بييجي object فيه تقييمات لكل مهارة (pace, shooting...) - بنحولها لمصفوفة عشان نلفها بسهولة
  // وبنفضل ندعم الشكل القديم (مصفوفة أسماء مهارات) لو فيه بيانات قديمة بنفس الشكل ده
  const skillEntries = Array.isArray(userskills)
    ? userskills.filter(Boolean).map((skillName) => ({ key: skillName, label: skillName, value: null }))
    : (userskills && typeof userskills === 'object'
        ? Object.entries(userskills)
            .filter(([, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => ({ key, label: SKILL_LABELS[key] || key, value }))
        : []);

  return (
    <div className="min-h-screen bg-[#0e1011] text-white py-10 px-4 md:px-8 lg:px-16 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#D4AF37] transition-all font-bold"
        >
          <ArrowRight className="w-4 h-4" /> رجوع لقائمة المشاركين
        </button>

        {/* بطاقة الهيدر */}
        <div className="bg-[#16191b]/80 border border-[#D4AF37]/20 rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="w-24 h-24 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
            <span className="text-3xl font-black text-[#D4AF37]">
              {displayName?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <div className="flex-1 space-y-3 text-center md:text-right w-full">
            <h1 className="text-2xl font-black text-white">{displayName}</h1>
            <p className="text-gray-400 text-sm flex items-center gap-1.5 justify-center md:justify-start">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" /> {userEmail}
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1">
              {getStatusBadge(status)}
              {leagueTitle && (
                <span className="bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-500/20 flex items-center gap-1 w-fit">
                  <Crown className="w-3.5 h-3.5" /> {leagueTitle}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* الجائزة الممنوحة (لو فاز) */}
        {awardedPrize && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-3">
            <Gift className="w-6 h-6 text-emerald-400 shrink-0" />
            <p className="text-sm text-emerald-300 font-bold">
              الجائزة الممنوحة:{' '}
              <span className="text-white font-medium">
                {awardedPrize.label}: {awardedPrize.value}
              </span>
            </p>
          </div>
        )}

        {/* بيانات اللاعب */}
        <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6 shadow-2xl space-y-4">
          <h2 className="text-base font-black text-[#D4AF37] flex items-center gap-2">
            <User className="w-4 h-4" /> بيانات اللاعب
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <StatCard icon={Calendar} label="السن" value={userage} />
            <StatCard icon={MapPin} label="المكان" value={userlocation} />
            <StatCard icon={Star} label="التقييم" value={userrate} />
          </div>
        </div>

        {/* المهارات */}
        {skillEntries.length > 0 && (
          <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-black text-[#D4AF37] flex items-center gap-2">
              <Tag className="w-4 h-4" /> مهارات اللاعب
            </h2>
            {skillEntries[0].value !== null ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skillEntries.map((skill) => (
                  <SkillBar key={skill.key} label={skill.label} value={skill.value} />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skillEntries.map((skill) => (
                  <span
                    key={skill.key}
                    className="bg-black/30 border border-white/10 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    {skill.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* فيديو المهارات */}
        {uservideo && (
          <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-black text-[#D4AF37] flex items-center gap-2">
              <Video className="w-4 h-4" /> فيديو المهارات
            </h2>
            <a
              href={uservideo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] text-black rounded-xl font-bold text-sm hover:bg-[#bfa032] transition-all"
            >
              <Video className="w-4 h-4" /> مشاهدة الفيديو
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default PlayerProfile;