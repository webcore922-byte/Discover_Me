import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Save, X, Gift, Calendar, Award, MapPin, Target, Layers } from 'lucide-react';

const ContestsSection = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingContestId, setEditingContestId] = useState(null);
  
  const [contestForm, setContestForm] = useState({
    title: '',
    goal: '',
    duration: '',
    location: '',
    image: '',
    category: 'normal', // القيمة الافتراضية
    prizes: {
      first: '',
      second: '',
      grand: '',
      others: ''
    }
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/prizesAndCompetitions`);
        if (res.ok) {
          const data = await res.json();
          setContests(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("خطأ في جلب المسابقات:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
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

  // دالة مساعدة لعرض اسم الكاتوجري بشكل جمالي في الجدول
  const getCategoryBadge = (cat) => {
    switch(cat) {
      case 'annual': return <span className="bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-amber-500/20">سنوية</span>;
      case 'monthly': return <span className="bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-blue-500/20">شعرية</span>;
      default: return <span className="bg-gray-500/10 text-gray-400 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-white/5">عادية</span>;
    }
  };

  if (loading) return <div className="text-center py-20 text-[#D4AF37] font-bold animate-pulse text-lg" dir="rtl">جاري تحميل التحديات والمسابقات...</div>;

  return (
    <div className="space-y-8 animate-fadeIn" dir="rtl">
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
          {/* تم تعديل الجريد ليصبح 4 أعمدة لاستيعاب حقل الاختيار الجديد */}
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
              <input type="text" name="location" value={contestForm.location} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="مثال: القاهرة أو كل المحافظات" required />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">الفترة الزمنية / المدة</label>
              <input type="text" name="duration" value={contestForm.duration} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="مثال: 20 يونيو - 10 يوليو" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-amber-400 block mb-1">الجائزة الأولى (المركز الأول)</label>
              <input type="text" name="prize_first" value={contestForm.prizes.first} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="مثال: طقم رياضي كامل" required />
            </div>
            <div>
              <label className="text-xs text-gray-300 block mb-1">الجائزة الثانية</label>
              <input type="text" name="prize_second" value={contestForm.prizes.second} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="مثال: 300 ج.م" />
            </div>
            <div>
              <label className="text-xs text-amber-500 block mb-1">الجائزة الكبرى (Grand)</label>
              <input type="text" name="prize_grand" value={contestForm.prizes.grand} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="مثال: حذاء كروي مخصص" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">جوائز أخرى</label>
              <input type="text" name="prize_others" value={contestForm.prizes.others} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="مثال: كرات هدايا" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">رابط تصوير كارت المسابقة (Image URL)</label>
              <input type="url" name="image" value={contestForm.image} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="https://unsplash.com/..." required />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">الهدف من التحدي والقواعد الأساسية</label>
              <textarea name="goal" rows="3" value={contestForm.goal} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-[#D4AF37] text-white" placeholder="مثال: تقديم أفضل مهارة فردية (مراوغة) بالفيديو..." required />
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
                <tr>
                  <td colSpan="6" className="p-10 text-center text-sm text-gray-500 font-bold">لا توجد تحديات معلنة حالياً.</td>
                </tr>
              ) : (
                contests.map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-all">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={item.image} className="w-16 h-12 rounded-xl object-cover border border-white/10" alt="" onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=500"}} />
                        <div>
                          <p className="font-bold text-base text-white">{item.title}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3 text-[#D4AF37]"/> {item.duration}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      {getCategoryBadge(item.category)}
                    </td>
                    <td className="p-6 text-xs text-gray-400 max-w-[220px] truncate">{item.goal}</td>
                    <td className="p-6 text-sm text-gray-300">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-500" /> {item.location || 'كل المحافظات'}</span>
                    </td>
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
    </div>
  );
};

export default ContestsSection;