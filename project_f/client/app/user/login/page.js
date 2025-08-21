"use client";

import Link from "next/link";

export default function UserLoginPage() {
  return (
    <div className="container py-3">
      <h1>使用者的登入與登出頁</h1>
      <Link className="btn btn-primary" href="/">
        回首頁
      </Link>
    </div>
  );
}
