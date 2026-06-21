import { useState } from "react";
import { Button, Input, Textarea, Typography, Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaSpinner } from "react-icons/fa";
const ErrorAlert = ({ message }) => (
  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 mb-6 animate-pulse">
    <FaExclamationTriangle className="text-xl text-red-500" />
    <span className="text-sm font-medium">{message}</span>
  </div>
);

const ContactStore = () => { 
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "الاسم مطلوب";
    if (!formData.email.trim() || !formData.email.includes("@")) tempErrors.email = "بريد إلكتروني صالح مطلوب";
    if (!formData.message.trim()) tempErrors.message = "يرجى كتابة تفاصيل المشكلة";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
setLoading(true);
    setServerError(null);

    try {
      const url = import.meta.env.VITE_API_URL;
      const req = await fetch(`${url}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, date: new Date().toISOString() }),
      });
      
      setOpen(true);
    } catch (err) {
      setServerError("عذراً، حدث خطأ في الاتصال بالسيرفر. يرجى المحاولة لاحقاً.");
  };
  }
  return (
    <>
    <div className="min-h-screen bg-[var(--color-bg-main)] py-20 px-4">
      <div className="container mx-auto max-w-2xl bg-[var(--color-bg-card)] p-10 rounded-xl border border-[var(--color-border)] shadow-xl">
        <Typography variant="h2" className="text-center text-[var(--color-gold-main)] mb-8">
          تواصل معنا
        </Typography>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <Input label="الاسم بالكامل" color="amber" className="text-white" error={!!errors.name}
              onChange={(e) => { setFormData({...formData, name: e.target.value}); if(errors.name) setErrors({...errors, name: null}) }} />
            {errors.name && <Typography color="red" className="text-xs mt-1">{errors.name}</Typography>}
          </div>

          <div>
            <Input label="البريد الإلكتروني" color="amber" className="text-white" error={!!errors.email}
              onChange={(e) => { setFormData({...formData, email: e.target.value}); if(errors.email) setErrors({...errors, email: null}) }} />
            {errors.email && <Typography color="red" className="text-xs mt-1">{errors.email}</Typography>}
          </div>

          <div>
            <Textarea label="تفاصيل المشكلة" color="amber" className="text-white" error={!!errors.message}
              onChange={(e) => { setFormData({...formData, message: e.target.value}); if(errors.message) setErrors({...errors, message: null}) }} />
            {errors.message && <Typography color="red" className="text-xs mt-1">{errors.message}</Typography>}
          </div>
<Button 
    type="submit" 
    disabled={loading} 
    className="bg-[var(--color-gold-main)] text-black font-bold text-lg w-full py-3 hover:scale-[1.02] transition-transform flex justify-center items-center gap-2"
  >
    {loading ? <><FaSpinner className="animate-spin" /> جاري الإرسال...</> : "إرسال المشكلة"}
  </Button>
           {serverError && <ErrorAlert message={serverError} />} 

        </form>
      </div>

      <Dialog open={open} handler={() => navigate("/")} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-4">
        <DialogBody className="text-center">
          <Typography variant="h3" className="text-[var(--color-gold-main)] mb-4">تم استلام مشكلتك!</Typography>
          <Typography className="text-white text-lg">شكراً لتواصلك، فريق الدعم سيعمل على حل المشكلة وسيرد عليك في أقرب وقت.</Typography>
        </DialogBody>
        <DialogFooter className="justify-center">
          <Button onClick={() => navigate("/store")} className="bg-[var(--color-gold-main)] text-black px-8 py-3">
            العودة للرئيسية
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
    </>
  );
};

export default ContactStore;