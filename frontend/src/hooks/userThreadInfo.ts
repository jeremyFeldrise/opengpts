import { useQuery } from 'react-query';

export function getThreadInfo() {
    const { data: threadInfo, isLoading: isLoadingThreadInfo } = useQuery(
        "threadInfo",
        async () => {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/thread-info`
                , {
                    headers: {
                        Accept: "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    }
                }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }
    );
    return {
        threadInfo,
        isLoading: isLoadingThreadInfo,
    }
}