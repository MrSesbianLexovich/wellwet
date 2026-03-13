import { api } from "@/app/utils/api";
import { products } from "@/server/lib/db/schema/schema";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "./card";
import { ArrowRight, Loader } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Link from "next/link";
import { Button } from "./ui/button";
import CustomLoader from "./loader";

export default function Products() {
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
  const lf = !isLoading || !isFetching;

  if (!lf) {
    return <CustomLoader />;
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-8 mt-12 font-[inter]">
        <div className="flex flex-col gap-6 items-center justify-center">
          <p className="text-5xl font-medium max-w-150 text-center">
            Подберите корм для вашего <i>питомца</i>
          </p>

          <p className="text-2xl opacity-50 max-w-200 text-center">
            Выберите категорию питомца и подходящий рацион с учётом возраста и
            потребностей.
          </p>
        </div>

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
              {data?.slice(0, 4)?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value={currentValue}>
            <div className="w-full mt-8 grid grid-cols-4 gap-6">
              {data
                ?.filter((product) => product.type === currentValue)
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
        <div className="w-full flex flex-col justify-center items-center gap-2">
          <p className="text-2xl">Больше в каталоге</p>
          <Link href={"/catalog"}>
            <Button className="bg-accent text-3xl">Перейти в каталог</Button>
          </Link>
        </div>
        {/*<div className="w-full h-full flex absolute translate-y-1/2 translate-x-8 justify-end">
          <Link className="" href={"/catalog"}>
            <div className="w-fit p-2 rounded-xl bg-accent/30 text-accent">
              <ArrowRight size={40} />
            </div>
          </Link>
        </div>
        <div className="">
          <Link href={"/catalog"}>
            <Button className="bg-accent text-2xl">Перейти в каталог</Button>
          </Link>
        </div> */}
      </div>
    </div>
  );
}
