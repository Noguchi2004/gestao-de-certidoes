export interface CertidaoForm {
  empresa: string;
  cnpj: string;
  email: string;
  tipoDocumento: string;
  orgao: string;
  dataEmissao: string;
  fimVigencia: string;
  statusNovoVenc: string;
}

export interface ApiResponse {
  ok: boolean;
  message?: string;
  [key: string]: any;
}

export enum CertidaoType {
  FEDERAL = "Certidão Federal",
  ESTADUAL = "Certidão Estadual",
  MUNICIPAL = "Certidão Municipal",
  TRABALHISTA = "Certidão Trabalhista",
  OUTRO = "Outro"
}