import { useEffect, useState } from "react";
import { RemediationInstructionViewModel, RemediationInstructionsResponseDto } from "../types/remediationInstructions";
import { getRemediationInstructions, refreshRemediationInstructions } from "../api/remediationInstructionsApi";

export function useRemediationInstructions(issueId: string) {
    const [instructions, setInstructions] = useState<RemediationInstructionViewModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        getRemediationInstructions(issueId)
            .then(mapResponse)
            .then(data => {
                setInstructions(data);
                setIsLoading(false);
            })
            .catch(e => {
                setError(typeof e.message === "string" ? e.message : "Failed to load remediation instructions.");
                setIsLoading(false);
            });
    }, [issueId]);

    const refresh = () => {
        setIsLoading(true);
        refreshRemediationInstructions(issueId)
            .then(() => getRemediationInstructions(issueId))
            .then(mapResponse)
            .then(setInstructions)
            .catch(e => setError(typeof e.message === "string" ? e.message : "Failed to refresh instructions."))
            .finally(() => setIsLoading(false));
    };

    function mapResponse(dto: RemediationInstructionsResponseDto): RemediationInstructionViewModel[] {
        return dto.instructions.map(i => ({
            instructionId: i.instructionId,
            order: i.order,
            title: i.title,
            description: i.description
        })).sort((a, b) => a.order - b.order);
    }

    return { instructions, isLoading, error, refresh };
}
