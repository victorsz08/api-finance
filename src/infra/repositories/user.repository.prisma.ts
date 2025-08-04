import { Prisma, PrismaClient } from "@prisma/client";
import { UserEntity } from "../../domain/entities/user.entity";
import {
    ListUser,
    UserInterface,
} from "../../domain/interfaces/user.interface";

export class UserRepository implements UserInterface {
    private constructor(private readonly repo: PrismaClient) {}

    public static build(repo: PrismaClient) {
        return new UserRepository(repo);
    }

    public async create(user: UserEntity): Promise<void> {
        await this.repo.user.create({
            data: user,
        });

        return;
    }

    public async find(id: string): Promise<UserEntity | null> {
        const user = await this.repo.user.findUnique({ where: { id } });

        if (!user) return null;

        const output = UserEntity.with(user);
        return output;
    }

    public async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.repo.user.findUnique({ where: { email } });

        if (!user) return null;

        const output = UserEntity.with(user);
        return output;
    }

    public async list(
        page: number,
        limit: number,
        search?: string | undefined,
    ): Promise<ListUser> {
        const query: Prisma.UserFindManyArgs = {
            where: {},
            take: limit,
            skip: (page - 1) * limit,
        };

        const count: Prisma.UserCountArgs = {
            where: {},
        };

        if (search) {
            query.where = {
                AND: [
                    { email: search },
                    { firstName: search },
                    { lastName: search },
                ],
            };

            count.where = {
                AND: [
                    { email: search },
                    { firstName: search },
                    { lastName: search },
                ],
            };
        }

        const [users, total] = await Promise.all([
            this.repo.user.findMany(query),
            this.repo.user.count(count),
        ]);

        const userList = users.map((u) => {
            return UserEntity.with(u);
        });
        const totalPages = Math.ceil(total / limit);

        return {
            users: userList,
            total,
            totalPages,
            currentPage: page,
            perPage: limit,
        };
    }

    public async update(
        id: string,
        email: string,
        firstName: string,
        lastName: string,
        updatedAt: Date,
    ): Promise<void> {
        await this.repo.user.update({
            where: { id },
            data: {
                email,
                firstName,
                lastName,
                updatedAt,
            },
        });

        return;
    }

    public async updatePassword(
        id: string,
        password: string,
        updatedAt: Date,
    ): Promise<void> {
        await this.repo.user.update({
            where: { id },
            data: {
                password,
                updatedAt,
            },
        });

        return;
    }

    public async delete(id: string): Promise<void> {
        await this.repo.user.delete({ where: { id } });

        return;
    }
}
