import { queryClient } from "@/app/utils/query-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { api } from "@/app/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod/v4";
import { EllipsisVertical, Loader } from "lucide-react";
import { productSchema } from "@/server/lib/schemas";

export default
