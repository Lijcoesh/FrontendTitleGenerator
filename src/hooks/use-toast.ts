"use client";

// This is a simplified version of the use-toast hook
import { useState } from "react";

type Toast = {
  id: string;
  title: string;
  description?: string;
  duration?: number;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({
    title,
    description,
    duration = 3000,
  }: {
    title: string;
    description?: string;
    duration?: number;
  }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, duration };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);

    return id;
  };

  return { toast, toasts };
}
