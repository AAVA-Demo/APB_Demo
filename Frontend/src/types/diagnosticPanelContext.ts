export interface PanelSectionDto {
    sectionKey: string;
    displayName: string;
}

export interface DiagnosticPanelContextDto {
    memberIssueId: string;
    isPanelAvailable: boolean;
    panelTitle: string;
    panelSections: PanelSectionDto[];
}

export interface DiagnosticPanelContainerProps {
    memberIssueId: string;
}

export interface DiagnosticPanelHeaderProps {
    panelTitle: string;
}

export interface PanelSectionViewModel {
    key: string;
    displayName: string;
}

export interface DiagnosticPanelSectionsProps {
    sections: PanelSectionViewModel[];
}
