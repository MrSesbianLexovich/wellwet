import z from "zod/v4";

export const questionSchema = z.object({
  name: z.string().min(3, "Имя слишком короткое"),
  phoneOrEmail: z.string().trim().refine((value) => {
    const isEmail = z.email().safeParse(value).success;
    const digits = value.replace(/\D/g, "").length;
    const isPhone =
      /^[+]?[0-9\s\-()]+$/.test(value) && digits >= 10 && digits <= 15;

    return isEmail || isPhone;
  }, "Введите корректный email или телефон"),

  type: z.string(),
  question: z.string(),
});

export const productSchema = z.object({
  image: z.file(),
  name: z.string(),
  shortDescription: z.string(),
  description: z.string(),
  type: z.string(),
});

export const accordionSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const categorySchema = z.object({
  category: z.string(),
});
