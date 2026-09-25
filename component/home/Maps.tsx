"use client";

import { useState, useEffect } from "react";

// Байршлын газрын зураг - Google Maps Embed ашиглана
export default function Maps() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center pb-8">
            <h3 className="text-3xl font-bold mb-2">Манай байршил</h3>
            <p className="text-gray-600">Макс Молл, Улаанбаатар хотод зочилно уу</p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg bg-gray-200 h-96 flex items-center justify-center">
            <p className="text-gray-500">Газрын зураг ачааллаж байна...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center pb-8">
          <h3 className="text-3xl font-bold mb-2">Манай байршил</h3>
          <p className="text-gray-600">Макс Молл, Улаанбаатар хот</p>
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
         <div className="rounded-lg overflow-hidden shadow-lg">
  <div className="relative w-full h-96">
    <iframe
      src="https://maps.google.com/maps?q=Max%20Mall%20Ulaanbaatar&t=&z=17&ie=UTF8&iwloc=&output=embed"
      className="absolute top-0 left-0 w-full h-full border-0"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Макс Моллын байршил"
    />
  </div>
</div>
        </div>
        
        {/* Хаяг мэдээлэл */}
      </div>
    </section>
  );
}
