import React, { useState, useEffect } from "react";
import { useStore } from "../../contexts/StoreContext/StoreContext";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { Error } from "../../components/Error/Error";

const STATUS_MAP = {
  pending:    { label: "قيد المراجعة", width: "25%", color: "bg-yellow-500" },
  preparing:  { label: "تم التجهيز",   width: "50%", color: "bg-blue-500" },
  on_the_way: { label: "في الطريق",    width: "75%", color: "bg-purple-500" },
  delivered:  { label: "تم التوصيل",   width: "100%", color: "bg-green-500" },
};

const getProgress = (status) =>
  STATUS_MAP[status] || { label: status, width: "10%", color: "bg-gray-500" };

const PAYMENT_LABELS = {
  cash:     "الدفع عند الاستلام",
  instapay: "إنستاباي",
  wallet:   "محفظة إلكترونية",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { load, error, setError, setLoad } = useStore();
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoad(true);
      const url = import.meta.env.VITE_API_URL;
      const req = await fetch(`${url}/orders`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const res = await req.json();

      // فلتر الأوردرات بتاعت اليوزر الحالي بس
      const myOrders = (res || []).filter(
        (o) => o.userEmail === user?.email && o.date && o.total
      );

      // ترتيب من الأحدث للأقدم
      myOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

      setOrders(myOrders);
      setLoad(false);
    } catch (e) {
      setError("خطأ في جلب الطلبات");
      setLoad(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchOrders();
  }, [user]);

  if (load)
    return (
      <div className="min-h-screen bg-[var(--color-bg-main)] flex items-center justify-center text-white text-lg">
        جاري تحميل طلباتك...
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] py-12 px-4 md:px-12 text-white">
      {error ? (
        <Error message={error} onRetry={fetchOrders} />
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 border-b border-[var(--color-border)] pb-4">
            <h1 className="text-3xl font-black text-[var(--color-gold-main)]">طلباتي</h1>
            <p className="text-gray-500 text-sm mt-1">{orders.length} طلب</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="text-6xl">📦</div>
              <p className="text-gray-400 text-lg">لا توجد طلبات حالياً</p>
            </div>
          ) : (
            orders.map((order) => {
              const progress = getProgress(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-[var(--color-bg-card)] p-6 rounded-2xl border border-[var(--color-border)] mb-6 hover:border-[var(--color-gold-main)]/40 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <p className="font-black text-white text-lg">طلب #{order.id.slice(-6)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(order.date).toLocaleDateString("ar-EG", {
                          year: "numeric", month: "long", day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[var(--color-gold-main)] font-black text-xl">{order.total} EGP</p>
                      <p className="text-xs text-gray-500 mt-0.5">شحن: {order.shippingCost} EGP</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex flex-col gap-2 mb-5">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm bg-[var(--color-bg-main)] px-3 py-2 rounded-lg">
                        <span className="text-gray-300">{item.name} <span className="text-gray-600">× {item.count}</span></span>
                        <span className="text-white font-bold">{item.price * item.count} EGP</span>
                      </div>
                    ))}
                  </div>

                  {/* Info Row */}
                  <div className="flex flex-wrap gap-3 mb-5 text-xs">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                      📍 {order.city}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                      💳 {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                    </span>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-gray-400">حالة الطلب</span>
                      <span className={`font-black text-sm ${
                        order.status === "delivered" ? "text-green-400" :
                        order.status === "on_the_way" ? "text-purple-400" :
                        order.status === "preparing" ? "text-blue-400" :
                        "text-yellow-400"
                      }`}>
                        {progress.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${progress.color}`}
                        style={{ width: progress.width }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>مراجعة</span>
                      <span>تجهيز</span>
                      <span>طريق</span>
                      <span>وصول</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;