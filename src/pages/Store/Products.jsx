import { useState, useEffect } from "react";
import { Card,CardHeader,CardBody,CardFooter,Typography,Button} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext/StoreContext";
import ProductCard from "../../components/ProductCard/ProductCard";
import { Error } from "../../components/Error/Error";
const Products = () => {
  const { products, addToCart, selectcategory, search, load, addedProductId,error,handleError ,getproduct} = useStore();
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectcategory
      ? selectcategory === "تخفيضات"
        ? p.discount > 0
        : p.category === selectcategory
      : true;

    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectcategory, search]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (load)
    return (
      <div className="min-h-screen bg-[var(--color-bg-main)] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[var(--color-border)] border-t-[var(--color-gold-main)] rounded-full animate-spin"></div>
        <p className="text-[var(--color-gold-main)] font-bold tracking-widest uppercase animate-pulse">
          جاري تحميل المنتجات...
        </p>
      </div>
    );

    if (error) return <Error message={error} onRetry={getproduct} />;
  return (
      <div className="min-h-screen bg-[var(--color-bg-main)] pt-5 pb-10 px-4">
        <div className="text-center mb-12">
          <Typography variant="h2" className="text-gradient-gold mb-4">
            {selectcategory ? selectcategory : "منتجاتنا المميزة"}
          </Typography>
          <div className="w-24 h-1 bg-[var(--color-gold-main)] mx-auto rounded-full" />
        </div>

        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
  {currentProducts?.map((p) => (
    <div key={p.id} className="hover-gold-card card-shine w-full flex justify-center">
      <ProductCard product={p} />
    </div>
  ))}
</div>
        <div className="flex justify-center items-center gap-4 mt-12 mb-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 border border-[var(--color-gold-main)] 
    ${
      currentPage === 1
        ? "opacity-30 cursor-not-allowed border-gray-600 text-gray-600"
        : "text-[var(--color-gold-main)] hover:bg-[var(--color-gold-main)] hover:text-black"
    }`}>
            السابق
          </button>

          <div className="flex items-center gap-2 text-white bg-[var(--color-bg-card)] px-4 py-2 rounded-full border border-[var(--color-border)]">
            <span className="text-[var(--color-gold-main)] font-bold">
              {currentPage}
            </span>
            <span className="text-gray-500">/</span>
            <span className="font-bold">{totalPages}</span>
          </div>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 border border-[var(--color-gold-main)] 
    ${
      currentPage === totalPages || totalPages === 0
        ? "opacity-30 cursor-not-allowed border-gray-600 text-gray-600"
        : "text-[var(--color-gold-main)] hover:bg-[var(--color-gold-main)] hover:text-black" }`} >
            التالي
          </button>
        </div>
      </div>
  );
};

export default Products;
