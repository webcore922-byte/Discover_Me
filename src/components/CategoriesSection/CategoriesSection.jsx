import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { useStore } from '../../contexts/StoreContext/StoreContext';

const CategoryCard = ({ title, image }) => (
  <div className="relative h-52 w-full rounded-2xl overflow-hidden cursor-pointer border border-[var(--color-border)] hover:border-[var(--color-gold-main)] transition-all group">
    <img
      src={image}
      alt={title}
      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"/>
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
    <div className="absolute bottom-4 left-0 w-full px-4">
      <span className="text-white font-bold text-lg block">{title}</span>
      <div className="w-12 h-0.5 bg-[var(--color-gold-main)] mt-1"></div>
    </div>
  </div>
);
const categories = [
  { title: "أطقم الأندية", image: "/اطقم الاندية.jpg" },
  { title: "أحذية كرة القدم", image: "/chosefoot.webp" },
  { title: "كرات القدم", image: "/كرة القدم.avif" },
  { title: "معدات التدريب", image: "/معدات التدريب.jpg" },
  { title: "أطقم المنتخبات", image: "/اطقم المنتخب.webp" },
  { title: "إكسسوارات", image: "/اكسسوارات.jpg" },
];

const CategoriesSection = () => {
    const {setSelectcategory}=useStore();
  return (
    <div>
        <section className="px-12 py-6 relative">
          <h2 className="text-2xl font-bold mb-6">الأقسام</h2>

          <div className="swiper-button-prev !text-[var(--color-gold-main)] !w-8 !h-8 !scale-75"></div>
          <div className="swiper-button-next !text-[var(--color-gold-main)] !w-8 !h-8 !scale-75"></div>

          <Swiper
            modules={[Autoplay, Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            spaceBetween={15}
            loop={true}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            // التعديل هنا:
            breakpoints={{
              300: {slidesPerView: 1},
              350: {slidesPerView: 2 },
              640: {slidesPerView: 3},
              1024: {slidesPerView: 5},}}>
            {categories.map(({ title,image}) => (
              <SwiperSlide key={title} className="py-4">
                <div className="h-48 w-full flex items-center justify-center">
                  <Link
                    to="/products"
                    onClick={() => setSelectcategory(title)} >
                    <CategoryCard title={title} image={image} />
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
    </div>
  )
}

export default CategoriesSection