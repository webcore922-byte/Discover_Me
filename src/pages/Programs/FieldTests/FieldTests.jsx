import React from 'react';
import bgImg from '../../../../public/bg_Field_tests.jpeg'; 
import youssefImg from '../../../../public/youssef.png';
import coachImg from '../../../../public/coach.png';
import actionImg from '../../../../public/action.jpg';

const FieldTests = () => {
    return (
        <div 
            className="min-h-screen text-[#FFFFFF] font-['Tajawal',_sans-serif] relative overflow-hidden flex flex-col" 
            dir="rtl"
            style={{ backgroundColor: '#161819' }}
        >
            <div 
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `url(${bgImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'contrast(1.15) brightness(1.05) saturate(1.2)'
                }}
            ></div>
            <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>

            <header className="relative z-10 pt-8 px-12 flex flex-col items-center mb-8">
                <div className="absolute top-8 right-12 text-2xl font-black tracking-wider drop-shadow-md">
                    اكتشفني
                </div>
                
                <div className="text-center mt-6">
                    <div className="relative inline-flex items-center justify-center gap-6 mb-4">
                        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" className="transform scale-x-[-1] mt-2 drop-shadow-md">
                            <path d="M5 25 C 15 20, 25 10, 35 5" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round"/>
                            <path d="M15 28 C 22 24, 30 16, 38 12" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
                            <path d="M25 30 C 30 27, 35 22, 40 18" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
                        </svg>

                        <h1 className="text-5xl md:text-6xl font-black tracking-tight drop-shadow-lg">
                            الاختبارات الميدانية
                        </h1>

                        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" className="mt-2 drop-shadow-md">
                            <path d="M5 25 C 15 20, 25 10, 35 5" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round"/>
                            <path d="M15 28 C 22 24, 30 16, 38 12" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
                            <path d="M25 30 C 30 27, 35 22, 40 18" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
                        </svg>
                    </div>
                    <p className="text-[#B0B0B0] max-w-2xl mx-auto text-base leading-relaxed font-medium drop-shadow-md">
                        تمنحك الاختبارات الميدانية فرصة لتطبيق مهاراتك... <br />
                        يتم تقييم الأداء من قبل خبراء متخصصين...
                    </p>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex items-center max-w-[1500px] w-full mx-auto px-8 pb-12">
                
                <div className="w-full lg:w-[420px] flex flex-col gap-6 ms-auto lg:ms-0 mt-8 lg:mt-0">
                    
                    <div className="bg-[#1A1D1E]/80 border-[1px] border-[#D4AF37]/40 rounded-[2rem] p-3 backdrop-blur-md shadow-2xl">
                        <div className="rounded-[1.5rem] overflow-hidden mb-4 h-[180px]">
                            <img src={actionImg} alt="Action" className="w-full h-full object-cover" />
                        </div>
                        <div className="px-3 pb-2 text-[15px] space-y-2.5">
                            <p><span className="text-[#D4AF37] font-bold">المكان:</span> <span className="text-white">نادي الجزيرة، القاهرة</span></p>
                            <p><span className="text-[#D4AF37] font-bold">المواعيد:</span> <span className="text-white">السبت 15 مايو - الأحد 16 مايو</span></p>
                            <div className="flex justify-between items-center">
                                <p><span className="text-[#D4AF37] font-bold">الشروط:</span> <span className="text-white">الفئة العمرية 14-17 سنة</span></p>
                                <button className="bg-gradient-to-r from-[#D4AF37] to-[#A68946] text-[#1A1D1E] px-4 py-1.5 rounded-lg text-xs font-black shadow-lg hover:opacity-90 transition-opacity">
                                    عرض التفاصيل
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1A1D1E]/80 border-[1px] border-[#D4AF37]/40 rounded-[2rem] p-5 backdrop-blur-md shadow-2xl relative">
                        <h3 className="text-[#D4AF37] font-black mb-4 text-xl">
                            ركن اللاعب المقبول
                        </h3>
                        
                        <div className="flex justify-between items-start mb-5">
                            <div className="space-y-1">
                                <h4 className="font-black text-white text-xl">يوسف حسن</h4>
                                <p className="text-[13px] text-[#A0A0A0] max-w-[200px] leading-tight">
                                    تهانينا! لقد تم قبولك للاختبارات. هذا هو موعدك الخاص:
                                </p>
                            </div>
                            <div className="w-[85px] h-[85px] rounded-2xl border border-[#D4AF37]/50 p-1 shrink-0 bg-[#2A2D2E]">
                                <img src={youssefImg} alt="Profile" className="w-full h-full rounded-xl object-cover" />
                            </div>
                        </div>

                        <div className="bg-[#242728]/90 rounded-2xl p-4 border border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[13px] font-bold text-white leading-relaxed">القاهرة - نادي الجزيرة | الأحد 16 مايو | الساعة 4 عصراً</p>
                                <div className="text-[#D4AF37] text-xl ml-2">📍</div>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-white/10">
                                <div className="flex items-center gap-1.5 bg-[#1F2F24] text-[#4ADE80] px-3 py-1 rounded-md text-[11px] font-bold">
                                    Confirmed <span className="w-2 h-2 bg-[#4ADE80] rounded-full inline-block"></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-[#A0A0A0]">الكشاف: <span className="text-white">كابتن محمد سمير</span></span>
                                    <div className="w-7 h-7 rounded-full overflow-hidden">
                                        <img src={coachImg} alt="Scout" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default FieldTests;
