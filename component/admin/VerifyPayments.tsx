"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Package, Search, ArrowLeft, Home } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [transactionId, setTransactionId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin эрх шалгах
  useEffect(() => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    setIsAdmin(!!token);
  }, []);

  const handleSearch = async () => {
    if (!transactionId.trim()) {
      setError("Transaction ID оруулна уу");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setOrder(null);

    try {
      const response = await fetch(`${API_URL}/orders/transaction/${transactionId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order not found");
      }

      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!order) return;

    setVerifying(true);
    setError("");
    setSuccess("");

    try {
      // Admin token авах (localStorage-с - 2 газраас шалгана)
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

      // Туршилтын endpoint ашиглах (token шаардлагагүй)
      // Production дээр энийг /verify-payment болгож, token заавал шаардах
      const endpoint = token 
        ? `/orders/verify-payment/${order.transactionId}`  // Admin token байвал
        : `/orders/verify-payment-test/${order.transactionId}`; // Token байхгүй бол test endpoint

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['token'] = token; // Backend 'token' header хүлээж байна
      }

      console.log(`Admin verify: Using ${token ? 'authenticated' : 'test'} endpoint`);

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
      setOrder(data.order); // Updated order
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify payment");
    } finally {
      setVerifying(false);
    }
  };

  const getImageSrc = (imgCover?: string) => {
    return imgCover || "/assets/images/featured-products/01.webp";
  };

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
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
                Төлбөр баталгаажуулах
              </h1>
              <p className="text-gray-600">Transaction ID ашиглан төлбөрийг баталгаажуулна</p>
            </div>
            {isAdmin && (
              <Badge variant="default" className="text-base px-4 py-2">
                ✓ Admin
              </Badge>
            )}
          </div>
        </div>

        {/* Хайлт */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Transaction ID оруулах"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={handleSearch} disabled={loading} size="lg">
                <Search />
                {loading ? "Хайж байна..." : "Хайх"}
              </Button>
            </div>
            {error && !order && (
              <p className="mt-3 text-red-600 text-sm">{error}</p>
            )}
            {success && (
              <p className="mt-3 text-green-600 text-sm font-semibold">{success}</p>
            )}
          </CardContent>
        </Card>

        {/* Захиалгын мэдээлэл */}
        {order && (
          <div className="space-y-6">
            {/* Статус */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Захиалгын мэдээлэл</span>
                  <Badge variant={order.isPaid ? "default" : "destructive"} className="text-base px-4 py-1">
                    {order.isPaid ? "✓ Төлөгдсөн" : "⏳ Төлөгдөөгүй"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Transaction ID</p>
                    <p className="font-mono font-bold">{order.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Нийт дүн</p>
                    <p className="font-bold text-xl text-blue-600">${order.totalOrderPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Захиалсан огноо</p>
                    <p className="font-semibold">{new Date(order.createdAt).toLocaleString('mn-MN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Хүргэлтийн төлөв</p>
                    <Badge variant={order.isDelivered ? "default" : "secondary"}>
                      {order.isDelivered ? "Хүргэгдсэн" : "Хүлээгдэж байна"}
                    </Badge>
                  </div>
                </div>

                {/* Харилцагчийн мэдээлэл */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Харилцагчийн мэдээлэл:</h4>
                  {order.guestInfo ? (
                    <>
                      <p className="text-sm"><strong>Нэр:</strong> {order.guestInfo.name} (Guest)</p>
                      <p className="text-sm"><strong>Email:</strong> {order.guestInfo.email}</p>
                      <p className="text-sm"><strong>Утас:</strong> {order.guestInfo.phone}</p>
                    </>
                  ) : (
                    <p className="text-sm">Нэвтэрсэн хэрэглэгч</p>
                  )}
                  <p className="text-sm mt-2"><strong>Хаяг:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}</p>
                  <p className="text-sm"><strong>Утас:</strong> {order.shippingAddress.phone}</p>
                </div>

                {/* Төлбөр баталгаажуулах товч */}
                {!order.isPaid && (
                  <div className="pt-4">
                    <Button
                      onClick={handleVerifyPayment}
                      disabled={verifying}
                      className="w-full"
                      size="lg"
                    >
                      {verifying ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Баталгаажуулж байна...
                        </>
                      ) : (
                        <>
                          <CheckCircle />
                          Төлбөр баталгаажуулах
                        </>
                      )}
                    </Button>
                    {error && (
                      <p className="mt-2 text-red-600 text-sm">{error}</p>
                    )}
                  </div>
                )}

                {order.isPaid && order.paidAt && (
                  <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Төлбөр баталгаажсан</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.paidAt).toLocaleString('mn-MN')}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Бүтээгдэхүүнүүд */}
            <Card>
              <CardHeader>
                <CardTitle>Захиалсан бүтээгдэхүүн ({order.cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.cartItems.map((item) => (
                    <div key={item.productId._id} className="flex gap-4 pb-4 border-b last:border-b-0">
                      <div className="relative w-20 h-20 shrink-0 bg-gray-100 rounded">
                        <Image
                          src={getImageSrc(item.productId?.imgCover)}
                          alt={item.productId?.title || "Product"}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{item.productId?.title}</p>
                        {item.selectedSize && (
                          <p className="text-xs text-blue-600 mb-1">
                            Size: <span className="font-semibold bg-blue-50 px-2 py-0.5 rounded">{item.selectedSize}</span>
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Тоо: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                        <p className="font-bold text-blue-600">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
