import React, { useRef } from "react";
import {
  Typography,
  IconButton,
  Spinner,
  Button,
  Input,
} from "@material-tailwind/react";
import { FaSearch, FaShoppingCart, FaBars } from "react-icons/fa";

import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/ProductCard";

const store = () => {
  const { products, cart, loading } = useStore();
  const productsRef = useRef(null);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans" dir="rtl">
      {/* Navbar مع عرض محتويات السلة عند الـ Hover */}
      <nav className="bg-[#1a1a1a] p-4 sticky top-0 z-50 border-b border-gray-800">
        <div className="container mx-auto flex items-center justify-between">
          <Typography className="text-[#c5a059] font-black text-2xl">
            GOALSTORE
          </Typography>
          {/* شريط البحث (JS Dynamic Search placeholder) */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <Input
              type="text"
              id="search"
              name="search"
              placeholder="ابحث عن قميص، حذاء..."
              className="!border-gray-700 focus:!border-[#c5a059] bg-[#2a2a2a] text-white rounded-full pr-10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-500" />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <IconButton variant="text" className="text-white">
                <FaShoppingCart size={22} />
              </IconButton>
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cart.length}
                </span>
              )}
              {/* قائمة السلة السريعة */}
              <div className="absolute left-0 mt-2 w-64 bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hidden group-hover:block z-50">
                <Typography className="text-[#c5a059] font-bold mb-2 text-sm">
                  السلة ({cart.length})
                </Typography>
                <div className="max-h-48 overflow-y-auto">
                  {cart.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-2 mb-2 items-center border-b border-gray-900 pb-2"
                    >
                      <img
                        src={item.image}
                        className="w-8 h-8 bg-white rounded"
                        alt=""
                      />
                      <Typography className="text-[10px] flex-1 line-clamp-1">
                        {item.title}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <IconButton variant="text" className="text-white lg:hidden">
              <FaBars size={20} />
            </IconButton>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative rounded-[2rem] bg-gradient-to-l from-[#111] to-black h-[350px] mb-12 border border-gray-800 flex items-center px-10 overflow-hidden">
          <div className="z-10 max-w-lg">
            <Typography
              variant="h1"
              className="text-4xl md:text-6xl font-black mb-4 italic uppercase"
            >
              استعد للموسم الجديد !
            </Typography>
            <Button
              onClick={scrollToProducts}
              className="bg-[#c5a059] text-black font-black px-10 py-4 rounded-xl"
            >
              تسوق الآن
            </Button>
          </div>
          <img
            src="./public/pngtree-soccer-player-in-motion-3d-rendering-of-kicking-a-soccer-ball-image_3772157.jpg"
            className="absolute left-0 bottom-0 h-80 opacity-60 hidden lg:block"
            alt="players"
          />
        </div>

        {/* قسم المنتجات */}
        <div ref={productsRef} className="mb-10">
          <Typography
            variant="h3"
            className="text-2xl font-black border-r-4 border-[#c5a059] pr-4 mb-8"
          >
            الأكثر مبيعاً
          </Typography>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner className="h-12 w-12 text-[#c5a059]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {products.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default store;
