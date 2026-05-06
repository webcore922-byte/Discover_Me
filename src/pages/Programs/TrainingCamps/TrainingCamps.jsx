import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineClipboardCheck,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import { GiGloves } from "react-icons/gi";

const TrainingCamps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCamps = async () => {
    setLoading(true);
    setError(false);
    const baseUrl = import.meta.env.VITE_URL;
    try {
      const response = await fetch(`${baseUrl}/training_camps`);
      if (response.ok) {
        const data = await response.json();
        setCamps(data);
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "strategy":
        return <HiOutlineClipboardCheck className="text-[#d4af37] text-xl" />;
      case "shield":
        return <HiOutlineShieldCheck className="text-[#d4af37] text-xl" />;
      case "gloves":
        return <GiGloves className="text-[#d4af37] text-xl" />;
      default:
        return <HiOutlineClipboardCheck className="text-[#d4af37] text-xl" />;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[var(--color-bg-main)] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-t-2 border-[var(--color-gold-main)] rounded-full animate-spin mb-6 shadow-[var(--gold-glow)]"></div>
        <p className="text-gradient-gold font-black text-xl tracking-[0.2em] animate-pulse italic uppercase">
          جاري التحميل ....
        </p>
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1d1e] text-center px-4">
        <span className="text-8xl mb-6">⚠️</span>
        <Typography variant="h4" className="text-white font-bold mb-2">
          نواجه مشكلة في تحميل البيانات
        </Typography>
        <Typography className="text-[#b0b0b0]">حاول مرة أخرى لاحقاً</Typography>
        <Button
          onClick={fetchCamps}
          className="mt-6 bg-[#d4af37] text-[#1a1d1e]"
        >
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <section
      className="min-h-screen bg-[#1a1d1e] py-16 px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('bg_prizes_and_competitions.jpeg')` }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-[#d4af37]"></div>
            <Typography variant="h2" className="text-white font-bold text-4xl">
              المعسكرات التدريبية
            </Typography>
            <div className="h-[1px] w-8 bg-[#d4af37]"></div>
          </div>
          <Typography className="text-[#b0b0b0]">
            نقدم معسكرات تدريبية مكثفة لتطوير مهاراتك
          </Typography>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 mb-16">
          {camps.map((camp) => (
            <Card
              key={camp.id}
              className="bg-[#242829] border border-[#a68946]/20 overflow-hidden shadow-2xl group"
            >
              <CardHeader
                floated={false}
                shadow={false}
                className="m-0 rounded-none relative h-56 overflow-hidden"
              >
                <img
                  src={camp.camp_image}
                  alt={camp.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-[#1a1d1e]/80 p-2 rounded-lg border border-[#d4af37]/30 z-10">
                  {getIcon(camp.icon_type)}
                </div>
              </CardHeader>

              <CardBody className="p-6">
                <Typography
                  variant="h4"
                  className="text-[#d4af37] text-center font-bold mb-1"
                >
                  {camp.title}
                </Typography>
                <Typography className="text-white text-center text-sm mb-6 font-medium">
                  {camp.subtitle}
                </Typography>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full border border-[#d4af37] flex items-center justify-center shrink-0 mt-1">
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full"></div>
                    </div>
                    <Typography className="text-[#b0b0b0] text-sm leading-relaxed">
                      <span className="text-[#d4af37] font-bold">
                        يركز على:{" "}
                      </span>{" "}
                      {camp.focus}
                    </Typography>
                  </div>

                  <div className="flex items-center gap-3">
                    <HiOutlineLocationMarker className="text-[#d4af37] text-xl shrink-0" />
                    <Typography className="text-[#b0b0b0] text-sm">
                      <span className="text-[#d4af37] font-bold">المكان: </span>{" "}
                      {camp.location}
                    </Typography>
                  </div>

                  <div className="flex items-center gap-3 pb-6 border-b border-[#a68946]/10">
                    <HiOutlineClock className="text-[#d4af37] text-xl shrink-0" />
                    <Typography className="text-[#b0b0b0] text-sm">
                      <span className="text-[#d4af37] font-bold">
                        المواعيد:{" "}
                      </span>{" "}
                      {camp.schedule}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <div className="flex flex-col items-end">
                      <span className="text-[#d4af37] text-[10px] font-bold">
                        المدرب
                      </span>
                      <span className="text-white text-sm font-bold">
                        {camp.coach_name}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Link to="/training-camps/form">
            <Button className="bg-[#c5a059] hover:bg-[#8e7037] text-[#1a1d1e] font-bold px-12 py-4 rounded-full text-lg flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5 shadow-gold">
              تسجيل الآن <span className="text-xl">⚽</span>
            </Button>
          </Link>
          <Typography className="text-[#b0b0b0] text-sm">
            اختر المعسكر المناسب وابدأ رحلتك نحو الاحتراف
          </Typography>
        </div>
      </div>
    </section>
  );
};

export default TrainingCamps;
