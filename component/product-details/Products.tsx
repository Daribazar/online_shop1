"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlistContext";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { fetchProductById } from "@/lib/api";

// Category төрөл
type Category = {
  _id: string;
  name: string;
};

// Brand төрөл
type Brand = {
  _id: string;
  name: string;
};

// Size мэдээлэл
type SizeInfo = {
  size: string;
  quantity: number;
  description: string;
};

// Бүтээгдэхүүний төрөл
type Product = {
  _id: string;
  title: string;
  descripton: string;
  price: number;
  priceAfterDiscount?: number;
  quantity?: number;
  sizes?: SizeInfo[];
  imgCover?: string;
  images?: string[];
  category?: Category | string;
  subcategory?: Category | string;
  brand?: Brand | string;
};

type ProductsProps = {
  onCategoryLoad?: (categoryId: string) => void;
};

// Бүтээгдэхүүний дэлгэрэнгүй хуудас - Зураг, мэдээлэл, wishlist
export default function Products({ onCategoryLoad }: ProductsProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<SizeInfo | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await fetchProductById(productId);
        setProduct(data);
        
        // Category ID-г parent компонент руу дамжуулах
        if (data?.category) {
          const catId = typeof data.category === 'string' ? data.category : data.category._id;
          onCategoryLoad?.(catId);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [onCategoryLoad, productId]);

  if (loading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">Loading product...</div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">Product not found</div>
        </div>
      </section>
    );
  }

  const productImages = [
    ...(product.imgCover && !product.imgCover.includes('undefined') ? [product.imgCover] : []),
    ...(product.images?.filter(img => !img.includes('undefined')) || []),
  ].slice(0, 8);

  const slides = productImages.map((img) => ({ src: img }));
  
  // Хямдралын хувийг тооцоолох
  const calculateDiscount = () => {
    if (!product.priceAfterDiscount) return 0;
    return Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100);
  };
  
  const discount = calculateDiscount();

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
                  className="relative w-full h-80 md:h-96 overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition"
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <Image
                    src={img}
                    fill
                    alt={`Product image ${index + 1}`}
                    className="object-cover"
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
            <h4 className="text-2xl font-bold mb-2">{product.title}</h4>
            <p className="text-gray-600 mb-4">{product.descripton}</p>

            <hr className="my-4" />

            {/* Price */}
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl font-bold">
                ${product.priceAfterDiscount || product.price}
              </span>
              {product.priceAfterDiscount && (
                <>
                  <span className="text-xl text-gray-400 line-through">${product.price}</span>
                  <span className="text-2xl font-bold text-red-600">({discount}% off)</span>
                </>
              )}
            </div>
            <p className="text-green-600 font-semibold mb-4">inclusive of all taxes</p>
            
            {/* Нийт тоо ширхэг (sizes байхгүй бол) */}
            {!product.sizes && product.quantity !== undefined && (
              <p className="text-gray-600 mb-4">
                {product.quantity > 0 ? `In Stock: ${product.quantity} items` : 'Out of Stock'}
              </p>
            )}

            {/* Size Chart */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <h6 className="font-bold mb-3">Select Size</h6>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((sizeInfo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(sizeInfo)}
                      disabled={sizeInfo.quantity === 0}
                      className={`px-6 py-3 border rounded transition-all ${
                        selectedSize?.size === sizeInfo.size
                          ? "bg-gray-900 text-white border-gray-900"
                          : sizeInfo.quantity === 0
                          ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                          : "bg-white hover:bg-gray-100 border-gray-300"
                      }`}
                      title={sizeInfo.description || `${sizeInfo.quantity} available`}
                    >
                      <div className="text-center">
                        <div className="font-bold text-lg">{sizeInfo.size}</div>
                        <div className="text-xs mt-1">
                          {sizeInfo.quantity > 0 ? `${sizeInfo.quantity} ширхэг` : 'Дууссан'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Сонгогдсон size-ын тайлбар */}
                {selectedSize && selectedSize.description && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Size {selectedSize.size}:</span> {selectedSize.description}
                    </p>
                  </div>
                )}
                
                {/* Сонгогдсон size дээр тоо ширхэг мэдээлэл */}
                {selectedSize && (
                  <div className="mt-3">
                    <p className="text-gray-600">
                      <span className="font-semibold">Available:</span>{' '}
                      <span className={selectedSize.quantity > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {selectedSize.quantity > 0 ? `${selectedSize.quantity} items in stock` : 'Out of stock'}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Button */}
            <div className="mt-6">
              <button 
                onClick={() => {
                  if (!product) return;
                  if (isInWishlist(product._id)) {
                    removeFromWishlist(product._id);
                  } else {
                    addToWishlist(product);
                  }
                }}
                className={`w-full px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 font-semibold ${
                  product && isInWishlist(product._id)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                <Heart 
                  size={20} 
                  className={product && isInWishlist(product._id) ? 'fill-white' : ''} 
                />
                {product && isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            <hr className="my-6" />

            {/* Product Details */}
            <div>
              <h6 className="font-bold mb-3">Product Details</h6>
              <div className="space-y-2 text-gray-600">
                <p>{product.descripton}</p>
                {product.category && (
                  <p>
                    <span className="font-semibold">Category:</span>{' '}
                    <span className="font-bold text-gray-900">
                      {typeof product.category === 'string' ? product.category : product.category.name}
                    </span>
                  </p>
                )}
                {product.brand && (
                  <p>
                    <span className="font-semibold">Brand:</span>{' '}
                    <span className="font-bold text-gray-900">
                      {typeof product.brand === 'string' ? product.brand : product.brand.name}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <hr className="my-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
