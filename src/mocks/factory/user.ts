import { faker } from '@faker-js/faker';
import { User } from "@prisma/client";

export class UserFactory {
    create(): Partial<User> {
        return {
            email: faker.internet.email(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            password: faker.internet.password(),
            phone: faker.phone.number(),
            username: faker.internet.userName(),
        }
    }
    createMany(quantity: number) {
        return Array.from({ length: quantity }, () => this.create())
    }
}