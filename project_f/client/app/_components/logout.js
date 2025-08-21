"use client";

import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import style from "@/styles/ben.module.sass";
import style2 from "@/styles/may.module.sass";

export default function Logout() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const onclick = () => {
    // console.log(account, password);
    login(account, password);
  };

  return (
    <>
      <h1>
      <span className={style.color1}>登出</span>
      <span className={style2.color1}>狀態</span>
      </h1>
      <div className="input-group mb-2">
        <span className={`input-group-text ${style.color1}`}>帳號</span>
        <input
          type="text"
          name="account"
          className="form-control"
          value={account}
          onChange={(e) => {
            setAccount(e.target.value);
          }}
        />
      </div>
      <div className="input-group mb-2">
        <span className="input-group-text">密碼</span>
        <input
          type="password"
          name="password"
          className="form-control"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div className="d-flex">
        <div className="btn btn-primary ms-auto btn-login" onClick={onclick}>
          送出
        </div>
      </div>
    </>
  );
}
