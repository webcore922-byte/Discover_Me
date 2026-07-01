import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Clock, Award, CheckCircle, XCircle, Hourglass } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../../../contexts/AuthContext/AuthContext';

const TrainingCamps = () => {
  const [camps, setCamps] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const playerData = user?.player || null;
  const role = user?.role;

  const isAdmin = role === 'admin';
  const playerRole = !isAdmin && playerData;

  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // =============================================
  // جلب المعسكرات + طلبات اللاعب
  // =============================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const campsRes = await fetch(`${apiURL}/camps`);
        if (!campsRes.ok) throw new Error('لم نتمكن من الاتصال بالخادم حالياً');
        const campsData = await campsRes.json();
        setCamps(Array.isArray(campsData) ? campsData : campsData.camps || []);

        if (playerRole && user?.email) {
          const regsRes = await fetch(`${apiURL}/campRegistrations`);
          if (regsRes.ok) {
            const allRegs = await regsRes.json();
            const mine = allRegs.filter(
              r => r.playerEmail?.toLowerCase() === user.email?.toLowerCase()
            );
            setMyRegistrations(mine);
          }
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        Swal.fire({
          title: '<span style="color: #fff; font-size: 22px;">عذراً، تعذر تحميل المعسكرات!</span>',
          html: '<p style="color: var(--color-text-gray); font-size: 15px;">يبدو أن هناك مشكلة في الاتصال بالـ API أو أن البيانات غير متوفرة حالياً.</p>',
          icon: 'error',
          iconColor: '#d4af37',
          background: 'rgba(26, 29, 30, 0.95)',
          backdrop: 'rgba(0, 0, 0, 0.8)',
          showCancelButton: true,
          confirmButtonText: 'إعادة المحاولة 🔄',
          cancelButtonText: 'العودة للصفحة السابقة 🔙',
          confirmButtonColor: 'var(--color-gold-main)',
          cancelButtonColor: '#333',
          customClass: {
            popup: 'glass-card gold-glow-border rounded-2xl',
            confirmButton: 'px-5 py-2 rounded-xl font-bold text-black',
            cancelButton: 'px-5 py-2 rounded-xl font-bold text-white'
          }
        }).then((result) => {
          if (result.isConfirmed) { setLoading(true); window.location.reload(); }
          else if (result.dismiss === Swal.DismissReason.cancel) window.history.back();
        });
      }
    };

    fetchData();
  }, []);

  // =============================================
  // مساعد: إيجاد طلب اللاعب لمعسكر معين
  // =============================================
  const getMyReg = (campId) =>
    myRegistrations.find(r => r.campId === campId) || null;

  // =============================================
  // Badge حالة الطلب
  // =============================================
  const StatusBadge = ({ status }) => {
    const map = {
      pending: {
        bg: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400',
        icon: <Hourglass className="w-3 h-3" />,
        label: 'طلبك قيد المراجعة ⏳'
      },
      accepted: {
        bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'تم قبولك في المعسكر 🎉'
      },
      rejected: {
        bg: 'bg-red-500/15 border-red-500/40 text-red-400',
        icon: <XCircle className="w-3 h-3" />,
        label: 'لم يتم قبول طلبك ❌'
      },
    };
    const s = map[status] || map.pending;
    return (
      <div className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold ${s.bg}`}>
        {s.icon}
        {s.label}
      </div>
    );
  };

  // =============================================
  // دالة التسجيل في المعسكر
  // =============================================
  const handleRegister = async (camp) => {
    const existing = getMyReg(camp.id);
    if (existing) return;

    const result = await Swal.fire({
      title: `<span style="color: #d4af37; font-size: 20px; font-weight: 800;">تأكيد التسجيل في المعسكر ⚽</span>`,
      html: `
        <div dir="rtl" style="text-align: right; font-family: inherit;">
          <div style="background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.25); border-radius: 12px; padding: 14px 16px; margin-bottom: 14px;">
            <p style="color: #d4af37; font-size: 13px; font-weight: 700; margin-bottom: 8px;">🏕️ المعسكر المختار</p>
            <p style="color: #fff; font-size: 15px; font-weight: 800; margin: 0;">${camp.title}</p>
            ${camp.subtitle ? `<p style="color: #aaa; font-size: 12px; margin: 4px 0 0;">${camp.subtitle}</p>` : ''}
          </div>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 16px; margin-bottom: 14px;">
            <p style="color: #d4af37; font-size: 13px; font-weight: 700; margin-bottom: 10px;">👤 بيانات اللاعب</p>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="color: #d4af37; font-size: 13px;">الاسم:</span>
              <span style="color: #fff; font-size: 13px; font-weight: 600;">${user?.username || '—'}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="color: #d4af37; font-size: 13px;">الإيميل:</span>
              <span style="color: #fff; font-size: 13px; font-weight: 600;">${user?.email || '—'}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #d4af37; font-size: 13px;">الموبايل:</span>
              <span style="color: #fff; font-size: 13px; font-weight: 600;">${user?.phone || '—'}</span>
            </div>
          </div>
          <div style="background: rgba(212,175,55,0.05); border-radius: 10px; padding: 10px 14px;">
            <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.7;">
              📋 سيتم إرسال بياناتك للمراجعة من قِبل الإدارة، وستصلك نتيجة الطلب على بريدك الإلكتروني.
            </p>
          </div>
        </div>
      `,
      icon: 'question',
      iconColor: '#d4af37',
      background: 'rgba(18, 20, 22, 0.97)',
      backdrop: 'rgba(0,0,0,0.85)',
      showCancelButton: true,
      confirmButtonText: '✅ تأكيد التسجيل',
      cancelButtonText: '❌ إلغاء',
      confirmButtonColor: '#d4af37',
      cancelButtonColor: '#333',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'px-6 py-2 rounded-xl font-bold text-black text-sm',
        cancelButton: 'px-6 py-2 rounded-xl font-bold text-white text-sm',
      }
    });

    if (!result.isConfirmed) return;

    try {
      const registrationData = {
        id: crypto.randomUUID(),
        campId: camp.id,
        campTitle: camp.title,
        playerName: user?.username,
        playerEmail: user?.email,
        playerPhone: user?.phone,
        status: 'pending',
        registeredAt: new Date().toISOString(),
      };

      const response = await fetch(`${apiURL}/campRegistrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) throw new Error('فشل الإرسال');

      setMyRegistrations(prev => [...prev, registrationData]);

      Swal.fire({
        title: '<span style="color: #d4af37; font-size: 20px;">تم إرسال طلبك بنجاح! 🎉</span>',
        html: `
          <div dir="rtl" style="text-align: right;">
            <p style="color: #ccc; font-size: 14px; line-height: 1.8; margin: 0;">
              تم استلام طلب تسجيلك في معسكر <strong style="color:#fff;">${camp.title}</strong> بنجاح.<br/>
              سيتم مراجعة بياناتك من قِبل الإدارة وستصلك النتيجة على إيميلك قريباً. ✉️
            </p>
          </div>
        `,
        icon: 'success',
        iconColor: '#d4af37',
        background: 'rgba(18, 20, 22, 0.97)',
        backdrop: 'rgba(0,0,0,0.85)',
        confirmButtonText: 'حسناً 👍',
        confirmButtonColor: '#d4af37',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'px-6 py-2 rounded-xl font-bold text-black text-sm',
        }
      });

    } catch (error) {
      Swal.fire({
        title: '<span style="color: #fff; font-size: 18px;">حدث خطأ أثناء التسجيل!</span>',
        html: '<p style="color: #aaa; font-size: 14px;">يرجى المحاولة مرة أخرى لاحقاً.</p>',
        icon: 'error',
        iconColor: '#d4af37',
        background: 'rgba(18, 20, 22, 0.97)',
        backdrop: 'rgba(0,0,0,0.85)',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#d4af37',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'px-6 py-2 rounded-xl font-bold text-black text-sm',
        }
      });
    }
  };

  // =============================================
  // دالة إعادة التقديم (بعد الرفض)
  // =============================================
  const handleReapply = async (camp) => {
    const existing = getMyReg(camp.id);
    if (!existing) return;

    const result = await Swal.fire({
      title: `<span style="color: #d4af37; font-size: 20px; font-weight: 800;">إعادة التقديم في المعسكر ⚽</span>`,
      html: `
        <div dir="rtl" style="text-align: right; font-family: inherit;">
          <div style="background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.25); border-radius: 12px; padding: 14px 16px; margin-bottom: 14px;">
            <p style="color: #d4af37; font-size: 13px; font-weight: 700; margin-bottom: 8px;">🏕️ المعسكر المختار</p>
            <p style="color: #fff; font-size: 15px; font-weight: 800; margin: 0;">${camp.title}</p>
            ${camp.subtitle ? `<p style="color: #aaa; font-size: 12px; margin: 4px 0 0;">${camp.subtitle}</p>` : ''}
          </div>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 16px; margin-bottom: 14px;">
            <p style="color: #ccc; font-size: 13px; line-height: 1.8; margin: 0;">
              هل تريد إعادة تقديم طلبك في هذا المعسكر؟<br/>
              سيتم حذف طلبك المرفوض وإرسال طلب جديد للمراجعة.
            </p>
          </div>
          <div style="background: rgba(212,175,55,0.05); border-radius: 10px; padding: 10px 14px;">
            <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.7;">
              📋 سيتم إرسال بياناتك للمراجعة من قِبل الإدارة مجدداً، وستصلك النتيجة على بريدك الإلكتروني.
            </p>
          </div>
        </div>
      `,
      icon: 'question',
      iconColor: '#d4af37',
      background: 'rgba(18, 20, 22, 0.97)',
      backdrop: 'rgba(0,0,0,0.85)',
      showCancelButton: true,
      confirmButtonText: '🔄 إعادة التقديم',
      cancelButtonText: '❌ إلغاء',
      confirmButtonColor: '#d4af37',
      cancelButtonColor: '#333',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'px-6 py-2 rounded-xl font-bold text-black text-sm',
        cancelButton: 'px-6 py-2 rounded-xl font-bold text-white text-sm',
      }
    });

    if (!result.isConfirmed) return;

    try {
      // حذف الطلب المرفوض القديم
      await fetch(`${apiURL}/campRegistrations/${existing.id}`, {
        method: 'DELETE',
      });

      // إنشاء طلب جديد
      const newRegistration = {
        id: crypto.randomUUID(),
        campId: camp.id,
        campTitle: camp.title,
        playerName: user?.username,
        playerEmail: user?.email,
        playerPhone: user?.phone,
        status: 'pending',
        registeredAt: new Date().toISOString(),
      };

      const response = await fetch(`${apiURL}/campRegistrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRegistration),
      });

      if (!response.ok) throw new Error('فشل الإرسال');

      // تحديث الـ state: احذف القديم وحط الجديد
      setMyRegistrations(prev => [
        ...prev.filter(r => r.id !== existing.id),
        newRegistration,
      ]);

      Swal.fire({
        title: '<span style="color: #d4af37; font-size: 20px;">تم إعادة التقديم بنجاح! 🎉</span>',
        html: `
          <div dir="rtl" style="text-align: right;">
            <p style="color: #ccc; font-size: 14px; line-height: 1.8; margin: 0;">
              تم إرسال طلبك الجديد في معسكر <strong style="color:#fff;">${camp.title}</strong> بنجاح.<br/>
              طلبك الآن قيد المراجعة وستصلك النتيجة على إيميلك قريباً. ✉️
            </p>
          </div>
        `,
        icon: 'success',
        iconColor: '#d4af37',
        background: 'rgba(18, 20, 22, 0.97)',
        backdrop: 'rgba(0,0,0,0.85)',
        confirmButtonText: 'حسناً 👍',
        confirmButtonColor: '#d4af37',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'px-6 py-2 rounded-xl font-bold text-black text-sm',
        }
      });

    } catch (error) {
      Swal.fire({
        title: '<span style="color: #fff; font-size: 18px;">حدث خطأ أثناء إعادة التقديم!</span>',
        html: '<p style="color: #aaa; font-size: 14px;">يرجى المحاولة مرة أخرى لاحقاً.</p>',
        icon: 'error',
        iconColor: '#d4af37',
        background: 'rgba(18, 20, 22, 0.97)',
        backdrop: 'rgba(0,0,0,0.85)',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#d4af37',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'px-6 py-2 rounded-xl font-bold text-black text-sm',
        }
      });
    }
  };

  // =============================================
  // Loading Screen
  // =============================================
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url('bg_prizes_and_competitions.jpeg')` }}
      >
        <div className="absolute inset-0 bg-black/80 pointer-events-none" />
        <div className="relative z-10 animate-spin-slow rounded-full h-16 w-16 border-t-2 border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  // =============================================
  // Main UI
  // =============================================
  return (
    <section
      dir="rtl"
      className="min-h-screen text-white py-16 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat bg-fixed overflow-hidden
      dark:bg-[url('/bg_prizes_and_competitions.jpeg')] bg-[url('/bg-prizesLight.png')] "
    >
      <div className="absolute inset-0 dark:bg-black/60 pointer-events-none z-0" />

      {/* الهيدر */}
      <div className="max-w-7xl mx-auto mb-16 text-center relative z-10">
        <div className="inline-block relative">
          <span className="absolute -top-6 -right-8 text-xl text-[#d4af37] opacity-70">✨</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-wide dark:text-white text-[--color-gold-main]">
            المعسكرات التدريبية
          </h2>
          <span className="absolute -bottom-2 -left-8 text-xl text-[#d4af37] opacity-70">✨</span>
        </div>
        <p className="mt-2 text-sm md:text-base max-w-md mx-auto" style={{ color: 'var(--color-text-gray)' }}>
          اختر المعسكر المناسب لك وانضم إلينا الآن لتطوير مهاراتك الرياضية
        </p>
      </div>

      {/* شبكة الكروت */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 mb-16">
        {camps.map((camp) => {
          const myReg = getMyReg(camp.id);

          return (
            <div
              key={camp.id}
              className="glass-card hover-gold-card card-shine rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative group"
            >
              <div>
                {/* صورة المعسكر */}
                <div className="w-full h-48 rounded-xl overflow-hidden mb-5 relative group">
                  <img
                    src={camp.image}
                    alt={camp.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=500"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                  {/* badge فوق الصورة */}
                  {myReg?.status === 'accepted' && (
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                      <CheckCircle className="w-3 h-3" /> مقبول
                    </div>
                  )}
                  {myReg?.status === 'rejected' && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                      <XCircle className="w-3 h-3" /> مرفوض
                    </div>
                  )}
                  {myReg?.status === 'pending' && (
                    <div className="absolute top-3 left-3 bg-yellow-500/90 text-black text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                      <Hourglass className="w-3 h-3" /> قيد المراجعة
                    </div>
                  )}
                </div>

                {/* عنوان الكارت */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold mb-1 text-white">{camp.title}</h3>
                  <h4 className="text-sm font-medium" style={{ color: 'var(--color-gold-main)' }}>
                    {camp.subtitle}
                  </h4>
                </div>

                {/* تفاصيل المعسكر */}
                <div className="space-y-3 text-right text-sm border-t border-gray-800/60 pt-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Award className="icon-gold w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">
                      <span className="text-[#d4af37] font-semibold pl-1">يركز على:</span>
                      {Array.isArray(camp.focus) ? camp.focus.join('، ') : camp.focus}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="icon-gold w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">
                      <span className="text-[#d4af37] font-semibold pl-1">المكان:</span>
                      {camp.location}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="icon-gold w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">
                      <span className="text-[#d4af37] font-semibold pl-1">المواعيد:</span>
                      {camp.schedule}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="icon-gold w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-400 text-xs leading-relaxed">
                      <span className="text-[#d4af37] text-sm font-semibold pl-1">التفاصيل:</span>
                      {camp.details}
                    </p>
                  </div>
                </div>
              </div>

              {/* الأزرار السفلية */}
              <div className="space-y-3 relative z-20">

                {playerRole && (
                  <>
                    {/* لو مفيش طلب → زرار التسجيل */}
                    {!myReg && (
                      <button
                        type="button"
                        onClick={() => handleRegister(camp)}
                        className="w-full py-3 px-4 rounded-xl font-extrabold text-black text-sm tracking-wide transition-all duration-300 relative z-20 cursor-pointer overflow-hidden group/btn block hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                        style={{ background: 'linear-gradient(to right, var(--color-btn-start), var(--color-btn-end))' }}
                      >
                        <span className="absolute inset-0 w-full h-full bg-white/25 transform -skew-x-12 -translate-x-full group-hover/btn:transition-transform group-hover/btn:duration-700 group-hover/btn:translate-x-full pointer-events-none" />
                        <span className="flex items-center justify-center gap-1.5 relative z-10">
                          سجل الآن في المعسكر ✨ ⚽
                        </span>
                      </button>
                    )}

                    {/* لو عنده طلب → badge الحالة + زرار إعادة التقديم لو مرفوض */}
                    {myReg && (
                      <div className="space-y-2">
                        <StatusBadge status={myReg.status} />

                        {myReg.status === 'rejected' && (
                          <button
                            type="button"
                            onClick={() => handleReapply(camp)}
                            className="w-full py-2.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 cursor-pointer border border-[#d4af37]/40 text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                          >
                            🔄 إعادة التقديم
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* قسم المدرب */}
                <div className="pt-2 border-t border-gray-800/60">
                  <div className="flex items-center justify-between bg-black/20 p-2 rounded-xl border border-gray-800/40">
                    <div className="text-right">
                      <p className="text-[10px]" style={{ color: 'var(--color-gold-main)' }}>المدرب المسؤول</p>
                      <p className="text-xs font-bold text-white">{camp.coach?.name}</p>
                    </div>
                    <img
                      src={camp.coach?.image}
                      alt={camp.coach?.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#a68946]"
                      style={{ borderColor: 'var(--color-border)' }}
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"; }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* فوتر */}
      <div className="text-center pt-6 border-t border-white/10 text-[11px] text-gray-400 font-light relative z-10">
        منصة اكتشفني تضمن تكافؤ الفرص لجميع المواهب الناشئة بمصر 🇪🇬
      </div>
    </section>
  );
};

export default TrainingCamps;