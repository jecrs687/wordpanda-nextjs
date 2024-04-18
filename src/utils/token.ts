import { decode, sign } from 'jsonwebtoken';
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
        id: string,
        name: string,
        email: string,
        role: string,
    } | undefined = decode(token);
    return { decoded };
}


