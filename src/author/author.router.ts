import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as AuthorService from "./author.service";

export const authorRouter = express.Router();

// get a list of all authors
authorRouter.get("/", async (req: Request, resp: Response) => {
  try {
    const authors = await AuthorService.listAuthors();
    return resp.status(200).json(authors);
  } catch (error: any) {
    return resp.status(500).json(error.m);
  }
});
authorRouter.get("/:id", async (req: Request, resp: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const author = await AuthorService.getAuthor(id);
    if (author) {
      return resp.status(200).json(author);
    } else {
      return resp.status(404).json(`author ${id} could not be found`);
    }
  } catch (error: any) {
    return resp.status(500).json(error.message);
  }
});

// POST: create an author
// Params: firstName, lastName
authorRouter.post(
  "/",
  body("firstName").isString(),
  body("lastName").isString(),
  async (req: Request, resp: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({ error: errors.array() });
    }
    try {
      const author = req.body;
      const newAuthor = await AuthorService.createAuthor(req.body);
      return resp.status(201).json(newAuthor);
    } catch (error: any) {
      return resp.status(500).json(error.message);
    }
  },
);

// PUT: Update author
// Params: firstName, lastName
authorRouter.put(
  "/:id",
  body("firstName").isString(),
  body("lastName").isString(),
  async (req: Request, resp: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({ error: errors.array() });
    }
    try {
      const id: number = parseInt(req.params.id, 10);
      const author = req.body;
      const updatedAuthor = await AuthorService.updateAuthor(author, id);
      return resp.status(200).json(updatedAuthor);
    } catch (error: any) {
      return resp.status(600).json(error.message);
    }
  },
);

// Delete: delete an author
// params: id
authorRouter.delete("/:id", async (req: Request, resp: Response) => {
  const id: number = parseInt(req.params.id);
  try {
    await AuthorService.deleteAuthor(id);
    return resp.status(204).json("author has been deleted");
  } catch (error: any) {
    return resp.status(600).json(error.message);
  }
});
