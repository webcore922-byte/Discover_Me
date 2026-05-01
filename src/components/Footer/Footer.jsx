import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaFeatherAlt } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[var(--color-bg-card)] text-white  border-[var(--color-border)]/20 py-4 overflow-hidden">
      
      <FaFeatherAlt className="absolute -bottom-6 -left-10 text-[var(--color-gold-main)] text-[150px] opacity-[0.03] -rotate-12 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-4">
            <h2 className="text-[var(--color-gold-main)] text-xl font-bold">اكتشفني</h2>
            <div className="hidden md:block h-4 w-[1px] bg-[var(--color-border)]/30"></div>
            <p className="dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] text-xs font-bold">
              &copy; {currentYear} جميع الحقوق محفوظة
            </p>
          </div>

          <ul className="flex flex-wrap justify-center gap-6 dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] text-xs">
            <li className="hover:text-[var(--color-gold-main)] cursor-pointer transition">الرئيسية</li>
            <li className="hover:text-[var(--color-gold-main)] cursor-pointer transition">قصص النجاح</li>
            <li className="hover:text-[var(--color-gold-main)] cursor-pointer transition">اتصل بنا</li>
            <li className="hover:text-[var(--color-gold-main)] cursor-pointer transition">سياسة الخصوصية</li>
          </ul>

          <div className="flex items-center gap-5 dark:text-[var(--color-gold-main)]/80 text-[var(--color-text-main)]">
            <FaFacebook className="hover:text-[var(--color-gold-main)] cursor-pointer transition text-lg" />
            <FaInstagram className="hover:text-[var(--color-gold-main)] cursor-pointer transition text-lg" />
            <FaTwitter className="hover:text-[var(--color-gold-main)] cursor-pointer transition text-lg" />
            <FaLinkedin className="hover:text-[var(--color-gold-main)] cursor-pointer transition text-lg" />
          </div>

        </div>
      </div>
    </footer>
  );
};


export default Footer;