"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Package, Search, ArrowLeft, Home } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Order төрөл
type Order = {
  _id: string;
  transactionId: string;
  totalOrderPrice: number;
  shippingAddress: {
    street: string;
    city: string;
    phone: string;
  };
  guestInfo?: {
    email: string;
    phone: string;
    name: string;
  };
  additionalNotes?: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  createdAt: string;
  cartItems: Array<{
    productId: {
      _id: string;
      title: string;
      imgCover?: string;
    };
    quantity: number;
    price: number;
    selectedSize?: string;
  }>;
};

export function VerifyPaymentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"search" | "pending" | "history">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Order[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin эрх шалгах болон захиалгууд татах
  useEffect(() => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    setIsAdmin(!!token);
    if (token) {
      loadOrders();
    }
  }, []);

  // Бүх захиалгууд татах
  const loadOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const response = await fetch(`${API_URL}/orders/all`, {
        headers: { token: token || "" }
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Хайлтын утга оруулна уу");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setSearchResults([]);

    try {
      // Бүх захиалгуудаас хайх
      const query = searchQuery.toLowerCase().trim();
      const filtered = orders.filter(order => {
        // Transaction ID-ээр хайх
        if (order.transactionId.toLowerCase().includes(query)) return true;
        
        // Утасны дугаараар хайх
        if (order.shippingAddress.phone.includes(query)) return true;
        if (order.guestInfo?.phone.includes(query)) return true;
        
        // Нэрээр хайх
        if (order.guestInfo?.name.toLowerCase().includes(query)) return true;
        
        // Хаягаар хайх
        if (order.shippingAddress.street.toLowerCase().includes(query)) return true;
        if (order.shippingAddress.city.toLowerCase().includes(query)) return true;
        
        // Email-ээр хайх
        if (order.guestInfo?.email.toLowerCase().includes(query)) return true;
        
        return false;
      });

      if (filtered.length === 0) {
        setError("Захиалга олдсонгүй");
      } else {
        setSearchResults(filtered);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Хайлт амжилтгүй боллоо");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId: string) => {
    const targetOrder = orders.find(o => o._id === orderId);
    if (!targetOrder) return;

    setVerifying(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const endpoint = token 
        ? `/orders/verify-payment/${targetOrder.transactionId}`
        : `/orders/verify-payment-test/${targetOrder.transactionId}`;

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['token'] = token;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({})
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify payment');
      }

      setSuccess("Төлбөр амжилттай баталгаажлаа!");
      loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify payment");
    } finally {
      setVerifying(false);
    }
  };

  const handleMarkAsDelivered = async (orderId: string) => {
    if (!confirm("Энэ захиалгыг хүргэгдсэн гэж тэмдэглэх үү?")) return;

    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const response = await fetch(`${API_URL}/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: token || ""
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark as delivered');
      }

      setSuccess("Захиалга хүргэгдсэн гэж тэмдэглэгдлээ!");
      loadOrders(); // Жагсаалт шинэчлэх
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark as delivered");
    }
  };

  const getImageSrc = (imgCover?: string) => {
    return imgCover || "/assets/images/featured-products/01.webp";
  };

  // Pending болон delivered захиалгууд шүүх
  const pendingOrders = orders.filter(o => o.isPaid && !o.isDelivered);
  const deliveredOrders = orders.filter(o => o.isPaid && o.isDelivered);

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navigation */}
        <div className="flex gap-3 mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
          >
            <ArrowLeft />
            Admin Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
          >
            <Home />
            Нүүр хуудас
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Захиалга удирдах
              </h1>
              <p className="text-gray-600">Төлбөр баталгаажуулах болон хүргэлт удирдах</p>
            </div>
            {isAdmin && (
              <Badge variant="default" className="text-base px-4 py-2">
                ✓ Admin
              </Badge>
            )}
          </div>
        </div>

        {/* Табууд */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "search"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Search className="inline w-5 h-5 mr-2" />
            Хайх
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "pending"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Package className="inline w-5 h-5 mr-2" />
            Хүргэлтэнд ({pendingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "history"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <CheckCircle className="inline w-5 h-5 mr-2" />
            History ({deliveredOrders.length})
          </button>
        </div>

        {/* Хайлт таб */}
        {activeTab === "search" && (
          <>
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Transaction ID, утас, нэр, хаяг, email-ээр хайх"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button onClick={handleSearch} disabled={loading} size="lg">
                    <Search />
                    {loading ? "Хайж байна..." : "Хайх"}
                  </Button>
                </div>
                {error && searchResults.length === 0 && (
                  <p className="mt-3 text-red-600 text-sm">{error}</p>
                )}
                {success && (
                  <p className="mt-3 text-green-600 text-sm font-semibold">{success}</p>
                )}
              </CardContent>
            </Card>

            {/* Хайлтын үр дүн */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">{searchResults.length} захиалга олдлоо</p>
                {searchResults.map((order) => (
                  <Card key={order._id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-mono font-bold text-lg">{order.transactionId}</p>
                          <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString('mn-MN')}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={order.isPaid ? "default" : "destructive"}>
                            {order.isPaid ? "✓ Төлөгдсөн" : "⏳ Төлөгдөөгүй"}
                          </Badge>
                          <Badge variant={order.isDelivered ? "default" : "secondary"}>
                            {order.isDelivered ? "✓ Хүргэгдсэн" : "Хүлээгдэж байна"}
                          </Badge>
                        </div>
                      </div>

                      {/* Харилцагчийн мэдээлэл */}
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2 text-sm">Харилцагчийн мэдээлэл:</h4>
                        {order.guestInfo ? (
                          <>
                            <p className="text-sm"><strong>Нэр:</strong> {order.guestInfo.name}</p>
                            <p className="text-sm"><strong>Email:</strong> {order.guestInfo.email}</p>
                            <p className="text-sm"><strong>Утас:</strong> {order.guestInfo.phone}</p>
                          </>
                        ) : (
                          <p className="text-sm">Нэвтэрсэн хэрэглэгч</p>
                        )}
                        <p className="text-sm mt-2"><strong>Хаяг:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}</p>
                        <p className="text-sm"><strong>Утас:</strong> {order.shippingAddress.phone}</p>
                        {order.additionalNotes && (
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <p className="text-sm"><strong>Нэмэлт мэдээлэл:</strong></p>
                            <p className="text-sm text-gray-700 mt-1 bg-white p-2 rounded">{order.additionalNotes}</p>
                          </div>
                        )}
                      </div>

                      {/* Захиалгын мэдээлэл */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Нийт дүн</p>
                          <p className="font-bold text-xl text-blue-600">₮{order.totalOrderPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Бүтээгдэхүүн</p>
                          <p className="font-semibold">{order.cartItems.filter(item => item.productId).length} ширхэг</p>
                        </div>
                      </div>

                      {/* Бүтээгдэхүүнүүд */}
                      <div className="border-t pt-4 mb-4">
                        <h4 className="font-semibold mb-3 text-sm">Захиалсан бүтээгдэхүүн:</h4>
                        <div className="space-y-3">
                          {order.cartItems.filter(item => item.productId).map((item, index) => (
                            <div key={`search-${order._id}-${item.productId._id}-${item.selectedSize || 'nosize'}-${index}`} className="flex gap-3">
                              <div className="relative w-16 h-16 shrink-0 bg-gray-100 rounded">
                                <Image
                                  src={getImageSrc(item.productId?.imgCover)}
                                  alt={item.productId?.title || "Product"}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{item.productId?.title || "Бүтээгдэхүүн устсан"}</p>
                                {item.selectedSize && (
                                  <p className="text-xs text-blue-600">
                                    Size: <span className="font-semibold bg-blue-50 px-2 py-0.5 rounded">{item.selectedSize}</span>
                                  </p>
                                )}
                                <p className="text-xs text-gray-600">
                                  {item.quantity} × ₮{item.price.toFixed(2)} = ₮{(item.quantity * item.price).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Товчнууд */}
                      <div className="flex gap-2">
                        {!order.isPaid && (
                          <Button
                            onClick={() => handleVerifyPayment(order._id)}
                            disabled={verifying}
                            className="flex-1"
                            variant="default"
                          >
                            <CheckCircle />
                            Төлбөр баталгаажуулах
                          </Button>
                        )}
                        {order.isPaid && !order.isDelivered && (
                          <Button
                            onClick={() => handleMarkAsDelivered(order._id)}
                            className="flex-1"
                            variant="default"
                          >
                            <CheckCircle />
                            Хүргэгдсэн гэж тэмдэглэх
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pending таб - Хүргэлтэнд гарсан */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Ачааллаж байна...</div>
            ) : pendingOrders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-8 text-gray-500">
                  Хүргэлтэнд гарсан захиалга байхгүй байна
                </CardContent>
              </Card>
            ) : (
              pendingOrders.map((order) => (
                <Card key={order._id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-mono font-bold text-lg">{order.transactionId}</p>
                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString('mn-MN')}</p>
                      </div>
                      <Badge variant="secondary">Хүлээгдэж байна</Badge>
                    </div>

                    {/* Харилцагчийн мэдээлэл */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2 text-sm">Харилцагчийн мэдээлэл:</h4>
                      {order.guestInfo ? (
                        <>
                          <p className="text-sm"><strong>Нэр:</strong> {order.guestInfo.name}</p>
                          <p className="text-sm"><strong>Email:</strong> {order.guestInfo.email}</p>
                          <p className="text-sm"><strong>Утас:</strong> {order.guestInfo.phone}</p>
                        </>
                      ) : (
                        <p className="text-sm">Нэвтэрсэн хэрэглэгч</p>
                      )}
                      <p className="text-sm mt-2"><strong>Хаяг:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}</p>
                      <p className="text-sm"><strong>Утас:</strong> {order.shippingAddress.phone}</p>
                      {order.additionalNotes && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="text-sm"><strong>Нэмэлт мэдээлэл:</strong></p>
                          <p className="text-sm text-gray-700 mt-1 bg-white p-2 rounded">{order.additionalNotes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Нийт дүн</p>
                        <p className="font-bold text-xl text-blue-600">₮{order.totalOrderPrice.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Бүтээгдэхүүн</p>
                        <p className="font-semibold">{order.cartItems.filter(item => item.productId).length} ширхэг</p>
                      </div>
                    </div>

                    {/* Бүтээгдэхүүнүүд */}
                    <div className="border-t pt-4 mb-4">
                      <h4 className="font-semibold mb-3 text-sm">Захиалсан бүтээгдэхүүн:</h4>
                      <div className="space-y-3">
                        {order.cartItems.filter(item => item.productId).map((item, index) => (
                          <div key={`pending-${order._id}-${item.productId._id}-${item.selectedSize || 'nosize'}-${index}`} className="flex gap-3">
                            <div className="relative w-16 h-16 shrink-0 bg-gray-100 rounded">
                              <Image
                                src={getImageSrc(item.productId?.imgCover)}
                                alt={item.productId?.title || "Product"}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{item.productId?.title || "Бүтээгдэхүүн устсан"}</p>
                              {item.selectedSize && (
                                <p className="text-xs text-blue-600">
                                  Size: <span className="font-semibold bg-blue-50 px-2 py-0.5 rounded">{item.selectedSize}</span>
                                </p>
                              )}
                              <p className="text-xs text-gray-600">
                                {item.quantity} × ₮{item.price.toFixed(2)} = ₮{(item.quantity * item.price).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleMarkAsDelivered(order._id)}
                      className="w-full"
                      variant="default"
                    >
                      <CheckCircle />
                      Хүргэгдсэн гэж тэмдэглэх
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* History таб - Хүргэгдсэн */}
        {activeTab === "history" && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Ачааллаж байна...</div>
            ) : deliveredOrders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-8 text-gray-500">
                  Хүргэгдсэн захиалга байхгүй байна
                </CardContent>
              </Card>
            ) : (
              deliveredOrders.map((order) => (
                <Card key={order._id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-mono font-bold text-lg">{order.transactionId}</p>
                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString('mn-MN')}</p>
                      </div>
                      <Badge variant="default">✓ Хүргэгдсэн</Badge>
                    </div>

                    {/* Харилцагчийн мэдээлэл */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2 text-sm">Харилцагчийн мэдээлэл:</h4>
                      {order.guestInfo ? (
                        <>
                          <p className="text-sm"><strong>Нэр:</strong> {order.guestInfo.name}</p>
                          <p className="text-sm"><strong>Email:</strong> {order.guestInfo.email}</p>
                          <p className="text-sm"><strong>Утас:</strong> {order.guestInfo.phone}</p>
                        </>
                      ) : (
                        <p className="text-sm">Нэвтэрсэн хэрэглэгч</p>
                      )}
                      <p className="text-sm mt-2"><strong>Хаяг:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}</p>
                      <p className="text-sm"><strong>Утас:</strong> {order.shippingAddress.phone}</p>
                      {order.additionalNotes && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="text-sm"><strong>Нэмэлт мэдээлэл:</strong></p>
                          <p className="text-sm text-gray-700 mt-1 bg-white p-2 rounded">{order.additionalNotes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Нийт дүн</p>
                        <p className="font-bold text-xl text-blue-600">₮{order.totalOrderPrice.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Бүтээгдэхүүн</p>
                        <p className="font-semibold">{order.cartItems.filter(item => item.productId).length} ширхэг</p>
                      </div>
                    </div>

                    {/* Бүтээгдэхүүнүүд */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 text-sm">Захиалсан бүтээгдэхүүн:</h4>
                      <div className="space-y-3">
                        {order.cartItems.filter(item => item.productId).map((item, index) => (
                          <div key={`history-${order._id}-${item.productId._id}-${item.selectedSize || 'nosize'}-${index}`} className="flex gap-3">
                            <div className="relative w-16 h-16 shrink-0 bg-gray-100 rounded">
                              <Image
                                src={getImageSrc(item.productId?.imgCover)}
                                alt={item.productId?.title || "Product"}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{item.productId?.title || "Бүтээгдэхүүн устсан"}</p>
                              {item.selectedSize && (
                                <p className="text-xs text-blue-600">
                                  Size: <span className="font-semibold bg-blue-50 px-2 py-0.5 rounded">{item.selectedSize}</span>
                                </p>
                              )}
                              <p className="text-xs text-gray-600">
                                {item.quantity} × ₮{item.price.toFixed(2)} = ₮{(item.quantity * item.price).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
      </div>
    </section>
  );
}
