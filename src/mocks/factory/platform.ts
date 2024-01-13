import { faker } from "@faker-js/faker"
import { Platform } from "@prisma/client"
import { randomInt } from "crypto"

type PlatformFactoryProps = {
    name: string,
    url: string,
    logoUrl: string
}
export class PlatformFactory {
    create(values: Partial<Platform>): PlatformFactoryProps {
        return {
            name: faker.lorem.words(randomInt(1, 3)),
            url: faker.internet.url(),
            logoUrl: faker.image.url(),
            ...values,
        }
    }
    createMany(quantity: number, partial?: Partial<Platform>): PlatformFactoryProps[] {
        return Array.from({ length: quantity }, () => this.create(partial))
    }
}