import Slider from "@/component/home/Slider";
import Padding from "@/component/home/Padding";
import Category from "@/component/home/Category";
import LatestProducts from "@/component/home/LatestProducts";
import Maps from "@/component/home/Maps";

export default function Home() {
  return (
    <div>
      <Slider />
      <Padding />
      <LatestProducts />
      <Category />
      <Maps />
    </div>
  );
}
