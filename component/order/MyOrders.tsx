"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Calendar, DollarSign, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/authContext";

// Guest захиалга төрөл
type GuestOrder = {
  transactionId: string;
  date: string;
  total: number;
  email: string;
};

export function MyOrdersPage() {
  const router = useRouter();
  const { isGuest, isAuthenticated } = useAuth();
  const [guestOrders, setGuestOrders] = useState<GuestOrder[]>([]);

  useEffect(() => {
    // Хуудас дээш scroll хийх
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Guest-ийн захиалгуудыг localStorage-оос унших
    const saved = localStorage.getItem("guestOrders");
    if (saved) {
      setGuestOrders(JSON.parse(saved));
    }
  }, []);

  // Хэрэв нэвтэрсэн хэрэглэгч бол backend-с захиалга татах
  if (isAuthenticated && !isGuest) {
    return (
      <section className="py-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Миний захиалгууд</h1>
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-center py-8">
                Backend-с захиалга татах функц нэмэх хэрэгтэй
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

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
                          ₮{order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
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
                      <Search />
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
