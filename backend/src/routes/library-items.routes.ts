import { Router } from "express";
import { prisma, Prisma } from "../lib/prisma.js";
import { createLibraryItemSchema } from "../schemas/library-item.schema.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const result = createLibraryItemSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Ogiltigt library item.",
        errors: result.error.flatten(),
      });
    }

    const libraryItem = await prisma.libraryItem.create({
      data: result.data,
    });

    res.status(201).json(libraryItem);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return res.status(404).json({
        message: "Kategorin kunde inte hittas.",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Kunde inte skapa library item.",
    });
  }
});

export default router;
