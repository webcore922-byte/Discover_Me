import React, { useState, useEffect } from 'react';
import Swal from '../../utils/swalAlert';
import { Plus, Trash2, Edit3, Save, X, Users } from 'lucide-react';
import { authHeader, authJsonHeader } from '../../utils/authHeader';
import ImageUploadField from '../ImageUpload/ImageUploadField';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const TYPES = {
  coaches: {
    label: 'المدربون',
    endpoint: 'coaches',
    fields: [{
      name: 'name',
      label: 'الاسم',
      required: true
    }, {
      name: 'info',
      label: 'نبذة عن المدرب'
    }, {
      name: 'image',
      label: 'رابط الصورة'
    }]
  },
  consultants: {
    label: 'المستشارون',
    endpoint: 'consultants',
    fields: [{
      name: 'name',
      label: 'الاسم',
      required: true
    }, {
      name: 'specialty',
      label: 'التخصص'
    }, {
      name: 'bio',
      label: 'نبذة تعريفية'
    }, {
      name: 'image',
      label: 'رابط الصورة'
    }]
  },
  field_testers: {
    label: 'المختبرون الميدانيون',
    endpoint: 'field-testers',
    fields: [{
      name: 'name',
      label: 'الاسم',
      required: true
    }, {
      name: 'specialty',
      label: 'التخصص'
    }, {
      name: 'bio',
      label: 'نبذة تعريفية'
    }, {
      name: 'tags',
      label: 'الوسوم (افصل بينهم بفاصلة ,)'
    }, {
      name: 'image',
      label: 'رابط الصورة'
    }]
  }
};
const emptyFormFor = type => TYPES[type].fields.reduce((acc, f) => ({
  ...acc,
  [f.name]: ''
}), {});
const StaffSection = () => {
  const [activeType, setActiveType] = useState('coaches');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyFormFor('coaches'));
  const [saving, setSaving] = useState(false);
  const config = TYPES[activeType];
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${config.endpoint}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchItems();
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyFormFor(activeType));
  }, [activeType]);
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const openCreateForm = () => {
    setEditingId(null);
    setFormData(emptyFormFor(activeType));
    setShowForm(true);
  };
  const openEditForm = item => {
    setEditingId(item.id);
    const initial = {};
    config.fields.forEach(f => {
      if (f.name === 'tags') {
        initial[f.name] = Array.isArray(item.tags) ? item.tags.join(', ') : '';
      } else {
        initial[f.name] = item[f.name] || '';
      }
    });
    setFormData(initial);
    setShowForm(true);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData
      };
      if (payload.tags !== undefined) {
        payload.tags = payload.tags.split(',').map(t => t.trim()).filter(Boolean);
      }
      const url = editingId ? `${API_URL}/${config.endpoint}/${editingId}` : `${API_URL}/${config.endpoint}`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: authJsonHeader(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'حدث خطأ');
      }
      Swal.fire({
        title: editingId ? 'تم التعديل بنجاح!' : 'تمت الإضافة بنجاح!',
        icon: 'success'
      });
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyFormFor(activeType));
      fetchItems();
    } catch (err) {
      Swal.fire({
        title: 'حدث خطأ',
        text: err.message,
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff'
      });
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async item => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف "${item.name}" نهائياً!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4444',
      cancelButtonColor: '#444',
      confirmButtonText: 'نعم، احذفه'
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${API_URL}/${config.endpoint}/${item.id}`, {
        method: 'DELETE',
        headers: authHeader()
      });
      if (!res.ok) throw new Error();
      setItems(prev => prev.filter(i => i.id !== item.id));
      Swal.fire({
        title: 'تم الحذف بنجاح!',
        icon: 'success',
        background: '#1a1a1a',
        color: '#fff'
      });
    } catch {
      Swal.fire({
        title: 'فشل الحذف',
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff'
      });
    }
  };
  return <div className="space-y-6">
      {}
      <div className="flex flex-wrap gap-2 dark:bg-white/5 bg-white p-1.5 rounded-2xl border border-white/5 w-fit">
        {Object.entries(TYPES).map(([key, cfg]) => <button key={key} onClick={() => setActiveType(key)} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeType === key ? 'bg-[#D4AF37] text-black' : 'dark:text-white text-[var(--color-text-gray)]'}`}>
            {cfg.label}
          </button>)}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black flex items-center gap-2">
          <Users className="w-5 h-5 text-[#D4AF37]" /> إدارة {config.label}
        </h2>
        <button onClick={openCreateForm} className="flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-xl text-xs font-black hover:scale-105 transition-all">
          <Plus className="w-4 h-4" /> إضافة {config.label.slice(0, -1) || 'عنصر'} جديد
        </button>
      </div>

      {showForm && <form onSubmit={handleSubmit} className="dark:bg-white/5 bg-white border border-white/10 rounded-2xl p-6 space-y-4">
          {config.fields.map(f => <div key={f.name}>
              {f.name === 'image' ? <ImageUploadField label={f.label} value={formData[f.name]} onChange={url => handleChange('image', url)} folder={activeType === 'coaches' ? 'coaches' : 'scoutpro'} shape="circle" required={f.required} /> : <>
                  <label className="block text-xs font-bold mb-1.5 dark:text-gray-300">{f.label}</label>
                  {f.name === 'bio' || f.name === 'info' ? <textarea value={formData[f.name]} onChange={e => handleChange(f.name, e.target.value)} required={f.required} rows={3} className="w-full dark:bg-black/30 bg-gray-50 border border-white/10 rounded-xl px-4 py-2.5 text-sm" /> : <input type="text" value={formData[f.name]} onChange={e => handleChange(f.name, e.target.value)} required={f.required} className="w-full dark:bg-black/30 bg-gray-50 border border-white/10 rounded-xl px-4 py-2.5 text-sm" />}
                </>}
            </div>)}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#D4AF37] text-black px-5 py-2.5 rounded-xl text-xs font-black disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl text-xs font-black">
              <X className="w-4 h-4" /> إلغاء
            </button>
          </div>
        </form>}

      {loading ? <p className="text-center text-gray-400 py-10">جاري التحميل...</p> : items.length === 0 ? <p className="text-center text-gray-400 py-10">مفيش {config.label} مضافين لسه.</p> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => <div key={item.id} className="dark:bg-white/5 bg-white border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />}
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-[#D4AF37]">{item.specialty || ''}</p>
                </div>
              </div>
              {(item.bio || item.info) && <p className="text-xs dark:text-gray-400 line-clamp-2">{item.bio || item.info}</p>}
              <div className="flex gap-2 pt-2 border-t border-white/5">
                <button onClick={() => openEditForm(item)} className="flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300">
                  <Edit3 className="w-3.5 h-3.5" /> تعديل
                </button>
                <button onClick={() => handleDelete(item)} className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300">
                  <Trash2 className="w-3.5 h-3.5" /> حذف
                </button>
              </div>
            </div>)}
        </div>}
    </div>;
};
export default StaffSection;
