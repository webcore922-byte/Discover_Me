import { BsCart3 } from "react-icons/bs";
import { IoPersonSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext/StoreContext";
const NavStore = () => {
  const {
    cart,
    setSelectcategory,
    setSearch
  } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return <>
      <nav className="fixed top-[65px] md:top-[75px] left-0 w-full h-14 md:h-16 flex items-center justify-between px-3 md:px-8 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] z-50">

        <div className="flex items-center gap-3">
          <button ref={buttonRef} className="md:hidden text-[var(--color-text-white)] text-2xl" onClick={() => setIsOpen(!isOpen)}>
            <GiHamburgerMenu />
          </button>

          <input type="text" placeholder="ابحث..." onChange={e => setSearch(e.target.value)} className="bg-[var(--color-bg-main)] border border-[var(--color-border)] px-4 py-2 rounded-full text-sm w-32 md:w-64 focus:outline-none focus:border-[var(--color-gold-main)] transition-all dark:text-[var(--color-text-white)] text-[var(--color-text-gray)] shrink-0" />
        </div>

        <div ref={menuRef} className={`${isOpen ? 'flex' : 'hidden'} md:flex absolute md:static top-14 left-0 w-full md:w-auto bg-[var(--color-bg-card)] flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-4 md:p-0 border-b md:border-0 border-[var(--color-border)] dark:text-[var(--color-text-white)]
        text-[var(--color-text-gray)] text-sm font-medium shadow-xl md:shadow-none z-50`}>
          <Link to="/store" onClick={() => setIsOpen(false)} className="cursor-pointer hover:text-[var(--color-gold-main)] transition-colors">الرئيسية</Link>
          <Link to="/products" className="cursor-pointer hover:text-[var(--color-gold-main)] transition-colors" onClick={() => {
          setSelectcategory("أطقم الأندية");
          setIsOpen(false);
        }}>أطقم الأندية</Link>
          <Link to="/products" className="cursor-pointer hover:text-[var(--color-gold-main)] transition-colors" onClick={() => {
          setSelectcategory("أحذية كرة القدم");
          setIsOpen(false);
        }}>أحذية</Link>
          <Link to="/products" className="cursor-pointer hover:text-[var(--color-gold-main)] transition-colors" onClick={() => {
          setSelectcategory("معدات التدريب");
          setIsOpen(false);
        }}>معدات</Link>
          <Link to="/products" className="cursor-pointer hover:text-[var(--color-gold-main)] transition-colors" onClick={() => {
          setSelectcategory("تخفيضات");
          setIsOpen(false);
        }}>تخفيضات</Link>
          <Link to="/myorder" className="cursor-pointer hover:text-[var(--color-gold-main)] transition-colors" onClick={() => setIsOpen(false)}>طلباتي</Link>

          {}
          <Link to="/contact-us" state={{
          type: "store"
        }} className="cursor-pointer hover:text-[var(--color-gold-main)] transition-colors" onClick={() => setIsOpen(false)}>
            تواصل معنا
          </Link>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/Cart" className="relative">
            <div className="icon-gold text-lg md:text-xl cursor-pointer"><BsCart3 /></div>
            {cart.length > 0 && <span className="absolute -top-2 -right-3 bg-[var(--color-gold-main)] text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cart.length}
              </span>}
          </Link>
        </div>

      </nav>

      {}
      <div className="h-[90px] md:h-[85px]" />
    </>;
};
export default NavStore;
