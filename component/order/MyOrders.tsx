"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Package, Calendar, DollarSign, Search, Loader2, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/authContext";
import { API_URL } from "@/lib/api";
import Image from "next/image";

// Guest захиалга төрөл
type GuestOrder = {
  transactionId: string;
  date: string;
  total: number;
  email: string;
};

// Backend захиалга төрөл
type BackendOrder = {
  _id: string;
  transactionId: string;
  userId: string;
  cartItems: Array<{
    productId: {
      _id: string;
      title: string;
      imgCover?: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  totalOrderPrice: number;
  paymentMethod: string;
  isPaid: boolean;
  isDelivered: boolean;
  isExpired?: boolean;
  paymentExpiry?: string;
  shippingAddress: {
    city: string;
    district: string;
    address: string;
    phone: string;
  };
  createdAt: string;
  paidAt?: string;
  deliveredAt?: string;
};

export function MyOrdersPage() {
  const router = useRouter();
  const { isGuest, isAuthenticated, user, token } = useAuth();
  const [guestOrders, setGuestOrders] = useState<GuestOrder[]>([]);
  const [backendOrders, setBackendOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Client-side mounting шалгах
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchUserOrders = useCallback(async () => {
    if (!token) {
      console.log('❌ Token байхгүй байна');
      return;
    }
    
    console.log('🔍 Захиалга татаж байна...');
    console.log('Token:', token);
    console.log('API URL:', `${API_URL}/orders`);
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'token': token,
        },
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (response.ok) {
        console.log('✅ Захиалга амжилттай татагдлаа:', data.orders?.length || 0, 'захиалга');
        setBackendOrders(data.orders || []);
      } else {
        console.error('❌ Алдаа:', data.message);
        setError(data.message || "Захиалга татахад алдаа гарлаа");
      }
    } catch (err) {
      console.error("❌ Network алдаа:", err);
      setError("Сүлжээний алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!mounted) return;
    
    console.log('🎯 MyOrders useEffect ажиллаж байна');
    console.log('isGuest:', isGuest);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('token:', token ? 'Байна' : 'Байхгүй');
    console.log('user:', user);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (isGuest) {
      console.log('👤 Guest хэрэглэгч - localStorage-оос уншиж байна');
      // Guest-ийн захиалгуудыг localStorage-оос унших
      const saved = localStorage.getItem("guestOrders");
      if (saved) {
        const orders = JSON.parse(saved);
        console.log('📦 Guest захиалга олдлоо:', orders.length);
        setGuestOrders(orders);
      } else {
        console.log('📦 Guest захиалга байхгүй');
      }
    } else if (isAuthenticated && token) {
      console.log('👤 Нэвтэрсэн хэрэглэгч - Backend-с татаж байна');
      // Нэвтэрсэн хэрэглэгчийн захиалгуудыг backend-с татах
      fetchUserOrders();
    } else {
      console.log('⚠️ Нэвтрээгүй эсвэл token байхгүй');
    }
  }, [mounted, isGuest, isAuthenticated, token, fetchUserOrders, user]);

  // Төлөв харуулах функц
  const getStatusBadge = (order: BackendOrder) => {
    if (order.isDelivered) {
      return <Badge className="bg-green-600">Хүргэгдсэн</Badge>;
    }
    if (order.isPaid) {
      return <Badge className="bg-blue-600">Төлбөр баталгаажсан</Badge>;
    }
    if (order.isExpired) {
      return <Badge variant="destructive">Хугацаа дууссан</Badge>;
    }
    return <Badge variant="secondary">Төлбөр хүлээгдэж байна</Badge>;
  };

  // Server-side rendering үед хоосон харуулах
  if (!mounted) {
    return (
      <section className="py-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Миний захиалгууд
            </h1>
          </div>
        </div>
      </section>
    );
  }

  // Нэвтэрсэн хэрэглэгчийн захиалгууд
  if (isAuthenticated && !isGuest) {
    return (
      <section className="py-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Миний захиалгууд
            </h1>
            <p className="text-gray-600">
              Таны бүх захиалгуудын жагсаалт
            </p>
          </div>

          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-3 text-gray-600">Ачааллаж байна...</span>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={fetchUserOrders}>Дахин оролдох</Button>
                </div>
              </CardContent>
            </Card>
          ) : backendOrders.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Танд захиалга байхгүй байна
                  </p>
                  <Button onClick={() => router.push("/products")}>
                    Бүтээгдэхүүн үзэх
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {backendOrders.map((order) => (
                <Card key={order._id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg mb-1">
                          Захиалга #{order.transactionId.slice(-8)}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleString('mn-MN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {getStatusBadge(order)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    {/* Бүтээгдэхүүнүүд */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3 text-gray-700">Бүтээгдэхүүнүүд:</h3>
                      <div className="space-y-3">
                        {order.cartItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            {item.productId?.imgCover && (
                              <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                  src={item.productId.imgCover}
                                  alt={item.productId.title}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {item.productId?.title || "Бүтээгдэхүүн"}
                              </p>
                              <p className="text-sm text-gray-600">
                                Тоо ширхэг: {item.quantity} × ₮{item.price.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-600">
                                ₮{(item.quantity * item.price).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Хүргэлтийн хаяг */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Хүргэлтийн хаяг:</p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.city}, {order.shippingAddress.district}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.address}
                          </p>
                          <p className="text-sm text-gray-600">
                            Утас: {order.shippingAddress.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Төлбөрийн мэдээлэл */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Төлбөрийн хэлбэр</p>
                          <p className="font-semibold text-sm">
                            {order.paymentMethod === 'bank' ? 'Банкны шилжүүлэг' : 'Бэлэн мөнгө'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Нийт дүн</p>
                          <p className="font-semibold text-lg text-blue-600">
                            ₮{order.totalOrderPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {order.paymentExpiry && !order.isPaid && !order.isExpired && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <div>
                            <p className="text-xs text-gray-500">Төлбөрийн хугацаа</p>
                            <p className="font-semibold text-sm text-orange-600">
                              {new Date(order.paymentExpiry).toLocaleString('mn-MN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Товчнууд */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push(`/order-track?txn=${order.transactionId}`)}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Захиалга хянах
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(order.transactionId);
                        }}
                        title="Transaction ID хуулах"
                      >
                        Copy ID
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Guest хэрэглэгчийн захиалгууд
  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Миний захиалгууд
          </h1>
          <p className="text-gray-600">
            Та Guest-ээр хийсэн захиалгууддаа энд байна
          </p>
        </div>

        {guestOrders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Танд захиалга байхгүй байна
                </p>
                <Button onClick={() => router.push("/products")}>
                  Бүтээгдэхүүн үзэх
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {guestOrders.map((order) => (
              <Card key={order.transactionId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Order #{order.transactionId.slice(-8)}
                    </CardTitle>
                    <Badge variant="secondary">Guest</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Огноо</p>
                        <p className="font-semibold text-sm">
                          {new Date(order.date).toLocaleDateString('mn-MN')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Нийт дүн</p>
                        <p className="font-semibold text-sm text-blue-600">
                          ₮{order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Имэйл</p>
                        <p className="font-semibold text-sm truncate">
                          {order.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push(`/order-track?txn=${order.transactionId}`)}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Захиалга хянах
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(order.transactionId);
                      }}
                      title="Transaction ID хуулах"
                    >
                      Copy ID
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Тайлбар */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">
              💡 <strong>Санамж:</strong> Эдгээр захиалгууд зөвхөн энэ браузер дээр харагдана. 
              Transaction ID-г хадгалаад авснаар ямар ч газраас захиалгаа хянах боломжтой.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
