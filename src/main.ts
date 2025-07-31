import { ApiExpress } from "./infra/api/express/api.express";

export function main() {
    const app = ApiExpress.build([]);

    app.start(3000);
}

main();
