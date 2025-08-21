"use client";

import Link from "next/link";

export default function UserPage() {
  return (
    <div className="container py-3">
      <h1>使用者主頁</h1>
      <Link className="btn btn-primary" href="/">回首頁</Link>
    </div>
  );
}
