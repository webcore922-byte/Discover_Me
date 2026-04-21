import { useState } from "react";
import {
  Navbar,
  Button,
  IconButton,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";


const navbarItems = ["الرئيسية", "من نحن", "المواهب", "البرامج", "المتجر"];


const sidebarItems = [
  "الرئيسية",
  "من نحن",
  "المواهب",
  "البرامج",
  "المتجر",
  "قصص النجاح",
  "المدونة",
  "الأخبار والتحديثات",
  "لوحة التحكم",
  "الملف الشخصي"
];


const DropdownItem = ({ title, items }) => {
  return (
    <Menu>
      <MenuHandler>
        <li className="flex items-center gap-1 cursor-pointer text-xl text-[var(--color-text-gray)] hover:text-[var(--color-gold-main)] transition-colors">
          {title}
          <ChevronDownIcon className="h-4 w-4" />
        </li>
      </MenuHandler>
      <MenuList className="w-52 bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-gray)]">
        {items.map((item, i) => (
          <MenuItem key={i} className="hover:text-[var(--color-gold-main)] text-right">
            {item}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};


const SidebarDropdown = ({ title, items }) => {
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
            <li 
              key={i} 
              className="text-md py-2 px-4 rounded-md text-[var(--color-text-gray)] opacity-80 hover:text-[var(--color-gold-main)] hover:bg-[#1A1D1E] transition-all duration-200 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};


const MobileDropdown = ({ title, items }) => {
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
            <li 
              key={i} 
              className="text-md py-2 px-4 rounded-md text-[var(--color-text-gray)] opacity-80 hover:text-[var(--color-gold-main)] hover:bg-[#1A1D1E] transition-all duration-200 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);

  const renderNavbarItem = (item) => {
    const subItemsMap = {
      "من نحن": ["عن المنصة", "المدربين و اللجنة الفنية"],
      "المواهب": ["المواهب المقبولة", "الفيديوهات المقبولة"],
      "البرامج": ["المعسكرات التدريبية", "الاختبارات الميدانية", "الجوائز والمسابقات"]
    };

    if (subItemsMap[item]) {
      return <DropdownItem key={item} title={item} items={subItemsMap[item]} />;
    }

    return (
      <li 
        key={item} 
        className="text-xl text-[var(--color-text-gray)] cursor-pointer hover:text-[var(--color-gold-main)] transition-all whitespace-nowrap"
      >
        {item}
      </li>
    );
  };

  const renderSidebarItem = (item) => {
    const subItemsMap = {
      "من نحن": ["عن المنصة", "المدربين و اللجنة الفنية"],
      "المواهب": ["المواهب المقبولة", "الفيديوهات المقبولة"],
      "البرامج": ["المعسكرات التدريبية", "الاختبارات الميدانية", "الجوائز والمسابقات"]
    };

    if (subItemsMap[item]) {
      return <SidebarDropdown key={item} title={item} items={subItemsMap[item]} />;
    }

    return (
      <li 
        key={item} 
        className="text-lg py-3 px-3 rounded-lg hover:bg-[#1A1D1E] text-[var(--color-text-gray)] cursor-pointer hover:text-[var(--color-gold-main)] transition-all whitespace-nowrap"
      >
        {item}
      </li>
    );
  };

  const renderMobileItem = (item) => {
    const subItemsMap = {
      "من نحن": ["عن المنصة", "المدربين و اللجنة الفنية"],
      "المواهب": ["المواهب المقبولة", "الفيديوهات المقبولة"],
      "البرامج": ["المعسكرات التدريبية", "الاختبارات الميدانية", "الجوائز والمسابقات"]
    };

    if (subItemsMap[item]) {
      return <MobileDropdown key={item} title={item} items={subItemsMap[item]} />;
    }

    return (
      <li 
        key={item} 
        className="text-lg py-3 px-3 rounded-lg hover:bg-[#1A1D1E] text-[var(--color-text-gray)] cursor-pointer hover:text-[var(--color-gold-main)] transition-all whitespace-nowrap"
      >
        {item}
      </li>
    );
  };

  return (
    <div className="flex w-full overflow-hidden relative">
      
      
      {open && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setOpen(false)}
        />
      )}
      
      
      <div
        className={`hidden md:block fixed top-0 right-0 h-full w-72 bg-[var(--color-bg-card)] text-[var(--color-text-gray)] shadow-2xl transition-transform duration-300 z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 overflow-y-auto h-full">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h5" className="text-[var(--color-gold-main)]">
              القائمة
            </Typography>
            
            <IconButton variant="text" onClick={() => setOpen(false)}>
               <XMarkIcon className="h-8 w-8 text-[var(--color-text-white)]" />
            </IconButton>
          </div>

          <ul className="flex flex-col gap-1">
            {sidebarItems.map((item) => renderSidebarItem(item))}
            
            <li className="mt-6">
                <Button 
                    fullWidth 
                    variant="outlined" 
                    className="border-[var(--color-border)] text-[var(--color-text-gray)]"
                >
              تسجيل الدخول / إنشاء حساب
                </Button>
            </li>
          </ul>
        </div>
      </div>

      
      <div
        className={`md:hidden fixed top-[72px] left-0 right-0 bg-[var(--color-bg-card)] text-[var(--color-text-gray)] shadow-2xl transition-all duration-300 z-50 overflow-y-auto ${
          open ? "max-h-[calc(100vh-72px)] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
        style={{ transitionProperty: "max-height, opacity" }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h5" className="text-[var(--color-gold-main)]">
              القائمة
            </Typography>
            
            <IconButton variant="text" onClick={() => setOpen(false)}>
               <XMarkIcon className="h-8 w-8 text-[var(--color-text-white)]" />
            </IconButton>
          </div>

          <ul className="flex flex-col gap-1">
            {sidebarItems.map((item) => renderMobileItem(item))}
            
            <li className="mt-6">
                <Button 
                    fullWidth 
                    variant="outlined" 
                    className="border-[var(--color-border)] text-[var(--color-text-gray)]"
                >
              تسجيل الدخول / إنشاء حساب
                </Button>
            </li>
          </ul>
        </div>
      </div>

      
      <div className={`w-full transition-all duration-300 ${open ? "md:pr-72" : "pr-0"} ${open ? "blur-sm" : ""} md:blur-none`}>
        
        <Navbar className=" z-50  border-none shadow-none rounded-none w-full max-w-full p-4 bg-[var(--color-bg-card)]">
          <div className="flex items-center justify-between w-full">
            
            <div className="flex items-center gap-3">
              
              {!open && (
                <IconButton
                  variant="text"
                  className="text-3xl text-[var(--color-text-white)]"
                  onClick={() => setOpen(true)}
                >
                  ☰
                </IconButton>
              )}
              <img src="../logo.png" className="h-10" alt="logo" />
            </div>

            
            <ul className="hidden xl:flex items-center gap-10">
              {navbarItems.map((item) => renderNavbarItem(item))}
            </ul>

            
           <Button
              variant="outlined"
              className="hidden xl:block text-lg p-2 border-[var(--color-border)] text-[var(--color-text-gray)]"
            >
              تسجيل الدخول / إنشاء حساب
            </Button>
          </div>
        </Navbar>
        
        
        <div className="md:hidden h-[72px]"></div>
      </div>
    </div>
  );
};

