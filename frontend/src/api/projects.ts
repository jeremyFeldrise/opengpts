export async function getProjects() {
    try {

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        });
        if (!response.ok) {
            return null;
        }
        const projects = await response.json();
        ;
        return (projects);
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return null;
    }
}

export async function selectProject(id: string, projectName: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        });
        if (!response.ok) {
            return null;
        }
        const user = await response.json();
        localStorage.setItem("token", user.jwt_token);
        localStorage.setItem("project_name", projectName);
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return null;
    }
}

export async function addProject(name: string, description: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/`, {
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

export async function deleteProject(id: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        });
    }
    catch (error) {
        console.error("Failed to delete project:", error);
    }
}

export async function updateProject(id: string, name: string, description: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ name, description }),
        });
    }
    catch (error) {
        console.error("Failed to update project:", error);
    }
}