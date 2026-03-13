"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import Image from "next/image";
import QuestionForm from "@/components/questionForm";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/utils/api";
import Custom404 from "@/app/not-found";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomLoader from "@/components/loader";

export default function ProductPage() {
  const productId = useParams<{ id: string }>().id;

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["products", productId],
    queryFn: async () => {
      const { data, error } = await api.products({ id: productId }).get();

      if (error) {
        throw new Error(String(error.value));
      }

      return data;
    },
  });

  //if (isLoading) return <Loader />

  if (data === "" && !isLoading) {
    return <Custom404 />;
  }

  return (
    <>
      {(isLoading || isFetching) && (
        <div className="w-screen h-screen">
          <CustomLoader />
        </div>
      )}
      {data && (
        <div className="flex flex-col items-center">
          <div className="flex flex-col container">
            <Header />
            <Product product={data} />
            <QuestionForm />
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

type Product = NonNullable<
  Awaited<ReturnType<typeof api.products.get>>["data"]
>[number];

function Product({ product }: { product: Product }) {
  return (
    <div className="my-8 flex gap-6">
      <Image
        src={`/api/file/${product.image}`}
        alt=""
        style={{
          width: "100%",
          height: "100%",
        }}
        width={200}
        height={200}
        className="max-w-170 rounded-2xl"
      />

      <div className="w-full flex flex-col gap-8 font-[inter]">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-medium">{product && product.name}</h1>
          <p className="text-[20px] opacity-40">{product && product.type}</p>
          <p className="text-[20px]">{product && product.description}</p>
        </div>
        <ProductAccordion product={product} />
      </div>
    </div>
  );
}

function ProductAccordion({ product }: { product: Product }) {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["accordion", product.id],
    queryFn: async () => {
      const { data, error } = await api.accordion({ id: product.id }).get();
      if (error) {
        throw new Error(String(error.value));
      }

      return data;
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {(isLoading || isFetching) && <p>Загрузка...</p>}
      {data &&
        data.map((a) => (
          <Accordion
            key={a.id}
            type="single"
            className="w-full bg-muted p-6 rounded-2xl border border-border/50"
            collapsible
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="items-center text-[20px]">
                {a.title}
              </AccordionTrigger>
              <AccordionContent className="mt-6 opacity-50 text-base whitespace-pre-line">
                {a.content}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
    </div>
  );
}
