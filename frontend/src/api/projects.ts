export async function getProjects() {
    try {

        const response = await fetch(`${process.env.VITE_BACKEND_URL}//projects/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        });
        if (!response.ok) {
            return null;
        }
        return (await response.json());
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return null;
    }
}

export async function selectProject(id: string) {
    console.log('id', id)
    try {
        const response = await fetch(`${process.env.VITE_BACKEND_URL}//projects/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        });
        if (!response.ok) {
            return null;
        }
        const user = await response.json();
        console.log('User', user)
        localStorage.setItem("token", user.jwt_token);
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return null;
    }
}

export async function addProject(name: string, description: string) {
    console.log("Payload", JSON.stringify({ name, description }))
    try {
        const response = await fetch(`${process.env.VITE_BACKEND_URL}//projects/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ name, description }),
        });
    }
    catch (error) {
        console.error("Failed to add project:", error);
    }
}