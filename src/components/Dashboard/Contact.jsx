import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Mail, User, MessageSquare, Trash2, Send, Inbox } from 'lucide-react';

// بيانات EmailJS - تأكد إن أسماء المتغيرات تحت (template_params) مطابقة
// لأسماء المتغيرات اللي عاملها في التمبليت بتاعك على EmailJS
const SERVICE_ID = "service_gcnbn55";
const TEMPLATE_ID = "template_t4iawyc";
const PUBLIC_KEY = "IrYz-yNKPjZh7J3t2";

const ContactSection = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/contact`)
      .then(res => res.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching contact messages:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (msg) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف رسالة "${msg.subject || 'بدون عنوان'}" نهائياً!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4444',
      cancelButtonColor: '#444',
      confirmButtonText: 'نعم، احذفها',
      cancelButtonText: 'إلغاء',
      background: '#1a1a1a',
      color: '#fff'
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/contact/${msg.id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== msg.id));
        Swal.fire({ title: 'تم حذف الرسالة', icon: 'success', background: '#1a1a1a', color: '#D4AF37' });
      } else {
        Swal.fire({ title: 'حدث خطأ أثناء الحذف', icon: 'error', background: '#1a1a1a' });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ title: 'حدث خطأ في الاتصال بالسيرفر', icon: 'error', background: '#1a1a1a' });
    }
  };

  const STATUS_OPTIONS = [
    { value: 'تم حل مشكلتك بنجاح', label: 'تم الرد على الرسالة' },
    { value: 'قيد المراجعة', label: 'قيد المراجعة' },
    { value: 'تم الحل', label: 'تم حل المشكلة' },
    { value: 'مرفوض', label: 'مرفوض' },
  ];

  const handleReply = async (msg) => {
    // 1) بوب أب فيه اختيار الحالة + تيكست اريا عشان الادمن يكتب الرد
    const { value: formValues } = await Swal.fire({
      title: `الرد على ${msg.name || 'العميل'}`,
      html: `
        <div dir="rtl" style="text-align:right">
          <label style="display:block;font-size:12px;font-weight:bold;color:#D4AF37;margin-bottom:6px;">حالة المشكلة</label>
          <select id="swal-status" class="swal2-select" style="width:100%;margin:0 0 14px;">
            ${STATUS_OPTIONS.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
          </select>
          <label style="display:block;font-size:12px;font-weight:bold;color:#D4AF37;margin-bottom:6px;">نص الرد</label>
          <textarea id="swal-message" class="swal2-textarea" style="width:100%;margin:0;" placeholder="اكتب ردك هنا...">مرحباً ${msg.name || ''}،\n\n</textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'إرسال الرد',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#D4AF37',
      cancelButtonColor: '#444',
      background: '#1a1a1a',
      color: '#fff',
      focusConfirm: false,
      preConfirm: () => {
        const status = document.getElementById('swal-status').value;
        const message = document.getElementById('swal-message').value;
        if (!message || !message.trim()) {
          Swal.showValidationMessage('لازم تكتب رد قبل الإرسال');
          return false;
        }
        return { status, message };
      }
    });

    if (!formValues) return; // المستخدم لغى العملية

    // 2) لودينج وهو بيبعت
    Swal.fire({
      title: 'جاري إرسال الرد...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: '#1a1a1a',
      color: '#fff',
      didOpen: () => Swal.showLoading()
    });

    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: {
            player_name: msg.name || 'عميلنا العزيز',
            status: formValues.status,
            message: formValues.message,
            player_email: msg.email,
          }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'فشل الإرسال');
      }

      // 3) بعد نجاح الإرسال، نشيل الرسالة من الباك إند ومن الداشبورد
      try {
        const delRes = await fetch(`${API_URL}/contact/${msg.id}`, { method: 'DELETE' });
        if (delRes.ok) {
          setMessages(prev => prev.filter(m => m.id !== msg.id));
        }
      } catch (delErr) {
        console.error("Delete after reply failed:", delErr);
      }

      await Swal.fire({
        title: 'تم إرسال الرد بنجاح',
        text: `تم إرسال ردك إلى ${msg.email}`,
        icon: 'success',
        confirmButtonText: 'تم',
        confirmButtonColor: '#D4AF37',
        background: '#1a1a1a',
        color: '#D4AF37'
      });
    } catch (err) {
      console.error("EmailJS error:", err);
      Swal.fire({
        title: 'حدث خطأ أثناء إرسال الرد',
        text: 'تأكد إن بيانات EmailJS (Service ID / Template ID / Public Key) صحيحة، أو حاول تاني.',
        icon: 'error',
        confirmButtonColor: '#D4AF37',
        background: '#1a1a1a',
        color: '#fff'
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-[#D4AF37] font-bold animate-pulse text-lg" dir="rtl">
        جاري تحميل رسائل التواصل...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-xl font-black text-[#D4AF37] flex items-center gap-2">
          <Inbox className="w-5 h-5" /> رسائل التواصل
        </h2>
        <div className="bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5 text-center min-w-[120px]">
          <p className="text-2xl font-black italic text-[#D4AF37]">{messages.length}</p>
          <p className="text-[10px] text-gray-400 font-bold">إجمالي الرسائل</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white/5 rounded-[2rem] border border-white/10 p-16 text-center">
          <Inbox className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-bold">لا توجد رسائل تواصل حتى الآن.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {messages.map(msg => (
            <div
              key={msg.id}
              className="bg-white/5 rounded-[2rem] border border-white/10 p-6 shadow-xl space-y-4 flex flex-col hover:border-[#D4AF37]/30 transition-all"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-black text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" /> {msg.name || 'غير معروف'}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" /> {msg.email}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(msg)}
                  className="text-red-400 hover:text-white hover:bg-red-600 p-2 rounded-lg transition-all shrink-0"
                  title="حذف الرسالة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-2 flex-1">
                <p className="text-xs text-[#D4AF37] font-bold flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> {msg.subject || 'بدون عنوان'}
                </p>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              </div>

              <button
                onClick={() => handleReply(msg)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#D4AF37] hover:bg-[#bfa032] text-black font-black rounded-xl text-xs transition-all"
              >
                <Send className="w-3.5 h-3.5" /> الرد على المشكلة
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactSection;