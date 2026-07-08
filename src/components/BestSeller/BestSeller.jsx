import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from '../../contexts/StoreContext/StoreContext';
import { FaExclamationTriangle, FaRedo, FaSpinner, FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";
const ITEMS_PER_PAGE = 5;
const ErrBestSeller = ({
  onRetry
}) => <div className="flex items-center justify-between p-3 bg-[var(--color-gold-main)]/10 border border-[var(--color-gold-main)]/30 rounded-lg text-[var(--color-gold-main)] mb-6">
    <div className="flex items-center gap-3">
      <FaExclamationTriangle className="text-xl" />
      <p className="text-sm font-medium">عذراً، حدث خطأ في تحميل البيانات</p>
    </div>
    <button onClick={onRetry} className="p-2 hover:bg-[var(--color-gold-main)] hover:text-black rounded-full transition text-[var(--color-gold-main)]" title="إعادة المحاولة">
      <FaRedo className="text-sm" />
    </button>
  </div>;
const BestSeller = () => {
  const {
    search,
    addedProductId,
    products,
    addToCart,
    load,
    error,
    getproduct
  } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const bestSellers = products.filter(item => item.isBestSeller === true && item.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(bestSellers.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages || 1);
  const displayed = bestSellers.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  return <div>
      {error && <ErrBestSeller onRetry={getproduct} />}
      {load ? <div className="flex justify-center py-20 text-[var(--color-gold-main)] text-3xl">
          <FaSpinner className="animate-spin" />
        </div> : <>
          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayed.map(product => <div key={product.id} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-4 rounded-2xl flex flex-col hover:border-[var(--color-gold-main)] transition-all duration-300 hover:-translate-y-2 shadow-lg">

                <div className="relative w-full aspect-square overflow-hidden rounded-xl mb-4">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col flex-grow">
                  <h3 className="font-bold text-[var(--color-text-white)] text-md mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[var(--color-gold-main)] font-black text-lg mb-4">
                    {product.price} EGP
                  </p>
                </div>

                <div className="flex gap-2 mt-auto">
                  <Link to={`/productDetails/${product.id}`} className="flex items-center justify-center gap-1.5 w-1/3 py-3 border-2 border-[var(--color-gold-main)]/50 text-[var(--color-gold-main)] rounded-lg font-bold transition-all duration-300 hover:border-[var(--color-gold-main)] hover:bg-[var(--color-gold-main)]/10 text-sm">
                    <FaInfoCircle />
                    <span>تفاصيل</span>
                  </Link>

                  <button onClick={() => addToCart(product)} disabled={addedProductId == product.id} className={`flex-1 py-3 border-2 transition-all duration-500 rounded-lg font-bold text-sm
                    ${addedProductId == product.id ? "bg-[var(--color-gold-main)]/20 border-[var(--color-gold-main)]/50 text-[var(--color-gold-main)] cursor-default" : "bg-transparent border-[var(--color-gold-main)] text-[var(--color-gold-main)] hover:bg-[var(--color-gold-main)] hover:text-black"}`}>
                    {addedProductId == product.id ? "تمت الإضافة ✓" : "أضف للسلة"}
                  </button>
                </div>
              </div>)}
          </div>

          {}
          {totalPages > 1 && <div className="flex items-center justify-center gap-3 pt-8">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 transition-all">
                <FaChevronRight className="w-4 h-4" />
              </button>

              {Array.from({
          length: totalPages
        }, (_, i) => i + 1).map(n => <button key={n} onClick={() => setCurrentPage(n)} className={`w-9 h-9 text-sm font-black rounded-xl transition-all
                    ${n === safePage ? "bg-[var(--color-gold-main)] text-black" : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"}`}>
                  {n}
                </button>)}

              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 transition-all">
                <FaChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs text-gray-500 font-bold mr-2">
                صفحة {safePage} من {totalPages} · {bestSellers.length} منتج
              </span>
            </div>}
        </>}
    </div>;
};
export default BestSeller;
