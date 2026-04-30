import React from "react";
import {
  Typography,
  Card,
  CardBody,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { useTheme } from "../../../../context/ThemeContext";
const SportsPsychology = () => {
  const { theme } = useTheme();
  return (
    <div className="bg-[var(--color-bg-main)] min-h-screen p-6 lg:p-12 text-[var(--color-text-gray)] font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-16 border-r-8 border-[var(--color-border)] pr-6 py-2">
          <Typography variant="h1" className="text-5xl lg:text-7xl font-black uppercase tracking-tight dark:text-[var(--color-text-white)] text-[var(--color-text-main)] mb-4">
            العقل <span className="text-gradient-gold font-black">أولاً</span>
          </Typography>
          <Typography className="text-xl dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] max-w-3xl leading-relaxed">
            لماذا ينكسر أعظم اللاعبين بدنياً أمام ضغط "اللحظة الصفر"؟ رحلة في أعماق الإعداد الذهني الذي يصنع الفارق بين اللاعب الموهوب والأسطورة الخالدة.
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-12">
            
            <article className="prose prose-invert max-w-none">
              <Typography variant="h2" className="mb-8 font-bold text-3xl dark:text-[var(--color-text-white)] text-[var(--color-text-main)]">
                سيكولوجية المستطيل الأخضر
              </Typography>
              
              <p className="dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] text-lg leading-loose mb-6">
                في عالم كرة القدم الحديثة، لم يعد الحذاء الذهبي يُمنح لصاحب الأقدام الأسرع، بل لصاحب العقل الأهدأ. الإعداد النفسي هو تلك المنطقة الرمادية التي تسبق صافرة البداية؛ حيث تُربح المباريات وتُخسر في غرف الملابس قبل النزول للميدان.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                <div className="glass-card hover-gold-card p-6 rounded-2xl card-shine group">
                  <Typography variant="h5" className="mb-3  text-[var(--color-gold-main)] ">
                    المرونة الإدراكية
                  </Typography>
                  <Typography className="text-sm dark:text-[var(--color-text-gray)] text-[var(--color-bg-main)]">
                    القدرة على تغيير التكتيك الذهني فوراً عند استقبال هدف مفاجئ أو التعرض لقرار تحكيمي ظالم.
                  </Typography>
                </div>
                <div className="glass-card hover-gold-card p-6 rounded-2xl card-shine group">
                  <Typography variant="h5" className="mb-3 text-[var(--color-gold-main)] ">
                    النفق الذهني
                  </Typography>
                  <Typography className="text-sm dark:text-[var(--color-text-gray)] text-[var(--color-bg-main)]">
                    حالة من التركيز المطلق تجعل اللاعب لا يسمع صياح الجماهير ولا يرى سوى الثغرات في دفاع الخصم.
                  </Typography>
                </div>
              </div>

              <Typography variant="h3" className="mb-4 mt-10 font-bold text-gradient-gold">
                المقال: فن الصمود تحت الأضواء
              </Typography>
              <p className="dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] text-lg leading-loose">
                اللاعب المحترف يتعرض لضغط يوازي الضغط الجوي في أعماق المحيط. عندما يتقدم لاعب لتسديد ركلة جزاء في نهائي، هو لا يحارب الحارس، بل يحارب "الأنا" والذكريات القديمة والخوف من خيبة أمل الملايين. 
                <br /><br />
                الإعداد الذهني يعلم اللاعب أن الفشل ليس "نهاية"، بل هو "بيانات" يتم تحليلها لتطوير الأداء. اللاعب الذي يتجاوز خطأه في ثوانٍ هو الذي يمتلك سيادة حقيقية على جسده، لأن العضلات لا تتحرك إلا بأوامر من مركز القيادة.. العقل.
              </p>
            </article>

            <div className="relative p-8 rounded-3xl glass-card border-r-4 border-[var(--color-border)]">
              <span className="absolute top-0 right-4 text-8xl text-[var(--color-gold-main)] opacity-10 font-serif font-bold">"</span>
              <Typography variant="h4" className="italic font-light text-[var(--color-text-white)]">
                "الموهبة هي ما تفعله، أما الشخصية الذهنية فهي ما يجعلك تستمر في فعله عندما يتوقف الجميع."
              </Typography>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            
            <Card className="bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-none rounded-2xl overflow-hidden">
              <CardBody className="p-0">
                <div className="dark:bg-[var(--color-border)] bg-[--color-gold-main] p-4 text-center">
                  <Typography variant="h5" className="font-bold uppercase tracking-widest text-[var(--color-bg-main)]">
                    بروتوكول القوة  
                  </Typography>
                </div>
                <List className="p-2 text-[var(--color-text-gray)]">
                  <ListItem className="hover:bg-[var(--color-bg-main)] focus:bg-[var(--color-bg-main)] gap-3">
                    <ListItemPrefix>
                      <span className="w-2 h-2 rounded-full bg-[var(--color-gold-main)] shadow-[var(--gold-glow)]"></span>
                    </ListItemPrefix>
                    التحدث الإيجابي مع النفس  
                  </ListItem>
                  <ListItem className="hover:bg-[var(--color-bg-main)] focus:bg-[var(--color-bg-main)] gap-3">
                    <ListItemPrefix>
                      <span className="w-2 h-2 rounded-full bg-[var(--color-gold-main)] shadow-[var(--gold-glow)]"></span>
                    </ListItemPrefix>
                    تمارين التنفس الإيقاعي  
                  </ListItem>
                  <ListItem className="hover:bg-[var(--color-bg-main)] focus:bg-[var(--color-bg-main)] gap-3">
                    <ListItemPrefix>
                      <span className="w-2 h-2 rounded-full bg-[var(--color-gold-main)] shadow-[var(--gold-glow)]"></span>
                    </ListItemPrefix>
                    التحليل البصري المسبق  
                  </ListItem>
                  <ListItem className="hover:bg-[var(--color-bg-main)] focus:bg-[var(--color-bg-main)] gap-3">
                    <ListItemPrefix>
                      <span className="w-2 h-2 rounded-full bg-[var(--color-gold-main)] shadow-[var(--gold-glow)]"></span>
                    </ListItemPrefix>
                    عزل المشتتات الخارجية  
                  </ListItem>
                </List>
              </CardBody>
            </Card>

            <div className="bg-gradient-to-br from-[var(--color-btn-start)] to-[var(--color-btn-end)] p-8 rounded-3xl text-[var(--color-bg-main)] shadow-[var(--gold-glow)]">
              <Typography variant="h6" className="font-black mb-2 uppercase italic border-b border-[var(--color-bg-main)]/20 pb-2">
                حقيقة علمية
              </Typography>
              <Typography className="font-bold leading-tight">
                90% من أداء النخبة في الرياضة يعتمد على الحالة الذهنية في يوم المباراة. البدني يوصلك للملعب، الذهني يوصلك للمنصة.
              </Typography>
            </div>

            <div className="p-6 border border-dashed dark:border-[var(--color-border)] border-[var(--color-gold-main)] rounded-2xl opacity-60">
              <Typography className="text-xs uppercase tracking-widest text-[var(--color-gold-main)] mb-2 font-bold">الحالة الفنية</Typography>
              <Typography className="text-sm italic dark:text-[var(--color-text-gray)] text-[var(--color-text-main)]">
                تم استدعاء المتغيرات اللونية لتطبيق الهوية البصرية "Gold & Matte".
              </Typography>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsPsychology;