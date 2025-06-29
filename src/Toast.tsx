import React, { useEffect, useState } from "react";
import { cn } from "./utils";

export interface ToastProps {
  message: string | undefined;
}

export default function Toast({ message }: ToastProps) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (message) {
      setShow(true);
    }
    const timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed transition-all w-full flex justify-center p-2 pt-10",
        show ? "top-5" : "top-0",
      )}
    >
      <div
        className={cn(
          "pointer-events-auto transition-all bg-dusk-800 border border-dusk-400 rounded-lg shadow-xl px-8 py-2 text-white",
          show ? "opacity-100" : "opacity-0",
        )}
      >
        {message}
      </div>
    </div>
  );
}
