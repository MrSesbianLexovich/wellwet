"use client";

import { authClient } from "@/app/utils/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignOut() {
  exit();
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Link href={"/"}>
        <Button>Вернутся на главную</Button>
      </Link>
    </div>
  );
}

async function exit() {
  await authClient.signOut();
}
