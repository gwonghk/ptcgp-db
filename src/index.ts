import express, { urlencoded, json } from "express";
import main from "./app.ts";

const port = process.env.PORT || 8000;
const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Server is up and running" });
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

const baseURL = "https://quotes.toscrape.com";
const baseURL2 = "https://sandbox.oxylabs.io/products/1";
const baseURL3 = "https://pocket.limitlesstcg.com/cards/A1/4";
const baseURL4 = "https://gamevlg.com/pokemon-tcg-pocket/cards/1";

main(baseURL3);
