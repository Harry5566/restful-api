"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function UserDetailPage() {
  const { id } = useParams();

  return (
    <div className="container py-3">
      <h1>使用者 {id} 的主頁</h1>
      <Link className="btn btn-primary" href="/">
        回首頁
      </Link>
    </div>
  );
}
