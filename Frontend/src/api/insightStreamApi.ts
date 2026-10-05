import { InsightUpdateDto } from "../types/insightStream";

export function openInsightStream(interactionId: string, onMessage: (update: InsightUpdateDto) => void, onError: () => void): EventSource {
    const source = new EventSource(`/api/insights/stream/${encodeURIComponent(interactionId)}`);

    source.onmessage = (event) => {
        try {
            const data: InsightUpdateDto = JSON.parse(event.data);
            onMessage(data);
        } catch {
            // ignore parse errors
        }
    };

    source.onerror = () => {
        onError();
        source.close();
    };

    return source;
}
