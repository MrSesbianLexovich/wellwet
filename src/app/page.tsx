"use client";

import Catalog from "@/components/catalog";
import Footer from "@/components/footer";

import Hero from "@/components/hero";
import Products from "@/components/products";
import QuestionForm from "@/components/questionForm";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col container">
        <Hero />

        <Products />

        <QuestionForm />
      </div>

      <Footer />
    </div>
  );
}
