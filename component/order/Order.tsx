"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { ShoppingCart, MapPin, CheckCircle, Package, User, CreditCard, Copy } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/authContext";
import { useCart } from "@/lib/cartContext";
import { API_URL } from "@/lib/api";

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

// Банкны мэдээлэл
type BankDetails = {
  bankName: string;
  accountNumber: string;
  accountName: string;
  transactionId: string;
};

// Захиалгын хариу
type OrderResponse = {
  _id: string;
  transactionId: string;
  totalOrderPrice: number;
  createdAt: string;
};

// Захиалгын хуудас - Банкны шилжүүлгээтэй
export const OrderPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { cart: localCart, clearCart } = useCart();

  // State
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [orderedItems, setOrderedItems] = useState<typeof localCart>([]);
  
  // Form data
  const [email, setEmail] = useState(user?.email || "");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: "",
    city: "",
    phone: "",
  });
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Алдааны мессеж
  const [error, setError] = useState<string>("");

  // Хуудас дээш scroll хийх
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Хэрэв хэрэглэгч нэвтэрсэн бол хаягийг автоматаар дүүргэх
  useEffect(() => {
    if (isAuthenticated && user) {
      setEmail(user.email || "");
      if (user.addresses && user.addresses.length > 0) {
        const firstAddress = user.addresses[0];
        setShippingAddress({
          street: firstAddress.street || "",
          city: firstAddress.city || "",
          phone: firstAddress.phone || "",
        });
      }
    }
  }, [isAuthenticated, user]);

  // Input өөрчлөгдөх
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  // Захиалга үүсгэх
  const handleSubmitOrder = async () => {
    // Validation
    if (localCart.length === 0) {
      setError("Таны сагс хоосон байна");
      return;
    }

    if (!email || !shippingAddress.street || !shippingAddress.city || !shippingAddress.phone) {
      setError("Бүх шаардлагатай талбаруудыг бөглөнө үү");
      return;
    }

    // Email validation
    if (!email.includes('@') || !email.includes('.')) {
      setError("Зөв email хаяг оруулна уу");
      return;
    }

    // Phone validation (Монголын утасны дугаар: 8 оронтой)
    const phoneDigits = shippingAddress.phone.replace(/\D/g, '');
    if (phoneDigits.length < 8) {
      setError("Утасны дугаар багадаа 8 оронтой байх ёстой");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // CartItems бэлтгэх (selectedSize оруулах)
      const cartItems = localCart.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.priceAfterDiscount || item.price,
        totalProductDiscount: item.priceAfterDiscount 
          ? (item.price - item.priceAfterDiscount) * item.quantity 
          : 0,
        selectedSize: item.selectedSize || null // Сонгосон size (байвал)
      }));

      // Нийт үнэ тооцоолох
      const totalOrderPrice = localCart.reduce((sum, item) => {
        const price = item.priceAfterDiscount || item.price;
        return sum + (price * item.quantity);
      }, 0);

      // API дуудах
      const response = await fetch(`${API_URL}/orders/bank-transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          totalOrderPrice,
          shippingAddress,
          additionalNotes,
          guestInfo: !isAuthenticated ? {
            email,
            phone: shippingAddress.phone,
            name: 'Guest Customer'
          } : null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Амжилттай - Банкны мэдээлэл хадгалах
      setOrderResponse(data.order);
      setBankDetails(data.bankDetails);
      
      // Захиалсан бүтээгдэхүүнүүдийг хадгалах (clearCart() хийхээс өмнө!)
      setOrderedItems([...localCart]);
      
      setOrderSuccess(true);
      
      // Guest бол Transaction ID хадгалах (дараа нь захиалга хянахад хялбар болгох)
      if (!isAuthenticated) {
        const guestOrders = JSON.parse(localStorage.getItem("guestOrders") || "[]");
        guestOrders.push({
          transactionId: data.order.transactionId,
          date: data.order.createdAt,
          total: data.order.totalOrderPrice,
          email: email
        });
        localStorage.setItem("guestOrders", JSON.stringify(guestOrders));
      }
      
      // Сагс цэвэрлэх (бүтээгдэхүүнүүдийг аль хэдийн orderedItems-д хадгалсан)
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  // Нийт үнэ
  const getTotalPrice = () => {
    return localCart.reduce((sum, item) => {
      const price = item.priceAfterDiscount || item.price;
      return sum + (price * item.quantity);
    }, 0);
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
          <p className="text-gray-600">Захиалгын мэдээлэл ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  // Захиалга амжилттай - Банкны мэдээлэл харуулах
  if (orderSuccess && bankDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Захиалга амжилттай!</h2>
              <p className="text-gray-600">Та доорх дансруу мөнгө шилжүүлнэ үү</p>
            </div>

            {/* Банкны мэдээлэл */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-900">Банкны мэдээлэл</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Банк:</span>
                  <span className="font-bold">{bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Дансны дугаар:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono">{bankDetails.accountNumber}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(bankDetails.accountNumber)}
                      className="p-1 hover:bg-blue-200 rounded"
                      title="Хуулах"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Дансны нэр:</span>
                  <span className="font-bold">{bankDetails.accountName}</span>
                </div>
                <div className="border-t-2 border-blue-300 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Гүйлгээний дугаар:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-blue-600 font-mono">{bankDetails.transactionId}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(bankDetails.transactionId)}
                        className="p-1 hover:bg-blue-200 rounded"
                        title="Хуулах"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-red-600 mt-2 font-semibold">
                    ⚠️ Заавал гүйлгээний дугаараа гүйлгээний утганд бичнэ үү!
                  </p>
                </div>
              </div>
            </div>

            {/* Захиалсан бүтээгдэхүүнүүд */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Package size={20} />
                Захиалсан бүтээгдэхүүн ({orderedItems.length})
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {orderedItems.map((item, index) => {
                  const price = item.priceAfterDiscount || item.price;
                  return (
                    <div key={`ordered-${item._id}-${item.selectedSize || 'nosize'}-${index}`} className="flex gap-3 pb-3 border-b last:border-b-0">
                      <div className="relative w-16 h-16 shrink-0 bg-gray-100 rounded">
                        <Image
                          src={getImageSrc(item.imgCover || item.images?.[0])}
                          alt={item.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm line-clamp-2">
                          {item.title}
                        </p>
                        {item.selectedSize && (
                          <p className="text-xs text-blue-600 mb-1">
                            Size: <span className="font-semibold bg-blue-50 px-2 py-0.5 rounded">{item.selectedSize}</span>
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Тоо: {item.quantity} × ₮{price.toFixed(2)}
                        </p>
                        <p className="font-bold text-sm text-blue-600">
                          ₮{(item.quantity * price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Захиалгын дүн */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-xl font-bold">
                <span>Нийт төлөх дүн:</span>
                <span className="text-blue-600">₮{orderResponse?.totalOrderPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Заавар */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-yellow-900 mb-2">📝 Төлбөрийн заавар:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
                <li>Дээрх дансны дугаар руу мөнгө шилжүүлнэ</li>
                <li>Гүйлгээний утганд <strong>{bankDetails.transactionId}</strong> гэж заавал бичнэ</li>
                <li>Төлбөр баталгаажих хүртэл 1-2 цаг хүлээнэ</li>
                <li>Transaction ID-ээ хадгалаад авна (захиалга шалгахад хэрэгтэй)</li>
              </ol>
            </div>

            {/* Товчнууд */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push(`/order-track?txn=${bankDetails.transactionId}`)}
                className="flex-1 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
              >
                Захиалга хянах
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded font-semibold hover:bg-gray-300 transition"
              >
                Нүүр хуудас
              </button>
            </div>

            {/* Transaction ID хадгалах сануулга */}
            <p className="text-center text-xs text-gray-500 mt-4">
              Transaction ID: <span className="font-mono font-bold">{bankDetails.transactionId}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Сагс хоосон бол
  if (localCart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <ShoppingCart className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Таны сагс хоосон байна</h2>
          <p className="text-gray-600 mb-4">Эхлээд бүтээгдэхүүн нэмнэ үү</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Бүтээгдэхүүн үзэх
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Төлбөр төлөх</h1>
          <p className="text-gray-600">Захиалгын мэдээллээ бөглөнө үү</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Зүүн тал - Хүргэлтийн хаяг */}
          <div className="lg:col-span-2">
            {/* Checkout Type Selection */}
            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-900">
                    Proceeding as Guest
                  </p>
                </div>
                <p className="text-sm text-blue-700">
                  You can checkout as a guest or{" "}
                  <button
                    onClick={() => router.push("/?openProfile=true")}
                    className="underline font-semibold hover:text-blue-900"
                  >
                    login to save your information
                  </button>
                </p>
              </div>
            )}

            {/* User Info Display for Authenticated Users */}
            {isAuthenticated && user && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-900">
                    Logged in as {user.name}
                  </p>
                </div>
                <p className="text-sm text-green-700">{user.email}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-bold">Shipping Address</h2>
              </div>
              <div className="border-b border-gray-200 mb-6" />

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Нэмэлт тэмдэглэл
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Хүргэлтийн нэмэлт тэмдэглэл (сонголттой)"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
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
                <h2 className="text-xl font-bold">Захиалгын хураангуй</h2>
              </div>
              <div className="border-b border-gray-200 mb-4" />

              {/* Бүтээгдэхүүний жагсаалт */}
              {localCart.length > 0 ? (
                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {localCart.map((item, index) => {
                    const price = item.priceAfterDiscount || item.price;
                    return (
                      <div key={`cart-${item._id}-${item.selectedSize || 'nosize'}-${index}`} className="flex gap-3 pb-3 border-b last:border-b-0">
                        <div className="relative w-16 h-16 shrink-0 bg-gray-100 rounded">
                          <Image
                            src={getImageSrc(item.imgCover || item.images?.[0])}
                            alt={item.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm line-clamp-2">
                          {item.title}
                        </p>
                        {item.selectedSize && (
                          <p className="text-xs text-blue-600 mb-1">
                            Size: <span className="font-semibold bg-blue-50 px-2 py-0.5 rounded">{item.selectedSize}</span>
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Тоо: {item.quantity} × ₮{price.toFixed(2)}
                        </p>
                        <p className="font-bold text-sm">
                          ₮{(item.quantity * price).toFixed(2)}
                        </p>
                      </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 mb-4">Сагс хоосон байна</p>
              )}

              {/* Үнийн дүн */}
              <div className="space-y-2 mb-6 pt-4 border-t">
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Нийт дүн:</span>
                    <span className="text-blue-600">₮{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Захиалга батлах товч */}
              <button
                onClick={handleSubmitOrder}
                disabled={submitting || localCart.length === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Захиалга үүсгэж байна...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Захиалах - ₮{getTotalPrice().toFixed(2)}</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Банкны шилжүүлгээр төлбөр төлнө
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

