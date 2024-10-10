export async function loginUser(email: string, password: string) {
            console.log("email : " + email);
            console.log("password : " + password);
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });
        const user = await response.json();
        localStorage.setItem("token", user.jwt_token);

        return user;
    } catch (error) {
        console.error("Failed to login user:", error);
        return null;
    }
}