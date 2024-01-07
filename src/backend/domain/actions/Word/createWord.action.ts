"use server";
import prisma from "@infra/config/database";
import { Word } from "@prisma/client";

export async function createWords(wordDto: Word[]) {
    try {
        const inserted = await prisma.word.createMany({
            data: wordDto
        })
        return { msg: 'ok', data: { words: inserted } }

    } catch (err) {
        if (err?.code === 'P2002') {
            return ({
                msg: 'Error',
                errors: {
                    email: "Email already exists"
                },
            });
        }
        return ({
            msg: 'Error',
            errors: {
                error: JSON.stringify(err)
            },
        });
    }
}