import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./utils/swagger";

import { authorRouter } from "./author/author.router";
import { bookRouter } from "./book/book.router";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.json());
app.use("/api/authors", authorRouter);
app.use("/api/books", bookRouter);

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Test api for typescript prisma and express",
      version: "1.0",
      description: "test api",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "C5",
        url: "https://www.c5m7b4.com",
        email: "c5m7b4@c5m7b4.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8009",
      },
    ],
  },
  apis: ["./book/book.router.ts"],
};

const specs = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true }),
);

app.listen(PORT.toString(), () => {
  console.log(`listening on port: ${PORT}`);
  swaggerDocs(app, PORT);
  console.log(`swagger docs are available at http://localhost:${PORT}/docs`);
});
