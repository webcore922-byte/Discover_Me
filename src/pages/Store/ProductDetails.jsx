import { useParams } from "react-router-dom";
import { FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useStore } from "../../contexts/StoreContext/StoreContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { products ,addedProductId,addToCart} = useStore();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = products.find((p) => String(p.id) === String(id)) || products[0];
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="dark:text-white text-[var(--color-text-gray)] text-center py-20 min-h-screen bg-[var(--color-bg-main)]">
        جاري تحميل تفاصيل المنتج...
      </div>
    );
  }

  return (
    <section className="py-16 px-8 min-h-screen bg-[var(--color-bg-main)] dark:text-white text-[var(--color-text-gray)]">
      <div className="mx-auto container grid place-items-center grid-cols-1 md:grid-cols-2 gap-12">
        <div className="w-full max-w-[400px] aspect-square flex items-center justify-center bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] p-4 overflow-hidden">
  <img
    src={product?.image}
    alt={product?.name}
    className="w-full h-full object-contain"
  />
</div>
        <div className="space-y-6">
         <h2 className="text-2xl md:text-4xl font-bold dark:text-white leading-tight"> {product?.name}</h2>

<div className="flex items-center gap-4 flex-wrap">
 <h3 className="text-2xl md:text-4xl font-bold text-[var(--color-gold-main)]">
    {product.price - (product.discount || 0)} EGP</h3>

  {product.discount > 0 && (
    <>
      <span className="text-gray-500 line-through text-2xl">
        {product.price} EGP
      </span>
      <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
        -{((product.discount / product.price) * 100).toFixed(0)}%
      </span>
    </>
  )}
</div>
          <div className="space-y-3">
            <p className="dark:text-gray-400 font-bold text-lg">
              القسم: <span className="dark:text-white text-[var(--color-text-gray)] font-normal">{product?.category}</span> </p>
  
<div className="border-t border-[var(--color-border)] pt-6 mt-6">
  <h4 className="text-xl font-bold dark:text-white text-[var(--color-text-gray)] mb-2">وصف المنتج</h4>
  <p className="dark:text-gray-400 leading-relaxed">
    {product?.description || "لا يوجد وصف متاح لهذا المنتج حالياً."}
  </p>
</div>   
          </div>

<div className="flex items-center gap-4 pt-6">
  <Button 
    onClick={() => addToCart(product)}
    disabled={addedProductId === product.id}
    className={`flex items-center justify-center gap-2 font-bold text-sm md:text-lg px-4 py-3 md:px-8 md:py-3 transition-all duration-500 w-full md:w-auto
      ${addedProductId === product.id 
        ? "bg-[var(--color-gold-main)]/20 border-2 border-[var(--color-gold-main)]/50 text-[var(--color-gold-main)] cursor-default" 
        : "bg-gradient-to-r from-[var(--color-btn-start)] to-[var(--color-btn-end)] text-black hover:scale-105"
      }`}
  >
    <FaShoppingCart /> 
    {addedProductId == product.id ? "تمت الإضافة ✓" : "أضف إلى السلة"}
  </Button>
</div>
        </div>
      </div>
    </section>
   
  );
};

export default ProductDetails;