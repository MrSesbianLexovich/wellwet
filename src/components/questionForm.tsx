"use client";

import { api } from "@/app/utils/api";
import { queryClient } from "@/app/utils/query-client";
import { questionSchema } from "@/server/lib/schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import z from "zod/v4";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { SquareArrowRight } from "lucide-react";

type Question = NonNullable<
  Awaited<ReturnType<typeof api.questions.get>>["data"]
>[number];

export default function QuestionForm({ question }: { question?: Question }) {
  const [isClicked, setIsClicked] = useState(false);

  const formSchema = questionSchema;
  const form = useForm({
    defaultValues: question as z.infer<typeof questionSchema>,
    validators: {
      onSubmit: z.object({
        name: z.string(),
        phoneOrEmail:
          z
            .string()
            .min(10, "Номер слишком короткий")
            .max(15, "Номер слишком длинный")
            .regex(
              /^[+]?[0-9\s\-()]+$/,
              "Номер содержит недопустимые символы",
            ) || z.email,
        type: z.string(),
        question: z.string(),
      }),
    },
    onSubmit: ({ value }) => {
      createQuestionMutation.mutate(value);
    },
  });

  const createQuestionMutation = useMutation({
    mutationKey: ["questions"],

    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { error } = await api.questions.post(data);
      if (error) {
        throw new Error(String(error.status));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["questions"],
      });
      form.reset();
      alert("Ваш вопрос был отправлен");
    },
    onError: () => {
      alert("Не удалось создать обращение");
    },
  });

  return (
    <div className="w-full flex gap-6 py-12 font-[inter]">
      <Image
        className="rounded-2xl max-w-100.75 object-cover"
        src="/leaf.svg"
        alt=""
        width={403}
        height={568}
      />
      <div className="w-full flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <p className="text-5xl font-medium">Остались вопросы?</p>
          <p className="text-2xl opacity-40">
            Мы поможем разобраться с выбором корма и ответим на <br /> вопросы о
            продукции WellWet.
          </p>
        </div>
        <form
          className="w-full flex flex-col gap-8"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col gap-6">
              <div className="w-full flex gap-6">
                <form.Field name="name">
                  {(field) => (
                    <Input
                      className="w-full"
                      id={field.name}
                      name={field.name}
                      placeholder="Имя"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                </form.Field>

                <form.Field name="phoneOrEmail">
                  {(field) => (
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="Email или телефон"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                </form.Field>
              </div>
              <form.Field name="type">
                {(field) => (
                  <Select
                    value={field.state.value || ""}
                    name={field.name}
                    onValueChange={(value) => {
                      field.setValue(value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Тип организации" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="item 1">Item 1</SelectItem>
                        <SelectItem value="item 2">Item 2</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </form.Field>
              <form.Field name="question">
                {(field) => (
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Ваш вопрос или комментарий"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            </div>
            <div className="flex gap-4">
              <button
                className={`w-6 h-6 border border-border rounded-[8px] ${isClicked ? "bg-accent" : "bg-non"}`}
                type="button"
                onClick={() => setIsClicked(!isClicked)}
              />
              <p className="text-base opacity-60">
                Согласен на обработку персональных данных
              </p>
            </div>
          </div>
          {/* <form.Subscribe>
            {(state) => (
              <Button
                className="w-fit bg-[#FDD5E9] text-black rounded-xl px-6 py-4"
                //loading={state.isSubmitting}
                disabled={!state.canSubmit || isClicked === false}
              >
                Отправить
                <SquareArrowRight className="size-8" />
              </Button>
            )}
          </form.Subscribe> */}
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                className="w-fit bg-accent text-white rounded-xl px-6 py-4"
                disabled={isSubmitting || isClicked === false}
                loading={createQuestionMutation.isPending || isSubmitting}
              >
                Отправить
                <SquareArrowRight className="size-8 text-white" />
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  );
}
