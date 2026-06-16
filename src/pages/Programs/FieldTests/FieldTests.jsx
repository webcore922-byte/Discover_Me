import React, { useState, useEffect } from 'react';
import bgImg from '../../../../public/bg_Field_tests.jpeg'; 
import coachImg from '../../../../public/coach.png';
import { useAuth } from '../../../contexts/AuthContext/AuthContext';

const FieldTests = () => {
    const { user, updatePlayerState } = useAuth(); 
    const [generalTest, setGeneralTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reSubmitting, setReSubmitting] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    const playerData = user?.player || null;

    useEffect(() => {
        const fetchGeneralData = async () => {
            try {
                const generalRes = await fetch(`${API_URL}/generalTest`);
                if (generalRes.ok) {
                    const generalData = await generalRes.json();
                    setGeneralTest(generalData);
                }
            } catch (err) {
                console.error("خطأ أثناء جلب بيانات الاختبار العام:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGeneralData();
    }, [API_URL]);

    const handleReSubmitTest = async () => {
        if (!playerData || !user?.id) return;
        setReSubmitting(true);

        const resetFieldTest = {
            date: "",
            location: "",
            time: "",
            coachName: "",
            isDone: false,
            finalStatus: ""
        };

        try {
            const res = await fetch(`${API_URL}/players/${playerData.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fieldTest: resetFieldTest })
            });

            if (res.ok) {
                const updatedPlayer = await res.json();
                await updatePlayerState(updatedPlayer);
                alert("تم إرسال طلب إعادة التقديم بنجاح! انتظر تحديد موعد جديد.");
            }
        } catch (err) {
            console.error("Error re-submitting test:", err);
        } finally {
            setReSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-main)' }}>
                <div className="text-xl animate-pulse font-black" style={{ color: 'var(--color-gold-main)' }}>جاري تحميل البيانات...</div>
            </div>
        );
    }

    const shouldShowPlayerCard = user && playerData && playerData.status === 'approved' && playerData.fieldTest?.finalStatus !== 'accepted';

    return (
        <div 
            className="min-h-screen font-['Tajawal',_sans-serif] relative overflow-hidden flex flex-col" 
            dir="rtl"
            style={{ backgroundColor: 'var(--color-bg-main)', color: 'var(--color-text-white)' }}
        >
            {/* الخلفية */}
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

            {/* الهيدر */}
            <header className="relative z-10 pt-8 px-12 flex flex-col items-center mb-8">
                <div className="absolute top-8 right-12 text-2xl font-black tracking-wider drop-shadow-md">
                    اكتشفني
                </div>
                
                <div className="text-center mt-6">
                    <div className="relative inline-flex items-center justify-center gap-6 mb-4">
                        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" className="transform scale-x-[-1] mt-2 drop-shadow-md">
                            <path d="M5 25 C 15 20, 25 10, 35 5" stroke="var(--color-gold-main)" strokeWidth="4" strokeLinecap="round"/>
                            <path d="M15 28 C 22 24, 30 16, 38 12" stroke="var(--color-gold-main)" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
                            <path d="M25 30 C 30 27, 35 22, 40 18" stroke="var(--color-gold-main)" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
                        </svg>

                        <h1 className="text-5xl md:text-6xl font-black tracking-tight drop-shadow-lg text-gradient-gold">
                            الاختبارات الميدانية
                        </h1>

                        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" className="mt-2 drop-shadow-md">
                            <path d="M5 25 C 15 20, 25 10, 35 5" stroke="var(--color-gold-main)" strokeWidth="4" strokeLinecap="round"/>
                            <path d="M15 28 C 22 24, 30 16, 38 12" stroke="var(--color-gold-main)" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
                            <path d="M25 30 C 30 27, 35 22, 40 18" stroke="var(--color-gold-main)" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
                        </svg>
                    </div>
                    <p className="max-w-2xl mx-auto text-base leading-relaxed font-medium drop-shadow-md" style={{ color: 'var(--color-text-gray)' }}>
                        تمنحك الاختبارات الميدانية فرصة لتطبيق مهاراتك... <br />
                        يتم تقييم الأداء من قبل خبراء متخصصين...
                    </p>
                </div>
            </header>

            {/* المحتوى الرئيسي */}
            <main className="relative z-10 flex-1 flex items-center max-w-[1500px] w-full mx-auto px-8 pb-12">
                <div className="w-full lg:w-[420px] flex flex-col gap-6 ms-auto lg:ms-0 mt-8 lg:mt-0">
                    
                    {/* كارت الاختبار العام */}
                    {generalTest && (
                        <div className="glass-card hover-gold-card card-shine rounded-[2rem] p-3 shadow-2xl">
                            <div className="rounded-[1.5rem] overflow-hidden mb-4 h-[180px]">
                                <img src={generalTest.imageUrl || '../../../../public/action.jpg'} alt="Action" className="w-full h-full object-cover" />
                            </div>
                            <div className="px-3 pb-2 text-[15px] space-y-2.5">
                                <p><span className="font-bold" style={{ color: 'var(--color-gold-main)' }}>المكان:</span> <span style={{ color: 'var(--color-text-white)' }}>{generalTest.location}</span></p>
                                <p><span className="font-bold" style={{ color: 'var(--color-gold-main)' }}>المواعيد:</span> <span style={{ color: 'var(--color-text-white)' }}>{generalTest.date}</span></p>
                                <div className="flex justify-between items-center">
                                    <p><span className="font-bold" style={{ color: 'var(--color-gold-main)' }}>الشروط:</span> <span style={{ color: 'var(--color-text-white)' }}>{generalTest.conditions}</span></p>
                                    <button 
                                        className="text-[#1A1D1E] px-4 py-1.5 rounded-lg text-xs font-black shadow-lg hover:opacity-90 transition-opacity"
                                        style={{ background: 'var(--gold-gradient)' }}
                                    >
                                        عرض التفاصيل
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* كارت ركن اللاعب المقبول */}
                    {shouldShowPlayerCard && (
                        <div className="glass-card hover-gold-card card-shine rounded-[2rem] p-5 shadow-2xl relative">
                            <h3 className="font-black mb-4 text-xl" style={{ color: 'var(--color-gold-main)' }}>
                                ركن اللاعب المقبول
                            </h3>
                            
                            <div className="flex justify-between items-start mb-5">
                                <div className="space-y-1">
                                    <h4 className="font-black text-white text-xl">{playerData.name}</h4>
                                    <p className="text-[13px] max-w-[200px] leading-tight" style={{ color: 'var(--color-text-gray)' }}>
                                        {playerData.fieldTest?.finalStatus === 'rejected' 
                                            ? 'للأسف لم تتخطى هذا الاختبار بنجاح، حاول مجدداً ولا تستسلم!' 
                                            : playerData.fieldTest?.date 
                                            ? 'تهانينا! لقد تم قبولك للاختبارات. هذا هو موعدك الخاص:' 
                                            : 'سوف يتم تحديد موعد اختبارك الميداني قريباً من قبل الإدارة.'}
                                    </p>
                                </div>
                                <div className="w-[85px] h-[85px] rounded-2xl p-1 shrink-0 flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid rgba(166, 137, 70, 0.5)' }}>
                                    <img src={playerData.image} alt="Profile" className="w-full h-full rounded-xl object-cover" />
                                </div>
                            </div>

                            {playerData.fieldTest && playerData.fieldTest.date && playerData.fieldTest.location ? (
                                <div className="rounded-2xl p-4 border border-white/5 space-y-3" style={{ backgroundColor: 'var(--color-bg-card)' }}>
                                    <div className="flex justify-between items-start">
                                        <p className="text-[13px] font-bold text-white leading-relaxed">
                                            {playerData.fieldTest.location} | {playerData.fieldTest.date} | الساعة {playerData.fieldTest.time}
                                        </p>
                                        <div className="text-xl ml-2 icon-gold">📍</div>
                                    </div>
                                    
                                    <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[11px]" style={{ color: 'var(--color-text-gray)' }}>حالة حضور الاختبار:</span>
                                            {playerData.fieldTest.isDone ? (
                                                <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded">تم الاختبار ✅</span>
                                            ) : (
                                                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded animate-pulse">لم يتم بعد ⏳</span>
                                            )}
                                        </div>

                                        {playerData.fieldTest.finalStatus === 'rejected' ? (
                                            <div className="mt-2 text-center space-y-2">
                                                <p className="text-red-400 text-xs font-bold">حظاً أوفر المرة القادمة! يمكنك المحاولة والتقديم مرة أخرى الآن.</p>
                                                <button
                                                    onClick={handleReSubmitTest}
                                                    disabled={reSubmitting}
                                                    className="w-full text-black font-black py-2 rounded-xl text-xs hover:opacity-90 transition-opacity disabled:opacity-50"
                                                    style={{ background: 'var(--gold-gradient)' }}
                                                >
                                                    {reSubmitting ? 'جاري التتقديم...' : 'تقديم طلب اختبار جديد 🔄'}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <span className="text-[11px]" style={{ color: 'var(--color-text-gray)' }}>الكشاف: <span className="text-white">{playerData.fieldTest.coachName || 'كابتن محمد سمير'}</span></span>
                                                <div className="w-7 h-7 rounded-full overflow-hidden">
                                                    <img src={coachImg} alt="Scout" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl p-4 border border-white/5 text-center" style={{ backgroundColor: 'var(--color-bg-card)' }}>
                                    <p className="font-bold text-sm animate-pulse" style={{ color: 'var(--color-gold-main)' }}>
                                        سوف يتم تحديد موعد اختبارك قريباً
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FieldTests;