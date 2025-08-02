import { verify } from "jsonwebtoken";
import { UserInterface } from "../../domain/interfaces/user.interface";
import { Usecase } from "../usecase";
import { UserEntity } from "../../domain/entities/user.entity";
import { HttpException, HttpStatus } from "../../exceptions/http-exception";


export type AuthSessionInputDto = {
    token: string
};


export type AuthSessionOutputDto = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}


export class AuthSessionUsecase implements Usecase<AuthSessionInputDto, AuthSessionOutputDto> {
    private constructor(private readonly userInterface: UserInterface) {};

    public static build(userInterface: UserInterface) {
        return new AuthSessionUsecase(userInterface)
    }
    
    public async execute(input: AuthSessionInputDto): Promise<AuthSessionOutputDto> {
        const { token } = input;
        const session = verify(token, String(process.env.JWT_SECRET)) as { id: string };

        const user = await this.userInterface.find(session.id);
        
        if(!user) {
            throw new HttpException(HttpStatus.NOT_FOUND, "User not found with id");
        }
        
        const output = this.present(user);

        return output;
    }

    private present(user: UserEntity): AuthSessionOutputDto {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }
    }
}