import { api } from "@/app/utils/api";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

type Product = NonNullable<
  Awaited<ReturnType<typeof api.products.get>>["data"]
>[number];

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col gap-6 h-full justify-between">
      <Image
        src={`/api/file/${product.image}`}
        alt=""
        style={{
          width: "100%",
          height: "auto",
        }}
        width={200}
        height={200}
        className="rounded-2xl"
      />
      <div className="flex flex-col p-2 gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl">{product.name}</h1>
          <p className="opacity-50 text-[20px]">{product.shortDescription}</p>
        </div>
        <Link href={`/products/${product.id}`}>
          <Button className="w-full bg-accent">Смотреть</Button>
        </Link>
      </div>
    </div>
  );
}
