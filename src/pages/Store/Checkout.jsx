import { useState } from "react";
import { Button, Input, Typography, Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useStore } from "../../contexts/StoreContext/StoreContext";
import { useNavigate } from "react-router-dom";
import {FaExclamationTriangle,  FaSpinner } from "react-icons/fa";
const ErrorAlert = ({ message }) => (
  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 mb-6 animate-pulse">
    <FaExclamationTriangle className="text-xl text-red-500" />
    <span className="text-sm font-medium">{message}</span>
  </div>
);
const Checkout = () => {
  const { cart, total, empty } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" ,paymentMethod: "cash"});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "الاسم مطلوب";
    if (!formData.phone.trim()) tempErrors.phone = "رقم الهاتف مطلوب";
    if (!formData.address.trim()) tempErrors.address = "العنوان مطلوب";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;
setLoading(true);
    setServerError(null);
try {
      const orderData = { ...formData, items: cart, total, date: new Date().toISOString(), status: "قيد المراجعة" }
     const url = import.meta.env.VITE_API_URL;
      const req = await fetch(`${url}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      setOpen(true);
    } catch (err) {
      setServerError("حدث خطأ أثناء تأكيد الطلب، يرجى المحاولة مرة أخرى.");
    }}
  const handleClose = () => {
    empty();
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <Typography variant="h2" className="text-center text-[var(--color-gold-main)] mb-12">
          إتمام الطلب
        </Typography>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-[var(--color-bg-card)] p-8 rounded-xl border border-[var(--color-border)] shadow-xl">
            <Typography variant="h4" className="mb-6 text-white">تفاصيل الشحن</Typography>
            <form onSubmit={handleConfirmOrder} className="flex flex-col gap-6">
              <div>
                <Input label="الاسم بالكامل" color="amber" className="text-white" error={!!errors.name} 
                  onChange={(e) => {
                    setFormData({...formData, name: e.target.value});
                    if (errors.name) setErrors(prev => ({...prev, name: null}));
                  }} />
                {errors.name && <Typography color="red" className="text-xs mt-1">{errors.name}</Typography>}
              </div>
              
              <div>
                <Input label="رقم الهاتف" color="amber" className="text-white" error={!!errors.phone} 
                  onChange={(e) => {
                    setFormData({...formData, phone: e.target.value});
                    if (errors.phone) setErrors(prev => ({...prev, phone: null}));
                  }} />
                {errors.phone && <Typography color="red" className="text-xs mt-1">{errors.phone}</Typography>}
              </div>
              
              <div>
                <Input label="العنوان بالتفصيل" color="amber" className="text-white" error={!!errors.address} 
                  onChange={(e) => {
                    setFormData({...formData, address: e.target.value});
                    if (errors.address) setErrors(prev => ({...prev, address: null}));
                  }} />
                {errors.address && <Typography color="red" className="text-xs mt-1">{errors.address}</Typography>}
              </div>

<div className="flex flex-col gap-3 mt-2">
    <Typography className="text-white font-medium text-sm">طريقة الدفع:</Typography>
    <div className="flex gap-4">
      <label className="flex items-center gap-2 text-white cursor-pointer hover:text-[var(--color-gold-main)] transition-colors">
        <input 
          type="radio" 
          name="paymentMethod" 
          value="cash" 
          checked={formData.paymentMethod === "cash"}
          onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
          className="accent-[var(--color-gold-main)]"/>
        الدفع عند الاستلام
      </label>
    </div>
  </div>
             <Button 
        type="submit" 
        disabled={loading} 
        className="bg-[var(--color-gold-main)] text-black font-bold text-lg w-full py-3 hover:scale-[1.02] transition-transform flex justify-center items-center gap-2">
        {loading ? <><FaSpinner className="animate-spin" /> جاري الطلب...</> : "تأكيد الطلب"}
      </Button>
      {serverError && <ErrorAlert message={serverError} />}
            </form>
          </div>
          <div className="bg-[var(--color-bg-card)] p-8 rounded-xl border border-[var(--color-border)] shadow-xl h-fit">
            <Typography variant="h4" className="mb-6 text-white">ملخص السلة</Typography>
            <div className="flex flex-col gap-4 mb-8">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-white border-b border-gray-700 pb-4">
                  <span className="font-medium">{item.name} <span className="text-gray-400">× {item.quantity || 1}</span></span>
                  <span className="text-[var(--color-gold-main)]">{(item.price - (item.discount || 0)) * (item.quantity || 1)} EGP</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-600">
              <Typography variant="h5" className="text-white">الإجمالي:</Typography>
              <Typography variant="h4" className="text-[var(--color-gold-main)]">{total} EGP</Typography>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={open} handler={handleClose} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-4">
        <DialogBody className="text-center">
          <Typography variant="h3" className="text-[var(--color-gold-main)] mb-4">تم الطلب بنجاح!</Typography>
          <Typography className="text-white text-lg">شكراً لثقتك بنا، سنقوم بتجهيز طلبك وتوصيله في أقرب وقت.</Typography>
        </DialogBody>
        <DialogFooter className="justify-center">
          <Button onClick={handleClose} className="bg-[var(--color-gold-main)] text-black px-8 py-3">
            العودة للمتجر
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
   
  );
};

export default Checkout;