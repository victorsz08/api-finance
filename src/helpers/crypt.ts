import { compare, hash } from "bcryptjs";

export class GenerateCrypt {
    public static async hash(str: string): Promise<string> {
        return await hash(str, 10);
    }

    public static async compare(str: string, hash: string): Promise<boolean> {
        return await compare(str, hash);
    }
}
