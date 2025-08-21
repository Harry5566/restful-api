"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Logout from "./_components/logout";
import Login from "./_components/login";

export default function Home() {
  return (
    <div className="container py-3">
      <Login />
    </div>
  );
}
