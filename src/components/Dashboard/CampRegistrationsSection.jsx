import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import { CheckCircle, XCircle, Clock, Users, Mail, Phone, Trophy } from 'lucide-react';

const API_URL     = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SERVICE_ID  = "service_gcnbn55";
const TEMPLATE_ID = "template_t4iawyc";
const PUBLIC_KEY  = "IrYz-yNKPjZh7J3t2";

// ── Badge الحالة ──────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    pending:  { bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',   icon: <Clock className="w-3 h-3" />,       label: 'قيد المراجعة' },
    accepted: { bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', icon: <CheckCircle className="w-3 h-3" />, label: 'مقبول' },
    rejected: { bg: 'bg-red-500/10 border-red-500/30 text-red-400',             icon: <XCircle className="w-3 h-3" />,     label: 'مرفوض' },
  };
  const s = styles[status] || styles.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg border ${s.bg}`}>
      {s.icon} {s.label}
    </span>
  );
};

// ── المكون الرئيسي ────────────────────────────────────────
const CampRegistrationsSection = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filterStatus, setFilterStatus]   = useState('all');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const res  = await fetch(`${API_URL}/campRegistrations`);
        const data = await res.json();
        setRegistrations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('خطأ في جلب الطلبات:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  // ── قبول أو رفض ──────────────────────────────────────
  const updateStatus = async (reg, newStatus) => {
    const isAccept = newStatus === 'accepted';

    const confirm = await Swal.fire({
      title: `<span style="color:#fff; font-size:18px;">${isAccept ? '✅ تأكيد القبول' : '❌ تأكيد الرفض'}</span>`,
      html: `
        <div dir="rtl" style="text-align:right; font-size:13px; color:#ccc; line-height:1.8;">
          هل تريد <strong style="color:${isAccept ? '#4ade80' : '#f87171'}">${isAccept ? 'قبول' : 'رفض'}</strong> 
          طلب <strong style="color:#fff;">${reg.playerName}</strong> 
          في معسكر <strong style="color:#d4af37;">${reg.campTitle}</strong>؟
          <br/>
          <span style="color:#aaa; font-size:11px;">
            ${isAccept ? '📧 سيتم إرسال إيميل قبول له تلقائياً.' : '📧 سيتم إرسال إيميل رفض له تلقائياً.'}
          </span>
        </div>
      `,
      icon: isAccept ? 'question' : 'warning',
      iconColor: isAccept ? '#4ade80' : '#f87171',
      background: 'rgba(14,16,17,0.98)',
      backdrop: 'rgba(0,0,0,0.85)',
      showCancelButton: true,
      confirmButtonText: isAccept ? 'نعم، اقبل الطلب' : 'نعم، ارفض الطلب',
      cancelButtonText: 'تراجع',
      confirmButtonColor: isAccept ? '#16a34a' : '#dc2626',
      cancelButtonColor: '#374151',
      customClass: { popup: 'rounded-2xl' }
    });

    if (!confirm.isConfirmed) return;

    // Loading أثناء الإرسال
    Swal.fire({
      title: '<span style="color:#fff; font-size:16px;">جاري تسجيل القرار وإرسال الإيميل...</span>',
      background: 'rgba(14,16,17,0.98)',
      backdrop: 'rgba(0,0,0,0.85)',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    try {
      // ١. تحديث الـ status في الـ API
      const res = await fetch(`${API_URL}/campRegistrations/${reg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('فشل تحديث الحالة');

      // ٢. إرسال الإيميل عبر EmailJS
      const templateParams = {
        player_email: reg.playerEmail,
        player_name:  reg.playerName,
        status:       isAccept ? 'مقبول في المعسكر 🏆' : 'معتذرين عن القبول ❌',
        message: isAccept
          ? `ألف مبروك يا بطل! 🎉 تم قبول طلبك في معسكر "${reg.campTitle}" بنجاح. سيتواصل معك المدرب المسؤول قريباً لتحديد موعد الانضمام. استعد لبدء رحلتك! ⚽🌟`
          : `شكراً لتقديمك في معسكر "${reg.campTitle}". للأسف لم يتم قبول طلبك في الوقت الحالي. لا تستسلم، طور من مهاراتك وحاول مرة أخرى قريباً! 💪🔥`,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      // ٣. تحديث الـ state محلياً
      setRegistrations(prev =>
        prev.map(r => r.id === reg.id ? { ...r, status: newStatus } : r)
      );

      Swal.fire({
        title: `<span style="color:${isAccept ? '#4ade80' : '#f87171'}; font-size:17px;">${isAccept ? '✅ تم القبول!' : '❌ تم الرفض!'}</span>`,
        html: `
          <div dir="rtl" style="text-align:right; font-size:13px; color:#ccc; line-height:1.8;">
            تم ${isAccept ? 'قبول' : 'رفض'} طلب <strong style="color:#fff;">${reg.playerName}</strong> بنجاح.
            <br/>
            <span style="color:#aaa; font-size:11px;">📧 تم إرسال إيميل إشعار على ${reg.playerEmail}</span>
          </div>
        `,
        icon: 'success',
        iconColor: isAccept ? '#4ade80' : '#f87171',
        background: 'rgba(14,16,17,0.98)',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#d4af37',
        customClass: { popup: 'rounded-2xl' }
      });

    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'حدث خطأ!',
        text: 'تعذر تحديث الحالة أو إرسال الإيميل، حاول مرة أخرى.',
        icon: 'error',
        background: 'rgba(14,16,17,0.98)',
        confirmButtonColor: '#d4af37',
      });
    }
  };

  // ── فلترة ────────────────────────────────────────────
  const filtered = filterStatus === 'all'
    ? registrations
    : registrations.filter(r => r.status === filterStatus);

  const counts = {
    all:      registrations.length,
    pending:  registrations.filter(r => r.status === 'pending').length,
    accepted: registrations.filter(r => r.status === 'accepted').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
  };

  if (loading) return (
    <div className="text-center py-20 text-sky-400 font-bold animate-pulse text-lg">
      جاري تحميل طلبات التسجيل...
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">

      {/* إحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: 'all',      label: 'إجمالي الطلبات', color: 'text-white',       border: 'border-white/10' },
          { key: 'pending',  label: 'قيد المراجعة',   color: 'text-yellow-400',  border: 'border-yellow-500/20' },
          { key: 'accepted', label: 'مقبولين',         color: 'text-emerald-400', border: 'border-emerald-500/20' },
          { key: 'rejected', label: 'مرفوضين',         color: 'text-red-400',     border: 'border-red-500/20' },
        ].map(s => (
          <div key={s.key} className={`bg-white/5 rounded-2xl border ${s.border} p-4 text-center`}>
            <p className="text-[10px] text-gray-400 mb-1 font-bold">{s.label}</p>
            <p className={`text-2xl font-black italic ${s.color}`}>{counts[s.key]}</p>
          </div>
        ))}
      </div>

      {/* فلتر */}
      <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 w-fit">
        {[
          { key: 'all',      label: '📋 الكل' },
          { key: 'pending',  label: '⏳ قيد المراجعة' },
          { key: 'accepted', label: '✅ المقبولين' },
          { key: 'rejected', label: '❌ المرفوضين' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              filterStatus === f.key ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* الجدول */}
      <div className="bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-white/5 text-sky-400 text-xs font-black">
                <th className="p-5">اللاعب</th>
                <th className="p-5">التواصل</th>
                <th className="p-5">المعسكر</th>
                <th className="p-5">تاريخ التسجيل</th>
                <th className="p-5 text-center">الحالة</th>
                <th className="p-5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-sm text-gray-500 font-bold">
                    لا توجد طلبات في هذا القسم حالياً.
                  </td>
                </tr>
              ) : (
                filtered.map(reg => (
                  <tr key={reg.id} className="hover:bg-white/[0.03] transition-all">

                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <p className="font-bold text-sm text-white">{reg.playerName}</p>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-300 flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-gray-500" /> {reg.playerEmail}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-gray-500" /> {reg.playerPhone}
                        </p>
                      </div>
                    </td>

                    <td className="p-5">
                      <span className="inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold px-3 py-1 rounded-xl">
                        <Trophy className="w-3 h-3" /> {reg.campTitle}
                      </span>
                    </td>

                    <td className="p-5 text-xs text-gray-400">
                      {reg.registeredAt
                        ? new Date(reg.registeredAt).toLocaleDateString('ar-EG', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })
                        : '—'}
                    </td>

                    <td className="p-5 text-center">
                      <StatusBadge status={reg.status} />
                    </td>

                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        {reg.status !== 'accepted' && (
                          <button
                            onClick={() => updateStatus(reg, 'accepted')}
                            className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all"
                          >
                            ✅ قبول
                          </button>
                        )}
                        {reg.status !== 'rejected' && (
                          <button
                            onClick={() => updateStatus(reg, 'rejected')}
                            className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                          >
                            ❌ رفض
                          </button>
                        )}
                        {reg.status === 'accepted' && reg.status !== 'rejected' && (
                          <span className="text-[10px] text-gray-600 font-bold">تم القبول</span>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampRegistrationsSection;