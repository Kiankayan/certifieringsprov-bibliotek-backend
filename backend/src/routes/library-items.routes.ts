import { Router } from "express";
import { prisma, Prisma } from "../lib/prisma.js";
import {
  createLibraryItemSchema,
  updateLibraryItemSchema,
} from "../schemas/library-item.schema.js";

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

router.get("/", async (_req, res) => {
  try {
    const libraryItems = await prisma.libraryItem.findMany({
      include: {
        category: true,
      },
    });

    res.json(libraryItems);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kunde inte hämta library items.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const libraryItem = await prisma.libraryItem.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        category: true,
      },
    });

    if (!libraryItem) {
      return res.status(404).json({
        message: "Library item kunde inte hittas.",
      });
    }

    res.json(libraryItem);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kunde inte hämta library item.",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = updateLibraryItemSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Ogiltigt library item.",
        errors: result.error.flatten(),
      });
    }

    const libraryItem = await prisma.libraryItem.update({
      where: {
        id: req.params.id,
      },
      data: result.data,
    });

    res.json(libraryItem);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({
        message: "Library item kunde inte hittas.",
      });
    }

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
      message: "Kunde inte uppdatera library item.",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.libraryItem.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(204).send();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({
        message: "Library item kunde inte hittas.",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Kunde inte ta bort library item.",
    });
  }
});

export default router;
