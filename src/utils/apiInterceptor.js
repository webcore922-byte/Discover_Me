import Swal from './swalAlert';
let redirecting = false;
const isAuthEndpoint = (url = '') => /\/(login|register)(\/|\?|$)/.test(url);
export const setupApiInterceptor = () => {
  if (typeof window === 'undefined' || window.__scoutFetchPatched) return;
  window.__scoutFetchPatched = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    try {
      const requestUrl = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
      const hadSession = !!localStorage.getItem('scoutToken');
      if (response.status === 401 && hadSession && !isAuthEndpoint(requestUrl) && !redirecting) {
        redirecting = true;
        localStorage.removeItem('scoutUser');
        localStorage.removeItem('scoutToken');
        await Swal.fire({
          title: 'انتهت صلاحية الجلسة',
          text: 'مرت مدة طويلة من غير نشاط، سجّل دخولك تاني عشان تكمل من غير أي مشاكل.',
          icon: 'info',
          confirmButtonText: 'تسجيل الدخول'
        });
        window.location.href = '/login';
      }
    } catch {}
    return response;
  };
};
export default setupApiInterceptor;
