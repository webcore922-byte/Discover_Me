import SwalBase from 'sweetalert2';
const GOLD = '#D4AF37';
const getThemeStyle = () => {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  return isDark ? {
    background: '#181b1d',
    color: '#f4f4f4'
  } : {
    background: '#ffffff',
    color: '#1c1c1c'
  };
};
const buildOptions = (options = {}) => {
  const theme = getThemeStyle();
  return {
    confirmButtonColor: GOLD,
    cancelButtonColor: '#6b7280',
    customClass: {
      popup: 'rounded-3xl shadow-2xl border border-[color:var(--color-border,rgba(212,175,55,0.15))]',
      ...(options.customClass || {})
    },
    ...options,
    background: theme.background,
    color: theme.color
  };
};
const Swal = {
  fire: options => SwalBase.fire(buildOptions(options)),
  mixin: options => SwalBase.mixin(buildOptions(options)),
  showLoading: (...args) => SwalBase.showLoading(...args),
  hideLoading: (...args) => SwalBase.hideLoading(...args),
  close: (...args) => SwalBase.close(...args),
  clickConfirm: (...args) => SwalBase.clickConfirm(...args),
  clickCancel: (...args) => SwalBase.clickCancel(...args),
  isVisible: (...args) => SwalBase.isVisible(...args),
  update: (...args) => SwalBase.update(...args),
  getPopup: (...args) => SwalBase.getPopup(...args),
  DismissReason: SwalBase.DismissReason
};
export default Swal;
