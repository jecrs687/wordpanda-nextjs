import fs from 'fs';

export async function GET(request: Request) {
    const response = fs.readFileSync('./src/app/api/extension/prime/inject/inject.js').toString()
    return Response.json(response)
}
