import Link from "next/link";
import { Button } from "./ui/button";

const navButtons = [
  { id: 0, href: "/admin/products", title: "Товары" },
  { id: 1, href: "/admin/questions", title: "Обращения" },
  { id: 2, href: "/admin/", title: "Пользователи" },
  { id: 3, href: "/admin/categories", title: "Категории" },
];

export default function Sidebar() {
  return (
    <div className="min-h-150 flex flex-col gap-2 bg-gray-100 p-4 rounded-2xl border">
      {navButtons.map((b) => (
        <Link key={b.id} href={b.href}>
          <Button className="w-full bg-white text-primary p-2">
            {b.title}
          </Button>
        </Link>
      ))}
    </div>
  );
}
