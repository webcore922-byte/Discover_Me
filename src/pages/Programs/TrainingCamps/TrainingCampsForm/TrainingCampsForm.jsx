import { useState, useEffect } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineAcademicCap,
} from "react-icons/hi";
import Swal from "sweetalert2";

const TrainingCampsForm = () => {
  const [camps, setCamps] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    selectedCamp: "",
  });

  const fetchCamps = async () => {
    const baseUrl = import.meta.env.VITE_URL;
    try {
      const response = await fetch(`${baseUrl}/training_camps`);
      if (response.ok) {
        const data = await response.json();
        setCamps(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = import.meta.env.VITE_URL;

    try {
      const response = await fetch(`${baseUrl}/camp_registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          title: "تم التسجيل بنجاح!",
          text: "تم حفظ بياناتك، سنتواصل معك قريباً.",
          icon: "success",
          confirmButtonColor: "#c5a059",
          background: "#242829",
          color: "#fff",
        });
        setFormData({ fullName: "", email: "", phone: "", selectedCamp: "" });
      }
    } catch (error) {
      Swal.fire({
        title: "خطأ!",
        text: "تعذر الاتصال بالسيرفر.",
        icon: "error",
        confirmButtonColor: "#c5a059",
        background: "#242829",
        color: "#fff",
      });
    }
  };

  return (
    <section className="min-h-screen bg-[#1a1d1e] py-12 px-4 bg-cover bg-fixed bg-center">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <Typography
            variant="h1"
            className="text-white text-4xl font-bold mb-4"
          >
            التسجيل في معسكرات التدريب
          </Typography>
          <Typography className="text-[#b0b0b0] max-w-lg mx-auto">
            سجل بياناتك الآن للانضمام إلى أقوى المعسكرات التدريبية تحت إشراف
            نخبة من المدربين
          </Typography>
        </div>

        <Card className="bg-[#242829]/90 border border-[#a68946]/30 p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-center gap-3 mb-8 border-b border-[#a68946]/20 pb-4">
            <HiOutlineAcademicCap className="text-[#d4af37] text-2xl" />
            <Typography variant="h4" className="text-[#d4af37] font-bold">
              بيانات التسجيل
            </Typography>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-white text-sm flex items-center justify-between">
                الاسم الكامل <HiOutlineUser className="text-[#d4af37]" />
              </label>
              <Input
                size="lg"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="اكتب اسمك الكامل"
                className="!border-[#a68946]/30 focus:!border-[#d4af37] text-white"
                labelProps={{ className: "hidden" }}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm flex items-center justify-between">
                البريد الإلكتروني <HiOutlineMail className="text-[#d4af37]" />
              </label>
              <Input
                size="lg"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="اكتب بريدك الإلكتروني"
                className="!border-[#a68946]/30 focus:!border-[#d4af37] text-white"
                labelProps={{ className: "hidden" }}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm flex items-center justify-between">
                رقم التواصل <HiOutlinePhone className="text-[#d4af37]" />
              </label>
              <Input
                size="lg"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="اكتب رقم التواصل"
                className="!border-[#a68946]/30 focus:!border-[#d4af37] text-white"
                labelProps={{ className: "hidden" }}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm flex items-center justify-between">
                اختر معسكر التدريب{" "}
                <HiOutlineAcademicCap className="text-[#d4af37]" />
              </label>
              <select
                name="selectedCamp"
                value={formData.selectedCamp}
                onChange={handleChange}
                className="w-full bg-transparent border border-[#a68946]/30 rounded-md p-3 text-white focus:border-[#d4af37] outline-none"
                required
              >
                <option value="" className="bg-[#242829]">
                  اضغط هنا لاختيار المعسكر
                </option>
                {camps.map((camp) => (
                  <option
                    key={camp.id}
                    value={camp.title}
                    className="bg-[#242829]"
                  >
                    {camp.title}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              fullWidth
              className="bg-[#c5a059] hover:bg-[#8e7037] text-[#1a1d1e] font-bold text-lg py-4 flex items-center justify-center gap-3 transition-all hover:-translate-y-1 shadow-gold"
            >
              إتمام التسجيل ⚽
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default TrainingCampsForm;
