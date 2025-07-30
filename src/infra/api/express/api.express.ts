import { Api } from "../api";
import express, { Express } from "express";
import { Route } from "./routes/route.express";

export class ApiExpress implements Api {
    private app: Express;

    private constructor(routes: Route[]) {
        this.app = express();
        this.app.use(express.json());

        this.addRoutes(routes);
    }

    public static build(routes: Route[]) {
        return new ApiExpress(routes);
    }

    private addRoutes(routes: Route[]) {
        routes.forEach((route) => {
            const handler = route.getHandler();
            const method = route.getMethod();
            const path = route.getPath();
            const middlewares = route.getMiddleware();

            this.app[method](path, ...middlewares, handler);
        });
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log("[INFO]: server http is running");
        });
    }
}
