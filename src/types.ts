export interface ArchivedSite {
  id: string;
  url: string;
  title: string;
  captureDate: string;
  size: string;
  status: 'complete' | 'pending' | 'failed';
  tags: string[];
  thumbnail?: string;
}

export interface ArchiveStats {
  totalCaptures: number;
  totalSize: string;
  lastUpdated: string;
}
