import { authHeader } from './authHeader';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_SIZE_MB = 5;
export class UploadImageError extends Error {}
export const uploadImage = async (file, folder = 'scoutpro') => {
  if (!file) {
    throw new UploadImageError('من فضلك اختر صورة أولاً');
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new UploadImageError('نوع الصورة غير مدعوم، استخدم JPG أو PNG أو WEBP فقط');
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new UploadImageError(`حجم الصورة كبير جدًا، الحد الأقصى ${MAX_SIZE_MB} ميجا`);
  }
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);
  let res;
  try {
    res = await fetch(`${API_URL}/uploads`, {
      method: 'POST',
      headers: {
        ...authHeader()
      },
      body: formData
    });
  } catch (networkErr) {
    throw new UploadImageError('تعذر الاتصال بالسيرفر، تأكد من اتصالك بالإنترنت وحاول تاني');
  }
  if (!res.ok) {
    let message = 'فشل رفع الصورة، حاول مرة أخرى';
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new UploadImageError(message);
  }
  const data = await res.json();
  return data.url;
};
export default uploadImage;
