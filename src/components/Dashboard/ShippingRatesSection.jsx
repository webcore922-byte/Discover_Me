import React from 'react';
import { Truck, Plus, Pencil, Trash2, X, Save, Search, MapPin } from 'lucide-react';
import UseShippingRatesLogic from './UseShippingRatesLogic';
const ShippingRatesSection = () => {
  const {
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
  } = UseShippingRatesLogic();
  return <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
            <Truck className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[var(--color-text-white)]">أسعار التوصيل</h2>
            <p className="text-xs text-gray-400 font-bold">{rates.length} محافظة مُضافة — بتظهر مباشرة في صفحة إتمام الطلب</p>
          </div>
        </div>
        <button onClick={openAddForm} className="flex items-center gap-2 bg-[#D4AF37] text-black font-black text-sm px-5 py-3 rounded-2xl hover:bg-[#e6c34a] transition-all">
          <Plus className="w-4 h-4" /> إضافة محافظة
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold px-4 py-3 rounded-2xl flex items-center justify-between">
          {error}
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث عن محافظة..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pr-11 pl-4 text-sm text-[var(--color-text-white)] placeholder-gray-500 outline-none focus:border-[#D4AF37]/40" />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-[var(--color-text-white)] outline-none focus:border-[#D4AF37]/40">
          <option value="city_asc" style={{
          background: '#15171a'
        }}>ترتيب: اسم المحافظة</option>
          <option value="cost_asc" style={{
          background: '#15171a'
        }}>ترتيب: السعر (الأقل أولاً)</option>
          <option value="cost_desc" style={{
          background: '#15171a'
        }}>ترتيب: السعر (الأعلى أولاً)</option>
        </select>
      </div>

      {loading ? <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({
        length: 8
      }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)}
        </div> : filtered.length === 0 ? <div className="text-center py-16 text-gray-500 font-bold">
          لا توجد محافظات مُضافة بعد. اضغط "إضافة محافظة" عشان تبدأ تحدد أسعار التوصيل.
        </div> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map(rate => <div key={rate.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 hover:border-[#D4AF37]/20 transition-all">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <h4 className="text-sm font-black text-[var(--color-text-white)] leading-tight truncate">{rate.city}</h4>
              </div>
              <div className="text-[#D4AF37] font-black text-lg">{rate.cost} ج.م</div>
              <div className="flex gap-2 mt-auto">
                <button onClick={() => openEditForm(rate)} className="flex-1 flex items-center justify-center gap-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-black py-2 rounded-xl hover:bg-sky-500 hover:text-white transition-all">
                  <Pencil className="w-3.5 h-3.5" /> تعديل
                </button>
                <button onClick={() => handleDelete(rate)} disabled={deletingId === rate.id} className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-black py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">
                  <Trash2 className="w-3.5 h-3.5" /> {deletingId === rate.id ? '...' : 'حذف'}
                </button>
              </div>
            </div>)}
        </div>}

      {showForm && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeForm}>
          <div className="bg-[#15171a] border border-white/10 rounded-3xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="font-black text-[var(--color-text-white)] text-lg">
                {editingRate ? 'تعديل سعر التوصيل' : 'إضافة محافظة جديدة'}
              </h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">اسم المحافظة</label>
                <input required value={formData.city} onChange={e => handleFormChange('city', e.target.value)} className="form-input w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#D4AF37]/40" placeholder="مثال: القاهرة" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">سعر التوصيل (ج.م)</label>
                <input required type="number" min="0" value={formData.cost} onChange={e => handleFormChange('cost', e.target.value)} className="form-input w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#D4AF37]/40" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 py-3 rounded-2xl font-black text-sm text-gray-300 bg-white/5 hover:bg-white/10 transition-all">
                  إلغاء
                </button>
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm text-black bg-[#D4AF37] hover:bg-[#e6c34a] transition-all disabled:opacity-60">
                  <Save className="w-4 h-4" /> {saving ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
export default ShippingRatesSection;
