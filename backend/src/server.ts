import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoriesRouter from "./routes/categories.routes.js";
import libraryItemsRouter from "./routes/library-items.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/categories", categoriesRouter);
app.use("/api/library-items", libraryItemsRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "Bibliotekssystemets API fungerar!",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
