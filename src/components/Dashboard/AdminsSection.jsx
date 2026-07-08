import React, { useState, useEffect } from 'react';
import Swal from '../../utils/swalAlert';
import { Plus, ShieldCheck, X, Save } from 'lucide-react';
import { authHeader, authJsonHeader } from '../../utils/authHeader';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const ROLE_LABELS = {
  super_admin: 'مدير عام المنصة',
  technical_coach: 'اللجنة الفنية والمدربين',
  camps_manager: 'مسؤول المعسكرات',
  marketing_admin: 'المسؤول الإعلامي والمسابقات'
};
const emptyForm = {
  username: '',
  email: '',
  password: '',
  role: 'technical_coach'
};
const AdminsSection = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admins`, {
        headers: authHeader()
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAdmins();
  }, []);
  const handleChange = (name, value) => setFormData(prev => ({
    ...prev,
    [name]: value
  }));
  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/admins`, {
        method: 'POST',
        headers: authJsonHeader(),
        body: JSON.stringify({
          ...formData,
          email: formData.email.toLowerCase().trim()
        })
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'حدث خطأ أثناء إنشاء الحساب');
      }
      Swal.fire({
        title: 'تم إنشاء حساب الأدمن بنجاح!',
        icon: 'success'
      });
      setShowForm(false);
      setFormData(emptyForm);
      fetchAdmins();
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
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37]" /> إدارة حسابات الأدمن
        </h2>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-xl text-xs font-black hover:scale-105 transition-all">
          <Plus className="w-4 h-4" /> إضافة أدمن جديد
        </button>
      </div>

      {showForm && <form onSubmit={handleSubmit} className="dark:bg-white/5 bg-white border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1.5 dark:text-gray-300">الاسم</label>
            <input type="text" value={formData.username} onChange={e => handleChange('username', e.target.value)} required className="w-full dark:bg-black/30 bg-gray-50 border border-white/10 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 dark:text-gray-300">الإيميل</label>
            <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} required className="w-full dark:bg-black/30 bg-gray-50 border border-white/10 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 dark:text-gray-300">الباسورد</label>
            <input type="password" value={formData.password} onChange={e => handleChange('password', e.target.value)} required minLength={6} className="w-full dark:bg-black/30 bg-gray-50 border border-white/10 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 dark:text-gray-300">الصلاحية</label>
            <select value={formData.role} onChange={e => handleChange('role', e.target.value)} className="w-full dark:bg-black/30 bg-gray-50 border border-white/10 rounded-xl px-4 py-2.5 text-sm">
              {Object.entries(ROLE_LABELS).filter(([key]) => key !== 'super_admin').map(([key, label]) => <option key={key} value={key}>
                    {label}
                  </option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#D4AF37] text-black px-5 py-2.5 rounded-xl text-xs font-black disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-xl text-xs font-black">
              <X className="w-4 h-4" /> إلغاء
            </button>
          </div>
        </form>}

      {loading ? <p className="text-center text-gray-400 py-10">جاري التحميل...</p> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {admins.map(admin => <div key={admin.id} className="dark:bg-white/5 bg-white border border-white/10 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="font-bold">{admin.username}</p>
                <p className="text-xs dark:text-gray-400">{admin.email}</p>
              </div>
              <span className="text-xs font-black text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded-lg">
                {ROLE_LABELS[admin.role] || admin.role}
              </span>
            </div>)}
        </div>}
    </div>;
};
export default AdminsSection;
