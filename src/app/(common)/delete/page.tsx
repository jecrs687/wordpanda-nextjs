"use client"

import { TOKEN_KEY } from "@constants/CONFIGS";
import { useState } from "react";
import { deleteUser } from "./deleteUser";



export default function Page() {

    const token = typeof window != 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    const [user, setUser] = useState(null);

    const delUser = async () => {
        const deletedUser = await deleteUser({ token });
        setUser(deletedUser);
    }

    if (!token) {
        return <div>Token not found</div>
    }

    return (
        <div>
            <h1>Delete</h1>
            <p>Are you sure you want to delete?</p>
            <button onClick={() => delUser()}>Delete</button>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    )
}