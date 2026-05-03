import React from "react";
import {
  Typography,
  Card,
  CardBody,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";

const SportsPsychology = () => {

  return (
    <div className="bg-[var(--color-bg-main)] min-h-screen p-6 lg:p-12 text-[var(--color-text-gray)] font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-16 border-r-8 border-[var(--color-border)] pr-6 py-2">
          <Typography variant="h1" className="text-5xl lg:text-7xl font-black uppercase tracking-tight dark:text-[var(--color-text-white)] text-[var(--color-text-main)] mb-4">
            العقل <span className="text-[var(--color-gold-main)] font-black">أولاً</span>
          </Typography>

          <Typography className="text-xl dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] max-w-3xl leading-relaxed">
            لماذا ينكسر أعظم اللاعبين بدنياً أمام ضغط اللحظة الحاسمة؟
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-12">
            
            <article className="max-w-none">
              <Typography variant="h2" className="mb-8 font-bold text-3xl dark:text-[var(--color-text-white)] text-[var(--color-text-main)]">
                سيكولوجية المستطيل الأخضر
              </Typography>

              <p className="dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] text-lg leading-loose mb-6">
                الإعداد النفسي هو ما يسبق المباراة الحقيقي.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                
                <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                  <Typography variant="h5" className="mb-3 text-[var(--color-gold-main)]">
                    المرونة الإدراكية
                  </Typography>
                  <Typography className="text-sm dark:text-[var(--color-text-gray)] text-[var(--color-text-main)]">
                    تغيير التفكير سريعاً أثناء الضغط.
                  </Typography>
                </div>

                <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                  <Typography variant="h5" className="mb-3 text-[var(--color-gold-main)]">
                    النفق الذهني
                  </Typography>
                  <Typography className="text-sm dark:text-[var(--color-text-gray)] text-[var(--color-text-main)]">
                    تركيز كامل بدون تشتيت.
                  </Typography>
                </div>

              </div>

              <Typography variant="h3" className="mb-4 mt-10 font-bold text-[var(--color-gold-main)]">
                المقال
              </Typography>

              <p className="dark:text-[var(--color-text-gray)] text-[var(--color-text-main)] text-lg leading-loose">
                اللاعب المحترف يفكر تحت ضغط أعلى من أي شخص آخر.
              </p>

            </article>

            <div className="relative p-8 rounded-3xl border-r-4 border-[var(--color-border)] bg-[var(--color-bg-card)]">
              <Typography variant="h4" className="italic font-light text-[var(--color-text-white)]">
                "الشخصية الذهنية هي ما يجعلك تكمل عندما يتوقف الجميع."
              </Typography>
            </div>

          </div>

          <div className="space-y-8">
            
            <Card className="bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-none rounded-2xl overflow-hidden">
              <CardBody className="p-0">

                <div className="bg-[var(--color-gold-main)] p-4 text-center">
                  <Typography variant="h5" className="font-bold uppercase tracking-widest text-black">
                    بروتوكول القوة
                  </Typography>
                </div>

                <List className="p-2">
                  {[
                    "التحدث الإيجابي مع النفس",
                    "تمارين التنفس",
                    "التحليل البصري",
                    "إزالة المشتتات",
                  ].map((item, i) => (
                    <ListItem key={i} className="gap-3 hover:bg-[var(--color-bg-main)]">
                      <ListItemPrefix>
                        <span className="w-2 h-2 rounded-full bg-[var(--color-gold-main)]"></span>
                      </ListItemPrefix>
                      {item}
                    </ListItem>
                  ))}
                </List>

              </CardBody>
            </Card>

            <div className="bg-gradient-to-br from-[var(--color-btn-start)] to-[var(--color-btn-end)] p-8 rounded-3xl text-black">
              <Typography variant="h6" className="font-black mb-2 uppercase">
                حقيقة علمية
              </Typography>
              <Typography className="font-bold">
                90% من الأداء يعتمد على العقل.
              </Typography>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default SportsPsychology;