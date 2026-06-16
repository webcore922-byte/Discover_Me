import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Plus, Trash2, Edit3, Save, X, FileText, Image as ImageIcon, Link2 } from 'lucide-react';

const NewsSection = () => {
  // 1. الـ States الخاصة بالأخبار فقط (تم عزلها عن باقي الصفحة)
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNewsId, setEditingNewsId] = useState(null);
  
  const [newsForm, setNewsForm] = useState({
    tag: '',
    title: '',
    summary: '',
    image: '',
    author: 'الإدارة التقنية'
  });
  
  const [newsSections, setNewsSections] = useState([
    { heading: '', content: '', sectionImage: '', hasImage: false }
  ]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // 2. جلب الداتا الخاصة بالأخبار فقط عند فتح هذا القسم
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        const newsRes = await fetch(`${API_URL}/newsAndUpdates`);
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          setNews(Array.isArray(newsData) ? newsData : []);
        }
      } catch (err) {
        console.error("حدث خطأ أثناء جلب الأخبار:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, []);

  // 3. الدوال الخاصة بإدارة الـ Form والسكاشن الديناميكية
  const handleNewsInputChange = (e) => {
    const { name, value } = e.target;
    setNewsForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNewsSectionChange = (index, field, value) => {
    const updated = [...newsSections];
    updated[index][field] = value;
    setNewsSections(updated);
  };

  const toggleNewsSectionImage = (index) => {
    const updated = [...newsSections];
    updated[index].hasImage = !updated[index].hasImage;
    if (!updated[index].hasImage) {
      updated[index].sectionImage = '';
    }
    setNewsSections(updated);
  };

  const addNewsSection = () => {
    setNewsSections([...newsSections, { heading: '', content: '', sectionImage: '', hasImage: false }]);
  };

  const removeNewsSection = (index) => {
    if (newsSections.length === 1) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'عذراً!', 
        text: 'يجب أن يحتوي الخبر على سكشن واحد على الأقل.', 
        confirmButtonColor: '#D4AF37', 
        background: '#16191b', 
        color: '#fff' 
      });
      return;
    }
    setNewsSections(newsSections.filter((_, i) => i !== index));
  };

  // 4. دالة الحفظ (إضافة أو تعديل)
  const handleSaveNews = async (e) => {
    e.preventDefault();

    const currentDate = new Date().toLocaleDateString('ar-EG', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    const cleanedSections = newsSections.map(sec => {
      const cleaned = { heading: sec.heading, content: sec.content };
      if (sec.hasImage && sec.sectionImage.trim() !== '') {
        cleaned.sectionImage = sec.sectionImage.trim();
      }
      return cleaned;
    });

    const newsPayload = {
      ...newsForm,
      date: currentDate,
      sections: cleanedSections
    };

    try {
      if (editingNewsId) {
        const res = await fetch(`${API_URL}/newsAndUpdates/${editingNewsId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsPayload),
        });
        if (res.ok) {
          const updatedNews = await res.json();
          setNews(news.map(n => n.id === editingNewsId ? updatedNews : n));
          Swal.fire({ title: 'تم تحديث الخبر بنجاح!', icon: 'success', background: '#1a1a1a', color: '#D4AF37' });
          resetNewsForm();
        }
      } else {
        const res = await fetch(`${API_URL}/newsAndUpdates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newsPayload, id: `news-${Date.now()}` }),
        });
        if (res.ok) {
          const newCreated = await res.json();
          setNews([newCreated, ...news]);
          Swal.fire({ title: 'تم نشر الخبر بنجاح!', icon: 'success', background: '#1a1a1a', color: '#D4AF37' });
          resetNewsForm();
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ title: 'حدث خطأ أثناء حفظ الخبر', icon: 'error', background: '#1a1a1a' });
    }
  };

  const handleEditNewsClick = (item) => {
    setEditingNewsId(item.id);
    setNewsForm({
      tag: item.tag || '',
      title: item.title || '',
      summary: item.summary || '',
      image: item.image || '',
      author: item.author || 'الإدارة التقنية'
    });
    
    if (item.sections && item.sections.length > 0) {
      setNewsSections(item.sections.map(sec => ({
        heading: sec.heading || '',
        content: sec.content || '',
        sectionImage: sec.sectionImage || '',
        hasImage: !!sec.sectionImage
      })));
    } else {
      setNewsSections([{ heading: '', content: '', sectionImage: '', hasImage: false }]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteNews = async (newsId, newsTitle) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف خبر "${newsTitle}" نهائياً!`,
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
        const res = await fetch(`${API_URL}/newsAndUpdates/${newsId}`, { method: 'DELETE' });
        if (res.ok) {
          setNews(news.filter(n => n.id !== newsId));
          Swal.fire({ title: 'تم حذف الخبر!', icon: 'success', background: '#1a1a1a', color: '#fff' });
        }
      } catch (err) { console.error(err); }
    }
  };

  const resetNewsForm = () => {
    setEditingNewsId(null);
    setNewsForm({ tag: '', title: '', summary: '', image: '', author: 'الإدارة التقنية' });
    setNewsSections([{ heading: '', content: '', sectionImage: '', hasImage: false }]);
  };

  if (loading) return <div className="text-center py-20 text-purple-400 font-bold animate-pulse text-lg">جاري تحميل مستودع الأخبار الحصري...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 📊 كارت الإحصائيات الخاص بالأخبار فقط (تطبيقاً لفكرتك) */}
      <div className="flex justify-start">
        <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/5 text-center min-w-[160px]">
          <p className="text-[10px] text-gray-400 mb-1 font-bold">المقالات والأخبار المنشورة</p>
          <p className="text-2xl font-black italic text-purple-400">{news.length}</p>
        </div>
      </div>

      {/* الـ Form الخاص بإضافة وتعديل الأخبار */}
      <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-[4px] w-full bg-gradient-to-r from-purple-600 to-indigo-500" />
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-purple-400 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {editingNewsId ? `تعديل بيانات الخبر (ID: ${editingNewsId})` : 'إضافة ونشر خبر جديد بالمنصة'}
          </h2>
          {editingNewsId && (
            <button onClick={resetNewsForm} className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-1">
              <X className="w-3 h-3"/> إلغاء التعديل
            </button>
          )}
        </div>

        <form onSubmit={handleSaveNews} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">الوسم / التاج (مثال: تحديثات المنصة 🚀)</label>
              <input type="text" name="tag" value={newsForm.tag} onChange={handleNewsInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500" placeholder="اكتب التاج..." required />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">الجهة الناشرة / الكاتب</label>
              <input type="text" name="author" value={newsForm.author} onChange={handleNewsInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500" required />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">رابط صورة الغلاف الأساسية (URL)</label>
              <input type="url" name="image" value={newsForm.image} onChange={handleNewsInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500" placeholder="https://example.com/cover.jpg" required />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">عنوان الخبر الرئيسي</label>
              <input type="text" name="title" value={newsForm.title} onChange={handleNewsInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-purple-500" placeholder="اكتب العنوان هنا..." required />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">ملخص الخبر القصير (يظهر في الكارت الخارجي)</label>
              <textarea name="summary" rows="2" value={newsForm.summary} onChange={handleNewsInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-purple-500 resize-none" placeholder="اكتب خلاصة الخبر في سطرين..." required />
            </div>
          </div>

          {/* السكاشن والفقرات الديناميكية */}
          <div className="border-t border-white/5 pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-purple-400 border-r-2 border-purple-500 pr-2">محتوى الخبر وفقراته بالتفصيل:</label>
              <button type="button" onClick={addNewsSection} className="px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl text-xs font-black flex items-center gap-1 hover:bg-purple-600 hover:text-white transition-all">
                <Plus className="w-4 h-4"/> إضافة فقرة (سكشن) جديدة
              </button>
            </div>

            <div className="space-y-4">
              {newsSections.map((section, index) => (
                <div key={index} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3 relative">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2 flex-wrap gap-2">
                    <span className="text-xs text-gray-400 font-bold bg-white/5 px-2 py-0.5 rounded">الفقرة #{index + 1}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <input type="checkbox" id={`news-hasImage-${index}`} checked={section.hasImage} onChange={() => toggleNewsSectionImage(index)} className="w-3.5 h-3.5 accent-purple-500 cursor-pointer" />
                        <label htmlFor={`news-hasImage-${index}`} className="text-xs text-gray-400 cursor-pointer hover:text-white transition-colors font-bold">إضافة صورة لهذه الفقرة</label>
                      </div>
                      <button type="button" onClick={() => removeNewsSection(index)} className="text-gray-500 hover:text-red-400 transition-all">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">عنوان الفقرة الفرعي</label>
                    <input type="text" value={section.heading} onChange={e => handleNewsSectionChange(index, 'heading', e.target.value)} className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-xs outline-none focus:border-purple-500" placeholder="مثال: أولاً: شروط التقديم" required />
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">محتوى الفقرة والشرح المفصل</label>
                    <textarea rows="3" value={section.content} onChange={e => handleNewsSectionChange(index, 'content', e.target.value)} className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-xs outline-none focus:border-purple-500 leading-relaxed" placeholder="اكتب تفاصيل الفقرة الكروية هنا..." required />
                  </div>

                  {section.hasImage && (
                    <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-1.5 animate-fadeIn">
                      <label className="text-[11px] text-purple-400 flex items-center gap-1 font-bold">
                        <ImageIcon className="w-3 h-3"/> رابط صورة الفقرة (URL)
                      </label>
                      <div className="relative">
                        <input type="url" value={section.sectionImage} onChange={e => handleNewsSectionChange(index, 'sectionImage', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pr-3 pl-8 py-2 text-xs text-white outline-none focus:border-purple-500" placeholder="https://example.com/section.jpg" required />
                        <Link2 className="w-3.5 h-3.5 text-gray-600 absolute left-2.5 top-2.5"/>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-purple-600 text-white rounded-xl font-extrabold hover:bg-purple-500 shadow-lg flex items-center justify-center gap-2">
            <Save className="w-4 h-4"/>
            {editingNewsId ? 'تعديل وحفظ الخبر الحالي' : 'نشر وتعميم الخبر في المنصة فوراً'}
          </button>
        </form>
      </div>

      {/* الجدول المعزول لعرض الأخبار */}
      <div className="bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-white/5 text-purple-400 text-sm font-black uppercase">
                <th className="p-6">الخبر المنشور</th>
                <th className="p-6">الناشر</th>
                <th className="p-6">التاريخ</th>
                <th className="p-6 text-center">الفقرات</th>
                <th className="p-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {news.map(item => (
                <tr key={item.id} className="hover:bg-white/5 transition-all">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img src={item.image} className="w-16 h-12 rounded-xl object-cover border border-white/10" alt="" onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=500"}} />
                      <div>
                        <p className="font-bold text-base text-white">{item.title}</p>
                        <p className="text-[11px] text-purple-400">🏷️ {item.tag}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-gray-300">✍️ {item.author}</td>
                  <td className="p-6 text-sm text-gray-400">📅 {item.date}</td>
                  <td className="p-6 text-center text-xs text-gray-300 font-bold">{item.sections ? item.sections.length : 0} فقرات</td>
                  <td className="p-6">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => handleEditNewsClick(item)} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">تعديل</button>
                      <button onClick={() => handleDeleteNews(item.id, item.title)} className="px-3 py-1.5 bg-red-900/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default NewsSection;