"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "../utils/api";
import Custom404 from "../not-found";
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

export default function Admin() {
  const { data: me, isLoading: load } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data, error } = await api.users.me.get();
      if (error) throw new Error(String(error.status));
      return data;
    },
  });

  if (!load && me?.user?.role !== "Admin") {
    return <Custom404 />;
  }
  return (
    <div className="flex justify-center">
      <div className="flex flex-col container">
        <div className="flex flex-row gap-8 mt-30">
          <Sidebar />
          <Users />
        </div>
      </div>
    </div>
  );
}

function Users() {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await api.users.get();

      if (error) {
        throw new Error(String(error.value));
      }

      return data;
    },
  });

  return (
    <div className="w-full bg-gray-100 p-4 rounded-2xl justify-center items-center border">
      {(isLoading || isFetching) && <Loader className="animate-spin" />}
      {data && (
        <table className="text-nowrap">
          <thead>
            <tr>
              <th>Имя пользователя</th>
              <th>Почта</th>
              <th>Роль</th>
            </tr>
          </thead>
          <tbody className="w-fit">
            {data.map((user) => (
              <tr key={user.id}>
                <td className="text-nowrap p-4">{user.name}</td>
                <td className="text-nowrap p-4 overflow-x-hidden">
                  {user.email}
                </td>
                <td className="flex text-nowrap p-4 pr-0 justify-end">
                  {user.role}
                </td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-0 ml-4">
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <ChangeRole />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function ChangeRole() {
  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Изменить роль
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="flex flex-col font-[Inter]">
        <DialogHeader>
          <DialogTitle>В разработке</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
