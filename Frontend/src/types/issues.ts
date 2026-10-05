export type IssueSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Issue {
  id: string;
  title: string;
  severity: IssueSeverity;
  status: string;
}
