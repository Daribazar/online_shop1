"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Package, CheckCircle, Clock, XCircle, CreditCard } from "lucide-react";
import Image from "next/image";
import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  additionalNotes?: string;
  guestInfo?: {
    email: string;
    phone: string;
    name: string;
  };
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  cartItems: Array<{
    productId: {
      _id: string;
      title: string;
      price: number;
      imgCover?: string;
    };
    quantity: number;
    price: number;
    selectedSize?: string;
  }>;
};

export function OrderTrackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const txnFromUrl = searchParams.get("txn");

  const [transactionId, setTransactionId] = useState(txnFromUrl || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Хуудас дээш scroll хийх
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // URL-с transaction ID авч автоматаар хайх
  useEffect(() => {
    if (txnFromUrl) {
      handleSearch();
    }
  }, [txnFromUrl]);

  const handleSearch = async () => {
    if (!transactionId.trim()) {
      setError("Transaction ID оруулна уу");
      return;
    }

    setLoading(true);
    setError("");
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

  const getImageSrc = (imgCover?: string) => {
    return imgCover || "/assets/images/featured-products/01.webp";
  };

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Гарчиг */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Захиалга хянах
          </h1>
          <p className="text-gray-600">Transaction ID ашиглан захиалгаа хянаарай</p>
        </div>

        {/* Хайлтын хэсэг */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Transaction ID оруулах (жишээ: TXN1234567890)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={handleSearch} disabled={loading} size="lg">
                <Search />
                {loading ? "Хайж байна..." : "Хайх"}
              </Button>
            </div>
            {error && (
              <p className="mt-3 text-red-600 text-sm">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Захиалгын мэдээлэл */}
        {order && (
          <div className="space-y-6">
            {/* Төлбөрийн төлөв */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Захиалгын төлөв</span>
                  <Badge variant={order.isPaid ? "default" : "destructive"}>
                    {order.isPaid ? "Төлөгдсөн" : "Төлөгдөөгүй"}
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
                    <p className="font-bold text-lg text-blue-600">₮{order.totalOrderPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Захиалсан огноо</p>
                    <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('mn-MN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Хүргэлтийн төлөв</p>
                    <Badge variant={order.isDelivered ? "default" : "secondary"}>
                      {order.isDelivered ? "Хүргэгдсэн" : "Хүлээгдэж байна"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Төлбөрийн статус харуулах */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  {order.isPaid ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <div>
                        <p className="font-semibold text-green-900">Төлбөр баталгаажсан</p>
                        <p className="text-sm text-gray-600">
                          {order.paidAt && new Date(order.paidAt).toLocaleString('mn-MN')}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Clock className="w-6 h-6 text-yellow-500" />
                      <div>
                        <p className="font-semibold text-yellow-900">Төлбөр хүлээгдэж байна</p>
                        <p className="text-sm text-gray-600">Банкны шилжүүлгээ хийгээд байгаа эсэхийг шалгаж байна</p>
                      </div>
                    </>
                  )}
                </div>

                {!order.isPaid && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      <CreditCard className="inline w-4 h-4 mr-1" />
                      Төлбөрийн мэдээлэл:
                    </p>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>Банк: <strong>Хаан Банк</strong></p>
                      <p>Данс: <strong>5123456789</strong></p>
                      <p>Нэр: <strong>Online Shop LLC</strong></p>
                      <p className="text-red-600 font-bold mt-2">
                        Гүйлгээний утганд: <span className="font-mono">{order.transactionId}</span>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Хүргэлтийн хаяг */}
            <Card>
              <CardHeader>
                <CardTitle>Хүргэлтийн хаяг</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Гудамж:</strong> {order.shippingAddress.street}</p>
                <p><strong>Хот:</strong> {order.shippingAddress.city}</p>
                <p><strong>Утас:</strong> {order.shippingAddress.phone}</p>
                {order.guestInfo && (
                  <>
                    <Separator className="my-3" />
                    <p><strong>Email:</strong> {order.guestInfo.email}</p>
                  </>
                )}
                {order.additionalNotes && (
                  <>
                    <Separator className="my-3" />
                    <p><strong>Тэмдэглэл:</strong> {order.additionalNotes}</p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Бүтээгдэхүүнүүд */}
            <Card>
              <CardHeader>
                <CardTitle>Захиалсан бүтээгдэхүүн</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.cartItems.map((item, index) => (
                    <div key={`track-${item.productId._id}-${item.selectedSize || 'nosize'}-${index}`} className="flex gap-4 pb-4 border-b last:border-b-0">
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
                          Тоо: {item.quantity} × ₮{item.price.toFixed(2)}
                        </p>
                        <p className="font-bold text-blue-600">
                          ₮{(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Буцах товч */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/")}
              >
                Нүүр хуудас
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleSearch()}
                disabled={loading}
              >
                <Search />
                Шинэчлэх
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
