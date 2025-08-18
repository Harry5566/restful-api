import express from "express";
import { resolve } from "path";

const app = express();
app.use(express.static(resolve(import.meta.dirname, "../client")));
app.use(
  "/bs",
  express.static(
    resolve(import.meta.dirname, "node_modules", "bootstrap", "dist")
  )
);

app.listen(3005, () => {
  console.log("client 已啟動於 http://localhost:3005");
});
