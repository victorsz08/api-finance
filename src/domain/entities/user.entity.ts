import { GenerateCrypt } from "../../helpers/crypt";
import { GenerateId } from "../../helpers/generate-id";

export type UserProps = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
};

export class UserEntity {
    private constructor(private readonly props: UserProps) {}

    public static async build(
        email: string,
        firstName: string,
        lastName: string,
        password: string,
    ) {
        return new UserEntity({
            id: GenerateId.uuid(),
            email,
            firstName,
            lastName,
            password: await GenerateCrypt.hash(password),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    public static with(props: UserProps) {
        return new UserEntity(props);
    }

    public get id() {
        return this.props.id;
    }

    public get email() {
        return this.props.email;
    }

    public get firstName() {
        return this.props.firstName;
    }

    public get lastName() {
        return this.props.lastName;
    }

    public get password() {
        return this.props.password;
    }

    public get createdAt() {
        return this.props.createdAt;
    }

    public get updatedAt() {
        return this.props.updatedAt;
    }
}
