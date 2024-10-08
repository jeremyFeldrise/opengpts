
interface ApiKeys {
    openaiApiKey: string
    anthropicApiKey: string
    ydcApiKey: string
    taviliApiKey: string
}

export async function getApiKeys() {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chatbot_configuration/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        console.log('data', data)
        return (data);
    } catch (error) {
        console.error("Failed to fetch api keys:", error);
        return null;
    }
}

export async function updateKeys(keys: ApiKeys) {
    console.log('Update  request keys', keys)
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chatbot_configuration/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(keys),
        });
        if (!response.ok) {
            return null;
        }
        return (await response.json());
    } catch (error) {
        console.error("Failed to update api keys:", error);
        return null;
    }
}