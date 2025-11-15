"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";

const products = [
  { id: 1, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/featured-products/01.webp" },
  { id: 2, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/featured-products/02.webp" },
  { id: 3, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/featured-products/03.webp" },
  { id: 4, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/featured-products/04.webp" },
  { id: 5, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/featured-products/05.webp" },
  { id: 6, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/featured-products/06.webp" },
  { id: 7, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/featured-products/07.webp" },
  { id: 8, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/featured-products/08.webp" },
  { id: 9, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/new-arrival/01.webp" },
  { id: 10, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/new-arrival/02.webp" },
  { id: 11, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/new-arrival/05.webp" },
  { id: 12, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/new-arrival/04.webp" },
  { id: 13, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/new-arrival/06.webp" },
  { id: 14, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/new-arrival/07.webp" },
  { id: 15, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/new-arrival/08.webp" },
  { id: 16, name: "Syndrona", desc: "Color Printed Kurta", price: 458, oldPrice: 2089, discount: 70, image: "/assets/images/best-sellar/01.webp" },
];

export const Products = () => {
  return (
    <section className="py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h5 className="text-xl font-bold mb-4">Filters</h5>
              
              {/* Categories */}
              <div className="mb-6">
                <h6 className="bg-gray-100 p-2 font-bold mb-2">Categories</h6>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {["Shirts (1548)", "Jeans (568)", "Kurtas (784)", "Makeup (1789)", "Shoes (358)", "Heels (572)", "Lehenga (754)", "Laptops (541)", "Jewellary (365)", "Sports (4512)", "Music (647)", "Headphones (9848)", "Sunglasses (751)", "Belts (4923)"].map((cat, i) => (
                    <label key={i} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md">
              {/* Header */}
              <div className="bg-gray-100 p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="font-semibold">657 Items Found</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sort By</span>
                  <select className="border rounded px-3 py-1">
                    <option>What&apos;s New</option>
                    <option>Popularity</option>
                    <option>Better Discount</option>
                    <option>Price: High to Low</option>
                    <option>Price: Low to High</option>
                    <option>Customer Rating</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg overflow-hidden group">
                      <div className="relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 bg-white/90 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <button className="p-2 hover:bg-gray-100 rounded-full transition">
                            <ShoppingBasket size={18} />
                          </button>
                        </div>
                        <Link href="/product-details">
                          <Image
                            src={product.image}
                            width={300}
                            height={300}
                            alt={product.name}
                            className="w-full h-auto object-cover"
                          />
                        </Link>
                      </div>
                      <div className="p-3 border-t">
                        <h5 className="font-bold text-sm mb-1">{product.name}</h5>
                        <p className="text-xs text-gray-600 mb-2">{product.desc}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold">${product.price}</span>
                          <span className="text-gray-400 line-through text-sm">${product.oldPrice}</span>
                          <span className="text-red-600 font-bold text-sm">({product.discount}% off)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
