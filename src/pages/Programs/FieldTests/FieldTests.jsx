import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from '../../../../public/bg_Field_tests.jpeg'; 
import coachImg from '../../../../public/coach.png';
import actionImg from '../../../../public/action.jpg'; 
import { useAuth } from '../../../contexts/AuthContext/AuthContext';
import Swal from 'sweetalert2';
const FieldTests = () => {
    const { user, updatePlayerState } = useAuth(); 
    const [reSubmitting, setReSubmitting] = useState(false);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    const playerData = user?.player || null;
    const role = user?.role; 

    const handleReSubmitTest = async (e) => {
        e.preventDefault();
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
                body: JSON.stringify({ 
                    status: 'approved', 
                    fieldTest: resetFieldTest 
                })
            });

            if (res.ok) {
                const updatedPlayer = await res.json();
                await updatePlayerState(updatedPlayer);
               Swal.fire({
                title: 'تم إرسال طلبك بنجاح! 🎉',
                text: 'سيتم مراجعة طلبك من قبل الإدارة، وسنقوم بتحديد موعد جديد لك للاختبارات الميدانية قريباً. يرجى متابعة حسابك بانتظام.',
                icon: 'success',
                background: '#121212',
                color: '#fff',
                confirmButtonColor: 'var(--color-gold-main)',
                confirmButtonText: 'حسناً، سأتابع'
            });       }
        } catch (err) {
            console.error("Error re-submitting test:", err);
        } finally {
            setReSubmitting(false);
        }
    };

    const handleShowDetails = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'قريباً',
            text: 'سيتم عرض تفاصيل الاختبارات العامة قريباً جداً!',
            icon: 'info',
            confirmButtonText: 'مفهوم',
            confirmButtonColor: '#a68946',
            background: '#1A1D1E',
            color: '#fff'
        });
  };

const[setIsUpgrading] = useState(false);
    const isAdmin = role === 'admin';
    const isRejectedPlayer =  playerData && playerData.fieldTest?.finalStatus === 'rejected';
    const isrejected =playerData?.status === 'rejected' ;
    const isPendingPlayer = playerData?.status === 'pending';
    const isApprovedPlayer =  playerData && playerData.status === 'approved' && playerData.fieldTest?.finalStatus !== 'rejected' && playerData.status !== 'pending';
    const isStaticUserCard =!isRejectedPlayer&&!isAdmin&&playerData?.status !== 'pending' && playerData?.status !== 'rejected' &&playerData?.status!== 'final_accepted' && role === 'user';

    return (
        <div 
            className="min-h-screen font-['Tajawal',_sans-serif] relative overflow-hidden flex flex-col" 
            style={{ backgroundColor: 'var(--color-bg-main)', color: 'var(--color-text-white)' }}
        >
            <div 
                className="absolute inset-0 z-0 pointer-events-none dark:bg-[url('/bg_Field_tests.jpeg')]
                 bg-[url('/bg_Field_tests_Light.png')] bg-cover bg-center bg-no-repeat filter contrast-[1.15] brightness-[1.05] saturate-[1.2]"
               
            ></div>
            <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>

            <header className="relative z-10 pt-8 px-12 flex flex-col items-center mb-8">
               
                
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
                </div>
            </header>

            <main className="relative z-10 flex-1 flex items-center max-w-[1500px] w-full mx-auto px-8 pb-12">
                <div className="relative z-20 w-full lg:w-[420px] flex flex-col gap-6 ms-auto lg:ms-0 mt-8 lg:mt-0">
                    
                    {isStaticUserCard && (
                        <div className="glass-card hover-gold-card card-shine rounded-[2rem] p-4 shadow-2xl relative z-30">
                            <div className="rounded-[1.5rem] overflow-hidden mb-4 h-[180px]">
                                <img src={actionImg} alt="Action" className="w-full h-full object-cover" />
                            </div>
                            <div className="px-3 pb-2 text-[15px] space-y-3">
                                <h3 className="font-black text-lg text-center" style={{ color: 'var(--color-gold-main)' }}>انضم إلى محاربي الملعب!</h3>
                                <p className="text-xs text-center leading-relaxed mb-2" style={{ color: 'var(--color-text-gray)' }}>
                                    لو عندك الشغف والمهارة وعايز تبدأ رحلتك وتكون لاعب كرة قدم محترف، قدم على طلب الانضمام الآن واشترك في الاختبارات الميدانية القادمة.
                                </p>
                                
                                <div className="flex gap-2 pt-2">
                                 
                                    <button 
                                        onClick={() => navigate('/profile' , { state: { openUpgradeForm: true } })}
                                        
                                        className="flex-1 text-[#1A1D1E] py-2.5 rounded-xl text-xs font-black shadow-lg hover:opacity-90 transition-opacity cursor-pointer relative z-40"
                                        style={{ background: 'var(--gold-gradient)' }}
                                    >
                                        سجل الآن كلاعب ⚽
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isRejectedPlayer && (
                        <div className="glass-card hover-gold-card card-shine rounded-[2rem] p-5 shadow-2xl text-center relative z-30">
                            <h3 className="font-black mb-3 text-xl text-red-400">ركن إعادة الاختبار</h3>
                            <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--color-text-gray)' }}>
                                للأسف لم تتخطى هذا الاختبار بنجاح، حاول مجدداً ولا تستسلم! اضغط على الزر بالأسفل لتقديم طلب إعادة الاختبار وتعديل حالتك إلى مقبول مجدداً لفتح فرصة جديدة.
                            </p>
                            <button
                                onClick={handleReSubmitTest}
                                disabled={reSubmitting}
                                className="w-full text-black font-black py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer relative z-40"
                                style={{ background: 'var(--gold-gradient)' }}
                            >
                                {reSubmitting ? 'جاري معالجة الطلب...' : 'إعادة الاختبار 🔄'}
                            </button>
                        </div>
                    )}
                    {isrejected && (
                        <div className="glass-card hover-gold-card card-shine rounded-[2rem] p-5 shadow-2xl text-center relative z-30">
                          <div className="rounded-[1.5rem] overflow-hidden mb-4 h-[180px]">
                                <img src={actionImg} alt="Action" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--color-text-gray)' }}>
                            <h3 className="font-black mb-3 text-xl text-red-400">​نشكرك على مشاركتنا موهبتك. في الوقت الحالي، لم نتمكن من قبول طلب انضمامك. ندعوك للعمل على تحسين مهاراتك وتحديث الفيديو التعريفي الخاص بك في ملفك الشخصي، وسنكون سعداء بمراجعة طلبك مجدداً.</h3>
                        </div>
                        </div>
                    )}
                    {isPendingPlayer && (
                        <div className="glass-card  hover-gold-card card-shine rounded-[2rem] p-5 shadow-2xl text-center relative z-30">
                          <div className="rounded-[1.5rem] overflow-hidden mb-4 h-[180px]">
                                <img src={actionImg} alt="Action" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--color-text-gray)' }}>
                            <h3 className="font-black mb-3 text-xl text-yellow-400">​طلب الانضمام الخاص بك قيد المعالجة حالياً. يمكنك متابعة حالة طلبك من خلال الملف الشخصي الخاص بك</h3>
                        </div>
                        </div>
                    )}
                    {isApprovedPlayer && (
                        <div className="glass-card hover-gold-card card-shine rounded-[2rem] p-5 shadow-2xl relative z-30">
                            <h3 className="font-black mb-4 text-xl" style={{ color: 'var(--color-gold-main)' }}>
                                ركن اللاعب المقبول
                            </h3>
                            
                            <div className="flex justify-between items-start mb-5">
                                <div className="space-y-1">
                                    <h4 className="font-black text-white text-xl">{playerData.name}</h4>
                                    <p className="text-[13px] max-w-[200px] leading-tight" style={{ color: 'var(--color-text-gray)' }}>
                                        {playerData.fieldTest?.date 
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

                                        <div className="flex justify-between items-center">
                                            <span className="text-[11px]" style={{ color: 'var(--color-text-gray)' }}>الكشاف: <span className="text-white">{playerData.fieldTest.coachName || 'كابتن محمد سمير'}</span></span>
                                            <div className="w-7 h-7 rounded-full overflow-hidden">
                                                <img src={coachImg} alt="Scout" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
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