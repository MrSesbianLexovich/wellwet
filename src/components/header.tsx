"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/utils/api";

type Me = NonNullable<Awaited<ReturnType<typeof api.users.me.get>>["data"]>;

export default function Header() {
  const { data: me, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data, error } = await api.users.me.get();
      if (error) throw new Error(String(error.status));
      return data;
    },
  });

  return (
    <div className="w-full flex justify-between items-center py-6 font-[inter]">
      <h1 className="text-3xl italic font-[playfair]">
        <Link href={"/"}>WellWet</Link>
      </h1>
      <div className="flex gap-5">
        <Link href={"/catalog"}>
          <Button className="bg-muted text-black">Каталог</Button>
        </Link>
        {(!isLoading && me && me.user.name) !== "" ? (
          <Link href="/auth/sign-out">
            <Button className="bg-black">Выйти</Button>
          </Link>
        ) : (
          <div className="flex">
            <Link href="/auth/sign-in">
              <Button className="bg-muted text-black hover:opacity-55 rounded-r-none">
                Войти
              </Button>
            </Link>

            <Link href="/auth/sign-up">
              <Button className="bg-accent hover:bg-accent/50 rounded-l-none">
                Регистрация
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
