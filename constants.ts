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

// Lista fixa de empresas para o dropdown
export const COMPANIES = [
  { value: '', label: 'Selecione a empresa...' },
  { value: 'AVA RJ', label: 'AVA RJ' },
  { value: 'AVA SP', label: 'AVA SP' },
  { value: 'AVA SP - GUARULHOS', label: 'AVA SP - GUARULHOS' },
  { value: 'BURN', label: 'BURN' },
  { value: 'LIMPPANO', label: 'LIMPPANO' },
  { value: 'LIMPPANO - RS', label: 'LIMPPANO - RS' },
  { value: 'LIMPPANO - TÊXTIL', label: 'LIMPPANO - TÊXTIL' },
  { value: 'VAN', label: 'VAN' },
];

// Mapa empresa -> CNPJ para autopreencher
export const COMPANY_CNPJ_MAP: Record<string, string> = {
  'AVA RJ': '17.336.663/0001-84',
  'AVA SP': '11.880.018/0001-41',
  'AVA SP - GUARULHOS': '11.880.018/0002-22',
  'BURN': '11.636.336/0001-61',
  'LIMPPANO': '33.033.556/0001-33',
  'LIMPPANO - RS': '33.033.556/0007-29',
  'LIMPPANO - TÊXTIL': '33.033.556/0006-48',
  'VAN': '19.047.654/0001-07',
};
