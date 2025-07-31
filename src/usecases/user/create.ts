import { UserEntity } from "../../domain/entities/user.entity";
import { UserInterface } from "../../domain/interfaces/user.interface";
import { HttpException, HttpStatus } from "../../exceptions/http-exception";
import { Usecase } from "../usecase";

export type CreateUserInputDto = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
};

export type CreateUserOutputDto = void;

export class CreateUserUsecase
    implements Usecase<CreateUserInputDto, CreateUserOutputDto>
{
    private constructor(private readonly userInterface: UserInterface) {}

    public static build(userInterface: UserInterface) {
        return new CreateUserUsecase(userInterface);
    }

    public async execute(input: CreateUserInputDto): Promise<void> {
        const { email, firstName, lastName, password } = input;
        const emailAlreadyexists = await this.userInterface.findByEmail(email);

        if (emailAlreadyexists) {
            throw new HttpException(HttpStatus.CONFLICT, "Email indisponível");
        }

        const aUser = await UserEntity.build(
            email,
            firstName,
            lastName,
            password,
        );
        await this.userInterface.create(aUser);

        return;
    }
}
