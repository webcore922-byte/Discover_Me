import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Target, MapPin, Award, Medal, X, Ban, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../../../contexts/AuthContext/AuthContext.jsx';
import { Link } from 'react-router-dom';
const PrizesAndCompetitions = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [myAnnualSubmissions, setMyAnnualSubmissions] = useState([]);
  const [dismissedBanners, setDismissedBanners] = useState([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const playerData = user?.player || null;
      const role = user?.role; 
      const isAdmin = role === 'admin';
    const playerRole =!isAdmin && playerData;
  useEffect(() => {
    fetch(`${API_URL}/prizesAndCompetitions`)
      .then(res => res.json())
      .then(data => {
        const safeData = Array.isArray(data) ? data : (data.prizesAndCompetitions || []);
        setContests(safeData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // جلب طلبات مشاركة اللاعب الحالي عشان نعرضله نتيجة الفوز/الرفض
  useEffect(() => {
    if (!user?.email) return;
    fetch(`${API_URL}/contest-submissions?userEmail=${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => {
        setMySubmissions(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error fetching user submissions:", err));
  }, [user?.email]);

  // جلب طلبات مشاركة اللاعب الحالي في الدوري السنوي عشان نعرضله نتيجة القبول/الاستبعاد كمان
  useEffect(() => {
    if (!user?.email) return;
    fetch(`${API_URL}/annual-league-submissions?userEmail=${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => {
        setMyAnnualSubmissions(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error fetching user annual league submissions:", err));
  }, [user?.email]);

  const handleDismissBanner = (subId) => {
    setDismissedBanners(prev => [...prev, subId]);
  };

  const handleJoinContest = (title) => {
    // لو مفيش يوزر مسجل دخول، نوقف العملية ونطلب تسجيل الدخول
    if (!user) {
      Swal.fire({
        title: 'يجب تسجيل الدخول',
        text: 'سجّل دخولك أولاً لتتمكن من المشاركة في التحدي',
        icon: 'warning',
        background: '#1A1D1E',
        color: '#fff',
        confirmButtonColor: '#D4AF37',
        confirmButtonText: 'حسناً'
      });
      return;
    }

    Swal.fire({
      title: 'انضم للتحدي',
      text: `ارفع فيديو مهاراتك الفنية لتحدي "${title}" مباشرة؟`,
      input: 'url',
      inputPlaceholder: 'أدخل رابط فيديو مهاراتك هنا (Drive, YouTube, etc...)',
      showCancelButton: true,
      confirmButtonColor: '#D4AF37',
      cancelButtonColor: '#222',
      confirmButtonText: 'إرسال ومشاركة',
      cancelButtonText: 'إلغاء',
      background: '#1A1D1E',
      color: '#fff',
      inputValidator: (value) => {
        if (!value) return 'يجب إدخل رابط الفيديو للمشاركة المستحقة!';
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // إرسال البيانات
          const res = await fetch(`${API_URL}/contest-submissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userName: user.player?.name || user.username,
              userEmail: user.email,
              contestTitle: title,
              videoUrl: result.value,
            })
          });

          if (res.ok) {
            Swal.fire({
              title: 'تم تسجيل مشاركتك! ⚽',
              text: 'سيتم تقييم الفيديو الخاص بك وإدراج نقاطك بلوحة الشرف قريباً.',
              icon: 'success',
              background: '#1A1D1E',
              color: '#D4AF37'
            });
          } else {
            Swal.fire({
              title: 'حدث خطأ',
              text: 'لم يتم إرسال طلب المشاركة، حاول مرة أخرى.',
              icon: 'error',
              background: '#1A1D1E',
              color: '#fff'
            });
          }
        } catch (err) {
          console.error("Error submitting contest entry:", err);
          Swal.fire({
            title: 'حدث خطأ في الاتصال',
            text: 'تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
            icon: 'error',
            background: '#1A1D1E',
            color: '#fff'
          });
        }
      }
    });
  };

  // مشاركة الدوري السنوي: بتاخد بروفايل اليوزر كامل وتبعته بعد تأكيد موافقته
  const handleJoinAnnualLeague = (annual) => {
    // لو مفيش يوزر مسجل دخول، نوقف العملية ونطلب تسجيل الدخول
    if (!user) {
      Swal.fire({
        title: 'يجب تسجيل الدخول',
        text: 'سجّل دخولك أولاً لتتمكن من المشاركة في الدوري السنوي',
        icon: 'warning',
        background: '#1A1D1E',
        color: '#fff',
        confirmButtonColor: '#D4AF37',
        confirmButtonText: 'حسناً'
      });
      return;
    }

    // لازم يكون لاعب (مش أدمن) عشان يكون عنده بروفايل لاعب يتراجع
    if (!playerRole) {
      Swal.fire({
        title: 'غير مسموح',
        text: 'هذه الميزة مخصصة للاعبين فقط.',
        icon: 'error',
        background: '#1A1D1E',
        color: '#fff',
        confirmButtonColor: '#D4AF37'
      });
      return;
    }

    Swal.fire({
      title: 'تأكيد المشاركة في الدوري السنوي',
      html: `
        <p style="margin-bottom:8px;">
          بمجرد تأكيد المشاركة في "<strong style="color:#D4AF37">${annual.title}</strong>"،
          سيتم إرسال بياناتك وبروفايلك بالكامل للجهة المنظمة لمراجعتها واعتماد مشاركتك.
        </p>
        <p style="font-size:12px;color:#aaa;">هل توافق على المتابعة؟</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#D4AF37',
      cancelButtonColor: '#222',
      confirmButtonText: 'أوافق وأشارك',
      cancelButtonText: 'رفض',
      background: '#1A1D1E',
      color: '#fff'
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        // بنبعت بروفايل اليوزر بالكامل في object مختلف عن المسابقات العادية
        const res = await fetch(`${API_URL}/annual-league-submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leagueTitle: annual.title,
            leagueId: annual.id,
            userEmail: user.email,
            userName: user.player?.name || user.username,
            userage: user.player?.age || '',
            userlocation: user.player?.location || '',
            userrate: user.player?.rating || '',
            userskills: user.player?.skills || [],
            uservideo: user.player?.videoUrl || '',
          })
        });

        if (res.ok) {
          Swal.fire({
            title: 'تم تسجيل مشاركتك! 🏆',
            text: 'تم استلام بياناتك بنجاح، سيتم التواصل معك بخصوص الدوري السنوي قريباً.',
            icon: 'success',
            background: '#1A1D1E',
            color: '#D4AF37'
          });
        } else {
          Swal.fire({
            title: 'حدث خطأ',
            text: 'لم يتم إرسال طلب المشاركة، حاول مرة أخرى.',
            icon: 'error',
            background: '#1A1D1E',
            color: '#fff'
          });
        }
      } catch (err) {
        console.error("Error submitting annual league entry:", err);
        Swal.fire({
          title: 'حدث خطأ في الاتصال',
          text: 'تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
          icon: 'error',
          background: '#1A1D1E',
          color: '#fff'
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e1011] flex items-center justify-center text-[#D4AF37] font-bold">
        جاري تحميل منصة الجوائز...
      </div>
    );
  }

  const normalContests = contests.filter(item => !item.category || item.category.toLowerCase() === "normal");
  const annualLeagues = contests.filter(item => item.category && item.category.toLowerCase() === "annual");
  const monthlyPrizes = contests.filter(item => item.category && item.category.toLowerCase() === "monthly");

  const defaultNormalImg = "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=500";
  const defaultAnnualImg = "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=500";
  const defaultMonthlyImg = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=500";

  // توحيد بانرات نتيجة المشاركة (تحديات عادية + دوري سنوي) في مصفوفة واحدة عشان نعرضهم بنفس الشكل
  const normalResultBanners = mySubmissions
    .filter(sub => sub.status === 'won' || sub.status === 'rejected')
    .map(sub => ({
      bannerId: `normal-${sub.id}`,
      type: 'normal',
      status: sub.status,
      message: sub.status === 'won'
        ? `🎉 تهانينا! لقد فزت في "${sub.contestTitle}"${sub.awardedPrize ? ` بجائزة "${sub.awardedPrize.label}: ${sub.awardedPrize.value}"` : ''}. سيتم التواصل معك لاستلام جائزتك.`
        : `نأسف، لم يتم قبول مشاركتك في "${sub.contestTitle}" هذه المرة. حاول مرة أخرى في تحدٍ قادم!`
    }));

  // بانر الدوري السنوي بقى بيوضح بس إنه اتقبل للمشاركة أو اتم استبعاده - من غير ذكر جوايز
  const annualResultBanners = myAnnualSubmissions
    .filter(sub => sub.status === 'won' || sub.status === 'rejected')
    .map(sub => ({
      bannerId: `annual-${sub.id}`,
      type: 'annual',
      status: sub.status,
      message: sub.status === 'won'
        ? `✅ تم قبول مشاركتك في الدوري السنوي "${sub.leagueTitle}"! بالتوفيق.`
        : `نأسف، لم يتم قبول مشاركتك في الدوري السنوي "${sub.leagueTitle}" هذه المرة. حاول مرة أخرى في الدورة القادمة!`
    }));

  const resultBanners = [...normalResultBanners, ...annualResultBanners].filter(
    banner => !dismissedBanners.includes(banner.bannerId)
  );

  return (
    <div 
      className="min-h-screen  text-white py-12 px-4 md:px-8 lg:px-16 font-sans relative overflow-hidden bg-cover bg-center bg-no-repeat
     dark:bg-[url('/bg_prizes_and_competitions.jpeg')] bg-[url('/bg-prizesLight.png')] "
               
    >
      <div className="absolute inset-0 dark:bg-black/40  bg-black/5 backdrop-blur-[2px] pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto space-y-10 relative z-10">
        
        {/* هيدر الصفحة */}
        <div className="text-center space-y-2 max-w-3xl mx-auto pt-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#D4AF37] text-xl">✨</span>
            <h1 className="text-3xl md:text-5xl font-black tracking-wide dark:text-white text-[var(--color-gold-main)] drop-shadow-md">
              الجوائز والمسابقات
            </h1>
            <span className="text-[#D4AF37] text-xl">✨</span>
          </div>
          <p className="dark:text-gray-300 text-[var(--color-text-gray)] text-xs md:text-sm leading-relaxed font-light">
            نقدم بشكل دوري مسابقات وتحديات تهدف إلى تحفيز المستخدمين على تقديم أفضل ما لديهم، تتيح هذه المسابقات فرصاً للفوز بجوائز مميزة...
          </p>
        </div>

        {/* بانرات نتيجة المشاركة (فاز/قبول مشاركة / مرفوض) - تحديات عادية ودوري سنوي */}
        {resultBanners.map(banner => {
          const StatusIcon = banner.status === 'won'
            ? (banner.type === 'annual' ? Check : Trophy)
            : Ban;
          return (
            <div
              key={banner.bannerId}
              className={`rounded-2xl p-4 border flex items-center justify-between gap-3 shadow-lg ${
                banner.status === 'won'
                  ? 'bg-emerald-500/10 dark:border-emerald-500/30 border-[var(--color-text-gray)]'
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <StatusIcon className={`w-6 h-6 shrink-0 ${banner.status === 'won' ? 'dark:text-emerald-300 text-[var(--color-text-main)]' : 'text-red-400'}`} />
                <p className={`text-sm font-bold ${banner.status === 'won' ? 'dark:text-emerald-300 text-[var(--color-text-main)]' : 'text-red-300'}`}>
                  {banner.message}
                </p>
              </div>
              <button
                onClick={() => handleDismissBanner(banner.bannerId)}
                className="dark:text-gray-400 text-[var(--color-text-gray)] dark:hover:text-white shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        <div className="w-full space-y-10 overflow-hidden">
          
          {/* 1. شبكة المسابقات العادية (Normal) */}
          {normalContests.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-black dark:text-white text-[var(--color-gold-main)] border-r-4 border-[#D4AF37] pr-2">⚽ التحديات الحالية ومسابقات المهارة</h2>
              
              <div className="flex flex-row overflow-x-auto pb-4 pt-1 gap-5 scrollbar-thin scrollbar-thumb-[#D4AF37]/30 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:overflow-x-visible lg:w-full">
                {normalContests.map(item => (
                  <div 
                    key={String(item.id)} 
                    className="bg-[#16191b]/80 border border-[#D4AF37]/20 rounded-2xl p-4 flex flex-col justify-between group hover:border-[#D4AF37] transition-all duration-300 shadow-xl backdrop-blur-md min-w-[280px] lg:min-w-0"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs gap-2">
                        <h3 className="font-bold text-sm text-[#D4AF37] truncate">{item.title}</h3>
                        {item.location && (
                          <span className="bg-white/10 text-gray-300 px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1 border border-white/5 shrink-0">
                            <MapPin className="w-3 h-3 text-[#D4AF37]" /> {item.location}
                          </span>
                        )}
                      </div>

                      <div className="h-36 w-full rounded-xl overflow-hidden border border-white/5 relative">
                        <img src={item.image || defaultNormalImg} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>

                      <div className="space-y-2 text-[11px] bg-black/30 p-3 rounded-xl border border-white/5">
                        <div className="flex gap-1.5">
                          <Target className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <p className="text-gray-300 line-clamp-2"><strong className="text-white">الهدف:</strong> {item.goal}</p>
                        </div>
                        {item.duration && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                            <p className="text-gray-300"><strong className="text-white">الفترة:</strong> {item.duration}</p>
                          </div>
                        )}
                        {item.prizes && (
                          <div className="pt-1.5 border-t border-white/5 space-y-0.5">
                            <p className="text-[#D4AF37] font-bold flex items-center gap-1">
                              <Trophy className="w-3 h-3" /> الجوائز المعتمدة:
                            </p>
                            <div className="text-gray-400 pl-1 space-y-0.5 font-light">
                              {item.prizes.first && <p>• الأول: <span className="text-white font-medium">{item.prizes.first}</span></p>}
                              {item.prizes.second && <p>• الثاني: <span className="text-white font-medium">{item.prizes.second}</span></p>}
                              {item.prizes.grand && <p>• الكبرى: <span className="text-amber-400 font-bold">{item.prizes.grand}</span></p>}
                              {item.prizes.others && <p>• إضافية: <span className="text-gray-300 font-medium">{item.prizes.others}</span></p>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  {playerRole && (
                    <button 
                      onClick={() => handleJoinContest(item.title)}
                      className="w-full mt-4 py-2 bg-[#D4AF37] hover:bg-[#bfa032] text-black font-black rounded-lg text-xs tracking-wide shadow-md transition-colors"
                    >
                      شارك الآن
                    </button>)}
                  </div>
                ))}
              </div>
            </div>
          )}

{annualLeagues.length > 0 && (
  <div className="space-y-4 pt-2">
    <h2 className="text-lg font-black dark:text-white text-[var(--color-gold-main)] border-r-4 border-amber-500 pr-2">🏆 الدوري السنوي العام</h2>
    {annualLeagues.map(annual => (
      <div key={String(annual.id)} className="bg-[#16191b]/80 border border-[#D4AF37]/20 rounded-2xl p-5 flex flex-col gap-5 shadow-xl backdrop-blur-md">
        
        {/* الحاوية الأساسية للعناصر داخل البوكس */}
        <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
          
          <div className="flex flex-col md:flex-row gap-4 items-center flex-1 w-full">
            <div className="h-32 w-full md:w-56 rounded-xl overflow-hidden border border-white/5 shrink-0">
              <img src={annual.image || defaultAnnualImg} alt={annual.title} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2 text-center md:text-right w-full">
              <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                <h3 className="text-lg font-black text-white flex items-center gap-1.5 justify-center">
                  <Award className="w-5 h-5 text-[#D4AF37]" /> {annual.title}
                </h3>
                {annual.duration && (
                  <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-2.5 py-0.5 rounded-full w-fit mx-auto md:mx-0 font-bold">
                    {annual.duration}
                  </span>
                )}
              </div>
              <p className="text-gray-300 text-xs font-light max-w-2xl">
                {annual.goal}
              </p>
              {annual.prizes?.grand && (
                <p className="text-xs text-[#D4AF37] font-semibold">
                  🏆 الجائزة الكبرى للدوري: <span className="text-white font-normal">{annual.prizes.grand}</span>
                </p>
              )}
            </div>
          </div>
          
          {annual.leaderboard && annual.leaderboard.length > 0 && (
            <div className="w-full md:w-64 bg-black/40 border border-white/5 p-3 rounded-xl space-y-2 text-[11px] shrink-0">
              <p className="text-gray-400 font-bold border-b border-white/5 pb-1 flex items-center gap-1">📊 متصدري الدوري حالياً:</p>
              {annual.leaderboard.map((player, idx) => (
                <div key={idx} className="flex justify-between text-gray-300 bg-white/5 p-1.5 rounded mb-1 border border-white/[0.02]">
                  <span>{player.name}</span>
                  <span className="text-[#D4AF37] font-black"> {player.points}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* زر التسجيل داخل البوكس */}
       <div className="flex  justify-center md:justify-end">
     {playerRole &&
     <button 
    type="button"
    onClick={() => handleJoinAnnualLeague(annual)}
    className="w-full md:max-w-xs py-3 bg-[#D4AF37] hover:bg-[#b8962d] text-black font-black rounded-xl text-center transition-all duration-300 shadow-lg cursor-pointer"
  >
    شارك الآن في الدوري السنوي
  </button>}
</div>
      </div>
    ))}
  </div>
)}

          {/* 3. قسم الجوائز الشهرية الثابتة (Monthly) */}
          {monthlyPrizes.length > 0 && (
            <div className="space-y-4 pt-2">
              <h2 className="text-lg font-black dark:text-white text-[var(--color-gold-main)] border-r-4 border-purple-500 pr-2">⭐ تكريمات الجوائز الشهرية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {monthlyPrizes.map(monthly => (
                  <div key={String(monthly.id)} className="bg-[#16191b]/80 border border-[#D4AF37]/20 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between gap-4">
                    <div className="space-y-3 w-full">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                        <h3 className="text-base font-black text-[#D4AF37] flex items-center gap-2 justify-center md:justify-start">
                          <Medal className="w-5 h-5" /> {monthly.title}
                        </h3>
                        {monthly.image && (
                          <img src={monthly.image} alt="" className="w-16 h-10 object-cover rounded-lg border border-white/10" />
                        )}
                      </div>
                      <p className="text-gray-300 text-xs font-light text-center md:text-right">
                        {monthly.goal}
                      </p>
                      
                      {monthly.prizes && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          {monthly.prizes.first && (
                            <div className="bg-black/30 border border-white/5 p-2.5 rounded-xl text-center flex flex-col justify-center items-center min-h-[65px]">
                              <p className="text-[9px] text-amber-400 font-bold">🥇 الفئة الأولى</p>
                              <p className="text-[11px] text-white font-medium mt-1 leading-snug">{monthly.prizes.first}</p>
                            </div>
                          )}
                          {monthly.prizes.second && (
                            <div className="bg-black/30 border border-white/5 p-2.5 rounded-xl text-center flex flex-col justify-center items-center min-h-[65px]">
                              <p className="text-[9px] text-gray-300 font-bold">🥈 الفئة الثانية</p>
                              <p className="text-[11px] text-white font-medium mt-1 leading-snug">{monthly.prizes.second}</p>
                            </div>
                          )}
                          {monthly.prizes.others && (
                            <div className="bg-black/30 border border-white/5 p-2.5 rounded-xl text-center flex flex-col justify-center items-center min-h-[65px]">
                              <p className="text-[9px] text-purple-400 font-bold">🌟 التقديرية</p>
                              <p className="text-[11px] text-purple-300 font-medium mt-1 leading-snug">{monthly.prizes.others}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* فوتر المنصة */}
        <div className="text-center pt-6 border-t border-white/10 text-[11px] dark:text-gray-400  text-[var(--color-text-gray)] font-light">
          منصة اكتشفني تضمن تكافؤ الفرص لجميع المواهب الناشئة بمصر 🇪🇬
        </div>

      </div>
    </div>
  );
};

export default PrizesAndCompetitions;