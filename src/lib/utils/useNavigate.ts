"use client";
import { useRouter } from "next/navigation";
import { getCurrentEntry, goBack, pushRoute } from "./navigate";

export function useNavigate() {
  const router = useRouter();

  const navigate = (pathname: string) => {
    const current = getCurrentEntry();

    if (current?.locationPathname !== pathname) {
      pushRoute(pathname);
    }
    router.push(pathname);
  };

  const back = () => {
    const prevPath = goBack();
    if (prevPath) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return { navigate, back };
}
