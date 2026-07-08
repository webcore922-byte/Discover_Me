import { useState, useEffect, useMemo } from 'react';
import { Clock, Package, Truck, CheckCircle2 } from 'lucide-react';
import Swal from '../../utils/swalAlert';
import { authHeader, authJsonHeader } from '../../utils/authHeader';
import { useStore } from '../../contexts/StoreContext/StoreContext';
const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
export const API_BASE = `${API_ROOT}/products`;
export const ORDERS_API = `${API_ROOT}/orders`;
export const CATEGORY_META = {
  'أطقم الأندية': {
    emoji: '👕'
  },
  'أطقم المنتخبات': {
    emoji: '🏆'
  },
  'أحذية كرة القدم': {
    emoji: '👟'
  },
  'كرات القدم': {
    emoji: '⚽'
  },
  'معدات التدريب': {
    emoji: '🏋️'
  },
  'اكسسوارات': {
    emoji: '🧤'
  }
};
export const STATUS_CONFIG = {
  pending: {
    label: 'قيد الانتظار',
    icon: Clock,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/25',
    dot: 'bg-yellow-400'
  },
  preparing: {
    label: 'جاري التحضير',
    icon: Package,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/25',
    dot: 'bg-blue-400'
  },
  on_the_way: {
    label: 'في الطريق',
    icon: Truck,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/25',
    dot: 'bg-purple-400'
  },
  delivered: {
    label: 'تم التسليم',
    icon: CheckCircle2,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/25',
    dot: 'bg-green-400'
  }
};
export const STATUS_ORDER = ['pending', 'preparing', 'on_the_way', 'delivered'];
export const ITEMS_PER_PAGE = 8;
export const ORDERS_PER_PAGE = 6;
export const EMPTY_PRODUCT = {
  name: '',
  price: '',
  discount: 0,
  category: '',
  image: '',
  isBestSeller: false,
  salesCount: 0,
  description: ''
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
    popup: 'swal-popup-custom',
    title: 'swal-title-custom',
    htmlContainer: 'swal-html-custom',
    confirmButton: 'swal-confirm-custom',
    cancelButton: 'swal-cancel-custom'
  }
});
export default function UseMarketLogic() {
  const {
    products,
    setProducts,
    load: storeLoading
  } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [recomputingBestSellers, setRecomputingBestSellers] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [debouncedOrderSearch, setDebouncedOrderSearch] = useState('');
  const [orderSort, setOrderSort] = useState('newest');
  const [ordersPage, setOrdersPage] = useState(1);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedOrderSearch(orderSearch), 250);
    return () => clearTimeout(t);
  }, [orderSearch]);
  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError('');
    try {
      const res = await fetch(ORDERS_API);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data.orders || data || []);
    } catch {
      setOrdersError('حدث خطأ في تحميل الطلبات.');
    } finally {
      setOrdersLoading(false);
    }
  };
  const handleStatusChange = async (order, newStatus) => {
    if (order.status === newStatus) return;
    setUpdatingOrderId(order.id);
    try {
      const res = await fetch(`${ORDERS_API}/${order.id}`, {
        method: 'PUT',
        headers: authJsonHeader(),
        body: JSON.stringify({
          ...order,
          status: newStatus
        })
      });
      if (!res.ok) throw new Error();
      setOrders(prev => prev.map(o => o.id === order.id ? {
        ...o,
        status: newStatus
      } : o));
      toastSuccess(`تم تحديث حالة الطلب إلى "${STATUS_CONFIG[newStatus].label}" ✅`);
    } catch {
      toastError('فشل تحديث حالة الطلب.');
    } finally {
      setUpdatingOrderId(null);
    }
  };
  const categories = useMemo(() => {
    const s = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(s);
  }, [products]);
  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    let list = products.filter(p => {
      const okCat = activeCategory === 'all' || p.category === activeCategory;
      const okSearch = !term || p.name?.toLowerCase().includes(term);
      return okCat && okSearch;
    });
    switch (sortBy) {
      case 'price_asc':
        list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price_desc':
        list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'sales_desc':
        list = [...list].sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0));
        break;
      case 'name_asc':
        list = [...list].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ar'));
        break;
      default:
        break;
    }
    return list;
  }, [products, activeCategory, debouncedSearch, sortBy]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  useEffect(() => {
    setPage(1);
  }, [activeCategory, debouncedSearch, sortBy]);
  const filteredOrders = useMemo(() => {
    const term = debouncedOrderSearch.trim().toLowerCase();
    let list = orders.filter(o => {
      const okStatus = statusFilter === 'all' || o.status === statusFilter;
      const okSearch = !term || o.name?.toLowerCase().includes(term) || o.id?.toLowerCase().includes(term) || o.phone?.includes(term) || o.city?.toLowerCase().includes(term) || o.address?.toLowerCase().includes(term);
      return okStatus && okSearch;
    });
    list = [...list].sort((a, b) => {
      const da = new Date(a.date || a.createdAt || 0).getTime();
      const db = new Date(b.date || b.createdAt || 0).getTime();
      return orderSort === 'oldest' ? da - db : db - da;
    });
    return list;
  }, [orders, statusFilter, debouncedOrderSearch, orderSort]);
  const ordersTotalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  const safeOrdersPage = Math.min(ordersPage, ordersTotalPages);
  const paginatedOrders = filteredOrders.slice((safeOrdersPage - 1) * ORDERS_PER_PAGE, safeOrdersPage * ORDERS_PER_PAGE);
  useEffect(() => {
    setOrdersPage(1);
  }, [statusFilter, debouncedOrderSearch, orderSort]);
  const statusCounts = useMemo(() => {
    const c = {
      all: orders.length
    };
    STATUS_ORDER.forEach(s => {
      c[s] = orders.filter(o => o.status === s).length;
    });
    return c;
  }, [orders]);
  const openAddForm = () => {
    setEditingProduct(null);
    setFormData(EMPTY_PRODUCT);
    setShowForm(true);
  };
  const openEditForm = product => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price ?? '',
      discount: product.discount ?? 0,
      category: product.category || '',
      image: product.image || '',
      isBestSeller: !!product.isBestSeller,
      salesCount: product.salesCount ?? 0,
      description: product.description || ''
    });
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData(EMPTY_PRODUCT);
  };
  const handleFormChange = (field, value) => setFormData(prev => ({
    ...prev,
    [field]: value
  }));
  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const {
      isBestSeller,
      salesCount,
      ...rest
    } = formData;
    const payload = {
      ...rest,
      price: Number(formData.price) || 0,
      discount: Number(formData.discount) || 0
    };
    try {
      if (editingProduct) {
        const res = await fetch(`${API_BASE}/${editingProduct.id}`, {
          method: 'PUT',
          headers: authJsonHeader(),
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
          ...p,
          ...payload,
          ...updated
        } : p));
        toastSuccess('تم تعديل المنتج بنجاح ✏️');
      } else {
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: authJsonHeader(),
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setProducts(prev => [...prev, {
          id: created.id || Date.now().toString(),
          ...payload,
          ...created
        }]);
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
  const handleDelete = async product => {
    const result = await confirmDelete(product.name);
    if (!result.isConfirmed) return;
    setDeletingId(product.id);
    try {
      const res = await fetch(`${API_BASE}/${product.id}`, {
        method: 'DELETE',
        headers: authHeader()
      });
      if (!res.ok) throw new Error();
      setProducts(prev => prev.filter(p => p.id !== product.id));
      toastSuccess('تم حذف المنتج بنجاح 🗑️');
    } catch {
      toastError('فشل حذف المنتج.');
    } finally {
      setDeletingId(null);
    }
  };
  const handleRecomputeBestSellers = async () => {
    setRecomputingBestSellers(true);
    try {
      const res = await fetch(`${API_BASE}/recompute-best-sellers`, {
        method: 'POST',
        headers: authHeader()
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setProducts(updated);
      toastSuccess('تم تحديث "الأكثر مبيعاً" حسب المبيعات الحقيقية 🔄');
    } catch {
      toastError('فشل تحديث "الأكثر مبيعاً"، حاول مرة أخرى.');
    } finally {
      setRecomputingBestSellers(false);
    }
  };
  return {
    products,
    loading: loading || storeLoading,
    error,
    setError,
    activeCategory,
    setActiveCategory,
    search,
    setSearch,
    sortBy,
    setSortBy,
    page,
    setPage,
    showForm,
    editingProduct,
    formData,
    saving,
    deletingId,
    categories,
    filtered,
    totalPages,
    safePage,
    paginated,
    openAddForm,
    openEditForm,
    closeForm,
    handleFormChange,
    handleSubmit,
    handleDelete,
    recomputingBestSellers,
    handleRecomputeBestSellers,
    orders,
    ordersLoading,
    ordersError,
    setOrdersError,
    statusFilter,
    setStatusFilter,
    orderSearch,
    setOrderSearch,
    orderSort,
    setOrderSort,
    ordersPage,
    setOrdersPage,
    updatingOrderId,
    handleStatusChange,
    filteredOrders,
    ordersTotalPages,
    safeOrdersPage,
    paginatedOrders,
    statusCounts
  };
}
;
