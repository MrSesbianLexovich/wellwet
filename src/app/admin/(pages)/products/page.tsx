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
import { EllipsisVertical, Loader, LoaderCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { queryClient } from "@/app/utils/query-client";
import { useState } from "react";
import { accordionSchema, productSchema } from "@/server/lib/schemas";
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
import CustomLoader from "@/components/loader";
import Image from "next/image";
import { s3 } from "@/server/lib/s3";
import { id } from "zod/v4/locales";

export default function Admin() {
  const {
    data: me,
    isLoading: load,
    isFetching: fetch,
  } = useQuery({
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
          <Products />
        </div>
      </div>
    </div>
  );
}

function Products() {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await api.products.get();
      if (error) {
        throw new Error(String(error.status));
      }
      return data;
    },
  });

  return (
    <div className="w-full bg-gray-100 p-4 rounded-2xl justify-center items-center border">
      {data && (
        <div className="flex flex-col gap-2">
          <CreateUpdateProduct />
          <table className="text-nowrap">
            <thead>
              <tr>
                <th>Название товара</th>
                <th>Краткое описание</th>
              </tr>
            </thead>
            <tbody className="w-fit">
              {data.map((product) => (
                <tr key={product.id}>
                  <td className="text-nowrap p-4">{product.name}</td>
                  <td className="text-nowrap p-4 overflow-x-hidden">
                    {product.shortDescription}
                  </td>
                  <td>
                    <a
                      href={`/products/${product.id}`}
                      target="_blank"
                      className="text-base text-accent"
                    >
                      Ссылка на товар
                    </a>
                  </td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="outline-0 ml-4">
                        <EllipsisVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="font-[inter]">
                        <ProductAccordions product={product} />
                        <CreateUpdateProduct product={product} />
                        <DeleteProduct product={product} />
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

type Product = NonNullable<
  Awaited<ReturnType<typeof api.products.get>>["data"]
>[number];

function CreateUpdateProduct({ product }: { product?: Product }) {
  const [open, SetOpen] = useState(false);

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await api.categories.get();

      if (error) {
        throw new Error(String(error.value));
      }
      return data;
    },
  });

  const formSchema = productSchema;
  const form = useForm({
    defaultValues: product as z.infer<typeof formSchema>,
    // defaultValues: {
    //   ...product,
    //   name: product?.name,
    //   image: ,
    //   shortDescription: product?.shortDescription,
    //   description: product?.description,
    //   type: product?.type,
    // } as z.infer<typeof formSchema>,
    validators: {
      // onSubmit: productSchema,
      onSubmit: z.object({
        name: z
          .string({ message: "Введите название" })
          .min(3, "Название должно быть длиннее 3-х символов"),
        shortDescription: z.string({ message: "Введите краткое описание" }),
        description: z.string(),
        type: z.string(),
        image: z.file({ message: "Загрузите изображение" }),
      }),
    },
    onSubmit: ({ value }) => {
      if (product) {
        updateProductMutation.mutate({
          ...value,
          name: value.name,
          shortDescription: value.shortDescription,
          description: value.description,
          type: value.type,
          image: imageMeta,
        });
      } else {
        createProductMutation.mutate(value);
      }
    },
  });

  const createProductMutation = useMutation({
    mutationKey: ["products"],

    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { error } = await api.products.post(data);
      if (error) {
        throw new Error(String(error.status));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      form.reset();
      SetOpen(false);
    },
    onError: () => {
      alert("Не удалось создать товар");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { error } = await api.products({ id: product!.id }).patch(data);
      if (error) {
        throw new Error(String(error.status));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      SetOpen(false);
    },
    onError: () => {
      alert("не удалось изменить товар");
    },
  });

  return (
    <Dialog open={open} onOpenChange={SetOpen} modal={true}>
      <DialogTrigger asChild>
        {product ? (
          <DropdownMenuItem
            className="flex justify-center"
            onSelect={(e) => e.preventDefault()}
          >
            Изменить
          </DropdownMenuItem>
        ) : (
          <Button className="bg-accent w-fit p-2">Создать товар</Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-200! flex flex-col font-[inter]">
        <DialogHeader>
          <DialogTitle>{product ? "Изменить" : "Создать"} товар</DialogTitle>
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
              <form.Field name="name">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label htmlFor={field.name}>Название товара</label>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="Название товара"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <p>{field.state.meta.errors.map((e) => e?.message)}</p>
                  </div>
                )}
              </form.Field>

              <form.Field name="shortDescription">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label htmlFor={field.name}>Краткое описание</label>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="Краткое описание"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <p>{field.state.meta.errors.map((e) => e?.message)}</p>
                  </div>
                )}
              </form.Field>

              <form.Field name="type">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label htmlFor={field.name}>Тип товара</label>
                    <Select
                      defaultValue={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger className="w-full p-6 shadow-none border-border">
                        <SelectValue placeholder="Выберите тип товара" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectGroup>
                          <SelectLabel>Типы товара</SelectLabel>
                          {/* {(isLoading || isFetching) && <p>Загрузка...</p>}
                          {data && (
                            <div key={"key"}>
                              {data.map((direction) => (
                                <SelectItem
                                  value={direction.direction}
                                  key={direction.id}
                                >
                                  {direction.direction}
                                </SelectItem>
                              ))}
                            </div>
                          )} */}
                          {data?.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.category}
                            >
                              {category.category}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <p>{field.state.meta.errors.map((e) => e?.message)}</p>
                  </div>
                )}
              </form.Field>
              <Image
                src={`/api/file/${product?.image}`}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                }}
                width={200}
                height={200}
              />
              <form.Field name="image">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label htmlFor={field.name}>Фото</label>
                    <Input
                      type="file"
                      id={field.name}
                      name={field.name}
                      placeholder="Выберите фото"
                      className="bg-muted text-black outline-0"
                      onChange={(e) => {
                        if (!e.target.files?.[0]) {
                          return;
                        }
                        return field.handleChange(e.target.files[0]);
                      }}
                      accept="image/*"
                    />
                    <p className="text-red-800">
                      {field.state.meta.errors.map((e) => e?.message)}
                    </p>
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="description">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <label htmlFor={field.name}>Описание товара</label>
                  <Textarea
                    className="h-101 max-h-101 w-100"
                    id={field.name}
                    name={field.name}
                    placeholder="Описание товара"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <p className="text-red-800">
                    {field.state.meta.errors.map((e) => e?.message)}
                  </p>
                </div>
              )}
            </form.Field>
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
                {isSubmitting ? (
                  <div className="animate-spin">
                    <LoaderCircle />
                  </div>
                ) : product ? (
                  "Изменить"
                ) : (
                  "Создать"
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteProduct({ product }: { product: Product }) {
  const [open, SetOpen] = useState(false);

  const deleteProductMutation = useMutation({
    mutationFn: async () => {
      const { error } = await api.products({ id: product.id }).delete();
      if (error) {
        throw new Error(String(error.value.message));
      }
    },
    onSuccess: async () => {
      SetOpen(false);
      await queryClient.invalidateQueries({
        queryKey: ["products"],
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
              Вы уверены, что хотите удалить товар?
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

function ProductAccordions({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);

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
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogTrigger asChild className="flex justify-center">
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="w-full text-center"
        >
          Аккордeоны
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogTitle className="hidden"></DialogTitle>
      <DialogContent>
        <div className="w-full justify-center items-center">
          {(isLoading || isFetching) && <Loader className="animate-spin" />}
          {data && (
            <div className="flex flex-col gap-2">
              <CreateUpdateAccordion product={product} />
              <table className="text-nowrap">
                <thead>
                  <tr className="text-base">
                    <th>Заголовок аккордеона</th>
                  </tr>
                </thead>
                <tbody className="w-fit">
                  {data.map((a) => (
                    <tr key={a.id}>
                      <td className="text-nowrap p-4">{a.title}</td>

                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="outline-0 ml-4">
                            <EllipsisVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <CreateUpdateAccordion
                              accordion={a}
                              product={product}
                            />
                            {/*
                         <DeleteProduct product={product} /> */}
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
      </DialogContent>
    </Dialog>
  );
}

type Accordion = NonNullable<
  Awaited<ReturnType<typeof api.accordion.get>>["data"]
>[number];

function CreateUpdateAccordion({
  accordion,
  product,
}: {
  accordion?: Accordion;
  product: Product;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const formSchema = accordionSchema;
  const form = useForm({
    defaultValues: accordion as z.infer<typeof formSchema>,
    validators: {
      onSubmit: z.object({
        title: z
          .string({ message: "Введите название" })
          .min(3, "Название должно быть длиннее 3-х символов"),

        content: z.string(),
      }),
    },
    onSubmit: ({ value }) => {
      if (accordion) {
        updateAccordionMutation.mutate(value);
      } else {
        createAccordionMutation.mutate(value);
      }
    },
  });

  const createAccordionMutation = useMutation({
    mutationKey: ["accordion", accordion?.id],

    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { error } = await api.accordion({ id: product.id }).post(data);
      if (error) {
        throw new Error(String(error.status));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["accordion", accordion?.id],
      });
      form.reset();
      setIsOpen(false);
    },
    onError: () => {
      alert("Не удалось создать аккордеон");
    },
  });

  const updateAccordionMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { error } = await api.accordion({ id: accordion!.id }).put(data);
      if (error) {
        throw new Error(String(error.status));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["accordion", accordion?.id],
      });
      setIsOpen(false);
    },
    onError: () => {
      alert("не удалось изменить аккордеон");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogTrigger asChild>
        {accordion ? (
          <DropdownMenuItem
            className="flex justify-center"
            onSelect={(e) => e.preventDefault()}
          >
            Изменить
          </DropdownMenuItem>
        ) : (
          <Button className="bg-accent w-fit p-2">Создать аккордеон</Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-200! flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {accordion ? "Изменить" : "Создать"} Аккордеон
          </DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <div className="flex flex-col  gap-2">
            <form.Field name="title">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <label htmlFor={field.name}>Название</label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Название товара"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <p>{field.state.meta.errors.map((e) => e?.message)}</p>
                </div>
              )}
            </form.Field>

            <form.Field name="content">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <label htmlFor={field.name}>Содержание</label>
                  <Textarea
                    className="h-101 max-h-101 w-100"
                    id={field.name}
                    name={field.name}
                    placeholder="Описание товара"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <p className="text-red-800">
                    {field.state.meta.errors.map((e) => e?.message)}
                  </p>
                </div>
              )}
            </form.Field>
          </div>
          {/*
          <form.Subscribe>
            {(state) => (
              <Button
                className="w-full"
                loading={
                  createAccordionMutation.isPending ||
                  updateAccordionMutation.isPending ||
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
              <Button
                disabled={isSubmitting}
                loading={
                  createAccordionMutation.isPending ||
                  updateAccordionMutation.isPending ||
                  isSubmitting
                }
              >
                Сохранить
              </Button>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}
