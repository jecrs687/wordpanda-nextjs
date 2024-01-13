import { faker } from "@faker-js/faker"
import { Media, MediaType } from "@prisma/client"
import { randomInt } from "crypto"

type MediaFactoryProps = {
    name: string,
    url: string,
    type: MediaType,
    logoUrl: string,
    platformId: number
}
export class MediaFactory {
    create(values: Partial<Media>): MediaFactoryProps {
        return {
            platformId: 1,
            name: faker.lorem.words(randomInt(1, 3)),
            url: faker.internet.url(),
            type: MediaType[Object.keys(MediaType)[randomInt(0, 2)]],
            logoUrl: faker.image.url(),
            ...values,
        }
    }
    createMany(quantity: number, partial?: Partial<Media>): MediaFactoryProps[] {
        return Array.from({ length: quantity }, () => this.create(partial))
    }
}