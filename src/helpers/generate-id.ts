import { v4 } from "uuid";

export class GenerateId {
    public static uuid() {
        return v4();
    }
}
