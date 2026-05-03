import React from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { useStore } from "../contexts/StoreContext/StoreContext";


const ProductCard = ({ product }) => {
  const { addToCart } = useStore();

  return (
    <Card className="bg-[#1a1a1a] border border-gray-800 p-4 flex flex-col items-center hover:border-[#c5a059] transition-all duration-300 rounded-xl shadow-lg">
      <div className="h-40 bg-white w-full rounded-lg flex items-center justify-center p-2 mb-4">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full object-contain"
        />
      </div>
      <Typography className="text-white font-bold text-xs text-center mb-2 h-10 line-clamp-2">
        {product.title}
      </Typography>
      <Typography className="text-[#c5a059] font-black mb-4">
        {product.price} ر.س
      </Typography>
      <Button
        size="sm"
        fullWidth
        onClick={() => addToCart(product)}
        className="bg-[#c5a059] text-black font-bold py-3 rounded-lg border-none"
      >
        أضف إلى السلة
      </Button>
    </Card>
  );
};

export default ProductCard;
