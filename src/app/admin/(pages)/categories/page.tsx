"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod/v4";
import { api } from "@/app/utils/api";
import Custom404 from "@/app/not-found";
import Sidebar from "@/components/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { queryClient } from "@/app/utils/query-client";
import { useState } from "react";
import {
  accordionSchema,
  categorySchema,
  productSchema,
} from "@/server/lib/schemas";
import { Field, useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, products } from "@/server/lib/db/schema/schema";
import CustomLoader from "@/components/loader";

export default function Admin() {
  const { data: me, isLoading: load } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data, error } = await api.users.me.get();
      if (error) throw new Error(String(error.status));
      return data;
    },
  });

  const lf = !load || !fetch;

  if (!lf) {
    return (
      <div className="w-screen h-screen">
        <CustomLoader />
      </div>
    );
  }

  if (lf && me?.user?.role !== "Admin") {
    return <Custom404 />;
  }
  return (
    <div className="flex justify-center font-[inter]">
      <div className="flex flex-col container">
        <div className="flex flex-row gap-8 mt-30">
          <Sidebar />
          <Categories />
        </div>
      </div>
    </div>
  );
}

function Categories() {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await api.categories.get();
      if (error) {
        throw new Error(String(error.status));
      }
      return data;
    },
  });

  return (
    <div className="w-full bg-gray-100 p-4 rounded-2xl justify-center items-center border">
      {(isLoading || isFetching) && <Loader className="animate-spin" />}
      {data && (
        <div className="flex flex-col gap-2">
          <CreateUpdateCategory />
          <table className="text-nowrap">
            <thead>
              <tr>
                <th>Категория</th>
              </tr>
            </thead>
            <tbody className="w-fit">
              {data.map((category) => (
                <tr key={category.id}>
                  <td className="text-nowrap p-4">{category.category}</td>

                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="outline-0 ml-4">
                        <EllipsisVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="font-[inter]">
                        <CreateUpdateCategory category={category} />
                        <DeleteCategory category={category} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

type Category = NonNullable<
  Awaited<ReturnType<typeof api.categories.get>>["data"]
>[number];

function CreateUpdateCategory({ category }: { category?: Category }) {
  const [open, SetOpen] = useState(false);

  const formSchema = categorySchema;
  const form = useForm({
    defaultValues: category as z.infer<typeof formSchema>,
    validators: {
      onSubmit: z.object({
        category: z
          .string({ message: "Введите название" })
          .min(3, "Название должно быть длиннее 3-х символов"),
      }),
    },
    onSubmit: ({ value }) => {
      if (category) {
        updateCategoryMutation.mutate(value);
      } else {
        createCategoryMutation.mutate(value);
      }
    },
  });

  const createCategoryMutation = useMutation({
    mutationKey: ["categories"],

    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { error } = await api.categories.post(data);
      if (error) {
        throw new Error(String(error.status));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      form.reset();
      SetOpen(false);
    },
    onError: () => {
      alert("Не удалось создать категорию");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { error } = await api.categories({ id: category!.id }).put(data);
      if (error) {
        throw new Error(String(error.status));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      SetOpen(false);
    },
    onError: () => {
      alert("не удалось изменить категорию");
    },
  });

  return (
    <Dialog open={open} onOpenChange={SetOpen} modal={true}>
      <DialogTrigger asChild>
        {category ? (
          <DropdownMenuItem
            className="flex justify-center"
            onSelect={(e) => e.preventDefault()}
          >
            Изменить
          </DropdownMenuItem>
        ) : (
          <Button className="bg-accent w-fit p-2">Создать категорию</Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-200! flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {category ? "Изменить" : "Создать"} категорию
          </DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <div className="flex justify-between">
            <div className="flex flex-col  gap-2">
              <form.Field name="category">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label htmlFor={field.name}>Категория</label>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="Категория"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <p>{field.state.meta.errors.map((e) => e?.message)}</p>
                  </div>
                )}
              </form.Field>
            </div>
          </div>
          {/*<form.Subscribe>
            {(state) => (
              <Button
                className="w-full"
                loading={
                  createProductMutation.isPending ||
                  updateProductMutation.isPending ||
                  state.isSubmitting
                }
                disabled={!state.canSubmit}
              >
                Сохранить
              </Button>
            )}
          </form.Subscribe> */}
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button disabled={isSubmitting}>
                {isSubmitting ? "Please wait..." : "Submit"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteCategory({ category }: { category: Category }) {
  const [open, SetOpen] = useState(false);

  const deleteProductMutation = useMutation({
    mutationFn: async () => {
      const { error } = await api.categories({ id: category.id }).delete();

      if (error) {
        throw new Error(String(error.value.message));
      }
    },
    onSuccess: async () => {
      SetOpen(false);
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={SetOpen} modal={true}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="flex justify-center"
          onSelect={(e) => e.preventDefault()}
        >
          Удалить
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <p className="p-4 text-[20px] font-500">
              Вы уверены, что хотите удалить категорию?
            </p>
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 justify-between">
          <Button
            className="w-fit px-16 rounded-md bg-red-600"
            onClick={() => deleteProductMutation.mutate()}
          >
            Удалить
          </Button>
          <Button
            className="w-fit px-16 rounded-md"
            onClick={() => SetOpen(!open)}
          >
            Отмена
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
