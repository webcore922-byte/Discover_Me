import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Gift, Calendar, Award, MapPin, Target, List, Trophy, Ban, Crown, User, Check } from 'lucide-react';
import UseContestsLogic from './UseContestsLogic';

const ContestsSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('contests');
  const [submissionFilter, setSubmissionFilter] = useState('pending'); 
  const [annualFilter, setAnnualFilter] = useState('pending'); 

  const {
    contests,
    submissions,
    annualSubmissions,
    loading,
    editingContestId,
    contestForm,
    handleInputChange,
    handleSaveContest,
    handleEditClick,
    handleDeleteContest,
    resetForm,
    handleWinNormalSubmission,
    handleRejectNormalSubmission,
    handleRejectAnnualSubmission,
    handleAcceptAnnualSubmission
  } = UseContestsLogic();

  const getSubmissionStatusBadge = (status) => {
    switch (status) {
      case 'won':
        return <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-emerald-500/20 flex items-center gap-1 w-fit"><Trophy className="w-3 h-3"/> فاز</span>;
      case 'rejected':
        return <span className="bg-red-500/10 text-red-400 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-red-500/20 flex items-center gap-1 w-fit"><Ban className="w-3 h-3"/> مرفوض</span>;
      default:
        return <span className="bg-gray-500/10 text-gray-400 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-white/5 w-fit">قيد المراجعة</span>;
    }
  };

  const getAnnualStatusBadge = (status) => {
    switch (status) {
      case 'won':
        return <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-emerald-500/20 flex items-center gap-1 w-fit"><Check className="w-3 h-3"/> مشارك</span>;
      case 'rejected':
        return <span className="bg-red-500/10 text-red-400 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-red-500/20 flex items-center gap-1 w-fit"><Ban className="w-3 h-3"/> مستبعد</span>;
      default:
        return <span className="bg-gray-500/10 text-gray-400 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-white/5 w-fit">قيد المراجعة</span>;
    }
  };

  const getCategoryBadge = (cat) => {
    switch(cat) {
      case 'annual': return <span className="bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-amber-500/20">سنوية</span>;
      case 'monthly': return <span className="bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-blue-500/20">شعرية</span>;
      default: return <span className="bg-gray-500/10 text-gray-400 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-white/5">عادية</span>;
    }
  };

  if (loading) return <div className="text-center py-20 text-[#D4AF37] font-bold animate-pulse text-lg" dir="rtl">جاري تحميل التحديات والمسابقات...</div>;

  const pendingSubmissions = submissions.filter(s => !s.status || s.status === 'pending');
  const wonSubmissions = submissions.filter(s => s.status === 'won');
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected');

  const visibleSubmissions =
    submissionFilter === 'won' ? wonSubmissions :
    submissionFilter === 'rejected' ? rejectedSubmissions :
    pendingSubmissions;

  const pendingAnnual = annualSubmissions.filter(s => !s.status || s.status === 'pending');
  const participatingAnnual = annualSubmissions.filter(s => s.status === 'won');
  const excludedAnnual = annualSubmissions.filter(s => s.status === 'rejected');

  const visibleAnnualSubmissions =
    annualFilter === 'won' ? participatingAnnual :
    annualFilter === 'rejected' ? excludedAnnual :
    pendingAnnual;

  return (
    <div className="space-y-8 animate-fadeIn   dark:text-white text-[var(--color-text-gray)]" >

      {/* تبويب التحكم */}
      <div className="flex gap-4 p-2 dark:bg-white/5 bg-[var(--color-bg-card)] rounded-2xl w-fit border border-white/10 flex-wrap">
        <button onClick={() => setActiveTab('contests')} className={`px-6 py-2 rounded-xl font-black transition-all ${activeTab === 'contests' ? 'bg-[#D4AF37] text-black' : 'dark:text-gray-400 text-[var(--color-text-gray)] dark:hover:text-white'}`}>إدارة المسابقات</button>
        <button onClick={() => setActiveTab('submissions')} className={`px-6 py-2 rounded-xl font-black transition-all ${activeTab === 'submissions' ? 'bg-[#D4AF37] text-black' : 'dark:text-gray-400 text-[var(--color-text-gray)] dark:hover:text-white'}`}>طلبات المشاركة ({pendingSubmissions.length})</button>
        <button onClick={() => setActiveTab('annual')} className={`px-6 py-2 rounded-xl font-black transition-all flex items-center gap-1.5 ${activeTab === 'annual' ? 'bg-amber-500 text-black' : 'dark:text-gray-400 text-[var(--color-text-gray)] dark:hover:text-white'}`}><Crown className="w-4 h-4" /> الدوري السنوي ({pendingAnnual.length})</button>
      </div>

      {activeTab === 'contests' && (
        <>
          <div className="flex justify-start">
            <div className="dark:bg-white/5 bg-[var(--color-bg-card)] px-6 py-4 rounded-2xl border border-white/5 text-center min-w-[160px]">
              <p className="text-[10px] dark:text-gray-400 mb-1 font-bold">إجمالي التحديات الحالية</p>
              <p className="text-2xl font-black italic text-[#D4AF37]">{contests.length}</p>
            </div>
          </div>

          <div className="dark:bg-white/5 bg-[var(--color-bg-card)] rounded-[2rem] border border-white/10 p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-[4px] w-full bg-[#D4AF37]" />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-[#D4AF37] flex items-center gap-2">
                <Award className="w-5 h-5"/>
                {editingContestId ? `تعديل المسابقة (ID: ${editingContestId})` : 'إطلاق تحدي ومسابقة جديدة'}
              </h2>
              {editingContestId && (
                <button onClick={resetForm} className="text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-xl hover:bg-red-500 dark:hover:text-white transition-all flex items-center gap-1">
                  <X className="w-3 h-3"/> إلغاء التعديل
                </button>
              )}
            </div>

            <form onSubmit={handleSaveContest} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs dark:text-gray-400 block mb-1">عنوان التحدي / المسابقة</label>
                  <input type="text" name="title" value={contestForm.title} onChange={handleInputChange} className="w-full dark:bg-white/5 bg-[var(--color-bg-main)] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] dark:text-white" placeholder="مثال: تحدي دقة التمرير" required />
                </div>
                <div>
                  <label className="text-xs dark:text-gray-400 block mb-1">نوع التصنيف (Category)</label>
                  <select name="category" value={contestForm.category} onChange={handleInputChange} className="w-full dark:bg-[#1a1a1a] bg-[var(--color-bg-main)] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] dark:text-white appearance-none cursor-pointer">
                    <option value="normal">تحدي عادي (Normal)</option>
                    <option value="monthly">مسابقة شهرية (Monthly)</option>
                    <option value="annual">دوري سنوي (Annual)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs dark:text-gray-400 block mb-1">المحافظة / النطاق</label>
                  <input type="text" name="location" value={contestForm.location} onChange={handleInputChange} className="w-full dark:bg-white/5 bg-[var(--color-bg-main)] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] dark:text-white" placeholder="مثال: القاهرة" required />
                </div>
                <div>
                  <label className="text-xs dark:text-gray-400 block mb-1">الفترة الزمنية</label>
                  <input type="text" name="duration" value={contestForm.duration} onChange={handleInputChange} className="w-full dark:bg-white/5 bg-[var(--color-bg-main)] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] dark:text-white" placeholder="مثال: 20 يونيو" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-amber-400 block mb-1">الجائزة الأولى</label>
                  <input type="text" name="prize_first" value={contestForm.prizes.first} onChange={handleInputChange} className="w-full dark:bg-white/5 bg-[var(--color-bg-main)] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] dark:text-white" placeholder="مثال: طقم رياضي" required />
                </div>
                <div>
                  <label className="text-xs dark:text-gray-300 block mb-1">الجائزة الثانية</label>
                  <input type="text" name="prize_second" value={contestForm.prizes.second} onChange={handleInputChange} className="w-full dark:bg-white/5 bg-[var(--color-bg-main)] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] dark:text-white" placeholder="مثال: 300 ج.م" />
                </div>
                <div>
                  <label className="text-xs text-amber-500 block mb-1">الجائزة الكبرى</label>
                  <input type="text" name="prize_grand" value={contestForm.prizes.grand} onChange={handleInputChange} className="w-full dark:bg-white/5 bg-[var(--color-bg-main)] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] dark:text-white" placeholder="مثال: حذاء كروي" />
                </div>
                <div>
                  <label className="text-xs dark:text-gray-400 block mb-1">جوائز أخرى</label>
                  <input type="text" name="prize_others" value={contestForm.prizes.others} onChange={handleInputChange} className="w-full dark:bg-white/5 bg-[var(--color-bg-main)] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] dark:text-white" placeholder="مثال: كرات هدايا" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs dark:text-gray-400 block mb-1">رابط صورة المسابقة</label>
                  <input type="url" name="image" value={contestForm.image} onChange={handleInputChange} className="w-full dark:bg-white/5 bg-[var(--color-bg-main)] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] dark:text-white" placeholder="https://..." required />
                </div>
                <div>
                  <label className="text-xs dark:text-gray-400 block mb-1">الهدف من التحدي والقواعد</label>
                  <textarea name="goal" rows="3" value={contestForm.goal} onChange={handleInputChange} className="w-full dark:bg-white/5 bg-[var(--color-bg-main)] border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-[#D4AF37] dark:text-white" placeholder="القواعد..." required />
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-[#D4AF37] text-black rounded-xl font-black hover:bg-[#bfa232] shadow-lg flex items-center justify-center gap-2 transition-all">
                <Save className="w-4 h-4"/> {editingContestId ? 'تعديل وحفظ المسابقة' : 'نشر المسابقة للجمهور فوراً'}
              </button>
            </form>
          </div>

          <div className="dark:bg-white/5 bg-[var(--color-bg-card)] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="dark:bg-white/5 bg-[var(--color-bg-main)] text-[#D4AF37] text-sm font-black">
                    <th className="p-6">المسابقة</th>
                    <th className="p-6">التصنيف</th>
                    <th className="p-6">الهدف / القواعد</th>
                    <th className="p-6">النطاق</th>
                    <th className="p-6">الجوائز المرصودة</th>
                    <th className="p-6 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {contests.length === 0 ? (
                    <tr><td colSpan="6" className="p-10 text-center text-sm dark:text-gray-500 font-bold">لا توجد تحديات معلنة حالياً.</td></tr>
                  ) : (
                    contests.map(item => (
                      <tr key={item.id} className="dark:hover:bg-white/5 transition-all">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <img src={item.image} className="w-16 h-12 rounded-xl object-cover border border-white/10" alt="" onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=500"}} />
                            <div>
                              <p className="font-bold  dark:text-white">{item.title}</p>
                              <p className="text-xs dark:text-gray-400 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3 text-[#D4AF37]"/> {item.duration}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">{getCategoryBadge(item.category)}</td>
                        <td className="p-6 text-xs dark:text-gray-400 max-w-[220px] truncate">{item.goal}</td>
                        <td className="p-6 text-sm dark:text-gray-300"><span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 dark:text-gray-500" /> {item.location || 'كل المحافظات'}</span></td>
                        <td className="p-6 text-xs dark:text-gray-300">
                          <div className="space-y-1">
                            {item.prizes?.first && <p className="text-amber-400 font-semibold flex items-center gap-1"><Gift className="w-3 h-3"/> {item.prizes.first}</p>}
                            {item.prizes?.grand && <p className="text-yellow-500 font-bold flex items-center gap-1"><Target className="w-3 h-3"/> {item.prizes.grand}</p>}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => handleEditClick(item)} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold dark:hover:bg-blue-600 dark:hover:text-white transition-all">تعديل</button>
                            <button onClick={() => handleDeleteContest(item.id, item.title)} className="px-3 py-1.5 bg-red-900/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold dark:hover:bg-red-600 dark:hover:text-white transition-all">حذف</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'submissions' && (
        <div className="dark:bg-white/5 bg-[var(--bg-color-card)] rounded-[2rem] border border-white/10 p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3 bg-white p-4 rounded-2xl">
            <h2 className="text-xl font-black text-sky-400 flex items-center gap-2"><List className="w-5 h-5"/> طلبات المشاركة في المسابقات</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSubmissionFilter('pending')}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold ${submissionFilter === 'pending' ? 'bg-sky-600 dark:text-white border-sky-600' : 'border-white/10 dark:text-gray-300 dark:hover:bg-white/10 '}`}
              >
                قيد المراجعة ({pendingSubmissions.length})
              </button>
              <button
                onClick={() => setSubmissionFilter('won')}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold flex items-center gap-1 ${submissionFilter === 'won' ? 'bg-emerald-600 dark:text-white border-emerald-600' : 'border-white/10 dark:text-gray-300 dark:hover:bg-white/10'}`}
              >
                <Trophy className="w-3 h-3"/> الفائزين ({wonSubmissions.length})
              </button>
              <button
                onClick={() => setSubmissionFilter('rejected')}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold flex items-center gap-1 ${submissionFilter === 'rejected' ? 'bg-red-600 dark:text-white border-red-600' : 'border-white/10 dark:text-gray-300 dark:hover:bg-white/10'}`}
              >
                <Ban className="w-3 h-3"/> الخاسرين ({rejectedSubmissions.length})
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-sky-400 text-sm border-b dark:border-white/10 border-[var(--color-border)] font-black">
                  <th className="p-4">اسم المستخدم</th>
                  <th className="p-4">الايميل </th>
                  <th className="p-4">المسابقة</th>
                  <th className="p-4">رابط الفيديو</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">الجائزة الممنوحة</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visibleSubmissions.length === 0 ? (
                  <tr><td colSpan="7" className="p-10 text-center text-sm dark:text-gray-500">
                    {submissionFilter === 'won' ? 'لا يوجد فائزين حالياً.' : submissionFilter === 'rejected' ? 'لا يوجد طلبات مرفوضة حالياً.' : 'لا توجد طلبات قيد المراجعة حالياً.'}
                  </td></tr>
                ) : (
                  visibleSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/5 transition-all">
                      <td className="p-4 dark:text-white text-sm">{sub.userName || 'غير معروف'}</td>
                      <td className="p-4 dark:text-gray-300 text-sm">{sub.userEmail}</td>
                      <td className="p-4 dark:text-gray-300 text-sm">{sub.contestTitle}</td>
                      <td className="p-4"><a href={sub.videoUrl} target="_blank" rel="noreferrer" className="text-sky-400 underline text-xs">مشاهدة الفيديو</a></td>
                      <td className="p-4">{getSubmissionStatusBadge(sub.status)}</td>
                      <td className="p-4 text-xs">
                        {sub.awardedPrize ? (
                          <span className="text-amber-300 font-semibold flex items-center gap-1">
                            <Gift className="w-3 h-3" /> {sub.awardedPrize.label}: {sub.awardedPrize.value}
                          </span>
                        ) : (
                          <span className="dark:text-gray-500">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {(!sub.status || sub.status === 'pending') ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleWinNormalSubmission(sub)}
                              className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border dark:border-emerald-500/20 border-black rounded-lg text-xs font-bold hover:bg-emerald-600 dark:hover:text-white transition-all flex items-center gap-1"
                            >
                              <Trophy className="w-3 h-3"/> فاز
                            </button>
                            <button
                              onClick={() => handleRejectNormalSubmission(sub.id)}
                              className="px-3 py-1.5 bg-red-900/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-600 dark:hover:text-white transition-all flex items-center gap-1"
                            >
                              <Ban className="w-3 h-3"/> رفض
                            </button>
                          </div>
                        ) : (
                          <p className="text-center dark:text-gray-500 text-xs">—</p>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'annual' && (
        <div className="dark:bg-white/5 rounded-[2rem] border border-amber-500/20 p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-[4px] w-full bg-amber-500" />
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-black text-amber-400 flex items-center gap-2"><Crown className="w-5 h-5"/> مشاركو الدوري السنوي</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setAnnualFilter('pending')}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold ${annualFilter === 'pending' ? 'bg-amber-600 dark:text-white border-amber-600' : 'border-white/10 dark:text-gray-300 hover:bg-white/10'}`}
              >
                قيد المراجعة ({pendingAnnual.length})
              </button>
              <button
                onClick={() => setAnnualFilter('won')}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold flex items-center gap-1 ${annualFilter === 'won' ? 'bg-[var(--color-bg-card)] dark:text-white border-emerald-600' : 'border-white/10 dark:text-gray-300 hover:bg-white/10'}`}
              >
                <Check className="w-3 h-3"/> المشاركين ({participatingAnnual.length})
              </button>
              <button
                onClick={() => setAnnualFilter('rejected')}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold flex items-center gap-1 ${annualFilter === 'rejected' ? 'bg-red-600 dark:text-white border-red-600' : 'border-white/10 dark:text-gray-300 hover:bg-white/10'}`}
              >
                <Ban className="w-3 h-3"/> المستبعدين ({excludedAnnual.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-[var(--color-bg-card)]  rounded-[2rem] shadow-2xl">
            <table className="w-full text-right">
              <thead>
                <tr className="text-amber-400 text-sm border border-b-[var(--color-border)] dark:border-white/10">
                  <th className="p-4">اللاعب</th>
                  <th className="p-4">الايميل</th>
                  <th className="p-4">الدوري</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visibleAnnualSubmissions.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-sm dark:text-gray-500">
                    {annualFilter === 'won' ? 'لا يوجد مشاركين مؤكدين في الدوري حالياً.' : annualFilter === 'rejected' ? 'لا يوجد مستبعدين حالياً.' : 'لا توجد طلبات قيد المراجعة حالياً.'}
                  </td></tr>
                ) : (
                  visibleAnnualSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/5 transition-all">
                      <td className="p-4 dark:text-white text-sm">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-amber-400" />
                          {sub.userName || 'غير معروف'}
                        </span>
                      </td>
                      <td className="p-4 dark:text-gray-300 text-sm">{sub.userEmail}</td>
                      <td className="p-4 dark:text-gray-300 text-sm">{sub.leagueTitle}</td>
                      <td className="p-4">{getAnnualStatusBadge(sub.status)}</td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center items-center flex-wrap">
                          {/* عرض البروفايل كصفحة منفصلة - بناخد معانا بيانات المشاركة كاملة */}
                          <button
                            onClick={() => navigate('/dashboard/profile-prizes', { state: { submission: sub } })}
                            className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold hover:bg-blue-600 dark:hover:text-white transition-all flex items-center gap-1"
                          >
                            <User className="w-3 h-3"/> عرض البروفايل
                          </button>
                          {(!sub.status || sub.status === 'pending') && (
                            <>
                              <button
                                onClick={() => handleAcceptAnnualSubmission(sub)}
                                className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-600 dark:hover:text-white transition-all flex items-center gap-1"
                              >
                                <Check className="w-3 h-3"/> قبول المشاركة
                              </button>
                              <button
                                onClick={() => handleRejectAnnualSubmission(sub)}
                                className="px-3 py-1.5 bg-red-900/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-600 dark:hover:text-white transition-all flex items-center gap-1"
                              >
                                <Ban className="w-3 h-3"/> استبعاد
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestsSection;