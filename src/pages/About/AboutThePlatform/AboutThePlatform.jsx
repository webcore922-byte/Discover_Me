import React from 'react'

const AboutThePlatform = () => {
  return (
     <main className="bg-[var(--color-bg-main)] text-[var(--color-text-white)]">
      
      <section className="container mx-auto px-6 py-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-gold-main)] mb-6">
          نحن منصة رقمية متخصصة
        </h1>
        <p className="text-[var(--color-text-gray)] max-w-3xl mx-auto leading-relaxed">
          نحن منصة رقمية متخصصة في اكتشاف ورعاية المواهب في مختلف المجالات. 
          نؤمن أن كل شخص يمتلك موهبة فريدة تستحق أن تُكتشف وتُطوّر. 
          لذلك قمنا ببناء بيئة رقمية متكاملة تساعد المستخدمين على عرض مهاراتهم، 
          الحصول على تقييم احترافي، والانضمام إلى برامج تدريبية متقدمة.
        </p>
        <p className="text-[var(--color-text-gray)] max-w-3xl mx-auto leading-relaxed mt-4">
          نعمل باستمرار على تطوير أدواتنا وخدماتنا لضمان تقديم أفضل تجربة ممكنة للمستخدمين.
        </p>
      </section>

      
      <section className="bg-[var(--color-bg-card)] py-9 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-gold-main)] mb-4">
          رؤيتنا
        </h2>
        <p className="text-[var(--color-text-gray)] max-w-2xl mx-auto leading-relaxed">
          أن نكون المنصة الرائدة في العالم العربي لاكتشاف وتطوير المواهب، 
          وأن نصنع مجتمعًا داعمًا يساعد الأفراد على تحقيق أحلامهم والوصول إلى أعلى مستويات النجاح.
        </p>
      </section>

      
      <section className="container mx-auto px-6 py-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-gold-main)] mb-4">
          رسالتنا
        </h2>
        <p className="text-[var(--color-text-gray)] max-w-2xl mx-auto leading-relaxed">
          نسعى إلى تمكين الأفراد من خلال توفير فرص تدريب حقيقية، تقييمات دقيقة، 
          وبيئة تشجع على الإبداع والتطور المستمر.
        </p>
      </section>
    </main>
  )
}

export default AboutThePlatform
