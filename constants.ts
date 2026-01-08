import { CertidaoType } from './types';

// Agora o front fala com a API da Vercel, não mais direto com o Apps Script
export const API_URL = '/api/certidao';

export const DOC_TYPES = [
  { value: '', label: 'Selecione o tipo...' },
  { value: CertidaoType.FEDERAL, label: CertidaoType.FEDERAL },
  { value: CertidaoType.ESTADUAL, label: CertidaoType.ESTADUAL },
  { value: CertidaoType.MUNICIPAL, label: CertidaoType.MUNICIPAL },
  { value: CertidaoType.TRABALHISTA, label: CertidaoType.TRABALHISTA },
  { value: CertidaoType.OUTRO, label: CertidaoType.OUTRO },
];