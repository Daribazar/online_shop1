import { Suspense } from "react";
import { OrderPage } from "@/component/order/Order";

export default function Order() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderPage />
    </Suspense>
  );
}


