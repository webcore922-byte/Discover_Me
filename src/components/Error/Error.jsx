import { Typography, Button } from "@material-tailwind/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
export const Error = ({
  message,
  onRetry
}) => <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-[var(--color-bg-main)]">
   
    <div className="w-full max-w-md p-8 bg-[var(--color-bg-card)] border border-[var(--color-gold-main)] rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.2)] flex flex-col items-center text-center">
      
      <div className="p-4 mb-6 rounded-full bg-[var(--color-gold-main)]/10">
        <ExclamationTriangleIcon className="w-16 h-16 text-[var(--color-gold-main)]" />
      </div>

      <Typography variant="h3" className="text-[var(--color-text-white)] mb-3 font-serif tracking-wide">
        حدث خطأ تقني
      </Typography>
      <Typography className="text-gray-400 mb-8 font-light leading-relaxed">
        {message || "تعذر الاتصال بخادم البيانات. يرجى المحاولة لاحقاً."}
      </Typography>

      <Button onClick={onRetry} className="bg-[var(--color-gold-main)] hover:bg-yellow-600 text-black px-10 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
        إعادة المحاولة
      </Button>
    </div>
  </div>;
