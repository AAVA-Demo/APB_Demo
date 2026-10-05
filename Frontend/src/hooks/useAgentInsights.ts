import { useEffect, useState } from "react";
import { AgentInsightResponseDto } from "../types/agentInsight";
import { getAgentInsights } from "../api/agentInsightApi";

export function useAgentInsights(interactionId: string) {
    const [data, setData] = useState<AgentInsightResponseDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!interactionId) {
            return;
        }

        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const result = await getAgentInsights(interactionId);
                if (!cancelled) {
                    setData(result);
                }
            } catch {
                if (!cancelled) {
                    setError("Unable to load agent guidance. Please retry.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [interactionId]);

    return { data, loading, error };
}
