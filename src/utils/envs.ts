export const envs = (variable: string) =>{
    if(localStorage.getItem(variable))
        return localStorage.getItem(variable);
    if(sessionStorage.getItem(variable))
        return sessionStorage.getItem(variable);
    if(process.env[variable])
        return process.env[variable];
    if(process.env[`NEXT_PUBLIC_${variable}`])
        return process.env[`NEXT_PUBLIC_${variable}`];
    throw new Error(`Environment variable ${variable} not found`);
}