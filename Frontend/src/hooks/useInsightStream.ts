import { useEffect, useState } from "react";
import { InsightUpdateDto } from "../types/insightStream";
import { openInsightStream } from "../api/insightStreamApi";

export function useInsightStream(interactionId: string) {
    const [data, setData] = useState<InsightUpdateDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [updated, setUpdated] = useState<boolean>(false);

    useEffect(() => {
        if (!interactionId) {
            return;
        }

        setLoading(true);
        setError(null);
        setUpdated(false);

        const source = openInsightStream(
            interactionId,
            (update) => {
                setData(update);
                setUpdated(true);
                setLoading(false);
            },
            () => {
                setError("Real-time updates unavailable");
                setLoading(false);
            }
        );

        return () => {
            source.close();
        };
    }, [interactionId]);

    return { data, loading, error, updated };
}
