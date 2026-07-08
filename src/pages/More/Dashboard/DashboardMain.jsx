import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import PlayersSection from '../../../components/Dashboard/PlayersSection';
import CampsSection from '../../../components/Dashboard/CampsSection';
import ContestsSection from '../../../components/Dashboard/ContestsSection';
import NewsSection from '../../../components/Dashboard/NewsSection';
import ContactSection from '../../../components/Dashboard/Contact';
import MarketSection from '../../../components/Dashboard/MarketSection';
import ShippingRatesSection from '../../../components/Dashboard/ShippingRatesSection';
import StaffSection from '../../../components/Dashboard/StaffSection';
import AdminsSection from '../../../components/Dashboard/AdminsSection';
const DashboardMain = () => {
  const navigate = useNavigate();
  const [adminRole, setAdminRole] = useState('');
  const [activeTab, setActiveTab] = useState('');
  useEffect(() => {
    const savedUser = localStorage.getItem('scoutUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      const role = user.role || 'user';
      setAdminRole(role);
      if (role === 'technical_coach') setActiveTab('pending');else if (role === 'camps_manager') setActiveTab('manage_camps');else if (role === 'marketing_admin') setActiveTab('manage_contests');else setActiveTab('pending');
    } else {
      navigate('/login');
    }
  }, [navigate]);
  const hasPermission = tabName => {
    if (adminRole === 'super_admin') return true;
    const permissions = {
      technical_coach: ['pending', 'approved_waiting', 'final_accepted', 'final_rejected', 'manage_staff'],
      camps_manager: ['manage_camps'],
      marketing_admin: ['manage_contests', 'manage_news', 'manage_contact', 'manage_market', 'manage_shipping']
    };
    return permissions[adminRole]?.includes(tabName) || false;
  };
  return <div className="min-h-screen dark:bg-[#0e1011] bg-[var(--color-bg-main)] dark:text-[var(--color-text-white)] text-[var(--color-text-gray)] p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] italic uppercase tracking-wider">لوحة التحكم الإدارية</h1>
            <p className="text-xs dark:text-gray-400 flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              صلاحية الحساب الحالية: 
              <span className="text-[#D4AF37] bg-[#D4AF37]/5 px-2 py-0.5 rounded border border-[#D4AF37]/10 font-black">
                {adminRole === 'super_admin' && 'مدير عام المنصة (Super Admin)'}
                {adminRole === 'technical_coach' && 'اللجنة الفنية والمدربين (Technical Coach)'}
                {adminRole === 'camps_manager' && 'مسؤول المعسكرات (Camps Manager)'}
                {adminRole === 'marketing_admin' && 'المسؤول الإعلامي والمسابقات (Marketing Admin)'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap dark:bg-white/5 bg-white p-1.5 rounded-3xl border border-white/5 w-full gap-1">
            {hasPermission('pending') && <>
                <button onClick={() => setActiveTab('pending')} className={`flex-1 min-w-[120px] py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${activeTab === 'pending' ? 'bg-[#F2D472] text-black' : 'dark:text-white text-[var(--color-text-gray)] dark:hover:bg-white/10 hover:bg-black/5 hover:text-[#D4AF37]'}`}>طلبات MGR</button>
                <button onClick={() => setActiveTab('approved_waiting')} className={`flex-1 min-w-[120px] py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${activeTab === 'approved_waiting' ? 'bg-sky-400 text-black' : 'dark:text-white text-[var(--color-text-gray)] dark:hover:bg-white/10 hover:bg-black/5 hover:text-[#D4AF37]'}`}>بانتظار الميدان</button>
                <button onClick={() => setActiveTab('final_accepted')} className={`flex-1 min-w-[120px] py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${activeTab === 'final_accepted' ? 'bg-emerald-400 text-black' : 'dark:text-white text-[var(--color-text-gray)] dark:hover:bg-white/10 hover:bg-black/5 hover:text-[#D4AF37]'}`}>المقبولين نهائياً</button>
                <button onClick={() => setActiveTab('final_rejected')} className={`flex-1 min-w-[120px] py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${activeTab === 'final_rejected' ? 'bg-red-500 text-white' : 'dark:text-white text-[var(--color-text-gray)] dark:hover:bg-white/10 hover:bg-black/5 hover:text-[#D4AF37]'}`}>المستبعدين</button>
              </>}
            
            {hasPermission('manage_camps') && <button onClick={() => setActiveTab('manage_camps')} className={`flex-1 min-w-[140px] py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${activeTab === 'manage_camps' ? 'bg-sky-500 text-black' : 'dark:text-gray-300 text-[var(--color-text-gray)] dark:hover:bg-white/10 hover:bg-black/5 hover:text-sky-500'}`}>🏟️ المعسكرات</button>}

            {hasPermission('manage_contests') && <button onClick={() => setActiveTab('manage_contests')} className={`flex-1 min-w-[140px] py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${activeTab === 'manage_contests' ? 'bg-[#D4AF37] text-black' : 'dark:text-white text-[var(--color-text-gray)] dark:hover:bg-white/10 hover:bg-black/5 hover:text-[#D4AF37]'}`}>🏆 المسابقات</button>}

            {hasPermission('manage_news') && <button onClick={() => setActiveTab('manage_news')} className={`flex-1 min-w-[140px] py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${activeTab === 'manage_news' ? 'bg-purple-600 text-white' : 'text-purple-400 dark:hover:bg-white/10 hover:bg-black/5'}`}>📰 الأخبار</button>}
 
             {hasPermission('manage_market') && <button onClick={() => setActiveTab('manage_market')} className={`flex-1 min-w-[140px] py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${activeTab === 'manage_market' ? 'bg-yellow-500 text-black' : 'dark:text-yellow-400 text-yellow-600 dark:hover:bg-white/10 hover:bg-black/5'}`}>🛒المنتجر</button>}
            {hasPermission('manage_shipping') && <button onClick={() => setActiveTab('manage_shipping')} className={`flex-1 min-w-[140px] py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${activeTab === 'manage_shipping' ? 'bg-orange-500 text-black' : 'dark:text-orange-400 text-orange-600 dark:hover:bg-white/10 hover:bg-black/5'}`}>🚚 أسعار التوصيل</button>}
            {hasPermission('manage_contact') && <button onClick={() => setActiveTab('manage_contact')} className={`flex-1 min-w-[140px] py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${activeTab === 'manage_contact' ? 'bg-teal-500 text-black' : 'text-teal-400 dark:hover:bg-white/10 hover:bg-black/5'}`}>✉️ التواصل</button>}
            {hasPermission('manage_staff') && <button onClick={() => setActiveTab('manage_staff')} className={`flex-1 min-w-[140px] py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${activeTab === 'manage_staff' ? 'bg-indigo-500 text-white' : 'dark:text-indigo-300 text-indigo-500 dark:hover:bg-white/10 hover:bg-black/5'}`}>👥 المدربين واللجنة الفنية</button>}

            {hasPermission('manage_admins') && <button onClick={() => setActiveTab('manage_admins')} className={`flex-1 min-w-[140px] py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${activeTab === 'manage_admins' ? 'bg-rose-500 text-white' : 'dark:text-rose-300 text-rose-500 dark:hover:bg-white/10 hover:bg-black/5'}`}>🛡️ حسابات الأدمن</button>}
          </div>
        </div>
        
        <main className="pt-4 relative z-0">
          {hasPermission(activeTab) && <>
              {['pending', 'approved_waiting', 'final_accepted', 'final_rejected'].includes(activeTab) && <PlayersSection activeTab={activeTab} navigate={navigate} />}
              {activeTab === 'manage_camps' && <CampsSection />}
              {activeTab === 'manage_contests' && <ContestsSection />}
              {activeTab === 'manage_news' && <NewsSection />}
              {activeTab === 'manage_contact' && <ContactSection />}
              {activeTab === 'manage_market' && <MarketSection />}
              {activeTab === 'manage_shipping' && <ShippingRatesSection />}
              {activeTab === 'manage_staff' && <StaffSection />}
              {activeTab === 'manage_admins' && <AdminsSection />}
            </>}
        </main>
      </div>
    </div>;
};
export default DashboardMain;
