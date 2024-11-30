import { Document } from '../types';

export const generateMockDocuments = (): Document[] => {
  const mockDocuments: Document[] = [
    // Documents professionnels
    {
      id: '1',
      name: 'Rapport annuel 2023',
      date: '2023-12-31',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
      fileType: 'application/pdf',
      uploadDate: '2024-01-02T09:00:00Z',
      userId: '1'
    },
    {
      id: '2',
      name: 'Plan stratégique 2024',
      date: '2024-01-15',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
      fileType: 'application/pdf',
      uploadDate: '2024-01-15T10:30:00Z',
      userId: '1'
    },
    {
      id: '3',
      name: 'Présentation projet X',
      date: '2024-01-20',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12',
      fileType: 'application/pdf',
      uploadDate: '2024-01-20T14:15:00Z',
      userId: '1'
    },
    {
      id: '4',
      name: 'Budget prévisionnel 2024',
      date: '2024-01-10',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3',
      fileType: 'application/pdf',
      uploadDate: '2024-01-10T11:20:00Z',
      userId: '1'
    },
    {
      id: '5',
      name: 'Compte-rendu réunion équipe',
      date: '2024-01-22',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db',
      fileType: 'application/pdf',
      uploadDate: '2024-01-22T16:45:00Z',
      userId: '1'
    },
    {
      id: '6',
      name: 'Analyse concurrentielle',
      date: '2024-01-18',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      fileType: 'application/pdf',
      uploadDate: '2024-01-18T15:30:00Z',
      userId: '1'
    },
    {
      id: '7',
      name: 'Planning Q1 2024',
      date: '2024-01-05',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1506784926709-22f1ec395907',
      fileType: 'application/pdf',
      uploadDate: '2024-01-05T09:45:00Z',
      userId: '1'
    },
    {
      id: '8',
      name: 'Organigramme département',
      date: '2024-01-12',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
      fileType: 'image/png',
      uploadDate: '2024-01-12T13:20:00Z',
      userId: '1'
    },
    {
      id: '9',
      name: 'Procédures internes',
      date: '2024-01-08',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
      fileType: 'application/pdf',
      uploadDate: '2024-01-08T10:15:00Z',
      userId: '1'
    },
    {
      id: '10',
      name: 'Rapport mensuel décembre',
      date: '2024-01-03',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      fileType: 'application/pdf',
      uploadDate: '2024-01-03T14:30:00Z',
      userId: '1'
    },
    {
      id: '11',
      name: 'Formation sécurité',
      date: '2024-01-25',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
      fileType: 'application/pdf',
      uploadDate: '2024-01-25T11:00:00Z',
      userId: '1'
    },
    {
      id: '12',
      name: 'Guide utilisateur logiciel',
      date: '2024-01-16',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db',
      fileType: 'application/pdf',
      uploadDate: '2024-01-16T15:45:00Z',
      userId: '1'
    },
    {
      id: '13',
      name: 'Contrat fournisseur',
      date: '2024-01-19',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3',
      fileType: 'application/pdf',
      uploadDate: '2024-01-19T09:30:00Z',
      userId: '1'
    },
    {
      id: '14',
      name: 'Plan de formation',
      date: '2024-01-11',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db',
      fileType: 'application/pdf',
      uploadDate: '2024-01-11T16:20:00Z',
      userId: '1'
    },
    {
      id: '15',
      name: 'Objectifs commerciaux',
      date: '2024-01-04',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      fileType: 'application/pdf',
      uploadDate: '2024-01-04T10:45:00Z',
      userId: '1'
    },
    {
      id: '16',
      name: 'Inventaire matériel',
      date: '2024-01-17',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
      fileType: 'application/pdf',
      uploadDate: '2024-01-17T13:15:00Z',
      userId: '1'
    },
    {
      id: '17',
      name: 'Plan de communication',
      date: '2024-01-23',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
      fileType: 'application/pdf',
      uploadDate: '2024-01-23T11:30:00Z',
      userId: '1'
    },
    {
      id: '18',
      name: 'Étude de marché',
      date: '2024-01-09',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      fileType: 'application/pdf',
      uploadDate: '2024-01-09T14:45:00Z',
      userId: '1'
    },
    {
      id: '19',
      name: 'Charte graphique',
      date: '2024-01-24',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
      fileType: 'application/pdf',
      uploadDate: '2024-01-24T15:00:00Z',
      userId: '1'
    },
    {
      id: '20',
      name: 'Plan d\'action commercial',
      date: '2024-01-26',
      category: 'professional',
      file: null,
      fileUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
      fileType: 'application/pdf',
      uploadDate: '2024-01-26T10:00:00Z',
      userId: '1'
    }
  ];

  return mockDocuments;
};