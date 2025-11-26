"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Products from "./Products";
import Similar from "./Similar";

export default function ProductDetailsPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  return (
    <>
      <Products onCategoryLoad={setCategoryId} />
      {categoryId && productId && (
        <Similar categoryId={categoryId} currentProductId={productId} />
      )}
    </>
  );
}
