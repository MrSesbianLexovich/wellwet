import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function Custom404() {
  return (
    <div className="w-full h-screen flex flex-col items-center font-[inter]">
      <div className="h-full flex flex-col container">
        <Header />
        <Error404 />
      </div>
      <Footer />
    </div>
  );
}

function Error404() {
  return (
    <div className="flex px-12 py-64">
      <div className="w-full flex flex-col items-center gap-4 ">
        <div className="flex flex-col items-center gap-2">
          <p className="text-6xl font-medium opacity-20">404</p>
          <p className="text-base font-medium">Страница не найдена</p>
          <p className="opacity-30 text-center">
            К сожалению, страница, которую вы ищете,
            <br /> не существует или была удалена.
          </p>
        </div>
        <Button className="bg-accent">
          <Link href="/">На главную</Link>
        </Button>
      </div>
    </div>
  );
}
