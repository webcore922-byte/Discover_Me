import React from 'react';
import {
  ShoppingBag, Plus, Pencil, Trash2, X, Save,
  Tag, Flame, ImageOff, Search, ChevronLeft, ChevronRight,
  Package, ChevronDown,
} from 'lucide-react';
import {
  useMarketLogic, CATEGORY_META, STATUS_CONFIG, STATUS_ORDER,
} from './useMarketLogic';

const MarketSection = () => {
  const [activeTab, setActiveTab] = React.useState('market');
  const {
    products, loading, error, setError,
    activeCategory, setActiveCategory,
    search, setSearch,
    page, setPage,
    showForm, editingProduct, formData, saving, deletingId,
    categories, filtered, totalPages, safePage, paginated,
    openAddForm, openEditForm, closeForm, handleFormChange,
    handleSubmit, handleDelete,
    orders, ordersLoading, ordersError, setOrdersError,
    statusFilter, setStatusFilter,
    orderSearch, setOrderSearch,
    ordersPage, setOrdersPage,
    updatingOrderId, handleStatusChange,
    filteredOrders, ordersTotalPages, safeOrdersPage, paginatedOrders,
    statusCounts,
  } = useMarketLogic();

  return (
    <div className="space-y-10" >

      <style>{`
        .swal-popup-custom   { border-radius:24px!important;border:1px solid rgba(255,255,255,.10)!important;padding:32px 24px 24px!important;min-width:400px!important; }
        .swal-title-custom   { font-size:22px!important;font-weight:900!important;font-family:inherit!important;direction:rtl; }
        .swal-html-custom    { font-family:inherit!important;direction:rtl; }
        .swal-confirm-custom { border-radius:14px!important;font-weight:800!important;font-size:14px!important;padding:12px 28px!important;color:#000!important; }
        .swal-cancel-custom  { border-radius:14px!important;font-weight:800!important;font-size:14px!important;padding:12px 28px!important; }
        .swal-center-toast   { border-radius:20px!important;border:1px solid rgba(255,255,255,.10)!important;padding:24px 40px!important;font-size:16px!important;font-weight:800!important;min-width:300px!important; }
        .swal-ok-custom      { border-radius:14px!important;font-weight:800!important;font-size:14px!important;padding:10px 36px!important;color:#000!important; }
        .form-input          { width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:10px 14px;font-size:13px;color:white;outline:none; }
        .form-input:focus    { border-color:rgba(212,175,55,.4); }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .status-select:focus { outline:none; }
      `}</style>
      <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1.5 w-fit">
        <button
          onClick={() => setActiveTab('market')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
            activeTab === 'market' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          المتجر
          <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-lg ${activeTab === 'market' ? 'bg-black/15' : 'bg-white/10'}`}>
            ({products.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
            activeTab === 'orders' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          إدارة الطلبات
          <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-lg ${activeTab === 'orders' ? 'bg-black/15' : 'bg-white/10'}`}>
            ({orders.length})
          </span>
        </button>
      </div>
      {activeTab === 'market' && <>
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

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold px-4 py-3 rounded-2xl flex items-center justify-between">
          {error}
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}
      <div className="space-y-3">
        <h3 className="text-lg font-black text-white">الأقسام</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <CategoryCard label="الكل" emoji="🛍️" active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} />
          {categories.map((cat) => (
            <CategoryCard key={cat} label={cat} emoji={CATEGORY_META[cat]?.emoji || '🏷️'}
              active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
          ))}
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث عن منتج..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pr-11 pl-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#D4AF37]/40" />
      </div>

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
              <ProductCard key={product.id} product={product}
                onEdit={() => openEditForm(product)}
                onDelete={() => handleDelete(product)}
                deleting={deletingId === product.id} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-9 h-9 text-sm font-black rounded-xl transition-all ${n === safePage ? 'bg-[#D4AF37] text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-500 font-bold mr-2">
                صفحة {safePage} من {totalPages} · {filtered.length} منتج
              </span>
            </div>
          )}
        </>
      )}

      </>}
      {activeTab === 'orders' && <div className="space-y-5">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">إدارة الطلبات</h2>
              <p className="text-xs text-gray-400 font-bold">{orders.length} طلب إجمالي</p>
            </div>
          </div>

        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { key: 'all', label: 'الكل', icon: null },
            ...STATUS_ORDER.map((s) => ({ key: s, ...STATUS_CONFIG[s] })),
          ].map(({ key, label, icon: Icon, color, bg, border }) => (
            <button key={key} onClick={() => setStatusFilter(key)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black border transition-all ${
                statusFilter === key
                  ? key === 'all'
                    ? 'bg-white/15 border-white/20 text-white'
                    : `${bg} ${border} ${color}`
                  : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/8'
              }`}>
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {label}
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-lg ${
                statusFilter === key ? 'bg-white/20' : 'bg-white/5'
              }`}>
                {statusCounts[key] ?? 0}
              </span>
            </button>
          ))}
        </div>
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2" />
          <input value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)}
            placeholder="بحث بالاسم أو رقم الطلب أو الهاتف..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pr-11 pl-4 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-400/40" />
        </div>

        {ordersError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold px-4 py-3 rounded-2xl flex items-center justify-between">
            {ordersError}
            <button onClick={() => setOrdersError('')}><X className="w-4 h-4" /></button>
          </div>
        )}
        {ordersLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-bold">لا توجد طلبات مطابقة</div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedOrders.map((order) => (
                <OrderRow key={order.id} order={order}
                  onStatusChange={(newStatus) => handleStatusChange(order, newStatus)}
                  updating={updatingOrderId === order.id} />
              ))}
            </div>

            {ordersTotalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <button onClick={() => setOrdersPage((p) => Math.max(1, p - 1))} disabled={safeOrdersPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
                {Array.from({ length: ordersTotalPages }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => setOrdersPage(n)}
                    className={`w-9 h-9 text-sm font-black rounded-xl transition-all ${n === safeOrdersPage ? 'bg-purple-500 text-white' : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'}`}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setOrdersPage((p) => Math.min(ordersTotalPages, p + 1))} disabled={safeOrdersPage === ordersTotalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-30 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-500 font-bold mr-2">
                  صفحة {safeOrdersPage} من {ordersTotalPages} · {filteredOrders.length} طلب
                </span>
              </div>
            )}
          </>
        )}
      </div>}
      {showForm && (
        <ProductFormModal formData={formData} editingProduct={editingProduct}
          onChange={handleFormChange} onSubmit={handleSubmit} onClose={closeForm}
          saving={saving} categories={categories} />
      )}
    </div>
  );
};

const OrderRow = ({ order, onStatusChange, updating }) => {
  const cfg     = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const Icon    = cfg.icon;
  const dateStr = order.date ? new Date(order.date).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'short', day: 'numeric',
  }) : '—';

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all ${updating ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${cfg.bg} ${cfg.border} flex-shrink-0`}>
        <span className={`w-2 h-2 rounded-full ${cfg.dot} ${updating ? 'animate-pulse' : ''}`} />
        <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
        <span className={`text-[11px] font-black ${cfg.color}`}>{cfg.label}</span>
      </div>

      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-black text-white truncate">{order.name || 'عميل'}</span>
          <span className="text-[10px] text-gray-500 font-bold bg-white/5 px-2 py-0.5 rounded-lg">#{order.id?.slice(-6)}</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-gray-400">{order.phone || '—'}</span>
          <span className="text-xs text-gray-600">·</span>
          <span className="text-xs text-gray-400">{dateStr}</span>
          <span className="text-xs text-gray-600">·</span>
          <span className="text-xs font-black text-[#D4AF37]">{order.total} ج.م</span>
        </div>
        {order.items?.length > 0 && (
          <p className="text-[11px] text-gray-500 truncate">
            {order.items.map((i) => i.name).join(' · ')}
          </p>
        )}
      </div>
      <div className="relative flex-shrink-0">
        <select
          value={order.status || 'pending'}
          onChange={(e) => onStatusChange(e.target.value)}
          disabled={updating}
          className={`status-select appearance-none pr-4 pl-8 py-2.5 rounded-xl text-xs font-black border cursor-pointer transition-all ${cfg.bg} ${cfg.border} ${cfg.color} bg-[#15171a]`}
          style={{ backgroundImage: 'none' }}
        >
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s} style={{ background: '#15171a', color: '#fff' }}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
        <ChevronDown className={`w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${cfg.color}`} />
      </div>
    </div>
  );
};

const CategoryCard = ({ label, emoji, active, onClick }) => (
  <button onClick={onClick}
    className={`flex-shrink-0 flex flex-col items-center justify-center gap-2 w-36 h-36 rounded-3xl border transition-all ${
      active ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'bg-white/5 border-white/5 text-white hover:border-[#D4AF37]/30'
    }`}>
    <span className="text-4xl">{emoji}</span>
    <span className="text-xs font-black text-center px-2">{label}</span>
  </button>
);

const ProductCard = ({ product, onEdit, onDelete, deleting }) => {
  const finalPrice = product.discount > 0 ? product.price - product.discount : product.price;

  return (
    <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden flex flex-col group hover:border-[#D4AF37]/20 transition-all">
      <div className="relative aspect-square bg-black/30 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }} />
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
          <button onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-black py-2 rounded-xl hover:bg-sky-500 hover:text-white transition-all">
            <Pencil className="w-3.5 h-3.5" /> تعديل
          </button>
          <button onClick={onDelete} disabled={deleting}
            className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-black py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">
            <Trash2 className="w-3.5 h-3.5" /> {deleting ? '...' : 'حذف'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductFormModal = ({ formData, editingProduct, onChange, onSubmit, onClose, saving, categories }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-[#15171a] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}>
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