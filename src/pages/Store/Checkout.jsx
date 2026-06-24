import { useState, useEffect } from "react";
import { Button, Input, Typography, Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useStore } from "../../contexts/StoreContext/StoreContext";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaSpinner, FaMoneyBillWave, FaMobile, FaUniversity } from "react-icons/fa";

const ErrorAlert = ({ message }) => (
  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 mb-6">
    <FaExclamationTriangle className="text-xl text-red-500" />
    <span className="text-sm font-medium">{message}</span>
  </div>
);

const PAYMENT_METHODS = [
  {
    id: "cash",
    label: "الدفع عند الاستلام",
    icon: <FaMoneyBillWave />,
    description: "ادفع كاش لما الطلب يوصلك",
  },
  {
    id: "instapay",
    label: "إنستاباي",
    icon: <FaUniversity />,
    description: "حول على حساب إنستاباي",
    details: {
      name: "Kerolos Asaad Fahmy",
      number: "01206765845",
      note: "ابعت إيصال التحويل على واتساب بعد الدفع",
    },
  },
  {
    id: "wallet",
    label: "محفظة إلكترونية",
    icon: <FaMobile />,
    description: "فودافون كاش / اتصالات / أورنج",
    details: {
      name: "Kerolos Asaad Fahmy",
      number: "01034690210",
      note: "ابعت إيصال التحويل على واتساب بعد الدفع",
    },
  },
];

const Checkout = () => {
  const { cart, total, empty } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", paymentMethod: "cash" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    const fetchShipping = async () => {
      try {
        const url = import.meta.env.VITE_API_URL;
        const res = await fetch(`${url}/shippingRates`);
        const data = await res.json();
        setShippingRates(data);
      } catch {
        setServerError("تعذر تحميل أسعار الشحن");
      }
    };
    fetchShipping();
  }, []);

  const handleCityChange = (e) => {
    const found = shippingRates.find((r) => r.id == e.target.value);
    setSelectedCity(found || null);
    setShippingCost(found ? found.cost : 0);
    if (errors.city) setErrors((prev) => ({ ...prev, city: null }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "الاسم مطلوب";
    if (!formData.phone.trim()) tempErrors.phone = "رقم الهاتف مطلوب";
    if (!formData.address.trim()) tempErrors.address = "العنوان مطلوب";
    if (!selectedCity) tempErrors.city = "اختر المحافظة";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setConfirmOpen(true);
  };

  const handleConfirmOrder = async () => {
    setConfirmOpen(false);
    setLoading(true);
    setServerError(null);
    try {
      const url = import.meta.env.VITE_API_URL;
      const orderData = {
        ...formData,
        city: selectedCity.city,
        shippingCost,
        items: cart.map((i) => ({ id: i.id, name: i.name, price: i.price, count: i.count })),
        subtotal: total,
        total: total + shippingCost,
        date: new Date().toISOString(),
        userEmail: user?.email,
        status: "pending",
      };
      await fetch(`${url}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      setOpen(true);
    } catch {
      setServerError("حدث خطأ أثناء تأكيد الطلب، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    empty();
    navigate("/products");
  };

  const selectedPayment = PAYMENT_METHODS.find((m) => m.id === formData.paymentMethod);
  const grandTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-center text-3xl font-black text-[var(--color-gold-main)] mb-12">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Form */}
          <div className="bg-[var(--color-bg-card)] p-8 rounded-2xl border border-[var(--color-border)]">
            <h2 className="text-xl font-black text-white mb-6">تفاصيل الشحن</h2>
            <form onSubmit={handleSubmitClick} className="flex flex-col gap-5">

              {/* Name */}
              <div>
                <Input
                  label="الاسم بالكامل"
                  color="amber"
                  className="text-white"
                  error={!!errors.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors((p) => ({ ...p, name: null }));
                  }}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <Input
                  label="رقم الهاتف"
                  color="amber"
                  className="text-white"
                  error={!!errors.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors((p) => ({ ...p, phone: null }));
                  }}
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* City */}
              <div>
                <select
                  onChange={handleCityChange}
                  defaultValue=""
                  className={`w-full bg-transparent border ${errors.city ? "border-red-500" : "border-[var(--color-border)]"} text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-gold-main)] transition`}
                >
                  <option value="" disabled className="bg-[var(--color-bg-card)] text-gray-400">اختر المحافظة</option>
                  {shippingRates.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[var(--color-bg-card)] text-white">
                      {r.city} — {r.cost} EGP
                    </option>
                  ))}
                </select>
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>

              {/* Address */}
              <div>
                <Input
                  label="العنوان بالتفصيل"
                  color="amber"
                  className="text-white"
                  error={!!errors.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (errors.address) setErrors((p) => ({ ...p, address: null }));
                  }}
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* Payment Methods */}
              <div className="flex flex-col gap-3 mt-1">
                <p className="text-white font-bold text-sm">طريقة الدفع:</p>
                <div className="flex flex-col gap-2">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.paymentMethod === method.id
                          ? "border-[var(--color-gold-main)] bg-[var(--color-gold-main)]/10"
                          : "border-[var(--color-border)] hover:border-[var(--color-gold-main)]/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="accent-[var(--color-gold-main)]"
                      />
                      <span className="text-[var(--color-gold-main)]">{method.icon}</span>
                      <div>
                        <p className="text-white text-sm font-bold">{method.label}</p>
                        <p className="text-gray-500 text-xs">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Payment Details */}
                {selectedPayment?.details && (
                  <div className="bg-[var(--color-gold-main)]/5 border border-[var(--color-gold-main)]/30 rounded-xl p-4 flex flex-col gap-2 mt-1">
                    <p className="text-gray-400 text-xs">اسم الحساب: <span className="text-white font-bold">{selectedPayment.details.name}</span></p>
                    <p className="text-gray-400 text-xs">الرقم:
                      <span className="text-[var(--color-gold-main)] font-black text-sm mr-1 tracking-widest">
                        {selectedPayment.details.number}
                      </span>
                    </p>
                    <p className="text-yellow-500 text-xs font-bold">⚠️ {selectedPayment.details.note}</p>
                    <a
                      href="https://wa.me/201034690210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 mt-2 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-xs font-bold hover:bg-green-500/20 transition"
                    >
                      📲 ابعت الإيصال على واتساب
                    </a>
                  </div>
                )}
              </div>

              {serverError && <ErrorAlert message={serverError} />}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[var(--color-gold-main)] text-black font-black text-base rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <><FaSpinner className="animate-spin" /> جاري الطلب...</> : "تأكيد الطلب"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-[var(--color-bg-card)] p-8 rounded-2xl border border-[var(--color-border)] h-fit sticky top-24">
            <h2 className="text-xl font-black text-white mb-6">ملخص الطلب</h2>

            <div className="flex flex-col gap-3 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b border-[var(--color-border)] pb-3">
                  <span className="text-white font-medium">
                    {item.name}
                    <span className="text-gray-500 mr-1">× {item.count}</span>
                  </span>
                  <span className="text-[var(--color-gold-main)] font-bold">{item.price * item.count} EGP</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-400 mb-4">
              <div className="flex justify-between">
                <span>المنتجات</span>
                <span className="text-white font-bold">{total} EGP</span>
              </div>
              <div className="flex justify-between">
                <span>الشحن</span>
                <span className={`font-bold ${selectedCity ? "text-white" : "text-gray-600"}`}>
                  {selectedCity ? `${shippingCost} EGP` : "اختر المحافظة أولاً"}
                </span>
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] pt-4 flex justify-between items-center">
              <span className="text-white font-black text-lg">الإجمالي</span>
              <span className="text-[var(--color-gold-main)] font-black text-2xl">{grandTotal} EGP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} handler={() => setConfirmOpen(false)} className="bg-[var(--color-bg-card)] border border-[var(--color-border)]">
        <DialogBody className="text-center p-8">
          <div className="text-4xl mb-4">🛒</div>
          <h3 className="text-white text-xl font-black mb-2">تأكيد الطلب</h3>
          <p className="text-gray-400 text-sm">هل أنت متأكد إنك عايز تكمل الطلب؟</p>
          <p className="text-[var(--color-gold-main)] font-black text-lg mt-3">{total + shippingCost} EGP</p>
        </DialogBody>
        <DialogFooter className="justify-center gap-3 pb-6">
          <button
            onClick={() => setConfirmOpen(false)}
            className="px-6 py-2 border border-[var(--color-border)] text-gray-400 rounded-xl font-bold hover:bg-white/5 transition text-sm"
          >
            إلغاء
          </button>
          <button
            onClick={handleConfirmOrder}
            className="px-6 py-2 bg-[var(--color-gold-main)] text-black font-black rounded-xl hover:opacity-90 transition text-sm"
          >
            أيوه، أكد الطلب
          </button>
        </DialogFooter>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={open} handler={handleClose} className="bg-[var(--color-bg-card)] border border-[var(--color-border)]">
        <DialogBody className="text-center p-8">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-[var(--color-gold-main)] text-2xl font-black mb-3">تم الطلب بنجاح!</h3>
          <p className="text-white text-base">شكراً لثقتك بنا، سنقوم بتجهيز طلبك وتوصيله في أقرب وقت.</p>
          {formData.paymentMethod !== "cash" && (
            <p className="text-yellow-400 text-sm mt-3 font-bold">⚠️ لا تنسى ترسل إيصال التحويل على واتساب عشان يتأكد طلبك</p>
          )}
        </DialogBody>
        <DialogFooter className="justify-center pb-6">
          <button onClick={handleClose} className="px-8 py-3 bg-[var(--color-gold-main)] text-black font-black rounded-xl hover:opacity-90 transition">
            العودة للمتجر
          </button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Checkout;