import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { createCategorySchema } from "../schemas/category.schema.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json(categories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kunde inte hämta kategorier.",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = createCategorySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Ogiltig kategori.",
        errors: result.error.flatten(),
      });
    }

    const category = await prisma.category.create({
      data: {
        name: result.data.name,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kunde inte skapa kategori.",
    });
  }
});

export default router;
