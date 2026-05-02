import React from 'react'
import { useTheme } from '../../../context/ThemeContext/ThemeContext'

const AboutThePlatform = () => {
  const { theme } = useTheme()
  return (
     <main className="bg-[var(--color-bg-main)] text-[var(--color-text-white)] min-h-screen flex flex-col overflow-x-hidden">
      
      
      <section className="container mx-auto px-4 md:px-6 pt-[100px] pb-12 md:pb-16 flex flex-col items-center text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-gold-main)] mb-6 leading-tight">
          نحن منصة رقمية متخصصة
        </h1>
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-base md:text-lg dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] leading-relaxed">
            نحن منصة رقمية متخصصة في اكتشاف ورعاية المواهب في مختلف المجالات. 
            نؤمن أن كل شخص يمتلك موهبة فريدة تستحق أن تُكتشف وتُطوّر. 
            لذلك قمنا ببناء بيئة رقمية متكاملة تساعد المستخدمين على عرض مهاراتهم، 
            الحصول على تقييم احترافي، والانضمام إلى برامج تدريبية متقدمة.
          </p>
          <p className="text-base md:text-lg dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] leading-relaxed ">
            نعمل باستمرار على تطوير أدواتنا وخدماتنا لضمان تقديم أفضل تجربة ممكنة للمستخدمين.
          </p>
        </div>
      </section>

      
      <section className="bg-[var(--color-bg-card)] w-full py-12 px-6 border-y border-[var(--color-border)]">
        <div className="container mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--color-gold-main)] mb-4">
            رؤيتنا
          </h2>
          <p className="text-base md:text-xl dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] max-w-2xl mx-auto leading-relaxed italic">
            أن نكون المنصة الرائدة في العالم العربي لاكتشاف وتطوير المواهب، 
            وأن نصنع مجتمعًا داعمًا يساعد الأفراد على تحقيق أحلامهم والوصول إلى أعلى مستويات النجاح.
          </p>
        </div>
      </section>

     
      <section className="container mx-auto px-6 py-12 md:py-16 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--color-gold-main)] mb-4">
          رسالتنا
        </h2>
        <p className="text-base md:text-xl dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] max-w-2xl mx-auto leading-relaxed">
          نسعى إلى تمكين الأفراد من خلال توفير فرص تدريب حقيقية، تقييمات دقيقة، 
          وبيئة تشجع على الإبداع والتطور المستمر.
        </p>
      </section>
      
    </main>
  )
}

export default AboutThePlatform