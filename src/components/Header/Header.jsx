import React, { useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Button,
  IconButton,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Collapse,
} from "@material-tailwind/react";
import { ChevronDownIcon, XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";

const menuStructure = [
  { name: "الرئيسية", path: "/" },
  { 
    name: "من نحن", 
    subItems: [
      { name: "عن المنصة", path: "/about-the-platform" },
      { name: "المدربين و اللجنة الفنية", path: "/coaches" },
    ] 
  },
  { 
    name: "المواهب", 
    subItems: [
      { name: "المواهب المقبولة", path: "/acceptable-talent" },
      { name: "الفيديوهات المقبولة", path: "/accepted-videos" },
    ] 
  },
  { 
    name: "البرامج", 
    subItems: [
      { name: "المعسكرات التدريبية", path: "/training-camps" },
      { name: "الاختبارات الميدانية", path: "/field-tests" },
      { name: "الجوائز والمسابقات", path: "/prizes-and-competitions" },
    ] 
  },
  { name: "المتجر", path: "/store" },
];

const extraSidebarItems = [
  { name: "قصص النجاح", path: "/success-stories" },
  { name: "المدونة", path: "/blog" },
  { name: "الأخبار والتحديثات", path: "/news-and-updates" },
  { name: "لوحة التحكم", path: "/dashboard" },
  { name: "الملف الشخصي", path: "/profile" },
  { name: "اتصل بنا", path: "/contact-us" },
];

const DropdownItem = ({ title, items, onClose }) => {
  return (
    <Menu>
      <MenuHandler>
        <li className="flex items-center gap-1 cursor-pointer text-xl text-[var(--color-text-gray)]  hover:text-[var(--color-gold-main)] transition-colors">
          {title} <ChevronDownIcon className="h-4 w-4" />
        </li>
      </MenuHandler>
      <MenuList className="w-52 bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-gray)] z-[200]">
        {items.map((item, i) => (
          <Link key={i} to={item.path} onClick={onClose}>
            <MenuItem className="hover:text-[var(--color-gold-main)] hover:bg-[var(--color-bg-main)]">
              {item.name}
            </MenuItem>
          </Link>
        ))}
      </MenuList>
    </Menu>
  );
};

const MobileDropdown = ({ title, items, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <li className="flex flex-col">
      <div 
        className="flex items-center justify-between cursor-pointer py-3 px-3 rounded-lg hover:bg-[#1A1D1E] hover:text-[var(--color-gold-main)] transition-all duration-200 text-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </div>
      {isOpen && (
        <ul className="mr-6 flex flex-col gap-1 border-r border-[var(--color-border)] mt-1 mb-2">
          {items.map((item, i) => (
            <Link key={i} to={item.path} onClick={onClose}>
              <li className="text-md py-2 px-4 rounded-md text-[var(--color-text-gray)] opacity-80 hover:text-[var(--color-gold-main)] hover:bg-[#1A1D1E] cursor-pointer">
                {item.name}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </li>
  );
};

const HeaderContent = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <div className="w-full relative">
      
      {open && (
        <div 
          className="fixed inset-0 top-[72px] md:top-[80px] bg-black/40 backdrop-blur-md z-[80]"
          onClick={handleClose}
        />
      )}

      <div className={`fixed top-[72px] md:top-[80px] right-0 h-[calc(100vh-80px)] w-72 bg-[var(--color-bg-card)] text-[var(--color-text-gray)] shadow-2xl transition-transform duration-300 z-[120] hidden md:block border-t border-[var(--color-border)] ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 overflow-y-auto h-full flex flex-col justify-between">
          <ul className="flex flex-col gap-1">
            {[...menuStructure, ...extraSidebarItems].map((item, i) => (
              item.subItems ? 
              <MobileDropdown key={i} title={item.name} items={item.subItems} onClose={handleClose} /> :
              <Link key={i} to={item.path} onClick={handleClose}>
                <li className="text-lg py-3 px-3 rounded-lg hover:bg-[#1A1D1E] hover:text-[var(--color-gold-main)] transition-all cursor-pointer">{item.name}</li>
              </Link>
            ))}
          </ul>
          <div className="mt-auto pt-6 border-t border-[var(--color-border)] mb-4">
             <Link to="/login" onClick={handleClose}><Button fullWidth variant="outlined" className="border-[var(--color-border)] text-[var(--color-text-gray)]">تسجيل الدخول / إنشاء حساب</Button></Link>
          </div>
        </div>
      </div>

      <Navbar variant="filled" shadow={false} blurred={false} fullWidth className="fixed top-0 left-0 z-[150] border-none outline-none rounded-none p-4 bg-[var(--color-bg-card)]">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <IconButton variant="text" className="text-3xl text-white outline-none" onClick={() => setOpen(!open)}>
              {open ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
            </IconButton>
            <Link to="/"><img src="../logo.png" className="h-10" alt="logo" /></Link>
          </div>

          <ul className="hidden xl:flex items-center gap-10">
            {menuStructure.map((item, i) => (
              item.subItems ? 
              <DropdownItem key={i} title={item.name} items={item.subItems} onClose={handleClose} /> :
              <Link key={i} to={item.path} className="text-xl text-[var(--color-text-gray)] hover:text-[var(--color-gold-main)] transition-all whitespace-nowrap">{item.name}</Link>
            ))}
          </ul>

          <Link to="/login" className="hidden xl:block">
            <Button variant="outlined" className="text-lg p-2 border-[var(--color-border)] text-[var(--color-text-gray)]">تسجيل الدخول / إنشاء حساب</Button>
          </Link>
        </div>

        <div className="md:hidden">
          <Collapse open={open}>
            <div className="mt-4 bg-[var(--color-bg-card)] border-t border-[var(--color-border)] pt-4 max-h-[70vh] overflow-y-auto">
              <ul className="flex flex-col gap-1">
                {[...menuStructure, ...extraSidebarItems].map((item, i) => (
                  item.subItems ? 
                  <MobileDropdown key={i} title={item.name} items={item.subItems} onClose={handleClose} /> :
                  <Link key={i} to={item.path} onClick={handleClose}>
                    <li className="text-lg py-3 px-3 rounded-lg hover:bg-[#1A1D1E] hover:text-[var(--color-gold-main)] transition-all">{item.name}</li>
                  </Link>
                ))}
                <li className="mt-4 pb-4">
                  <Link to="/login" onClick={handleClose}><Button fullWidth variant="outlined" className="border-[var(--color-border)] text-[var(--color-text-gray)]">تسجيل الدخول / إنشاء حساب</Button></Link>
                </li>
              </ul>
            </div>
          </Collapse>
        </div>
      </Navbar>
      
      <div className={`h-[72px] md:h-[80px] bg-[var(--color-bg-card)] border-none outline-none transition-all duration-300 ${open ? "blur-sm" : "blur-0"}`}></div>
    </div>
  );
};

const Header = () => {
  return (
    <Suspense fallback={<div className="h-[72px] md:h-[80px] bg-[var(--color-bg-card)] w-full"></div>}>
      <HeaderContent />
    </Suspense>
  );
};

export default Header;