"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Logout from "./_components/logout";
import Login from "./_components/login";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const {user} = useAuth();

  return (
    <div className="container py-3">
      {user ? <Login /> : <Logout />}
    </div>
  );
}
