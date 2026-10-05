import { apiClient } from "./apiClient";
import { HealthStatus } from "../types/health";

const baseUrl = "/api/health";

export function getHealthStatus(): Promise<HealthStatus> {
    return apiClient<HealthStatus>(baseUrl, {
        method: "GET",
    });
}
