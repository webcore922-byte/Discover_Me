import React from 'react';
import { useStore } from "../../contexts/StoreContext/StoreContext";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowRight } from "react-icons/fa";
const Cart = () => {
  const {
    cart,
    increment,
    decrement,
    del,
    empty,
    total,
    setSelectcategory,
    updateQuantity
  } = useStore();
  if (cart.length === 0) {
    return <div className="min-h-screen bg-[var(--color-bg-main)] flex flex-col items-center justify-center text-[var(--color-text-white)] gap-6">
        <div className="w-28 h-28 rounded-full dark:bg-white/5 bg-gray-300 border border-white/10 flex items-center justify-center">
          <FaShoppingCart className="text-5xl text-gray-600" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold dark:text-[var(--color-text-white)] text-[var(--color-text-gray)] mb-2">سلتك فارغة</h2>
          <p className="dark:text-gray-400 text-[var(--color-text-gray)] text-sm">أضف منتجات وارجع هنا لإتمام طلبك</p>
        </div>
        <Link to="/products" onClick={() => setSelectcategory(null)} className="flex items-center gap-2 px-6 py-3 bg-[var(--color-gold-main)] text-black font-bold rounded-xl hover:opacity-90 transition">
          <FaArrowRight className="text-sm" />
          تسوق الآن
        </Link>
      </div>;
  }
  return <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-white)] py-12 px-4 md:px-12">
      <div className="max-w-6xl mx-auto">

        {}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-gold-main)]">سلة المشتريات</h1>
            <p className="text-gray-500 text-sm mt-1">{cart.length} منتج</p>
          </div>
          <button onClick={empty} className="flex items-center gap-2 px-4 py-2 border border-red-500/40 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500/10 transition">
            <FaTrash className="text-xs" />
            مسح الكل
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map(({
            id,
            image,
            name,
            price,
            count
          }) => <div key={id} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 hover:border-[var(--color-gold-main)]/40 transition-all duration-300">
                {}
                <div className="w-20 h-20 rounded-xl bg-white flex-shrink-0 overflow-hidden">
                  <img src={image} alt={name} className="w-full h-full object-contain p-1" />
                </div>

                {}
                <div className="flex-1 text-center sm:text-right">
                  <p className="font-bold dark:text-[var(--color-text-white)] text-[var(--color-text-gray)] line-clamp-2 mb-1">{name}</p>
                  <p className="text-[var(--color-gold-main)] font-black text-lg">{price} EGP</p>
                </div>

                {}
                <div className="flex items-center gap-1 bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                  <button onClick={() => decrement(id)} className="w-9 h-9 flex items-center justify-center text-[var(--color-gold-main)] hover:bg-white/5 transition">
                    <FaMinus className="text-xs" />
                  </button>

                  <input type="number" min="1" value={count} onChange={e => {
                const val = parseInt(e.target.value);
                updateQuantity(id, isNaN(val) || val < 1 ? 1 : val);
              }} onBlur={e => {
                const val = parseInt(e.target.value);
                if (isNaN(val) || val < 1) updateQuantity(id, 1);
              }} className="w-12 bg-transparent dark:text-[var(--color-text-white)] text-[var(--color-text-gray)] text-center font-bold text-sm outline-none
                      [appearance:textfield]
                      [&::-webkit-outer-spin-button]:appearance-none
                      [&::-webkit-inner-spin-button]:appearance-none" />

                  <button onClick={() => increment(id)} className="w-9 h-9 flex items-center justify-center text-[var(--color-gold-main)] hover:bg-white/5 transition">
                    <FaPlus className="text-xs" />
                  </button>
                </div>

                {}
                <div className="flex flex-col items-center gap-2 min-w-[70px]">
                  <p className="dark:text-[var(--color-text-white)] text-[var(--color-text-gray)] font-bold text-sm">{(price * count).toLocaleString()} EGP</p>
                  <button onClick={() => del(id)} className="text-gray-600 hover:text-red-500 transition p-1">
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>)}
          </div>

          {}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[var(--color-bg-card)] border border-[var(--color-gold-main)]/30 rounded-2xl p-6 flex flex-col gap-5">
              <h3 className="text-xl font-black dark:text-[var(--color-text-white)] text-[var(--color-text-gray)]">ملخص الطلب</h3>

              <div className="flex flex-col gap-3 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>عدد المنتجات</span>
                  <span className="dark:text-[var(--color-text-white)] text-[var(--color-text-gray)] font-bold">{cart.reduce((acc, i) => acc + i.count, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>الشحن</span>
                  <span className="dark:text-gray-500 text-[var(--color-text-gray)] font-bold">يحدد عند الطلب</span>
                </div>
               
              </div>

              <div className="border-t border-[var(--color-border)] pt-4 flex justify-between items-center">
                <span className="dark:text-gray-300 text-[var(--color-text-gray)] font-bold">الإجمالي</span>
                <span className="text-[var(--color-gold-main)] font-black text-2xl">{total.toLocaleString()} EGP</span>
              </div>

              <Link to="/checkout" className="block">
                <button className="w-full py-3 bg-[var(--color-gold-main)] text-black font-black text-base rounded-xl hover:opacity-90 transition">
                  إتمام الشراء
                </button>
              </Link>

              <Link to="/products" onClick={() => setSelectcategory(null)}>
                <p className="text-center text-sm text-gray-500 hover:text-gray-300 transition cursor-pointer">
                  ← متابعة التسوق
                </p>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>;
};
export default Cart;
