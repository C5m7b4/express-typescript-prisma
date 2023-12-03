/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The book author
 *         finished:
 *           type: boolean
 *           description: Whether you have finished reading the book
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 *         finished: false
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 *
 */

import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as BookService from "./book.service";

export const bookRouter = express.Router();

/**
 * @openapi
 * /api/books:
 *  get:
 *    tag:
 *    - listAllBooks
 *    description: list all books
 *    responses:
 *        200:
 *          description: you should see a list of books
 */
bookRouter.get("/", async (req: Request, resp: Response) => {
  try {
    const books = await BookService.listBooks();
    return resp.status(200).json(books);
  } catch (error: any) {
    return resp.status(500).json(error.message);
  }
});
/**
 * @openapi
 * /api/books/{id}:
 *  get:
 *    tag:
 *    - bookbyid
 *    description: get a single book by its id
 *    summary: get single book by its id - summary
 *    parameters:
 *    - name: id
 *      in: path
 *      description: the id of the book you want
 *      required: true
 *    responses:
 *        200:
 *          description: you should see a list of books
 *        500:
 *          description: could not find your book or unknown message
 */
bookRouter.get("/:id", async (req: Request, resp: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const book = await BookService.getBook(id);
    if (book) {
      return resp.status(200).json(book);
    } else {
      return resp.status(500).json("could not find your book");
    }
  } catch (error: any) {
    return resp.status(500).json(error.message);
  }
});

/**
 * @openapi
 * /api/books:
 *  post:
 *    tag:
 *    - createbook
 *    description: Create a new book
 *    summary: Create a new book sumary
 *    parameters:
 *    - name: title
 *      in: path
 *      description: title of the book
 *      required: tr
 *    - name: autoriId
 *      in: path
 *      description: the authors id
 *      required: true
 *    - name: datePublished
 *      in: path
 *      description: date the book was published
 *      required: true
 *    - name: isFiction
 *      in: path
 *      description: fantasy or real
 *      required: true
 *    responses:
 *        200:
 *          description: you should see the details of the book you just created
 *        400:
 *          description: errors in your validation, missing form fields
 *        500:
 *          description: something went wrong
 */
bookRouter.post(
  "/",
  body("title").isString(),
  body("authorId").isInt(),
  // body("datePublished").isDate().toDate(),
  body("datePublished").isString(),
  body("isFiction").isBoolean(),
  async (req: Request, resp: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({ errors: errors.array() });
    }
    try {
      const book = req.body;
      const newBook = await BookService.createBook(book);
      return resp.status(201).json(newBook);
    } catch (error: any) {
      return resp.status(500).json(error.message);
    }
  },
);

/**
 * @openapi
 * /api/books/{id}:
 *  put:
 *    tag:
 *    - update
 *    description: delete a book by its id
 *    summary: delete a book by its id
 *    parameters:
 *    - name: id
 *      in: path
 *      description: the id of the book you want to delete
 *      required: true
 *    responses:
 *        200:
 *          description: you should see a list of books
 *        500:
 *          description: could not find your book or unknown message
 */
bookRouter.put(
  "/:id",
  body("title").isString(),
  body("authorId").isInt(),
  body("datePublished").isString(),
  body("isFiction").isBoolean(),
  async (req: Request, resp: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({ errors: errors.array() });
    }
    try {
      const book = req.body;
      const id: number = parseInt(req.params.id, 10);
      const updatedBook = await BookService.updateBook(book, id);
      return resp.status(201).json(updatedBook);
    } catch (error: any) {
      return resp.status(500).json(error.message);
    }
  },
);
/**
 * @openapi
 * /api/books/{id}:
 *  delete:
 *    tag:
 *    - delete
 *    description: delete a book by its id
 *    summary: delete a book by its id
 *    parameters:
 *    - name: id
 *      in: path
 *      description: the id of the book you want to delete
 *      required: true
 *    responses:
 *        200:
 *          description: you should see a list of books
 *        500:
 *          description: could not find your book or unknown message
 */
bookRouter.delete("/:id", async (req: Request, resp: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    await BookService.deleteBook(id);
    return resp.status(200).json("book was deleted");
  } catch (error: any) {
    return resp.status(500).json(error.message);
  }
});
