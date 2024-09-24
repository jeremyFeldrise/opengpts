export async function getProjects() {
    try {

        const response = await fetch(`/projects/`, {
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
    try {
        const response = await fetch(`/projects/${id}`, {
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