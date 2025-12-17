import { Suspense } from "react";
import { OrderTrackPage } from "@/component/order/OrderTrack";

export default function OrderTrack() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderTrackPage />
    </Suspense>
  );
}
