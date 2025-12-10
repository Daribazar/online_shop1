"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { ShoppingCart, MapPin, CheckCircle, Package } from "lucide-react";
import Image from "next/image";

// Сагсны бүтээгдэхүүний төрөл
type CartItem = {
  productId: {
    _id: string;
    title: string;
    price: number;
    imgCover?: string;
  };
  quantity: number;
  price: number;
  totalProductDiscount?: number;
};

// Сагсны төрөл
type Cart = {
  _id: string;
  userId: string;
  cartItem: CartItem[];
  totalPrice: number;
  totalPriceAfterDiscount?: number;
  discount?: number;
};

// Хаягийн төрөл
type ShippingAddress = {
  street: string;
  city: string;
  phone: string;
};

// Захиалгын хуудас - Энгийн хувилбар
export const OrderPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");

  // State
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Хаягийн мэдээлэл
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: "",
    city: "",
    phone: "",
  });

  // Алдааны мессеж
  const [error, setError] = useState<string>("");

  // Сагсны мэдээлэл татах
  useEffect(() => {
    if (!cartId) {
      setError("Cart ID not found");
      setLoading(false);
      return;
    }

    fetchCartDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartId]);

  // Сагсны дэлгэрэнгүй мэдээлэл авах (жишээ - бодит backend-тэй холбох хэрэгтэй)
  const fetchCartDetails = async () => {
    try {
      // Жишээ өгөгдөл - Бодит байдалд API дуудах
      // const response = await fetch(`${API_URL}/carts/${cartId}`);
      // const data = await response.json();
      
      // Demo өгөгдөл:
      const demoCart = {
        _id: cartId || "demo-cart-123",
        userId: "demo-user",
        cartItem: [
          {
            productId: {
              _id: "1",
              title: "Sample Product 1",
              price: 99.99,
              imgCover: "/assets/images/featured-products/01.webp"
            },
            quantity: 2,
            price: 99.99,
            totalProductDiscount: 10
          },
          {
            productId: {
              _id: "2",
              title: "Sample Product 2",
              price: 149.99,
              imgCover: "/assets/images/featured-products/02.webp"
            },
            quantity: 1,
            price: 149.99,
            totalProductDiscount: 0
          }
        ],
        totalPrice: 349.97,
        discount: 10,
        totalPriceAfterDiscount: 339.97
      };
      
      setCart(demoCart);
      setLoading(false);
    } catch (err) {
      setError("Failed to load cart details");
      setLoading(false);
    }
  };

  // Input өөрчлөгдөх
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  // Захиалга үүсгэх
  const handleSubmitOrder = async () => {
    if (!cartId) return;

    // Хаягийн validation
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.phone) {
      setError("Please fill in all shipping address fields");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Жишээ - Бодит API дуудах хэрэгтэй
      console.log("Creating order with:", {
        cartId,
        shippingAddress,
      });

      // Demo - 2 секунд хүлээх
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Амжилттай
      setOrderSuccess(true);
      
      // 3 секундын дараа нүүр хуудас руу
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  // Нийт үнэ
  const getTotalPrice = () => {
    if (!cart) return 0;
    return cart.totalPriceAfterDiscount || cart.totalPrice;
  };

  // Зургийн эх сурвалж
  const getImageSrc = (imgCover?: string) => {
    return imgCover || "/assets/images/featured-products/01.webp";
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Захиалга амжилттай
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Successful!</h2>
          <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  // Алдаа
  if (error && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Гарчиг */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Зүүн тал - Хүргэлтийн хаяг */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-bold">Shipping Address</h2>
              </div>
              <div className="border-b border-gray-200 mb-6" />

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    placeholder="Enter your street address"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    placeholder="Enter your city"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Алдааны мессеж */}
              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Баруун тал - Захиалгын дэлгэрэнгүй */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-bold">Order Summary</h2>
              </div>
              <div className="border-b border-gray-200 mb-4" />

              {/* Бүтээгдэхүүний жагсаалт */}
              {cart && cart.cartItem && cart.cartItem.length > 0 ? (
                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {cart.cartItem.map((item, index) => (
                    <div key={index} className="flex gap-3 pb-3 border-b last:border-b-0">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
                        <Image
                          src={getImageSrc(item.productId?.imgCover)}
                          alt={item.productId?.title || "Product"}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm line-clamp-2">
                          {item.productId?.title || "Product"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ${item.price}
                        </p>
                        <p className="font-bold text-sm">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-4">No items in cart</p>
              )}

              {/* Үнийн дүн */}
              <div className="space-y-2 mb-6 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${cart?.totalPrice.toFixed(2)}</span>
                </div>
                {cart?.discount && cart.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span>-${cart.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Захиалга батлах товч */}
              <button
                onClick={handleSubmitOrder}
                disabled={submitting || !cart}
                className="w-full bg-gray-900 text-white py-3 rounded font-semibold hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    <span>Place Order - ${getTotalPrice().toFixed(2)}</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing your order, you agree to our terms
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

