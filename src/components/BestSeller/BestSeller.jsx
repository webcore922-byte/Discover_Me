import { useStore } from '../../contexts/StoreContext/StoreContext';
import { FaExclamationTriangle, FaRedo, FaSpinner } from "react-icons/fa"; // أضفنا أيقونة التحميل

const ErrBestSeller = ({ onRetry }) => (
  <div className="flex items-center justify-between p-3 bg-[var(--color-gold-main)]/10 border border-[var(--color-gold-main)]/30 rounded-lg text-[var(--color-gold-main)] mb-6">
    <div className="flex items-center gap-3">
      <FaExclamationTriangle className="text-xl" />
      <p className="text-sm font-medium">عذراً، حدث خطأ في تحميل البيانات</p>
    </div>
    
    <button 
      onClick={onRetry} 
      className="p-2 hover:bg-[var(--color-gold-main)] hover:text-black rounded-full transition text-[var(--color-gold-main)]"
      title="إعادة المحاولة">
      <FaRedo className="text-sm" />
    </button>
  </div>
);

const BestSeller = () => {
  const { search, addedProductId, showAll, products, addToCart, load, error, getproduct } = useStore();

  return (
    <div>
      {error && <ErrBestSeller onRetry={getproduct} />}
      {load ? (
        <div className="flex justify-center py-20 text-[var(--color-gold-main)] text-3xl">
           <FaSpinner className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products
            .filter(
              (item) =>
                item.isBestSeller === true &&
                item.name.toLowerCase().includes(search.toLowerCase()),
            )
            .slice(0, showAll ? products.length : 4)
            .map((product) => (
              <div
                key={product.id}
                className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-4 rounded-2xl flex flex-col hover:border-[var(--color-gold-main)] transition-all duration-300 hover:-translate-y-2 shadow-lg">
                <div className="relative w-full aspect-square overflow-hidden rounded-xl mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col flex-grow">
                  <h3 className="font-bold text-white text-md mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[var(--color-gold-main)] font-black text-lg mb-4">
                    {product.price} EGP
                  </p>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  disabled={addedProductId == product.id}
                  className={`mt-auto w-full py-3 border-2 transition-all duration-500 rounded-lg font-bold
                  ${addedProductId == product.id
                      ? "bg-[var(--color-gold-main)]/20 border-[var(--color-gold-main)]/50 text-[var(--color-gold-main)] cursor-default"
                      : "bg-transparent border-[var(--color-gold-main)] text-[var(--color-gold-main)] hover:bg-[var(--color-gold-main)] hover:text-black"}`} >
                  {addedProductId == product.id
                    ? "تمت الإضافة ✓"
                    : "أضف إلى السلة"}
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default BestSeller;