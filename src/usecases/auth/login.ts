import { sign } from "jsonwebtoken";
import { UserInterface } from "../../domain/interfaces/user.interface";
import { HttpException, HttpStatus } from "../../exceptions/http-exception";
import { GenerateCrypt } from "../../helpers/crypt";
import { Usecase } from "../usecase";


export type AuthLoginInputDto = {
    email: string;
    password: string;
}


export type AuthLoginOutputDto = {
    token: string;
}


export class AuthLoginUsecase implements Usecase<AuthLoginInputDto, AuthLoginOutputDto> {
    private constructor(private readonly userInterface: UserInterface) {};

    public static build(userInterface: UserInterface) {
        return new AuthLoginUsecase(userInterface)
    }
    
    public async execute(input: AuthLoginInputDto): Promise<AuthLoginOutputDto> {
        const { email, password } = input;
        const aUser = await this.userInterface.findByEmail(email);

        if(!aUser) {
            throw new HttpException(HttpStatus.BAD_REQUEST, "Email or password incorrect")
        }

        const validatePassword = await GenerateCrypt.compare(password, aUser.password);

        if(!validatePassword) {
            throw new HttpException(HttpStatus.BAD_REQUEST, "Email or password incorrect")
        }

        const payload = sign({
            id: aUser.id
        }, String(process.env.JWT_SECRET), { expiresIn: "15min" });

        return {
            token: payload
        }
    }
}