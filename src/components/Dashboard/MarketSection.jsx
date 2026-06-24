import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag, Plus, Pencil, Trash2, X, Save,
  Tag, Flame, ImageOff, Search, ChevronLeft, ChevronRight,
  CheckCircle, AlertCircle, Info
} from 'lucide-react';
import Swal from 'sweetalert2';

/**
 * MarketSection – with SweetAlert2 toasts + 8 products per page (paginated)
 */

const API_BASE = `${import.meta.env.VITE_API_URL}/products`;

const CATEGORY_META = {
  'أطقم الأندية':    { emoji: '👕' },
  'أطقم المنتخبات': { emoji: '🏆' },
  'أحذية كرة القدم': { emoji: '👟' },
  'كرات القدم':      { emoji: '⚽' },
  'معدات التدريب':  { emoji: '🏋️' },
  'اكسسوارات':       { emoji: '🧤' },
};

const ITEMS_PER_PAGE = 8;

const EMPTY_PRODUCT = {
  name: '', price: '', discount: 0, category: '',
  image: '', isBestSeller: false, salesCount: 0, description: '',
};

// ─── Sweet helpers ────────────────────────────────────────────────────────────

/** Centered alert with OK button */
const CenteredAlert = Swal.mixin({
  position: 'center',
  showConfirmButton: true,
  confirmButtonText: 'OK',
  confirmButtonColor: '#D4AF37',
  background: '#15171a',
  color: '#ffffff',
  backdrop: 'rgba(0,0,0,0.6)',
  allowOutsideClick: false,
  customClass: {
    popup:         'swal-center-toast',
    confirmButton: 'swal-ok-custom',
  },
});

const toastSuccess = (title) => CenteredAlert.fire({ icon: 'success', title, iconColor: '#D4AF37' });
const toastError   = (title) => CenteredAlert.fire({ icon: 'error',   title, iconColor: '#ef4444' });

/** Delete confirmation dialog – centered, closable on backdrop */
const confirmDelete = (name) =>
  Swal.fire({
    title: 'هل أنت متأكد؟',
    html: `<span style="font-size:15px;color:#ccc;direction:rtl;">سيتم حذف <b style="color:#fff">"${name}"</b> نهائياً!</span>`,
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
      popup:         'swal-popup-custom',
      title:         'swal-title-custom',
      htmlContainer: 'swal-html-custom',
      confirmButton: 'swal-confirm-custom',
      cancelButton:  'swal-cancel-custom',
    },
  });

// ─── Main Component ───────────────────────────────────────────────────────────

const MarketSection = () => {
  const [products,       setProducts]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [search,         setSearch]         = useState('');
  const [page,           setPage]           = useState(1);

  const [showForm,        setShowForm]        = useState(false);
  const [editingProduct,  setEditingProduct]  = useState(null);
  const [formData,        setFormData]        = useState(EMPTY_PRODUCT);
  const [saving,          setSaving]          = useState(false);
  const [deletingId,      setDeletingId]      = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true); setError('');
    try {
      const res  = await fetch(API_BASE);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data.products || data || []);
    } catch {
      setError('حدث خطأ في تحميل المنتجات، تأكد من الاتصال بالسيرفر.');
    } finally {
      setLoading(false);
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const categories = useMemo(() => {
    const s = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(s);
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const okCat    = activeCategory === 'all' || p.category === activeCategory;
      const okSearch = p.name?.toLowerCase().includes(search.trim().toLowerCase());
      return okCat && okSearch;
    });
  }, [products, activeCategory, search]);

  const totalPages   = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage     = Math.min(page, totalPages);
  const paginated    = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  // reset to page 1 when filter changes
  useEffect(() => { setPage(1); }, [activeCategory, search]);

  // ── Form helpers ───────────────────────────────────────────────────────────
  const openAddForm = () => { setEditingProduct(null); setFormData(EMPTY_PRODUCT); setShowForm(true); };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setFormData({
      name:        product.name        || '',
      price:       product.price       ?? '',
      discount:    product.discount    ?? 0,
      category:    product.category    || '',
      image:       product.image       || '',
      isBestSeller: !!product.isBestSeller,
      salesCount:  product.salesCount  ?? 0,
      description: product.description || '',
    });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingProduct(null); setFormData(EMPTY_PRODUCT); };

  const handleFormChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');

    const payload = {
      ...formData,
      price:      Number(formData.price)      || 0,
      discount:   Number(formData.discount)   || 0,
      salesCount: Number(formData.salesCount) || 0,
    };

    try {
      if (editingProduct) {
        const res = await fetch(`${API_BASE}/${editingProduct.id}`, {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();

        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? { ...p, ...payload, ...updated } : p
          )
        );
        toastSuccess('تم تعديل المنتج بنجاح ✏️');
      } else {
        const res = await fetch(API_BASE, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();

        setProducts((prev) => [
          ...prev,
          { id: created.id || Date.now().toString(), ...payload, ...created },
        ]);
        toastSuccess('تمت إضافة المنتج بنجاح 🎉');
      }
      closeForm();
    } catch {
      const msg = editingProduct ? 'فشل تعديل المنتج.' : 'فشل إضافة المنتج.';
      setError(msg);
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (product) => {
    const result = await confirmDelete(product.name);
    if (!result.isConfirmed) return;

    setDeletingId(product.id);
    try {
      const res = await fetch(`${API_BASE}/${product.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toastSuccess('تم حذف المنتج بنجاح 🗑️');
    } catch {
      toastError('فشل حذف المنتج.');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8" dir="rtl">

      {/* SweetAlert2 global style overrides */}
      <style>{`
        /* centered delete popup */
        .swal-popup-custom {
          border-radius: 24px !important;
          border: 1px solid rgba(255,255,255,0.10) !important;
          padding: 32px 24px 24px !important;
          min-width: 400px !important;
        }
        .swal-title-custom  { font-size: 22px !important; font-weight: 900 !important; font-family: inherit !important; direction: rtl; }
        .swal-html-custom   { font-family: inherit !important; direction: rtl; }
        .swal-confirm-custom {
          border-radius: 14px !important; font-weight: 800 !important;
          font-size: 14px !important; padding: 12px 28px !important; color: #000 !important;
        }
        .swal-cancel-custom {
          border-radius: 14px !important; font-weight: 800 !important;
          font-size: 14px !important; padding: 12px 28px !important;
        }
        /* centered result toasts */
        .swal-center-toast {
          border-radius: 20px !important;
          border: 1px solid rgba(255,255,255,0.10) !important;
          padding: 24px 40px !important;
          font-size: 16px !important;
          font-weight: 800 !important;
          min-width: 300px !important;
        }
        .swal-ok-custom {
          border-radius: 14px !important;
          font-weight: 800 !important;
          font-size: 14px !important;
          padding: 10px 36px !important;
          color: #000 !important;
        }
        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 10px 14px;
          font-size: 13px;
          color: white;
          outline: none;
        }
        .form-input:focus { border-color: rgba(212,175,55,0.4); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">المتجر</h2>
            <p className="text-xs text-gray-400 font-bold">{products.length} منتج متاح</p>
          </div>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-[#D4AF37] text-black font-black text-sm px-5 py-3 rounded-2xl hover:bg-[#e6c34a] transition-all"
        >
          <Plus className="w-4 h-4" /> إضافة منتج
        </button>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold px-4 py-3 rounded-2xl flex items-center justify-between">
          {error}
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ── Categories ── */}
      <div className="space-y-3">
        <h3 className="text-lg font-black text-white">الأقسام</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <CategoryCard label="الكل" emoji="🛍️" active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} />
          {categories.map((cat) => (
            <CategoryCard
              key={cat}
              label={cat}
              emoji={CATEGORY_META[cat]?.emoji || '🏷️'}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث عن منتج..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pr-11 pl-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#D4AF37]/40"
        />
      </div>

      {/* ── Products grid (8 per page) ── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 font-bold">لا توجد منتجات مطابقة</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {paginated.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => openEditForm(product)}
                onDelete={() => handleDelete(product)}
                deleting={deletingId === product.id}
              />
            ))}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 text-sm font-black rounded-xl transition-all ${
                    n === safePage
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs text-gray-500 font-bold mr-2">
                صفحة {safePage} من {totalPages} · {filtered.length} منتج
              </span>
            </div>
          )}
        </>
      )}

      {/* ── Form modal ── */}
      {showForm && (
        <ProductFormModal
          formData={formData}
          editingProduct={editingProduct}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={closeForm}
          saving={saving}
          categories={categories}
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  CategoryCard
// ═══════════════════════════════════════════════════════════
const CategoryCard = ({ label, emoji, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 flex flex-col items-center justify-center gap-2 w-36 h-36 rounded-3xl border transition-all ${
      active
        ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
        : 'bg-white/5 border-white/5 text-white hover:border-[#D4AF37]/30'
    }`}
  >
    <span className="text-4xl">{emoji}</span>
    <span className="text-xs font-black text-center px-2">{label}</span>
  </button>
);

// ═══════════════════════════════════════════════════════════
//  ProductCard
// ═══════════════════════════════════════════════════════════
const ProductCard = ({ product, onEdit, onDelete, deleting }) => {
  const finalPrice = product.discount > 0 ? product.price - product.discount : product.price;

  return (
    <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden flex flex-col group hover:border-[#D4AF37]/20 transition-all">
      <div className="relative aspect-square bg-black/30 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <ImageOff className="w-8 h-8 text-gray-600" />
        )}

        {product.isBestSeller && (
          <span className="absolute top-2 right-2 bg-[#D4AF37] text-black text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
            <Flame className="w-3 h-3" /> الأكثر مبيعاً
          </span>
        )}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
            -{product.discount} جنيه
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <span className="text-[10px] text-[#D4AF37] font-bold flex items-center gap-1">
          <Tag className="w-3 h-3" /> {product.category}
        </span>
        <h4 className="text-sm font-black text-white leading-tight line-clamp-2">{product.name}</h4>

        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-[#D4AF37] font-black text-base">{finalPrice} ج.م</span>
          {product.discount > 0 && (
            <span className="text-gray-500 text-xs line-through">{product.price} ج.م</span>
          )}
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-black py-2 rounded-xl hover:bg-sky-500 hover:text-white transition-all"
          >
            <Pencil className="w-3.5 h-3.5" /> تعديل
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-black py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" /> {deleting ? '...' : 'حذف'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  ProductFormModal
// ═══════════════════════════════════════════════════════════
const ProductFormModal = ({ formData, editingProduct, onChange, onSubmit, onClose, saving, categories }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div
      className="bg-[#15171a] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-5 border-b border-white/5 sticky top-0 bg-[#15171a]">
        <h3 className="font-black text-white text-lg">
          {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
      </div>

      <form onSubmit={onSubmit} className="p-5 space-y-4">
        <Field label="اسم المنتج">
          <input required value={formData.name} onChange={(e) => onChange('name', e.target.value)}
            className="form-input" placeholder="مثال: طقم ريال مدريد 23/24" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="السعر (ج.م)">
            <input required type="number" min="0" value={formData.price}
              onChange={(e) => onChange('price', e.target.value)} className="form-input" />
          </Field>
          <Field label="الخصم (ج.م)">
            <input type="number" min="0" value={formData.discount}
              onChange={(e) => onChange('discount', e.target.value)} className="form-input" />
          </Field>
        </div>

        <Field label="القسم">
          <input required list="category-options" value={formData.category}
            onChange={(e) => onChange('category', e.target.value)}
            className="form-input" placeholder="مثال: أطقم الأندية" />
          <datalist id="category-options">
            {categories.map((c) => <option key={c} value={c} />)}
          </datalist>
        </Field>

        <Field label="رابط الصورة">
          <input value={formData.image} onChange={(e) => onChange('image', e.target.value)}
            className="form-input" placeholder="./real_madrid.jpg" />
        </Field>

        <Field label="الوصف">
          <textarea rows={4} value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            className="form-input resize-none" placeholder="وصف تفصيلي للمنتج..." />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="عدد المبيعات">
            <input type="number" min="0" value={formData.salesCount}
              onChange={(e) => onChange('salesCount', e.target.value)} className="form-input" />
          </Field>
          <label className="flex items-center gap-2 mt-7 cursor-pointer">
            <input type="checkbox" checked={formData.isBestSeller}
              onChange={(e) => onChange('isBestSeller', e.target.checked)}
              className="w-4 h-4 accent-[#D4AF37]" />
            <span className="text-xs font-bold text-gray-300">الأكثر مبيعاً</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 py-3 rounded-2xl font-black text-sm text-gray-300 bg-white/5 hover:bg-white/10 transition-all">
            إلغاء
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm text-black bg-[#D4AF37] hover:bg-[#e6c34a] transition-all disabled:opacity-60">
            <Save className="w-4 h-4" /> {saving ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-gray-400">{label}</label>
    {children}
  </div>
);

export default MarketSection;