import { Outlet } from "react-router-dom";
import NavStore from "../navStore/NavStore"; // تأكدي من مسار الاستيراد الصحيح

const StoreLayout = () => {
  return (
    <div className=" bg-[var(--color-bg-main)] min-h-screen"> 
  
      <NavStore />
  
      <Outlet />
    </div>
  );
};

export default StoreLayout;