"use client";
import { api } from "@/app/utils/api";
import { useQuery } from "@tanstack/react-query";

export default function ProductAccordion({ product }: { product: Product }) {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["accordion"],
    queryFn: async () => {
      const { data, error } = await api.accordion({ id: product.id }).get();
      if (error) {
        throw new Error(String(error.value));
      }
      console.log(data);
      return data;
    },
  });

  return (
    <div>
      {(isLoading || isFetching) && <p>Загрузка...</p>}
      {data && data.map()}
    </div>
  );
}
