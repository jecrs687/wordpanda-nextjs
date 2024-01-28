import { decode, sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { envs } from './envs';
export const generateToken = (user) => {
    const token = sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        envs['JWT_SECRET'], {
        expiresIn: '7d',
    });
    return token;
}
export const validateToken = (token) => {
    token = token?.value || token;
    const decoded: {
        id: number,
        name: string,
        email: string,
        role: string,
    } | undefined = decode(token);
    return { decoded };
}

export const validateTokenMiddleware = async (req: Request, res: Response) => {
    const token = cookies().get('token');
    if (!token) {
        return Response.json({ error: { message: 'No token provided' } }, { status: 401 })

    }
    const { decoded } = validateToken(token);
    if (!decoded) {
        return Response.json({ error: { message: 'Invalid token' } }, { status: 401 })
    }
    return { decoded }
}

