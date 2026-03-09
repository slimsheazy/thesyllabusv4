import { ArchivedSite } from '../types';

export const MOCK_ARCHIVES: ArchivedSite[] = [
  {
    id: '1',
    url: 'https://archive.org/details/libraryofalexandria',
    title: 'The Library of Alexandria (Fragmentary Reconstruction)',
    captureDate: '2024-03-04 14:20:01',
    size: '1.2 GB',
    status: 'complete',
    tags: ['history', 'lost-knowledge'],
    thumbnail: 'https://picsum.photos/seed/alexandria/400/300?grayscale'
  },
  {
    id: '2',
    url: 'https://archive.org/details/voynich-manuscript',
    title: 'The Voynich Manuscript (Digital Resonance Capture)',
    captureDate: '2024-03-04 12:15:45',
    size: '4.5 GB',
    status: 'complete',
    tags: ['cryptography', 'mystery'],
    thumbnail: 'https://picsum.photos/seed/voynich/400/300?grayscale'
  },
  {
    id: '3',
    url: 'https://archive.org/details/emerald-tablet',
    title: 'The Emerald Tablet (Vibrational Echo)',
    captureDate: '2024-03-04 09:00:00',
    size: '8.1 GB',
    status: 'pending',
    tags: ['alchemy', 'hermetic'],
    thumbnail: 'https://picsum.photos/seed/emerald/400/300?grayscale'
  },
  {
    id: '4',
    url: 'https://archive.org/details/dead-sea-scrolls',
    title: 'The Dead Sea Scrolls (Infrared Analysis)',
    captureDate: '2024-03-03 23:30:12',
    size: '12.4 GB',
    status: 'complete',
    tags: ['theology', 'manuscripts'],
    thumbnail: 'https://picsum.photos/seed/scrolls/400/300?grayscale'
  },
  {
    id: '5',
    url: 'https://archive.org/details/antikythera-mechanism',
    title: 'The Antikythera Mechanism (3D X-Ray Reconstruction)',
    captureDate: '2024-03-03 18:45:00',
    size: '2.3 GB',
    status: 'failed',
    tags: ['technology', 'astronomy'],
    thumbnail: 'https://picsum.photos/seed/antikythera/400/300?grayscale'
  }
];
