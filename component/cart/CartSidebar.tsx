"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const cartItems = [
  { id: 1, name: "Product Name", price: 59, quantity: 1, image: "/assets/images/new-arrival/01.webp" },
  { id: 2, name: "Product Name", price: 59, quantity: 1, image: "/assets/images/new-arrival/02.webp" },
  { id: 3, name: "Product Name", price: 59, quantity: 1, image: "/assets/images/new-arrival/03.webp" },
  { id: 4, name: "Product Name", price: 59, quantity: 1, image: "/assets/images/new-arrival/04.webp" },
  { id: 5, name: "Product Name", price: 59, quantity: 1, image: "/assets/images/new-arrival/05.webp" },
  { id: 6, name: "Product Name", price: 59, quantity: 1, image: "/assets/images/new-arrival/06.webp" },
  { id: 7, name: "Product Name", price: 59, quantity: 1, image: "/assets/images/new-arrival/07.webp" },
  { id: 8, name: "Product Name", price: 59, quantity: 1, image: "/assets/images/new-arrival/08.webp" },
];

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [items, setItems] = useState(cartItems);

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{totalItems} items in the cart</SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="mt-6 overflow-y-auto h-[calc(100vh-220px)] pb-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4 pr-2">
              {items.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center gap-3 p-2">
                    <Link href="/product-details" className="shrink-0">
                      <Image
                        src={item.image}
                        width={60}
                        height={60}
                        alt={item.name}
                        className="rounded"
                      />
                    </Link>
                    <div className="flex-1">
                      <h6 className="font-light mb-1">{item.name}</h6>
                      <p className="mb-0">
                        <strong>{item.quantity} X ${item.price.toFixed(2)}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-600 hover:text-red-600 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  {item.id !== items[items.length - 1].id && (
                    <hr className="my-4" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-background">
          <div className="mb-3 flex justify-between items-center">
            <span className="font-bold">Total:</span>
            <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-primary text-primary-foreground text-center px-6 py-3 rounded-md hover:bg-primary/90 transition font-semibold"
          >
            Checkout
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
