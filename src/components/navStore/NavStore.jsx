import { BsCart3 } from "react-icons/bs";
import { IoPersonSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext/StoreContext";
const NavStore = () => {
  const {cart,setSelectcategory,setSearch}=useStore();
  const [isOpen, setIsOpen] = useState(false);
 
  return (
    <nav className="relative w-full flex items-center justify-between px-3 md:px-8 py-4 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] fixed top-0 left-0 z-50">
      
      <div className="flex items-center gap-3">
        <button className="md:hidden text-white text-2xl" onClick={() => setIsOpen(!isOpen)}>
          <GiHamburgerMenu />
        </button>
        
        <input 
          type="text" 
          placeholder="ابحث..." 
          onChange={(e) => setSearch(e.target.value)} 
          className="bg-[var(--color-bg-main)] border border-[var(--color-border)] px-3 py-1.5 rounded-full text-xs w-20 md:w-40 focus:outline-none text-[var(--color-text-white)] shrink-0"   />
      </div>

      <div className={`${isOpen ? 'flex' : 'hidden'} md:flex absolute md:static top-[70px] left-0 w-full md:w-auto bg-[var(--color-bg-card)] flex-col md:flex-row gap-4 p-4 md:p-0 border-b md:border-0 border-[var(--color-border)] text-[var(--color-text-white)] text-sm shadow-xl md:shadow-none z-50`}>
        <Link to="/store" onClick={() => setIsOpen(false)}
         className="cursor-pointer hover:text-[var(--color-gold-main)] transition">الرئيسية</Link>
      <Link to="/products" className="cursor-pointer hover:text-[var(--color-gold-main)] transition" onClick={() => {setSelectcategory("أطقم الأندية"),setIsOpen(false);}}>أطقم الأندية</Link>
        
        <Link to="/products" className="cursor-pointer hover:text-[var(--color-gold-main)] transition" onClick={() => {setSelectcategory("أحذية كرة القدم");setIsOpen(false);}}>أحذية</Link>
        
        <Link to="/products" className="cursor-pointer hover:text-[var(--color-gold-main)] transition" onClick={() => {setSelectcategory("معدات التدريب");setIsOpen(false);}}>معدات</Link>
        <Link to="/products" className="cursor-pointer hover:text-[var(--color-gold-main)] transition" onClick={() => {setSelectcategory("تخفيضات");setIsOpen(false);}}>تخفيضات</Link>
        <Link to="/myorder" className="hover:text-[var(--color-gold-main)]" onClick={() => setIsOpen(false)}>طلباتي</Link>
        <Link to="/contactStore" className="cursor-pointer hover:text-[var(--color-gold-main)] transition" onClick={() => setIsOpen(false)}>تواصل معنا</Link>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link to="/Cart" className="relative">
        <div className="icon-gold text-lg md:text-xl cursor-pointer"><BsCart3 /></div>
        {cart.length > 0 && (
      <span className="absolute -top-2 -right-3 bg-[var(--color-gold-main)] text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
        {cart.length}
      </span>
    )}
        </Link>
        
      </div>
      
    </nav>
  );
};
export default NavStore;