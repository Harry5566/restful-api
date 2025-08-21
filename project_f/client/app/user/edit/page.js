"use client";

import Link from "next/link";

export default function UserEditPage() {
  return (
    <div className="container py-3">
      <h1>編輯使用者</h1>
      <Link className="btn btn-primary" href="/">
        回首頁
      </Link>
    </div>
  );
}
