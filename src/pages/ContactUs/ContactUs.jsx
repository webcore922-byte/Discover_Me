import React, { useState } from "react";
import { Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";
const Icons = {
  Mail: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
  Map: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>,
  Send: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
};
const PROBLEM_TYPES = [{
  id: "general",
  label: "مشكلة عامة"
}, {
  id: "store",
  label: "مشكلة في المتجر"
}];
const ContactUs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: location.state?.type || "general"
  });
  const [errors, setErrors] = useState({});
  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "الاسم مطلوب";
    if (!formData.email.trim() || !formData.email.includes("@")) tempErrors.email = "بريد إلكتروني صالح مطلوب";
    if (!formData.subject.trim()) tempErrors.subject = "الموضوع مطلوب";
    if (!formData.message.trim()) tempErrors.message = "يرجى كتابة تفاصيل المشكلة";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError(null);
    try {
      const url = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      await fetch(`${url}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString()
        })
      });
      setOpen(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        type: "general"
      });
    } catch {
      setServerError("عذراً، حدث خطأ في الاتصال بالسيرفر. يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) setErrors(prev => ({
      ...prev,
      [field]: null
    }));
  };
  return <div className="min-h-screen bg-[var(--color-bg-main)] dark:text-[var(--color-text-white)] text-[var(--color-text-gray)] p-6 md:p-12 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">

        {}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 text-[var(--color-gold-main)]">
            تواصل معنا
          </h1>
          <p className="dark:text-gray-400 text-lg max-w-2xl mx-auto">
            هل لديك استفسار أو مشكلة؟ نحن هنا لمساعدتك.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {}
          <div className="lg:col-span-4">
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-8 rounded-2xl h-full">
              <h3 className="text-xl font-black mb-8 border-r-4 border-[var(--color-gold-main)] pr-4">معلوماتنا</h3>
              <div className="flex flex-col gap-7">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--color-bg-main)] rounded-xl border border-[var(--color-border)] text-[var(--color-gold-main)]">
                    <Icons.Mail />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">البريد الإلكتروني</p>
                    <p className="font-bold">support@ektshefny.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--color-bg-main)] rounded-xl border border-[var(--color-border)] text-[var(--color-gold-main)]">
                    <Icons.Phone />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">رقم الهاتف</p>
                    <p className="font-bold">+20 103 461 0910</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--color-bg-main)] rounded-xl border border-[var(--color-border)] text-[var(--color-gold-main)]">
                    <Icons.Map />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">الموقع</p>
                    <p className="font-bold">القاهرة، مصر</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="lg:col-span-8">
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-8 md:p-10 rounded-2xl">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {}
                <div className="flex flex-col gap-2">
                  <label className="text-xs dark:text-gray-400 uppercase tracking-widest">نوع المشكلة</label>
                  <div className="flex gap-3">
                    {PROBLEM_TYPES.map(type => <label key={type.id} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-sm font-bold ${formData.type === type.id ? "border-[var(--color-gold-main)] bg-[var(--color-gold-main)]/10 text-[var(--color-gold-main)]" : "border-[var(--color-border)] dark:text-gray-400 hover:border-[var(--color-gold-main)]/40"}`}>
                        <input type="radio" name="type" value={type.id} checked={formData.type === type.id} onChange={e => handleChange("type", e.target.value)} className="hidden" />
                        {type.label}
                      </label>)}
                  </div>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs dark:text-gray-400 uppercase tracking-widest block mb-2">الاسم الكامل</label>
                    <input type="text" value={formData.name} onChange={e => handleChange("name", e.target.value)} className={`w-full bg-[var(--color-bg-main)] border ${errors.name ? "border-red-500" : "border-[var(--color-border)]"} rounded-xl p-3 dark:text-[var(--color-text-white)] text-sm outline-none focus:border-[var(--color-gold-main)] transition`} placeholder="أدخل اسمك..." />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-xs dark:text-gray-400 uppercase tracking-widest block mb-2">البريد الإلكتروني</label>
                    <input type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} className={`w-full bg-[var(--color-bg-main)] border ${errors.email ? "border-red-500" : "border-[var(--color-border)]"} rounded-xl p-3 dark:text-[var(--color-text-white)] text-sm outline-none focus:border-[var(--color-gold-main)] transition text-left`} placeholder="email@example.com" />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {}
                <div>
                  <label className="text-xs dark:text-gray-400 uppercase tracking-widest block mb-2">الموضوع</label>
                  <input type="text" value={formData.subject} onChange={e => handleChange("subject", e.target.value)} className={`w-full bg-[var(--color-bg-main)] border ${errors.subject ? "border-red-500" : "border-[var(--color-border)]"} rounded-xl p-3 dark:text-[var(--color-text-white)] text-sm outline-none focus:border-[var(--color-gold-main)] transition`} placeholder="سبب التواصل..." />
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                </div>

                {}
                <div>
                  <label className="text-xs dark:text-gray-400 uppercase tracking-widest block mb-2">تفاصيل المشكلة</label>
                  <textarea rows="5" value={formData.message} onChange={e => handleChange("message", e.target.value)} className={`w-full bg-[var(--color-bg-main)] border ${errors.message ? "border-red-500" : "border-[var(--color-border)]"} rounded-xl p-3 dark:text-[var(--color-text-white)] text-sm outline-none focus:border-[var(--color-gold-main)] transition resize-none`} placeholder="اكتب تفاصيل مشكلتك هنا..." />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>

                {serverError && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                    <FaExclamationTriangle />
                    {serverError}
                  </div>}

                <button type="submit" disabled={loading} className="w-full py-4 bg-[var(--color-gold-main)] text-black font-black text-base rounded-xl hover:opacity-90 transition flex items-center justify-center gap-3 disabled:opacity-50">
                  {loading ? <><FaSpinner className="animate-spin" /> جاري الإرسال...</> : <><span>إرسال المشكلة</span><Icons.Send /></>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {}
      <Dialog open={open} handler={() => setOpen(false)} className="bg-[var(--color-bg-card)] border border-[var(--color-border)]">
        <DialogBody className="text-center p-8">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-[var(--color-gold-main)] text-2xl font-black mb-3">تم استلام مشكلتك!</h3>
          <p className="dark:text-[var(--color-text-white)] text-[var(--color-text-gray)]">شكراً لتواصلك، فريق الدعم سيرد عليك في أقرب وقت.</p>
        </DialogBody>
        <DialogFooter className="justify-center pb-6">
          <button onClick={() => {
          setOpen(false);
          navigate("/");
        }} className="px-8 py-3 bg-[var(--color-gold-main)] text-black font-black rounded-xl hover:opacity-90 transition">
            العودة للرئيسية
          </button>
        </DialogFooter>
      </Dialog>
    </div>;
};
export default ContactUs;
