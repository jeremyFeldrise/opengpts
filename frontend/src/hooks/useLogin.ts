import { useQuery, useQueryClient } from "react-query";

import { login } from "../api/auth";


export function login(email: string, password: string) {

    const { data: user, isLoading: isLoadingAssistant } = useQuery(
        ["email", "password"],
        () => login(email as string, password as string),
        {
            enabled: !!email && !!password,
        },
    );

    return {
        user,
        isLoading: isLoadingAssistant,
    }
}
