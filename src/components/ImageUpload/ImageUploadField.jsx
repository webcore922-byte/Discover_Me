import React, { useRef, useState } from 'react';
import { UploadCloud, Loader2, ImageOff, X, Link2 } from 'lucide-react';
import { uploadImage, UploadImageError } from '../../utils/uploadImage';
import Swal from '../../utils/swalAlert';
const ImageUploadField = ({
  value,
  onChange,
  folder = 'scoutpro',
  label = 'الصورة',
  shape = 'square',
  required = false
}) => {
  const inputRef = useRef(null);
  const [mode, setMode] = useState('device');
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState('');
  const [imgError, setImgError] = useState(false);
  const [linkDraft, setLinkDraft] = useState(value || '');
  const preview = localPreview || value;
  const handlePick = () => inputRef.current?.click();
  const handleFile = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgError(false);
    setLocalPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      setLinkDraft(url);
    } catch (err) {
      setLocalPreview('');
      const message = err instanceof UploadImageError ? err.message : 'حصل خطأ غير متوقع أثناء رفع الصورة';
      Swal.fire({
        title: 'تعذر رفع الصورة',
        text: message,
        icon: 'error'
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };
  const handleRemove = e => {
    e.stopPropagation();
    setLocalPreview('');
    setLinkDraft('');
    onChange('');
  };
  const handleLinkChange = e => {
    const url = e.target.value;
    setLinkDraft(url);
    setImgError(false);
    onChange(url.trim());
  };
  const switchMode = next => {
    if (next === mode) return;
    setMode(next);
    setImgError(false);
    setLocalPreview('');
  };
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';
  return <div>
      {label && <label className="text-xs dark:text-gray-400 text-[var(--color-text-gray)] block mb-1.5 font-bold">
          {label} {required && <span className="text-red-500">*</span>}
        </label>}

      {}
      <div className="flex items-center gap-1 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-[var(--color-border)] rounded-xl p-1 mb-2 w-fit">
        <button type="button" onClick={() => switchMode('device')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${mode === 'device' ? 'bg-[#D4AF37] text-black' : 'dark:text-gray-400 text-[var(--color-text-gray)] hover:text-[#D4AF37]'}`}>
          <UploadCloud className="w-3.5 h-3.5" /> من الجهاز
        </button>
        <button type="button" onClick={() => switchMode('link')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${mode === 'link' ? 'bg-[#D4AF37] text-black' : 'dark:text-gray-400 text-[var(--color-text-gray)] hover:text-[#D4AF37]'}`}>
          <Link2 className="w-3.5 h-3.5" /> لينك صورة
        </button>
      </div>

      {mode === 'device' ? <>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/jpg" onChange={handleFile} className="hidden" />

          <div onClick={!uploading ? handlePick : undefined} className={`group relative flex items-center gap-4 border-2 border-dashed dark:border-white/15 border-[var(--color-border)] dark:bg-white/5 bg-[var(--color-bg-main)] hover:border-[#D4AF37] transition-all cursor-pointer p-3 ${shapeClass === 'rounded-full' ? 'rounded-2xl' : 'rounded-2xl'}`}>
            <div className={`relative shrink-0 w-16 h-16 ${shapeClass} overflow-hidden dark:bg-black/30 bg-white border dark:border-white/10 border-[var(--color-border)] flex items-center justify-center`}>
              {preview && !imgError ? <img src={preview} alt="معاينة" onError={() => setImgError(true)} className="w-full h-full object-cover" /> : <ImageOff className="w-6 h-6 text-gray-400" />}

              {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold dark:text-white text-[var(--color-text-gray)] flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
                {uploading ? 'جاري رفع الصورة...' : 'اضغط لاختيار صورة من جهازك'}
              </p>
              <p className="text-[11px] dark:text-gray-500 text-gray-500 mt-0.5">
                JPG أو PNG أو WEBP — بحد أقصى 5 ميجا
              </p>
            </div>

            {preview && !uploading && <button type="button" onClick={handleRemove} className="shrink-0 w-7 h-7 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center" title="إزالة الصورة">
                <X className="w-3.5 h-3.5" />
              </button>}
          </div>
        </> : <div className="flex items-center gap-3 border-2 border-dashed dark:border-white/15 border-[var(--color-border)] dark:bg-white/5 bg-[var(--color-bg-main)] rounded-2xl p-3">
          <div className={`relative shrink-0 w-16 h-16 ${shapeClass} overflow-hidden dark:bg-black/30 bg-white border dark:border-white/10 border-[var(--color-border)] flex items-center justify-center`}>
            {preview && !imgError ? <img src={preview} alt="معاينة" onError={() => setImgError(true)} className="w-full h-full object-cover" /> : <ImageOff className="w-6 h-6 text-gray-400" />}
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <input type="url" value={linkDraft} onChange={handleLinkChange} placeholder="https://example.com/image.jpg" dir="ltr" className="w-full bg-transparent text-sm dark:text-white text-[var(--color-text-gray)] placeholder-gray-500 outline-none border-b dark:border-white/10 border-[var(--color-border)] focus:border-[#D4AF37] py-1" />
            </div>
            <p className="text-[11px] dark:text-gray-500 text-gray-500">
              الصقّ رابط الصورة مباشرة (هيتحفظ زي ما هو من غير رفع)
            </p>
          </div>

          {preview && <button type="button" onClick={handleRemove} className="shrink-0 w-7 h-7 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center" title="إزالة الصورة">
              <X className="w-3.5 h-3.5" />
            </button>}
        </div>}
    </div>;
};
export default ImageUploadField;
