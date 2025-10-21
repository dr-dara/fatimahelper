
export interface Applicant {
  id: string;
  name: string;
  address: string;
  eircode: string;
  phone: string;
  applicationSent: boolean;
  applicationReturned: boolean;
  chequeLodged: boolean;
  createdAt: number;
  applicationSentAt: number | null;
  applicationReturnedAt: number | null;
  chequeLodgedAt: number | null;
}
