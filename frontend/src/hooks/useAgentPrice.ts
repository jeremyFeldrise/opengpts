import { useQuery } from 'react-query';

export function getAgentPrice(agentName: string) {
  const { data: price, isLoading: isLoadingAgentPrice, refetch } = useQuery(
    "agentPrice",

    async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/price/agent?agent_name=${agentName}`,
        {
          headers: {
            Accept: "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const resp = await response.json();
      return resp;
    }
  );
  return {
    price,
    isLoading: isLoadingAgentPrice,
    refetchPrice: refetch
  }
}
