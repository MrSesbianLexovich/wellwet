"use client";

import { authClient } from "@/app/utils/auth-client";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import z from "zod/v4";

export default function SignIn() {
  const router = useRouter();

  async function signIn(value: { email: string; password: string }) {
    await authClient.signIn.email(
      {
        email: value.email,
        password: value.password,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          console.log(error.error.message);
        },
      },
    );
  }

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: z.object({
        email: z.email(),
        password: z.string(),
      }),
    },
    onSubmit: ({ value }) => {
      signIn(value);
    },
  });

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center font-[Inter]">
      <form
        className="w-100 flex flex-col p-4 gap-4 border rounded-2xl "
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        <Link href="/" className="opacity-50">
          На главную
        </Link>
        <h1 className="w-full text-3xl text-center">Вход</h1>
        <form.Field name="email">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name}>Почта</label>
              <input
                id={field.name}
                name={field.name}
                placeholder="Почта"
                className="p-2 rounded-md bg-muted text-black outline-0"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <p className="text-red-800">
                {field.state.meta.errors.map((e) => e?.message)}
              </p>
            </div>
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name}>Пароль</label>
              <input
                id={field.name}
                name={field.name}
                placeholder="Пароль"
                className="p-2 rounded-md bg-muted text-black outline-0"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <p className="text-red-800">
                {field.state.meta.errors.map((e) => e?.message)}
              </p>
            </div>
          )}
        </form.Field>
        {/* <form.Subscribe>
          {(state) => (
            <Button
              className="w-full bg-accent"
              //loading={state.isSubmitting}
              disabled={!state.canSubmit}
            >
              Войти
            </Button>
          )}
        </form.Subscribe> */}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button disabled={isSubmitting} className="bg-accent">
              {isSubmitting ? (
                <div className="animate-spin">
                  <Loader />
                </div>
              ) : (
                "Войти"
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
