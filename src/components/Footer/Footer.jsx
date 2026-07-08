import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaFeatherAlt } from "react-icons/fa";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="relative bg-[var(--color-bg-card)] text-[var(--color-text-white)] py-4 overflow-hidden">
      
      <FaFeatherAlt className="absolute -bottom-6 -left-10 text-[var(--color-gold-main)] text-[150px] opacity-[0.03] -rotate-12 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-4">
            <Link to="/" className="text-[var(--color-gold-main)] text-xl font-bold hover:opacity-80 transition">
                اكتشفني
            </Link>
            <div className="hidden md:block h-4 w-[1px] bg-[var(--color-border)]/30"></div>
            <p className="dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] text-xs font-bold">
              &copy; {currentYear} جميع الحقوق محفوظة
            </p>
          </div>

          <ul className="flex flex-wrap justify-center gap-6 dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] text-xs font-bold">
            <li>
                <Link to="/" className="hover:text-[var(--color-gold-main)] transition">الرئيسية</Link>
            </li>
            <li>
                <Link to="/success-stories" className="hover:text-[var(--color-gold-main)] transition">قصص النجاح</Link>
            </li>
            <li>
                <Link to="/contact-us" className="hover:text-[var(--color-gold-main)] transition">اتصل بنا</Link>
            </li>
            <li>
                <Link to="/privacy-policy" className="hover:text-[var(--color-gold-main)] transition">سياسة الخصوصية</Link>
            </li>
          </ul>

          <div className="flex items-center gap-5 dark:text-[var(--color-gold-main)]/80 text-[var(--color-text-main)]">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="hover:text-[var(--color-gold-main)] cursor-pointer transition text-lg" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="hover:text-[var(--color-gold-main)] cursor-pointer transition text-lg" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="hover:text-[var(--color-gold-main)] cursor-pointer transition text-lg" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="hover:text-[var(--color-gold-main)] cursor-pointer transition text-lg" />
            </a>
          </div>

        </div>
      </div>
    </footer>;
};
export default Footer;
