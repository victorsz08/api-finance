import { hash } from "bcryptjs";

export class GenerateCrypt {
    public static async hash(str: string) {
        return await hash(str, 10);
    }
}
