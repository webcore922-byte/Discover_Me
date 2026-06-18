import React, { useState, useEffect } from "react";
import { useStore } from "../../contexts/StoreContext/StoreContext";
import { Error } from "../../components/Error/Error";
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { load, error, handleError, setError,setLoad } = useStore();
  const order= async () => {
    try {
      const url = import.meta.env.VITE_API_URL;
      const req = await fetch(`${url}/orders`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const res = await req.json();
    const validOrders = (res || []).filter(o => o.date && o.total);

      setOrders(validOrders); 
      setLoad(false);
    } catch (e) {
      setError("خطأ في جلب الطلبات");
      setLoad(false);
    }
  };
  useEffect(() => {
  order()
  }, []);

  const getProgress = (status) => {
    switch (status) {
      case "قيد المراجعة":
        return { width: "25%", color: "bg-yellow-600" };
      case "تم التجهيز":
        return { width: "50%", color: "bg-blue-500" };
      case "في الطريق":
        return { width: "75%", color: "bg-purple-500" };
      case "تم التوصيل":
        return { width: "100%", color: "bg-green-500" };
      default:
        return { width: "10%", color: "bg-gray-500" };
    }
  };

  if (load)
    return (
      <div className="p-20 text-center text-white">جاري تحميل طلباتك...</div>
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] py-12 px-4 md:px-12 text-white">
      
    {error ? (
        <Error message={error} onRetry={order} />
      ) : (
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-10 text-[var(--color-gold-main)] border-b border-gray-700 pb-4">
            طلباتي
          </h1>

        {orders.length === 0 ? (
          <p className="text-gray-400 text-center">لا توجد طلبات حالياً.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-[var(--color-bg-card)] p-6 rounded-xl border border-[var(--color-border)] mb-6 shadow-lg"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-lg font-bold">طلب رقم: #{order.id}</p>
                  <p className="text-sm text-gray-400">
                    التاريخ: {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[var(--color-gold-main)] font-bold text-lg">
                    {order.total} EGP
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-300">حالة الطلب:</span>
                  <span className="font-bold text-[var(--color-gold-main)]">
                    {order.status}
                  </span>
                </div>

                <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getProgress(order.status).color}`}
                    style={{ width: getProgress(order.status).width }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>مراجعة</span>
                  <span>تجهيز</span>
                  <span>طريق</span>
                  <span>وصول</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      )}
    </div>
  );
};

export default MyOrders;
