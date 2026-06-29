import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export const PRIZE_LABELS = {
  first: 'الجائزة الأولى',
  second: 'الجائزة الثانية',
  grand: 'الجائزة الكبرى',
  others: 'جوائز أخرى'
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function UseContestsLogic () {
  const [contests, setContests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [annualSubmissions, setAnnualSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingContestId, setEditingContestId] = useState(null);

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

  return {
    contests,
    submissions,
    annualSubmissions,
    loading,
    editingContestId,
    contestForm,
    setContests,
    setSubmissions,
    setAnnualSubmissions,
    handleInputChange,
    handleSaveContest,
    handleEditClick,
    handleDeleteContest,
    resetForm,
    handleWinNormalSubmission,
    handleRejectNormalSubmission,
    handleRejectAnnualSubmission,
    handleAcceptAnnualSubmission
  };
};

