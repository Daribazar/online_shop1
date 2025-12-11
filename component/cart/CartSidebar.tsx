"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cartContext";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  const getImageSrc = (imgCover?: string, images?: string[]) => {
    if (imgCover && !imgCover.includes('undefined')) {
      return imgCover;
    }
    if (images && images.length > 0 && !images[0].includes('undefined')) {
      return images[0];
    }
    return "/assets/images/new-arrival/01.webp";
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">
            Сагс ({totalItems} бараа)
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto mt-6 pb-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">Таны сагс хоосон байна</p>
              <p className="text-sm">Бүтээгдэхүүн нэмэж эхлээрэй!</p>
            </div>
          ) : (
            <div className="space-y-4 pr-2">
              {cart.map((item, index) => {
                const itemPrice = item.priceAfterDiscount || item.price;
                const cartKey = item.selectedSize ? `${item._id}-${item.selectedSize}` : item._id;
                return (
                  <div key={cartKey}>
                    <div className="flex items-start gap-3 p-2">
                      <Link href={`/product-details?id=${item._id}`} className="shrink-0">
                        <Image
                          src={getImageSrc(item.imgCover, item.images)}
                          width={80}
                          height={80}
                          alt={item.title}
                          className="rounded object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product-details?id=${item._id}`}>
                          <h6 className="font-medium mb-1 text-sm line-clamp-2 hover:text-blue-600 transition">
                            {item.title}
                          </h6>
                        </Link>
                        {/* Size харуулах */}
                        {item.selectedSize && (
                          <p className="text-xs text-gray-600 mb-1">
                            Size: <span className="font-semibold bg-gray-100 px-2 py-0.5 rounded">{item.selectedSize}</span>
                          </p>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          {item.priceAfterDiscount ? (
                            <>
                              <strong className="text-red-600">${item.priceAfterDiscount.toFixed(2)}</strong>
                              <span className="text-gray-400 line-through text-sm">${item.price.toFixed(2)}</span>
                            </>
                          ) : (
                            <strong>${item.price.toFixed(2)}</strong>
                          )}
                        </div>
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1, item.selectedSize)}
                            className="p-1 rounded border hover:bg-gray-100 transition"
                            aria-label="Багасгах"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1, item.selectedSize)}
                            className="p-1 rounded border hover:bg-gray-100 transition"
                            aria-label="Нэмэх"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Нийт: <strong>${(itemPrice * item.quantity).toFixed(2)}</strong>
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id, item.selectedSize)}
                        className="text-gray-400 hover:text-red-600 transition shrink-0"
                        aria-label="Устгах"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {index !== cart.length - 1 && (
                      <hr className="my-3" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {cart.length > 0 && (
          <div className="border-t pt-4 pb-6 mt-auto">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-lg font-semibold">Нийт дүн:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="space-y-2">
              <Link
                href="/order"
                onClick={onClose}
                className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Захиалах
              </Link>
              <Link
                href="/products"
                onClick={onClose}
                className="block w-full bg-gray-100 text-gray-800 text-center px-6 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Үргэлжлүүлэх
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
