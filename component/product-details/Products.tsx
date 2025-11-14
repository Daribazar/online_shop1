"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBasket } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const productImages = [
  "/assets/images/product-images/01.jpg",
  "/assets/images/product-images/02.jpg",
  "/assets/images/product-images/03.jpg",
  "/assets/images/product-images/04.jpg",
  "/assets/images/product-images/05.jpg",
  "/assets/images/product-images/06.jpg",
  "/assets/images/product-images/07.jpg",
  "/assets/images/product-images/08.jpg",
];

const moreColors = [
  "/assets/images/featured-products/01.webp",
  "/assets/images/featured-products/02.webp",
  "/assets/images/featured-products/03.webp",
  "/assets/images/featured-products/04.webp",
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function Products() {
  const [selectedSize, setSelectedSize] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const slides = productImages.map((img) => ({ src: img }));

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Product Images */}
          <div className="xl:col-span-7">
            <div className="grid grid-cols-2 gap-4">
              {productImages.map((img, index) => (
                <div 
                  key={index} 
                  className="overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition"
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <Image
                    src={img}
                    width={400}
                    height={400}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>

            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              slides={slides}
              index={lightboxIndex}
              carousel={{ finite: false }}
              controller={{ closeOnBackdropClick: true }}
            />
          </div>

          {/* Product Info */}
          <div className="xl:col-span-5">
            <h4 className="text-2xl font-bold mb-2">Check Pink Kurta</h4>
            <p className="text-gray-600 mb-4">Women Pink &amp; Off-White Printed Kurta with Palazzos</p>

            <hr className="my-4" />

            {/* Price */}
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl font-bold">$458</span>
              <span className="text-xl text-gray-400 line-through">$2089</span>
              <span className="text-2xl font-bold text-red-600">(70% off)</span>
            </div>
            <p className="text-green-600 font-semibold mb-4">inclusive of all taxes</p>

            {/* More Colors */}
            <div className="mt-6">
              <h6 className="font-bold mb-3">More Colors</h6>
              <div className="flex gap-3">
                {moreColors.map((color, index) => (
                  <div key={index} className="cursor-pointer hover:opacity-75 transition">
                    <Image
                      src={color}
                      width={65}
                      height={65}
                      alt={`Color option ${index + 1}`}
                      className="rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Size Chart */}
            <div className="mt-6">
              <h6 className="font-bold mb-3">Select Size</h6>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 border rounded ${
                      selectedSize === size
                        ? "bg-gray-900 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Cart Buttons */}
            <div className="mt-6 flex flex-col lg:flex-row gap-3">
              <button className="flex-1 bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-800 transition flex items-center justify-center gap-2">
                <ShoppingBasket size={20} />
                Add to Bag
              </button>
              <button className="flex-1 border-2 border-gray-900 px-6 py-3 rounded hover:bg-gray-100 transition flex items-center justify-center gap-2">
                <Heart size={20} />
                Wishlist
              </button>
            </div>

            <hr className="my-6" />

            {/* Product Details */}
            <div>
              <h6 className="font-bold mb-3">Product Details</h6>
              <ul className="space-y-2 text-gray-600">
                <li>There are many variations of passages of Lorem Ipsum</li>
                <li>All the Lorem Ipsum generators on the Internet tend to repeat</li>
                <li>Contrary to popular belief, Lorem Ipsum is not simply random text</li>
                <li>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below</li>
              </ul>
            </div>

            <hr className="my-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
