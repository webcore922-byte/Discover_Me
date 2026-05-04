import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
} from "@material-tailwind/react";
import { 
  PowerIcon, 
  UserIcon, 
  RectangleGroupIcon 
} from "@heroicons/react/24/outline";

const IconProfile = ({ user, logout, isMobile = false, onClose }) => {

  if (!user) {
    return (
      <Link to="/login" onClick={onClose} className={!isMobile ? "hidden xl:block" : "w-full"}>
        <Button
          fullWidth={isMobile}
          variant="outlined"
          className="text-lg p-2 border-[var(--color-border)] text-[var(--color-text-gray)]"
        >
          تسجيل الدخول / إنشاء حساب
        </Button>
      </Link>
    );
  }

  const rawImage = user.image || user.avatar || user.profile_image;
  const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name)}&background=D4AF37&color=fff`;
  const isAdmin = user.role === "admin";

  const handleError = (e) => {
    if (e.target.src !== placeholder) {
      e.target.src = placeholder;
    }
  };

  // المكون المشترك للصورة مع التأكد أنها تملأ العنصر الأب
  const ProfileImg = ({ className }) => (
    <img 
      key={rawImage} 
      src={rawImage || placeholder} 
      alt={user.name}
      onError={handleError}
      className={`rounded-full object-cover w-full h-full block ${className}`}
    />
  );

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 w-full px-2">
        <div className="flex items-center gap-3 py-4 border-b border-[var(--color-border)] mb-2">
          <div className="h-16 w-16">
             <ProfileImg className="border-2 border-[var(--color-gold-main)]" />
          </div>
          <div className="flex flex-col">
            <Typography className="font-bold text-[var(--color-text-gray)]">{user.username || user.name}</Typography>
            {isAdmin && <span className="text-[10px] bg-[var(--color-gold-main)] text-black px-2 rounded-full w-fit">مدير النظام</span>}
          </div>
        </div>
        
        {isAdmin && (
          <Link to="/admin-dashboard" onClick={onClose} className="flex items-center gap-2 p-2 hover:bg-[var(--color-bg-main)] text-[var(--color-gold-main)] rounded-lg">
            <RectangleGroupIcon className="h-5 w-5" /> <span>لوحة التحكم</span>
          </Link>
        )}

        <Link to="/profile" onClick={onClose} className="flex items-center gap-2 p-2 hover:bg-[var(--color-bg-main)] text-[var(--color-text-gray)] rounded-lg">
          <UserIcon className="h-5 w-5" /> <span>الملف الشخصي</span>
        </Link>

        <button onClick={() => { logout(); onClose(); }} className="flex items-center gap-2 p-2 text-red-500 hover:bg-red-500/10 rounded-lg mt-2">
          <PowerIcon className="h-5 w-5" /> <span>تسجيل الخروج</span>
        </button>
      </div>
    );
  }

  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <button 
          className="rounded-full  overflow-hidden h-12 w-12 outline-none p-0 flex items-center justify-center bg-transparent"
        >
          <ProfileImg />
        </button>
      </MenuHandler>
      <MenuList className="bg-[var(--color-bg-card)] border-[var(--color-border)] text-[var(--color-text-gray)] shadow-xl z-[200]">
        {isAdmin && (
          <Link to="/dashboard">
            <MenuItem className="flex items-center gap-2 text-[var(--color-gold-main)] font-bold">
              <RectangleGroupIcon className="h-4 w-4" /> لوحة التحكم 
            </MenuItem>
          </Link>
        )}
        <Link to="/profile">
          <MenuItem className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" /> الملف الشخصي
          </MenuItem>
        </Link>
        <hr className="my-2 border-[var(--color-border)]" />
        <MenuItem onClick={logout} className="flex items-center gap-2 text-red-500 hover:bg-red-500/10">
          <PowerIcon className="h-4 w-4" /> تسجيل الخروج
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default IconProfile;