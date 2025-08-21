"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container py-3">
      <Link className="btn btn-primary me-1 mb-1" href="/user/ben">
        使用者的主頁(R)
      </Link>
      <Link className="btn btn-primary me-1 mb-1" href="/user/add">
        新增使用者(C)
      </Link>
      <Link className="btn btn-primary me-1 mb-1" href="/user/edit">
        修改使用者(U)
      </Link>
      <Link className="btn btn-primary me-1 mb-1" href="/user/login">
        使用者登入
      </Link>
      <Link className="btn btn-primary me-1 mb-1" href="/user">
        使用列表頁(R)
      </Link>
    </div>
  );
}
