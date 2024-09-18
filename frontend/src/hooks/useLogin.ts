import { useCallback } from "react";

export function useLogin() {

    const createUser = useCallback(async (email: string, password: string) => {
        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({ email, password }),
            });
            console.log('response', response)
            const user = await response.json();
            return user;
        } catch (error) {
            console.error("Failed to create user:", error);
            return null;
        }
    }, []);


    return {
        createUser,
    }
}
