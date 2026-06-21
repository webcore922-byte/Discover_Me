import React from 'react';
import { useStore } from "../../contexts/StoreContext/StoreContext";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { Button, Card, Typography } from "@material-tailwind/react";

const Cart = () => {
  const { cart, addToCart,increment, decrement, del, empty, total ,setSelectcategory,updateQuantity} = useStore();
  if (cart.length == 0) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-main)] flex flex-col items-center justify-center text-white">
        <FaShoppingCart className="text-8xl text-gray-700 mb-6" />
        <h2 className="text-3xl font-bold mb-4">سلتك فارغة حالياً</h2>
        <Link to="/products">
          <Button onClick={setSelectcategory(null)} className="bg-[var(--color-gold-main)] text-black font-bold">تسوق الآن</Button>
        </Link>
      </div>
    );}
  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-white py-12 px-4 md:px-12">
      <div className="container mx-auto">
<div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <h1 className="text-2xl md:text-4xl font-bold text-gradient-gold">سلة المشتريات</h1>
      <Button 
        onClick={empty} 
        variant="outlined" 
        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white w-full md:w-auto" >
        <FaTrash className="inline mr-2" /> مسح الكل
      </Button>
    </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
       {cart.map(({id,image,name,price,count}) => (
  <Card key={id} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-4 flex flex-col md:flex-row items-center gap-4 shadow-none">
  
    <img src={image} alt={name} className="w-20 h-20 object-contain bg-white rounded-lg p-1" />
    
    <div className="flex-1 text-center md:text-right w-full">
      <Typography variant="h5" className="text-white text-lg">{name}</Typography>
      <Typography className="text-[var(--color-gold-main)] font-bold">{price} EGP</Typography>
    </div>

    <div className="flex items-center gap-2 bg-[var(--color-bg-main)] px-2 py-1 rounded-full border border-[var(--color-border)]">
      <button onClick={() => decrement(id)} className="text-[var(--color-gold-main)] p-2">
        <FaMinus />
      </button>

      <input
        type="number"
        value={count}
        onChange={(e) => {
          const val = e.target.value == "" ? "" : parseInt(e.target.value);
          updateQuantity(item.id, val == "" ? 1 : val);
        }}
        className="w-12 bg-transparent text-white text-center font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button onClick={() => increment(id)} className="text-[var(--color-gold-main)] p-2">
        <FaPlus />
      </button>
    </div>
    <button onClick={() => del(id)} className="text-gray-500 hover:text-red-500 p-2">
      <FaTrash />
    </button>
  </Card>
))}
       </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-[var(--color-bg-card)] border border-[var(--color-gold-main)] p-6 rounded-xl">
          <h3 className="text-2xl font-bold text-white mb-6">ملخص الطلب</h3>
          <div className="flex justify-between text-xl mb-6">
            <span>الإجمالي:</span>
            <span className="text-[var(--color-gold-main)] font-bold">{total} EGP</span>
          </div>
          <Link to="/checkout">
            <Button className="w-full py-4 bg-gradient-to-r from-[var(--color-btn-start)] to-[var(--color-btn-end)] text-black font-bold text-lg">
              إتمام الشراء
            </Button>
          </Link>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;