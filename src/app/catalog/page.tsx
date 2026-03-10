"use client";

import Catalog from "@/components/catalog";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function CatalogPage() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col container">
        <Header />
        <Catalog />
      </div>
      <Footer />
    </div>
  );
}

