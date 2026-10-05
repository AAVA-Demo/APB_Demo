import { useEffect, useState } from "react";
import { getHealthStatus } from "../api/healthApi";
import { HealthStatus } from "../types/health";

export function useHealthStatus() {
    const [data, setData] = useState<HealthStatus | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        getHealthStatus()
            .then(setData)
            .catch(e => setError(e.message ?? "Error"))
            .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}
