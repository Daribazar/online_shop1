import { Suspense } from "react";
import ProductDetailsPage from "@/component/product-details/ProductDetailsPage";

export default function ProductDetails() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetailsPage />
    </Suspense>
  );
}
