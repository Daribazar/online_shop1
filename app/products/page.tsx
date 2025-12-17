import { Suspense } from "react";
import { Products } from '@/component/products/Products'

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Products />
      </Suspense>
    </div>
  )
}
