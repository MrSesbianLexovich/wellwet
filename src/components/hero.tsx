import Image from "next/image";
import Header from "./header";
import { Button } from "./ui/button";
import { SquareArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="w-full flex relative flex-col p-6 items-center">
      <div className="w-full flex flex-col xl:mb-44 2xl:mb-86">
        <Header />
        <TextBlock />
      </div>
      <Image
        className="absolute -z-10 rounded-4xl"
        src="/Main.svg"
        alt=""
        style={{
          width: "100%",
          height: "auto",
        }}
        width={1392}
        height={752}
      />
    </div>
  );
}

function TextBlock() {
  return (
    <div className="flex justify-end">
      <div className="flex flex-col p-12 rounded-[24px] bg-white font-[inter] max-w-188">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <p className="text-5xl">
              Сухой полнорационный корм холистик для щенков, взрослых собак и
              кошек <i>holistic</i>
            </p>
            <p className="text-[20px] opacity-50">
              В полной мере обеспечивает физиологические потребности животных в
              питательных веществах, необходимых для поддержания нормальной
              жизнедеятельности их организма.
            </p>
          </div>
          <Link href={"/catalog"}>
            <Button className="bg-accent text-white w-fit mb-15">
              Выбрать корм <SquareArrowRight className="size-8" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
