"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserEditPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/user/login"); // 導頁
    }
  }, [user, isLoading]);

  if (isLoading || !user) return null;

  return (
    <div className="container py-3">
      <h1>編輯使用者</h1>
      <Link className="btn btn-primary" href="/">
        回首頁
      </Link>
    </div>
  );
}
