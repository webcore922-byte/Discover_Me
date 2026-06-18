import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Lock, Eye, Database, Bell } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <Database className="text-[var(--color-gold-main)]" />,
      title: "البيانات التي نجمعها",
      content: "نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل كلاعب، بما في ذلك الاسم، الرقم القومي، السن، وبيانات الموهبة الكروية مثل الفيديوهات والمهارات."
    },
    {
      icon: <Eye className="text-[var(--color-gold-main)]" />,
      title: "كيفية استخدام بياناتك",
      content: "نستخدم هذه البيانات لتقييم موهبتك الكروية، وتسهيل عملية اكتشافك من قبل الكشافين والأندية، وتحسين تجربة المستخدم داخل المنصة."
    },
    {
      icon: <Lock className="text-[var(--color-gold-main)]" />,
      title: "حماية المعلومات",
      content: "نحن نطبق إجراءات أمنية صارمة لحماية بياناتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح. بياناتك مشفرة ومؤمنة بأعلى المعايير."
    },
    {
      icon: <Bell className="text-[var(--color-gold-main)]" />,
      title: "التعديلات على السياسة",
      content: "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لتتواكب مع تطورات الموقع. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-white py-20 px-4 md:px-10" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-[var(--color-gold-main)] transition-all mb-10 group"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1" />
          <span>العودة للخلف</span>
        </button>

        <div className="text-center mb-16">
          <div className="inline-block p-4 rounded-full bg-[var(--color-gold-main)]/10 border border-[var(--color-gold-main)]/20 mb-6">
            <ShieldCheck className="w-12 h-12 text-[var(--color-gold-main)]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gradient-gold uppercase italic tracking-wider mb-4">
            سياسة الخصوصية
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
            نحن في <span className="text-[var(--color-gold-main)] font-bold">ScoutPro</span> نلتزم بحماية خصوصية مواهبنا الرياضية وتأمين بياناتهم.
          </p>
        </div>

        <div className="grid gap-8">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="glass-card p-8 rounded-[2rem] border border-white/5 hover:border-[var(--color-gold-main)]/30 transition-all duration-500 group"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-[var(--color-gold-main)]/10 transition-colors">
                  {section.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white group-hover:text-[var(--color-gold-main)] transition-colors italic">
                    {section.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 glass-card p-10 rounded-[3rem] border border-[var(--color-gold-main)]/20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--gold-gradient)]" />
          <h2 className="text-2xl font-black mb-4">هل لديك استفسار؟</h2>
          <p className="text-white/60 mb-8 italic">
            إذا كان لديك أي سؤال بخصوص خصوصية بياناتك، لا تتردد في التواصل معنا.
          </p>
          <Link 
            to="/contact-us"
            className="inline-block bg-[var(--gold-gradient)] text-black font-black px-10 py-4 rounded-full shadow-[var(--gold-glow)] hover:scale-105 transition-transform uppercase italic"
          >
            تواصل مع الدعم الفني
          </Link>
        </div>

        <footer className="mt-20 text-center text-white/30 text-sm italic">
          &copy; {new Date().getFullYear()} ScoutPro. جميع الحقوق محفوظة.
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;