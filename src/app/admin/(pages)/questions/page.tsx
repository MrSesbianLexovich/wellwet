"use client";

import { useQuery } from "@tanstack/react-query";

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
import { api } from "@/app/utils/api";
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
    return <CustomLoader />;
  }

  if (lf && me?.user?.role !== "Admin") {
    return <Custom404 />;
  }
  return (
    <div className="flex justify-center font-[inter]">
      <div className="flex flex-col container">
        <div className="flex flex-row gap-8 mt-30">
          <Sidebar />
          <Questions />
        </div>
      </div>
    </div>
  );
}

function Questions() {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const { data, error } = await api.questions.get();

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
              <th>Имя</th>
              <th>Вопрос</th>
              <th>Тип компании</th>
              <th>Контакт</th>
            </tr>
          </thead>
          <tbody className="w-fit">
            {data.map((question) => (
              <tr key={question.id}>
                <td className="text-nowrap p-4">{question.name}</td>
                <td className="text-nowrap p-4 overflow-x-hidden">
                  {question.question}
                </td>
                <td className="flex text-nowrap p-4">{question.type}</td>
                <td>{question.phoneOrEmail}</td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-0 ml-4">
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="font-[inter]"></DropdownMenuContent>
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
