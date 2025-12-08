"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useWishlist } from "@/lib/wishlistContext";

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistSidebar({ isOpen, onClose }: WishlistSidebarProps) {
  const { wishlist, removeFromWishlist } = useWishlist();

  const addToCart = () => {
    alert('Сагсанд нэмэгдлээ!');
  };

  const getImageSrc = (imgCover?: string, images?: string[]) => {
    if (imgCover && !imgCover.includes('undefined')) {
      return imgCover;
    }
    if (images && images.length > 0 && !images[0].includes('undefined')) {
      return images[0];
    }
    return "/assets/images/new-arrival/01.webp";
  };

  const totalItems = wishlist.length;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{totalItems} items in wishlist</SheetTitle>
        </SheetHeader>

        {/* Wishlist Items */}
        <div className="mt-6 overflow-y-auto h-[calc(100vh-180px)] pb-4">
          {wishlist.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Your wishlist is empty
            </div>
          ) : (
            <div className="space-y-4 pr-2">
              {wishlist.map((item, index) => (
                <div key={item._id}>
                  <div className="flex items-center gap-3 p-2">
                    <Link href={`/product-details?id=${item._id}`} className="shrink-0">
                      <Image
                        src={getImageSrc(item.imgCover, item.images)}
                        width={60}
                        height={60}
                        alt={item.title}
                        className="rounded object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <h6 className="font-light mb-1 text-sm">{item.title}</h6>
                      <p className="mb-2">
                        <strong>${item.price.toFixed(2)}</strong>
                      </p>
                      <button
                        onClick={addToCart}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="text-gray-600 hover:text-red-600 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  {index !== wishlist.length - 1 && (
                    <hr className="my-4" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-background">
          <Link
            href="/products"
            className="block w-full bg-primary text-primary-foreground text-center px-6 py-3 rounded-md hover:bg-primary/90 transition font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
