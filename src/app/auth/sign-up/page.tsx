"use client";

import { authClient } from "@/app/utils/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import z from "zod/v4";

export default function SignIn() {
  const router = useRouter();

  // async function signUn(value: {
  //   name: string;
  //   email: string;
  //   password: string;
  // }) {
  //   await authClient.signUp.email(
  //     {
  //       email: value.email,
  //       password: value.password,
  //     },
  //     {
  //       onSuccess: () => {
  //         router.push("/");
  //       },
  //       onError: (error) => {
  //         console.log(error.error.message);
  //       },
  //     },
  //   );
  // }

  async function signUp(value: {
    name: string;
    email: string;
    password: string;
  }) {
    await authClient.signUp.email(
      {
        name: value.name,
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
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: z.object({
        name: z.string(),
        email: z.email(),
        password: z.string(),
      }),
    },
    onSubmit: ({ value }) => {
      signUp(value);
    },
  });

  return (
    <div className="w-full h-screen flex items-center justify-center font-[Inter]">
      <form
        className="w-100 flex flex-col p-4 gap-4 border rounded-2xl "
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        {" "}
        <Link href="/" className="opacity-50">
          На главную
        </Link>
        <h1 className="w-full text-3xl text-center">Регистрация</h1>
        <form.Field name="name">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name}>Ваше имя</label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="Ваше имя"
                className="p-2 rounded-md text-black outline-0"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <p className="text-red-800">
                {field.state.meta.errors.map((e) => e?.message)}
              </p>
            </div>
          )}
        </form.Field>
        <form.Field name="email">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label htmlFor={field.name}>Почта</label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="Почта"
                className="p-2 rounded-md text-black outline-0"
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
              <Input
                id={field.name}
                name={field.name}
                placeholder="Пароль"
                className="p-2 rounded-md text-black outline-0"
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
              // loading={state.isSubmitting}
              disabled={!state.canSubmit}
            >
              Зарегистрироваться
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
