"use client";

import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  title: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning";
};

function addToast(options: ToastOptions) {
  const { title, description, type = "info" } = options;
  switch (type) {
    case "success":
      sonnerToast.success(title, { description });
      break;
    case "error":
      sonnerToast.error(title, { description });
      break;
    default:
      sonnerToast(title, { description });
      break;
  }
}

function promise<T>(
  promise: Promise<T>,
  options: {
    loading: ToastOptions;
    success: ToastOptions | ((data: T) => ToastOptions);
    error: ToastOptions | ((err: unknown) => ToastOptions);
  },
) {
  return sonnerToast.promise(promise, {
    loading: options.loading.title,
    success: (data) => {
      const opts =
        typeof options.success === "function"
          ? options.success(data)
          : options.success;
      return opts.title;
    },
    error: (err) => {
      const opts =
        typeof options.error === "function"
          ? options.error(err)
          : options.error;
      return opts.title;
    },
  });
}

export const toast = {
  add: addToast,
  promise,
};
