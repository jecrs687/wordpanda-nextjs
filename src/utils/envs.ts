const environment:{ [key: string]: any }  = {}

export const envs = new Proxy(environment, {
    get(target, name) {
            const variable = name.toString();
            if(target[variable])
                return target[variable];
            if(process.env[variable])
                return process.env[variable];
            const localValue = localStorage.getItem(variable);
            if(typeof localValue == 'string')
                return JSON.parse(localValue);
            if(process.env[`NEXT_PUBLIC_${variable}`])
                    return process.env[`NEXT_PUBLIC_${variable}`];
        },
    set(target, name, value) {
        const paramName  = name.toString();
        target[paramName] = value;
        localStorage.setItem(name.toString(), JSON.stringify(value));
        return true;
    }
});

