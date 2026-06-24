import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Save, X, Gift, Calendar, Award, MapPin, Target, Layers, List, Trophy, Ban, Crown, User, Check } from 'lucide-react';

const ContestsSection = () => {
  const [contests, setContests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [annualSubmissions, setAnnualSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('contests');
  const [loading, setLoading] = useState(true);
  const [editingContestId, setEditingContestId] = useState(null);
  const [submissionFilter, setSubmissionFilter] = useState('pending'); // pending | won | rejected
  const [annualFilter, setAnnualFilter] = useState('pending'); // pending | won (مشارك) | rejected (مستبعد)
  const navigate = useNavigate();

  const [contestForm, setContestForm] = useState({
    title: '',
    goal: '',
    duration: '',
    location: '',
    image: '',
    category: 'normal',
    prizes: {
      first: '',
      second: '',
      grand: '',
      others: ''
    }
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // أسماء العرض لكل نوع جايزة، مستخدمة في السيلكت بتاع اختيار الجايزة
  const PRIZE_LABELS = {
    first: 'الجائزة الأولى',
    second: 'الجائزة الثانية',
    grand: 'الجائزة الكبرى',
    others: 'جوائز أخرى'
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [contestsRes, subsRes, annualRes] = await Promise.all([
          fetch(`${API_URL}/prizesAndCompetitions`),
          fetch(`${API_URL}/contest-submissions`),
          fetch(`${API_URL}/annual-league-submissions`)
        ]);
        if (contestsRes.ok) {
          const data = await contestsRes.json();
          setContests(Array.isArray(data) ? data : []);
        }
        if (subsRes.ok) {
          const subData = await subsRes.json();
          setSubmissions(Array.isArray(subData) ? subData : []);
        }
        if (annualRes.ok) {
          const annualData = await annualRes.json();
          setAnnualSubmissions(Array.isArray(annualData) ? annualData : []);
        }
      } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('prize_')) {
      const prizeKey = name.replace('prize_', '');
      setContestForm(prev => ({
        ...prev,
        prizes: { ...prev.prizes, [prizeKey]: value }
      }));
    } else {
      setContestForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveContest = async (e) => {
    e.preventDefault();
    try {
      if (editingContestId) {
        const res = await fetch(`${API_URL}/prizesAndCompetitions/${editingContestId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contestForm)
        });
        if (res.ok) {
          const updated = await res.json();
          setContests(contests.map(c => c.id === editingContestId ? updated : c));
          Swal.fire({ title: 'تم التحديث بنجاح!', icon: 'success', background: '#1a1a1a', color: '#D4AF37' });
          resetForm();
        }
      } else {
        const res = await fetch(`${API_URL}/prizesAndCompetitions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...contestForm, id: String(Date.now()) })
        });
        if (res.ok) {
          const newContest = await res.json();
          setContests([newContest, ...contests]);
          Swal.fire({ title: 'تم إطلاق المسابقة!', icon: 'success', background: '#1a1a1a', color: '#D4AF37' });
          resetForm();
        }
      }
    } catch (err) { 
      console.error(err); 
      Swal.fire({ title: 'حدث خطأ غير متوقع', icon: 'error', background: '#1a1a1a' });
    }
  };

  const handleEditClick = (item) => {
    setEditingContestId(item.id);
    setContestForm({
      title: item.title || '',
      goal: item.goal || '',
      duration: item.duration || '',
      location: item.location || '',
      image: item.image || '',
      category: item.category || 'normal',
      prizes: {
        first: item.prizes?.first || '',
        second: item.prizes?.second || '',
        grand: item.prizes?.grand || '',
        others: item.prizes?.others || ''
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteContest = async (id, title) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف مسابقة "${title}" نهائياً!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4444',
      cancelButtonColor: '#444',
      confirmButtonText: 'نعم، احذفها',
      background: '#1a1a1a', color: '#fff'
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/prizesAndCompetitions/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setContests(contests.filter(c => c.id !== id));
          Swal.fire({ title: 'تم الحذف بنجاح!', icon: 'success', background: '#1a1a1a' });
        }
      } catch (err) { console.error(err); }
    }
  };

  const resetForm = () => {
    setEditingContestId(null);
    setContestForm({
      title: '', goal: '', duration: '', location: '', image: '', category: 'normal',
      prizes: { first: '', second: '', grand: '', others: '' }
    });
  };

  // مساعد عام: يفتح سيلكت لاختيار جايزة من جوايز مسابقة معينة، ويرجع المفتاح المختار أو null لو لغى
  // (مستخدم فقط في المسابقات العادية - الدوري السنوي بقى مشاركة/استبعاد من غير جوايز)
  const pickPrizeForContest = async (contest, winnerLabel) => {
    const prizes = contest?.prizes || {};
    const availablePrizeKeys = Object.keys(PRIZE_LABELS).filter(key => prizes[key]);

    if (availablePrizeKeys.length === 0) {
      Swal.fire({
        title: 'لا توجد جوائز محددة',
        text: 'لم يتم تسجيل أي جوائز لهذه المسابقة، أضف الجوائز أولاً من تبويب إدارة المسابقات.',
        icon: 'warning',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#D4AF37'
      });
      return null;
    }

    const { value: selectedKey } = await Swal.fire({
      title: 'اختيار جائزة الفوز',
      html: `
        <p style="font-size:13px;color:#ccc;margin-bottom:10px;">
          اختر الجائزة التي سيحصل عليها <strong style="color:#D4AF37">${winnerLabel}</strong> من جوائز "<strong style="color:#D4AF37">${contest?.title || ''}</strong>"
        </p>
      `,
      input: 'select',
      inputOptions: availablePrizeKeys.reduce((acc, key) => {
        acc[key] = `${PRIZE_LABELS[key]} — ${prizes[key]}`;
        return acc;
      }, {}),
      inputPlaceholder: 'اختر الجائزة',
      showCancelButton: true,
      confirmButtonColor: '#D4AF37',
      cancelButtonColor: '#444',
      confirmButtonText: 'تأكيد الفوز',
      cancelButtonText: 'إلغاء',
      background: '#1a1a1a',
      color: '#fff',
      didOpen: () => {
    const select = Swal.getInput();
    if (select) {
      select.style.backgroundColor = '#1a1a1a';
      select.style.color = '#fff';
      select.style.border = '1px solid #D4AF37';
    }
  },
      inputValidator: (value) => {
        if (!value) return 'يجب اختيار جائزة لتأكيد الفوز';
      }
      
    });

    if (!selectedKey) return null;
    return { key: selectedKey, label: PRIZE_LABELS[selectedKey], value: prizes[selectedKey] };
  };

  // فوز في مسابقة عادية - الأدمن يختار الجايزة من جوايز المسابقة نفسها قبل الحفظ
  const handleWinNormalSubmission = async (sub) => {
    const contest = contests.find(c => c.title === sub.contestTitle);
    const awardedPrize = await pickPrizeForContest(contest, sub.userName || sub.userEmail);
    if (!awardedPrize) return; // لغى الاختيار أو مفيش جوايز

    try {
      const res = await fetch(`${API_URL}/contest-submissions/${sub.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'won', IsDoneAll: true, awardedPrize })
      });
      if (res.ok) {
        const updated = await res.json();
        setSubmissions(prev => prev.map(s => s.id === sub.id ? updated : s));
        Swal.fire({
          title: 'تم تسجيل الفوز! 🏆',
          text: `تم منح "${awardedPrize.label}: ${awardedPrize.value}"`,
          icon: 'success',
          background: '#1a1a1a',
          color: '#D4AF37',
          confirmButtonColor: '#D4AF37'
        });
      } else {
        Swal.fire({ title: 'حدث خطأ أثناء التحديث', icon: 'error', background: '#1a1a1a' });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ title: 'حدث خطأ في الاتصال بالسيرفر', icon: 'error', background: '#1a1a1a' });
    }
  };

  // رفض طلب مشاركة في مسابقة عادية
  const handleRejectNormalSubmission = async (subId) => {
    try {
      const res = await fetch(`${API_URL}/contest-submissions/${subId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', IsDoneAll: true })
      });
      if (res.ok) {
        const updated = await res.json();
        setSubmissions(prev => prev.map(s => s.id === subId ? updated : s));
        Swal.fire({ title: 'تم رفض الطلب', icon: 'info', background: '#1a1a1a', color: '#fff', confirmButtonColor: '#D4AF37' });
      } else {
        Swal.fire({ title: 'حدث خطأ أثناء التحديث', icon: 'error', background: '#1a1a1a' });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ title: 'حدث خطأ في الاتصال بالسيرفر', icon: 'error', background: '#1a1a1a' });
    }
  };

  // استبعاد مشارك من الدوري السنوي
  const handleRejectAnnualSubmission = async (sub) => {
    try {
      const res = await fetch(`${API_URL}/annual-league-submissions/${sub.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (res.ok) {
        const updated = await res.json();
        setAnnualSubmissions(prev => prev.map(s => s.id === sub.id ? updated : s));
        Swal.fire({ title: 'تم استبعاد اللاعب', icon: 'info', background: '#1a1a1a', color: '#fff', confirmButtonColor: '#D4AF37' });
      } else {
        Swal.fire({ title: 'حدث خطأ أثناء التحديث', icon: 'error', background: '#1a1a1a' });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ title: 'حدث خطأ في الاتصال بالسيرفر', icon: 'error', background: '#1a1a1a' });
    }
  };

  // قبول مشاركة لاعب في الدوري السنوي (من غير اختيار جوايز - مجرد تأكيد مشاركة)
  const handleAcceptAnnualSubmission = async (sub) => {
    try {
      const res = await fetch(`${API_URL}/annual-league-submissions/${sub.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'won' })
      });
      if (res.ok) {
        const updated = await res.json();
        setAnnualSubmissions(prev => prev.map(s => s.id === sub.id ? updated : s));
        Swal.fire({
          title: 'تم قبول المشاركة! ✅',
          text: 'تم تأكيد مشاركة اللاعب في الدوري السنوي.',
          icon: 'success',
          background: '#1a1a1a',
          color: '#D4AF37',
          confirmButtonColor: '#D4AF37'
        });
      } else {
        Swal.fire({ title: 'حدث خطأ أثناء التحديث', icon: 'error', background: '#1a1a1a' });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ title: 'حدث خطأ في الاتصال بالسيرفر', icon: 'error', background: '#1a1a1a' });
    }
  };

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

  // بادچ الحالة الخاص بالدوري السنوي: مشارك / مستبعد / قيد المراجعة
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
    <div className="space-y-8 animate-fadeIn" dir="rtl">
      
      {/* تبويب التحكم */}
      <div className="flex gap-4 p-2 bg-white/5 rounded-2xl w-fit border border-white/10 flex-wrap">
        <button onClick={() => setActiveTab('contests')} className={`px-6 py-2 rounded-xl font-black transition-all ${activeTab === 'contests' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}>إدارة المسابقات</button>
        <button onClick={() => setActiveTab('submissions')} className={`px-6 py-2 rounded-xl font-black transition-all ${activeTab === 'submissions' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}>طلبات المشاركة ({pendingSubmissions.length})</button>
        <button onClick={() => setActiveTab('annual')} className={`px-6 py-2 rounded-xl font-black transition-all flex items-center gap-1.5 ${activeTab === 'annual' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}><Crown className="w-4 h-4" /> الدوري السنوي ({pendingAnnual.length})</button>
      </div>

      {activeTab === 'contests' && (
        <>
          <div className="flex justify-start">
            <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/5 text-center min-w-[160px]">
              <p className="text-[10px] text-gray-400 mb-1 font-bold">إجمالي التحديات الحالية</p>
              <p className="text-2xl font-black italic text-[#D4AF37]">{contests.length}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-[4px] w-full bg-[#D4AF37]" />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-[#D4AF37] flex items-center gap-2">
                <Award className="w-5 h-5"/> 
                {editingContestId ? `تعديل المسابقة (ID: ${editingContestId})` : 'إطلاق تحدي ومسابقة جديدة'}
              </h2>
              {editingContestId && (
                <button onClick={resetForm} className="text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-1">
                  <X className="w-3 h-3"/> إلغاء التعديل
                </button>
              )}
            </div>

            <form onSubmit={handleSaveContest} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">عنوان التحدي / المسابقة</label>
                  <input type="text" name="title" value={contestForm.title} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="مثال: تحدي دقة التمرير" required />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">نوع التصنيف (Category)</label>
                  <select name="category" value={contestForm.category} onChange={handleInputChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white appearance-none cursor-pointer">
                    <option value="normal">تحدي عادي (Normal)</option>
                    <option value="monthly">مسابقة شهرية (Monthly)</option>
                    <option value="annual">دوري سنوي (Annual)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">المحافظة / النطاق</label>
                  <input type="text" name="location" value={contestForm.location} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="مثال: القاهرة" required />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">الفترة الزمنية</label>
                  <input type="text" name="duration" value={contestForm.duration} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="مثال: 20 يونيو" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-amber-400 block mb-1">الجائزة الأولى</label>
                  <input type="text" name="prize_first" value={contestForm.prizes.first} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="مثال: طقم رياضي" required />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">الجائزة الثانية</label>
                  <input type="text" name="prize_second" value={contestForm.prizes.second} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="مثال: 300 ج.م" />
                </div>
                <div>
                  <label className="text-xs text-amber-500 block mb-1">الجائزة الكبرى</label>
                  <input type="text" name="prize_grand" value={contestForm.prizes.grand} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="مثال: حذاء كروي" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">جوائز أخرى</label>
                  <input type="text" name="prize_others" value={contestForm.prizes.others} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="مثال: كرات هدايا" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">رابط صورة المسابقة</label>
                  <input type="url" name="image" value={contestForm.image} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="https://..." required />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">الهدف من التحدي والقواعد</label>
                  <textarea name="goal" rows="3" value={contestForm.goal} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-[#D4AF37] text-white" placeholder="القواعد..." required />
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-[#D4AF37] text-black rounded-xl font-black hover:bg-[#bfa232] shadow-lg flex items-center justify-center gap-2 transition-all">
                <Save className="w-4 h-4"/> {editingContestId ? 'تعديل وحفظ المسابقة' : 'نشر المسابقة للجمهور فوراً'}
              </button>
            </form>
          </div>

          <div className="bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-white/5 text-[#D4AF37] text-sm font-black">
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
                    <tr><td colSpan="6" className="p-10 text-center text-sm text-gray-500 font-bold">لا توجد تحديات معلنة حالياً.</td></tr>
                  ) : (
                    contests.map(item => (
                      <tr key={item.id} className="hover:bg-white/5 transition-all">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <img src={item.image} className="w-16 h-12 rounded-xl object-cover border border-white/10" alt="" onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=500"}} />
                            <div>
                              <p className="font-bold text-base text-white">{item.title}</p>
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3 text-[#D4AF37]"/> {item.duration}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">{getCategoryBadge(item.category)}</td>
                        <td className="p-6 text-xs text-gray-400 max-w-[220px] truncate">{item.goal}</td>
                        <td className="p-6 text-sm text-gray-300"><span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-500" /> {item.location || 'كل المحافظات'}</span></td>
                        <td className="p-6 text-xs text-gray-300">
                          <div className="space-y-1">
                            {item.prizes?.first && <p className="text-amber-400 font-semibold flex items-center gap-1"><Gift className="w-3 h-3"/> {item.prizes.first}</p>}
                            {item.prizes?.grand && <p className="text-yellow-500 font-bold flex items-center gap-1"><Target className="w-3 h-3"/> {item.prizes.grand}</p>}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => handleEditClick(item)} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">تعديل</button>
                            <button onClick={() => handleDeleteContest(item.id, item.title)} className="px-3 py-1.5 bg-red-900/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all">حذف</button>
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
        <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-black text-sky-400 flex items-center gap-2"><List className="w-5 h-5"/> طلبات المشاركة في المسابقات</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSubmissionFilter('pending')}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold ${submissionFilter === 'pending' ? 'bg-sky-600 text-white border-sky-600' : 'border-white/10 text-gray-300 hover:bg-white/10'}`}
              >
                قيد المراجعة ({pendingSubmissions.length})
              </button>
              <button
                onClick={() => setSubmissionFilter('won')}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold flex items-center gap-1 ${submissionFilter === 'won' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-white/10 text-gray-300 hover:bg-white/10'}`}
              >
                <Trophy className="w-3 h-3"/> الفائزين ({wonSubmissions.length})
              </button>
              <button
                onClick={() => setSubmissionFilter('rejected')}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold flex items-center gap-1 ${submissionFilter === 'rejected' ? 'bg-red-600 text-white border-red-600' : 'border-white/10 text-gray-300 hover:bg-white/10'}`}
              >
                <Ban className="w-3 h-3"/> الخاسرين ({rejectedSubmissions.length})
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-sky-400 text-sm border-b border-white/10">
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
                  <tr><td colSpan="7" className="p-10 text-center text-sm text-gray-500">
                    {submissionFilter === 'won' ? 'لا يوجد فائزين حالياً.' : submissionFilter === 'rejected' ? 'لا يوجد طلبات مرفوضة حالياً.' : 'لا توجد طلبات قيد المراجعة حالياً.'}
                  </td></tr>
                ) : (
                  visibleSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/5 transition-all">
                      <td className="p-4 text-white text-sm">{sub.userName || 'غير معروف'}</td>
                      <td className="p-4 text-gray-300 text-sm">{sub.userEmail}</td>
                      <td className="p-4 text-gray-300 text-sm">{sub.contestTitle}</td>
                      <td className="p-4"><a href={sub.videoUrl} target="_blank" rel="noreferrer" className="text-sky-400 underline text-xs">مشاهدة الفيديو</a></td>
                      <td className="p-4">{getSubmissionStatusBadge(sub.status)}</td>
                      <td className="p-4 text-xs">
                        {sub.awardedPrize ? (
                          <span className="text-amber-300 font-semibold flex items-center gap-1">
                            <Gift className="w-3 h-3" /> {sub.awardedPrize.label}: {sub.awardedPrize.value}
                          </span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {(!sub.status || sub.status === 'pending') ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleWinNormalSubmission(sub)}
                              className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1"
                            >
                              <Trophy className="w-3 h-3"/> فاز
                            </button>
                            <button
                              onClick={() => handleRejectNormalSubmission(sub.id)}
                              className="px-3 py-1.5 bg-red-900/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all flex items-center gap-1"
                            >
                              <Ban className="w-3 h-3"/> رفض
                            </button>
                          </div>
                        ) : (
                          <p className="text-center text-gray-500 text-xs">—</p>
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
        <div className="bg-white/5 rounded-[2rem] border border-amber-500/20 p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-[4px] w-full bg-amber-500" />
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-black text-amber-400 flex items-center gap-2"><Crown className="w-5 h-5"/> مشاركو الدوري السنوي</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setAnnualFilter('pending')}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold ${annualFilter === 'pending' ? 'bg-amber-600 text-white border-amber-600' : 'border-white/10 text-gray-300 hover:bg-white/10'}`}
              >
                قيد المراجعة ({pendingAnnual.length})
              </button>
              <button
                onClick={() => setAnnualFilter('won')}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold flex items-center gap-1 ${annualFilter === 'won' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-white/10 text-gray-300 hover:bg-white/10'}`}
              >
                <Check className="w-3 h-3"/> المشاركين ({participatingAnnual.length})
              </button>
              <button
                onClick={() => setAnnualFilter('rejected')}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold flex items-center gap-1 ${annualFilter === 'rejected' ? 'bg-red-600 text-white border-red-600' : 'border-white/10 text-gray-300 hover:bg-white/10'}`}
              >
                <Ban className="w-3 h-3"/> المستبعدين ({excludedAnnual.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-amber-400 text-sm border-b border-white/10">
                  <th className="p-4">اللاعب</th>
                  <th className="p-4">الايميل</th>
                  <th className="p-4">الدوري</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visibleAnnualSubmissions.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-sm text-gray-500">
                    {annualFilter === 'won' ? 'لا يوجد مشاركين مؤكدين في الدوري حالياً.' : annualFilter === 'rejected' ? 'لا يوجد مستبعدين حالياً.' : 'لا توجد طلبات قيد المراجعة حالياً.'}
                  </td></tr>
                ) : (
                  visibleAnnualSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/5 transition-all">
                      <td className="p-4 text-white text-sm">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-amber-400" />
{sub.userName || 'غير معروف'}                        </span>
                      </td>
                      <td className="p-4 text-gray-300 text-sm">{sub.userEmail}</td>
                      <td className="p-4 text-gray-300 text-sm">{sub.leagueTitle}</td>
                      <td className="p-4">{getAnnualStatusBadge(sub.status)}</td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center items-center flex-wrap">
                          {/* عرض البروفايل كصفحة منفصلة - بناخد معانا بيانات المشاركة كاملة */}
                          <button
                            onClick={() => navigate('/dashboard/profile-prizes', { state: { submission: sub } })}
                            className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1"
                          >
                            <User className="w-3 h-3"/> عرض البروفايل
                          </button>
                          {(!sub.status || sub.status === 'pending') && (
                            <>
                              <button
                                onClick={() => handleAcceptAnnualSubmission(sub)}
                                className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1"
                              >
                                <Check className="w-3 h-3"/> قبول المشاركة
                              </button>
                              <button
                                onClick={() => handleRejectAnnualSubmission(sub)}
                                className="px-3 py-1.5 bg-red-900/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all flex items-center gap-1"
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