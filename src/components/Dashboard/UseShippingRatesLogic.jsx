import { useState, useEffect, useMemo } from 'react';
import Swal from '../../utils/swalAlert';
import { authHeader, authJsonHeader } from '../../utils/authHeader';
const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
export const SHIPPING_API = `${API_ROOT}/shipping-rates`;
export const EMPTY_RATE = {
  city: '',
  cost: ''
};
export const CenteredAlert = Swal.mixin({
  position: 'center',
  showConfirmButton: true,
  confirmButtonText: 'OK',
  confirmButtonColor: '#D4AF37',
  backdrop: 'rgba(0,0,0,0.6)',
  allowOutsideClick: false,
  customClass: {
    popup: 'swal-center-toast',
    confirmButton: 'swal-ok-custom'
  }
});
export const toastSuccess = title => CenteredAlert.fire({
  icon: 'success',
  title,
  iconColor: '#D4AF37'
});
export const toastError = title => CenteredAlert.fire({
  icon: 'error',
  title,
  iconColor: '#ef4444'
});
export const confirmDelete = name => Swal.fire({
  title: 'هل أنت متأكد؟',
  html: `<span style="font-size:15px;color:#ccc;direction:rtl;">سيتم حذف سعر شحن <b style="color:#fff">"${name}"</b> نهائياً!</span>`,
  icon: 'warning',
  iconColor: '#D4AF37',
  background: '#15171a',
  color: '#ffffff',
  position: 'center',
  showCancelButton: true,
  confirmButtonText: 'نعم، احذفه',
  cancelButtonText: 'Cancel',
  confirmButtonColor: '#D4AF37',
  cancelButtonColor: '#374151',
  reverseButtons: false,
  allowOutsideClick: true,
  allowEscapeKey: true,
  customClass: {
    popup: 'swal-popup-custom',
    title: 'swal-title-custom',
    htmlContainer: 'swal-html-custom',
    confirmButton: 'swal-confirm-custom',
    cancelButton: 'swal-cancel-custom'
  }
});
export default function UseShippingRatesLogic() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('city_asc');
  const [showForm, setShowForm] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState(EMPTY_RATE);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  useEffect(() => {
    fetchRates();
  }, []);
  const fetchRates = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(SHIPPING_API);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRates(Array.isArray(data) ? data : data.rates || []);
    } catch {
      setError('حدث خطأ في تحميل أسعار الشحن، تأكد من الاتصال بالسيرفر.');
    } finally {
      setLoading(false);
    }
  };
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = rates.filter(r => !term || r.city?.toLowerCase().includes(term));
    list = [...list].sort((a, b) => {
      if (sortBy === 'cost_asc') return a.cost - b.cost;
      if (sortBy === 'cost_desc') return b.cost - a.cost;
      return (a.city || '').localeCompare(b.city || '', 'ar');
    });
    return list;
  }, [rates, search, sortBy]);
  const openAddForm = () => {
    setEditingRate(null);
    setFormData(EMPTY_RATE);
    setShowForm(true);
  };
  const openEditForm = rate => {
    setEditingRate(rate);
    setFormData({
      city: rate.city || '',
      cost: rate.cost ?? ''
    });
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditingRate(null);
    setFormData(EMPTY_RATE);
  };
  const handleFormChange = (field, value) => setFormData(prev => ({
    ...prev,
    [field]: value
  }));
  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      city: formData.city.trim(),
      cost: Number(formData.cost) || 0
    };
    try {
      if (editingRate) {
        const res = await fetch(`${SHIPPING_API}/${editingRate.id}`, {
          method: 'PUT',
          headers: authJsonHeader(),
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setRates(prev => prev.map(r => r.id === editingRate.id ? {
          ...r,
          ...updated
        } : r));
        toastSuccess('تم تعديل سعر الشحن بنجاح ✏️');
      } else {
        const res = await fetch(SHIPPING_API, {
          method: 'POST',
          headers: authJsonHeader(),
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || '');
        }
        const created = await res.json();
        setRates(prev => [...prev, created]);
        toastSuccess('تمت إضافة المحافظة بنجاح 🎉');
      }
      closeForm();
    } catch (err) {
      const msg = err.message || (editingRate ? 'فشل تعديل سعر الشحن.' : 'فشل إضافة سعر الشحن، ربما المحافظة مضافة قبل كده.');
      setError(msg);
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async rate => {
    const result = await confirmDelete(rate.city);
    if (!result.isConfirmed) return;
    setDeletingId(rate.id);
    try {
      const res = await fetch(`${SHIPPING_API}/${rate.id}`, {
        method: 'DELETE',
        headers: authHeader()
      });
      if (!res.ok) throw new Error();
      setRates(prev => prev.filter(r => r.id !== rate.id));
      toastSuccess('تم حذف سعر الشحن بنجاح 🗑️');
    } catch {
      toastError('فشل حذف سعر الشحن.');
    } finally {
      setDeletingId(null);
    }
  };
  return {
    rates,
    loading,
    error,
    setError,
    search,
    setSearch,
    sortBy,
    setSortBy,
    filtered,
    showForm,
    editingRate,
    formData,
    saving,
    deletingId,
    openAddForm,
    openEditForm,
    closeForm,
    handleFormChange,
    handleSubmit,
    handleDelete
  };
}
