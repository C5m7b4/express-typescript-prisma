import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "rest api docs",
      version,
    },
    components: {},
    security: [{}],
  },
  apis: [
    "./src/book/book.router.ts",
    "./src/author/author.router.ts",
    "./src/book/book.service.ts",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  // swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // docs in json format
  app.get("/docs.json", (req: Request, resp: Response) => {
    resp.setHeader("Content-Type", "application/json");
    resp.send(swaggerSpec);
  });
}

export default swaggerDocs;
