import Image from "next/image";
import Link from "next/link";

// Ижил төстэй бүтээгдэхүүнүүд (одоогоор static өгөгдөл)
const similarProducts = [
  { id: 1, name: "Syndrona", description: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/best-sellar/03.webp" },
  { id: 2, name: "Syndrona", description: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/new-arrival/02.webp" },
  { id: 3, name: "Syndrona", description: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/best-sellar/02.webp" },
  { id: 4, name: "Syndrona", description: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/new-arrival/04.webp" },
  { id: 5, name: "Syndrona", description: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/new-arrival/05.webp" },
  { id: 6, name: "Syndrona", description: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/trending-product/03.webp" },
  { id: 7, name: "Syndrona", description: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/featured-products/05.webp" },
  { id: 8, name: "Syndrona", description: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/trending-product/05.webp" },
  { id: 9, name: "Syndrona", description: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/trending-product/01.webp" },
];

// Ижил төстэй бүтээгдэхүүнүүд харуулах компонент
export default function Similar() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Хэсгийн гарчиг */}
        <div className="flex items-center gap-4 pb-8">
          <div className="flex-1 h-px bg-gray-300" />
          <h3 className="text-3xl font-bold">Similar Products</h3>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Бүтээгдэхүүний grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {similarProducts.map((product) => (
            <Link key={product.id} href="/product-details">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <Image
                  src={product.image}
                  width={300}
                  height={300}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
                <div className="p-4 border-t">
                  <h5 className="font-bold mb-1">{product.name}</h5>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold">${product.price}</span>
                    <span className="text-sm text-gray-400 line-through">${product.oldPrice}</span>
                    <span className="text-sm font-bold text-red-600">({product.discount}% off)</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
