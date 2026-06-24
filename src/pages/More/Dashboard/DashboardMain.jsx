import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

import PlayersSection from '../../../components/Dashboard/PlayersSection';
import CampsSection from '../../../components/Dashboard/CampsSection';
import ContestsSection from '../../../components/Dashboard/ContestsSection';
import NewsSection from '../../../components/Dashboard/NewsSection';
import ContactSection from '../../../components/Dashboard/Contact';

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

      if (role === 'technical_coach') setActiveTab('pending');
      else if (role === 'camps_manager') setActiveTab('manage_camps');
      else if (role === 'marketing_admin') setActiveTab('manage_contests');
      else setActiveTab('pending');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const hasPermission = (tabName) => {
    if (adminRole === 'super_admin') return true; 
    
    const permissions = {
      technical_coach: ['pending', 'approved_waiting', 'final_accepted', 'final_rejected'],
      camps_manager: ['manage_camps'],
      marketing_admin: ['manage_contests', 'manage_news', 'manage_contact']
    };

    return permissions[adminRole]?.includes(tabName) || false;
  };

  return (
    <div className="min-h-screen bg-[#0e1011] text-white p-4 md:p-10" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] italic uppercase tracking-wider">لوحة التحكم الإدارية</h1>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 font-bold">
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
          <div className="flex flex-wrap bg-white/5 p-1.5 rounded-3xl border border-white/5 w-full">
            {hasPermission('pending') && (
              <>
                <button onClick={() => setActiveTab('pending')} className={`flex-1 min-w-[120px] py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'pending' ? 'bg-[#F2D472] text-black' : 'text-white'}`}>طلبات MGR</button>
                <button onClick={() => setActiveTab('approved_waiting')} className={`flex-1 min-w-[120px] py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'approved_waiting' ? 'bg-sky-400 text-black' : 'text-white'}`}>بانتظار الميدان</button>
                <button onClick={() => setActiveTab('final_accepted')} className={`flex-1 min-w-[120px] py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'final_accepted' ? 'bg-emerald-400 text-black' : 'text-white'}`}>المقبولين نهائياً</button>
                <button onClick={() => setActiveTab('final_rejected')} className={`flex-1 min-w-[120px] py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'final_rejected' ? 'bg-red-500 text-white' : 'text-white'}`}>المستبعدين</button>
              </>
            )}
            
            {hasPermission('manage_camps') && (
              <button onClick={() => setActiveTab('manage_camps')} className={`flex-1 min-w-[140px] py-3 rounded-2xl text-xs font-black ${activeTab === 'manage_camps' ? 'bg-sky-500 text-black' : 'text-gray-300'}`}>🏟️ المعسكرات</button>
            )}

            {hasPermission('manage_contests') && (
              <button onClick={() => setActiveTab('manage_contests')} className={`flex-1 min-w-[140px] py-3 rounded-2xl text-xs font-black ${activeTab === 'manage_contests' ? 'bg-[#D4AF37] text-black' : 'text-white'}`}>🏆 المسابقات</button>
            )}

            {hasPermission('manage_news') && (
              <button onClick={() => setActiveTab('manage_news')} className={`flex-1 min-w-[140px] py-3 rounded-2xl text-xs font-black ${activeTab === 'manage_news' ? 'bg-purple-600 text-white' : 'text-purple-400'}`}>📰 الأخبار</button>
            )}

            {hasPermission('manage_contact') && (
              <button onClick={() => setActiveTab('manage_contact')} className={`flex-1 min-w-[140px] py-3 rounded-2xl text-xs font-black ${activeTab === 'manage_contact' ? 'bg-teal-500 text-black' : 'text-teal-400'}`}>✉️ التواصل</button>
            )}
          </div>
        </div>
        
        <main className="pt-4">
          {hasPermission(activeTab) && (
            <>
              {['pending', 'approved_waiting', 'final_accepted', 'final_rejected'].includes(activeTab) && <PlayersSection activeTab={activeTab} navigate={navigate} />}
              {activeTab === 'manage_camps' && <CampsSection />}
              {activeTab === 'manage_contests' && <ContestsSection />}
              {activeTab === 'manage_news' && <NewsSection />}
              {activeTab === 'manage_contact' && <ContactSection />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardMain;