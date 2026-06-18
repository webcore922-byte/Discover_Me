import { Link } from "react-router-dom";
import { useStore } from '../../contexts/StoreContext/StoreContext';
import { Card,CardHeader,CardBody,CardFooter,Typography,Button} from "@material-tailwind/react";
const ProductCard = ({product}) => {
    const {addToCart,addedProductId}=useStore()
    const { name, image, price, id, category, discount } = product;
  return (
   <Card className="w-full max-w-[300px] bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-none text-white">
                  <CardHeader className="relative h-36 m-0 shadow-none rounded-none bg-transparent">
                    <img
                      src={image}
                      className="h-full w-full object-cover"
                      alt={name}
                    />
                  </CardHeader>
                  <CardBody className="p-4 z-20 pointer-events-auto">
                    <Typography
                      variant="h5"
                      className="mb-2 text-[var(--color-text-white)]"
                    >
                      {name}
                    </Typography>
                    <div className="flex items-center gap-2 mb-2">
                      <Typography className="font-bold text-[var(--color-gold-main)] text-xl">
                        {price - (discount || 0)} EGP
                      </Typography>
                      {discount > 0 && (
                        <>
                          <Typography className="text-gray-500 line-through text-sm">
                            {price} $
                          </Typography>
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            -{((discount / price) * 100).toFixed(0)}%
                          </span>
                        </>
                      )}
                    </div>

                    <Typography className="text-[var(--color-text-gray)] mt-2 italic">
                      {category}
                    </Typography>
                  </CardBody>
                  <CardFooter className="pt-0 flex gap-2 z-20">
                    <Link to={`/productDetails/${id}`} className="flex-1">
                      <Button
                        fullWidth
                        className="bg-transparent border border-[var(--color-gold-main)] text-[var(--color-gold-main)] hover:bg-gradient-to-r from-[var(--color-btn-start)] to-[var(--color-btn-end)] hover:text-black transition-all"
                      >
                        تفاصيل
                      </Button>
                    </Link>

                    <Button
                      onClick={() => addToCart(product)}
                      disabled={addedProductId === id}
                      className={`flex-1 transition-all duration-500 font-bold 
    ${
      addedProductId === id
        ? "bg-[var(--color-gold-main)]/20 border-2 border-[var(--color-gold-main)]/50 text-[var(--color-gold-main)] cursor-default"
        : "bg-gradient-to-r from-[var(--color-btn-start)] to-[var(--color-btn-end)] text-black"
    }`}>
                      {addedProductId === id ? "تمت الإضافة ✓" : "إضافة للسلة"}
                    </Button>
                  </CardFooter>
                </Card>
  )
}

export default ProductCard