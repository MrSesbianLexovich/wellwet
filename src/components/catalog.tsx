"use client";

import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { api } from "@/app/utils/api";
import ProductCard from "./card";
import { products } from "@/server/lib/db/schema/schema";
import { useState } from "react";

export default function Catalog() {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await api.products.get();

      if (error) {
        throw new Error(String(error.value));
      }

      return data;
    },
  });

  const {
    data: categoryData,

    error: categoryError,
    isLoading: categoryIsLoading,
    isFetching: categotyIsFetching,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await api.categories.get();
      if (error) {
        throw new Error(String(error.value));
      }
      return data;
    },
  });

  const [currentValue, setValue] = useState("");

  return (
    <div className="flex flex-col py-12 gap-12 font-[inter]">
      <h1 className="text-5xl font-medium">Каталог товаров</h1>
      <div className="flex flex-col">
        <Tabs defaultValue="all">
          <TabsList variant="default">
            <TabsTrigger value="all">Все корма</TabsTrigger>
            {categoryData?.map((category) => (
              <TabsTrigger
                key={category.id}
                onClick={() => setValue(category.category)}
                value={category.category}
              >
                {category.category}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            <div className="w-full mt-8 grid grid-cols-4 gap-6">
              {data?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value={currentValue}>
            <div className="w-full mt-8 grid grid-cols-4 gap-6">
              {data
                ?.filter((product) => product.type === currentValue)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
        {(isLoading || isFetching) && <p>Загрузка...</p>}
      </div>
    </div>
  );
}
