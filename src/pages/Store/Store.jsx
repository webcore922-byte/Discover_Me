import { Link } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext/StoreContext";
import CategoriesSection from "../../components/CategoriesSection/CategoriesSection";
import BestSeller from "../../components/BestSeller/BestSeller";

const Store = () => {
  const { addToCart, setSelectcategory } = useStore();

  return (
    <div>
      <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-white)] pb-10">
        <section className="px-4 md:px-8 py-6">
          <div className="w-full max-h-[430px] aspect-[16/9] md:aspect-[21/9] rounded-2xl flex items-center p-6 md:p-12 relative overflow-hidden gold-glow-border bg-[url('/storebg.png')] bg-cover bg-center bg-no-repeat">
            <div className="absolute inset-0"></div>

            <div className="relative z-10 text-white max-w-lg">
              <h1 className="text-sm sm:text-3xl md:text-5xl font-bold mb-3 md:mb-6 leading-tight">
                استعد للموسم الجديد!
              </h1>
              <p className="text-gray-200 mb-6 text-xs md:text-xl opacity-90 leading-relaxed">
                أحدث أطقم الأندية والمنتخبات لعام 2026
              </p>

              <Link to="/products" className="inline-block">
                <button
                  onClick={() => setSelectcategory(null)}
                  className="px-2 py-1.5 md:px-10 md:py-4 rounded-xl font-bold text-black bg-gradient-to-r from-[var(--color-btn-start)] to-[var(--color-btn-end)] hover:scale-105 transition-transform duration-300 text-sm md:text-lg shadow-lg">
                  تسوق الآن
                </button>
              </Link>
            </div>
          </div>
        </section>

        <CategoriesSection />

        <section className="px-8 py-12">
          <h2 className="text-3xl font-bold dark:text-white text-[var(--color-gold-main)] mb-8 border-r-4 border-[var(--color-gold-main)] pr-4">
            الأكثر مبيعاً
          </h2>
          <BestSeller />
        </section>
      </div>
    </div>
  );
};

export default Store;