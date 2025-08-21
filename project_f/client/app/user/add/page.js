"use client";

import Link from "next/link";

export default function UserAddPage() {
  return (
    <div className="container py-3">
      <h1>使用者註冊</h1>
      <Link className="btn btn-primary" href="/">
        回首頁
      </Link>
    </div>
  );
}
