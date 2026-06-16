import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Plus, Trash2, Edit3, Save, X, Trophy, MapPin, Calendar, Clock, DollarSign, User } from 'lucide-react';

const CampsSection = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCampId, setEditingCampId] = useState(null);
  
  // تحديث الـ Form لتدعم حقول كائن الـ coach الداخلي
  const [campForm, setCampForm] = useState({
    title: '',
    subtitle: '',
    location: '',
    schedule: '',
    details: '',
    image: '',
    focus: [],
    coachName: '',
    coachImage: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchCampsData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/camps`);
        if (res.ok) {
          const data = await res.json();
          setCamps(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("حدث خطأ أثناء جلب المعسكرات:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampsData();
  }, []);

  const handleCampInputChange = (e) => {
    const { name, value } = e.target;
    setCampForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCamp = async (e) => {
    e.preventDefault();

    // تشكيل جسم البيانات ليتطابق مع الـ Object والـ Array الأصلي في الجيسون
    const payload = {
      title: campForm.title,
      subtitle: campForm.subtitle,
      location: campForm.location,
      schedule: campForm.schedule,
      details: campForm.details,
      image: campForm.image,
      focus: typeof campForm.focus === 'string' ? campForm.focus.split(',').map(f => f.trim()) : campForm.focus,
      coach: {
        name: campForm.coachName,
        image: campForm.coachImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' // صورة افتراضية للمدرب في حال عدم الإدخال
      }
    };

    try {
      if (editingCampId) {
        const res = await fetch(`${API_URL}/camps/${editingCampId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updatedCamp = await res.json();
          setCamps(camps.map(c => c.id === editingCampId ? updatedCamp : c));
          Swal.fire({ title: 'تم التحديث بنجاح!', icon: 'success', background: '#1a1a1a', color: '#D4AF37' });
          resetCampForm();
        }
      } else {
        const res = await fetch(`${API_URL}/camps`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: `camp-${Date.now()}` }),
        });
        if (res.ok) {
          const newCamp = await res.json();
          setCamps([newCamp, ...camps]);
          Swal.fire({ title: 'تم إنشاء المعسكر بنجاح!', icon: 'success', background: '#1a1a1a', color: '#D4AF37' });
          resetCampForm();
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ title: 'حدث خطأ أثناء الحفظ', icon: 'error', background: '#1a1a1a' });
    }
  };

  const handleEditCampClick = (item) => {
    setEditingCampId(item.id);
    setCampForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      location: item.location || '',
      schedule: item.schedule || '',
      details: item.details || '',
      image: item.image || '',
      focus: Array.isArray(item.focus) ? item.focus.join(',') : item.focus || '',
      coachName: item.coach?.name || '',
      coachImage: item.coach?.image || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCamp = async (campId, campTitle) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف معسكر "${campTitle}" نهائياً!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4444',
      cancelButtonColor: '#444',
      confirmButtonText: 'نعم، احذفه',
      background: '#1a1a1a',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/camps/${campId}`, { method: 'DELETE' });
        if (res.ok) {
          setCamps(camps.filter(c => c.id !== campId));
          Swal.fire({ title: 'تم الحذف!', icon: 'success', background: '#1a1a1a', color: '#fff' });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetCampForm = () => {
    setEditingCampId(null);
    setCampForm({ title: '', subtitle: '', location: '', schedule: '', details: '', image: '', focus: [], coachName: '', coachImage: '' });
  };

  if (loading) return <div className="text-center py-20 text-sky-400 font-bold animate-pulse text-lg">جاري تحميل المعسكرات التدريبية...</div>;

  return (
    <div className="space-y-8 animate-fadeIn" dir="rtl">
      
      <div className="flex justify-start">
        <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/5 text-center min-w-[160px]">
          <p className="text-[10px] text-gray-400 mb-1 font-bold">إجمالي المعسكرات الحالية</p>
          <p className="text-2xl font-black italic text-sky-400">{camps.length}</p>
        </div>
      </div>

      {/* الفورم المعدل لإدخال بيانات الكابتن والمعسكر */}
      <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-[4px] w-full bg-gradient-to-r from-sky-600 to-blue-500" />
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-sky-400 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            {editingCampId ? `تعديل بيانات المعسكر (ID: ${editingCampId})` : 'إنشاء وتخطيط معسكر تدريبي جديد'}
          </h2>
          {editingCampId && (
            <button onClick={resetCampForm} className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-1">
              <X className="w-3 h-3"/> إلغاء التعديل
            </button>
          )}
        </div>

        <form onSubmit={handleSaveCamp} className="space-y-6">
          {/* بيانات المعسكر الأساسية */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">اسم المعسكر الرئيسي</label>
              <input type="text" name="title" value={campForm.title} onChange={handleCampInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500 text-white" placeholder="مثال: معسكر حراسة" required />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">العنوان الفرعي (التركيز)</label>
              <input type="text" name="subtitle" value={campForm.subtitle} onChange={handleCampInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500 text-white" placeholder="مثال: معسكر تدريب حراس المرمى" required />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">رابط صورة المعسكر (URL)</label>
              <input type="url" name="image" value={campForm.image} onChange={handleCampInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500 text-white" placeholder="https://example.com/camp.jpg" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">الموقع</label>
              <input type="text" name="location" value={campForm.location} onChange={handleCampInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500 text-white" placeholder="مثال: القاهرة" required />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">المواعيد والجدول</label>
              <input type="text" name="schedule" value={campForm.schedule} onChange={handleCampInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500 text-white" placeholder="مثال: السبت والأحد: 10 صباحاً" required />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">نقاط التركيز (افصل بينها بفصلة ,)</label>
              <input type="text" name="focus" value={campForm.focus} onChange={handleCampInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500 text-white" placeholder="مثال: التصدي, القيادة, السرعة" />
            </div>
          </div>

          {/* 🆕 القسم الجديد الخاص ببيانات المدرب */}
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-sky-400 font-bold block mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5"/> اسم كابتن / مدرب المعسكر
              </label>
              <input type="text" name="coachName" value={campForm.coachName} onChange={handleCampInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500 text-white" placeholder="مثال: كابتن أحمد حسن" required />
            </div>
            <div>
              <label className="text-xs text-sky-400 font-bold block mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5"/> رابط صورة المدرب (URL)
              </label>
              <input type="url" name="coachImage" value={campForm.coachImage} onChange={handleCampInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500 text-white" placeholder="https://example.com/coach.jpg" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">تفاصيل ومميزات المعسكر</label>
            <textarea name="details" rows="3" value={campForm.details} onChange={handleCampInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-sky-500 text-white" placeholder="اكتب تفاصيل المعسكر هنا..." required />
          </div>

          <button type="submit" className="w-full py-3 bg-sky-600 text-white rounded-xl font-extrabold hover:bg-sky-500 shadow-lg flex items-center justify-center gap-2 transition-all">
            <Save className="w-4 h-4"/>
            {editingCampId ? 'تعديل وحفظ بيانات المعسكر والمدرب' : 'اعتماد ونشر المعسكر الجديد'}
          </button>
        </form>
      </div>

      {/* الجدول مع عرض المدرب المستهدف */}
      <div className="bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-white/5 text-sky-400 text-sm font-black">
                <th className="p-6">المعسكر والمدرب</th>
                <th className="p-6">الموقع</th>
                <th className="p-6">المواعيد والجدول</th>
                <th className="p-6">التفاصيل والتركيز</th>
                <th className="p-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {camps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-sm text-gray-500 font-bold">لا يوجد معسكرات مسجلة حالياً.</td>
                </tr>
              ) : (
                camps.map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-all">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={item.image} className="w-16 h-12 rounded-xl object-cover border border-white/10 shrink-0" alt="" onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=500"}} />
                        <div>
                          <p className="font-bold text-base text-white">{item.title}</p>
                          <p className="text-xs text-gray-400 mb-1">{item.subtitle}</p>
                          
                          {/* 🆕 إظهار بيانات كابتن المعسكر في الجدول بشكل جمالي مصغر */}
                          {item.coach?.name && (
                            <div className="flex items-center gap-1.5 mt-1 bg-white/5 w-fit px-2 py-0.5 rounded-md border border-white/5">
                              <img src={item.coach.image} className="w-4 h-4 rounded-full object-cover" onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"}}/>
                              <span className="text-[10px] text-sky-300 font-bold">الكابتن: {item.coach.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-gray-300">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-500" /> {item.location}</span>
                    </td>
                    <td className="p-6 text-sm">
                      <p className="text-gray-300 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-500" /> {item.schedule}</p>
                    </td>
                    <td className="p-6 text-xs text-gray-400 max-w-[220px]">
                      <p className="truncate mb-1">{item.details}</p>
                      {/* عرض نقاط التركيز كمفاتيح صغيرة لضمان ظهور الـ Array المبعوث */}
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(item.focus) ? item.focus.map((f, i) => (
                          <span key={i} className="bg-sky-500/10 text-sky-400 text-[9px] px-1.5 py-0.5 rounded">
                            {f}
                          </span>
                        )) : null}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => handleEditCampClick(item)} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">تعديل</button>
                        <button onClick={() => handleDeleteCamp(item.id, item.title)} className="px-3 py-1.5 bg-red-900/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all">حذف</button>
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

export default CampsSection;