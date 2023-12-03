import { db } from "../utils/db.server";
import type { Author } from "../author/author.service";

/**
 * @openapi
 * components:
 *  schemas:
 *    BookRead:
 *      type: object
 *      required:
 *      - id
 *      - title
 *      - datePublished
 *      - isFiction
 *      - authorId
 *    properties:
 *      id:
 *        type: string
 *        description: The auto-generated id of the book
 *      title:
 *        type: string
 *      datePublished:
 *        type: date
 *      isFiction:
 *        type: boolean
 *      authorId:
 *    example:
 *      id: 3458tr
 *      title: a new book
 *      datePublished: 1/2/2023
 *      isFiction: false
 *      authorId: 2
 */
type BookRead = {
  id: number;
  title: string;
  datePublished: Date;
  isFiction: boolean;
  author: Author;
};

type BookWrite = {
  title: string;
  datePublished: Date;
  isFiction: boolean;
  authorId: number;
};

export const listBooks = async (): Promise<BookRead[]> => {
  return db.book.findMany({
    select: {
      id: true,
      title: true,
      datePublished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      // authorId: true,
    },
  });
};

export const getBook = async (id: number): Promise<BookRead | null> => {
  return db.book.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      datePublished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const createBook = async (book: BookWrite): Promise<BookRead> => {
  const { title, authorId, datePublished, isFiction } = book;
  const parsedDate: Date = new Date(datePublished);

  return db.book.create({
    data: {
      title,
      authorId,
      datePublished: parsedDate,
      isFiction,
    },
    select: {
      id: true,
      title: true,
      datePublished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const updateBook = async (
  book: BookWrite,
  id: number,
): Promise<BookRead> => {
  const { title, datePublished, isFiction, authorId } = book;
  return db.book.update({
    where: {
      id,
    },
    data: {
      title,
      isFiction,
      datePublished,
      authorId,
    },
    select: {
      id: true,
      title: true,
      datePublished: true,
      isFiction: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const deleteBook = async (id: number): Promise<void> => {
  await db.book.delete({
    where: {
      id,
    },
  });
};
