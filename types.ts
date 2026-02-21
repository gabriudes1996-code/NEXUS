
export type StatusLicitacao =
  | 'Pendente'
  | 'Ganhou'
  | 'Perdeu'
  | 'Desclassificado'
  | 'Em Recurso'
  | 'Recurso'
  | 'Homologado'
  | 'Contrato Assinado'
  | 'Cancelada'
  | 'Suspensa'
  | 'Frustrada'
  | 'Adiada';

export type MetodoPagamento = 'Pix' | 'Boleto' | 'Cartão' | 'Transferência';
export type ModeloContrato = 'Mensalidade' | 'Comissão (Success Fee)' | 'Avulso';

export interface ContratoAssessoria {
  id: string;
  empresa: string;
  valor: number;
  modelo: ModeloContrato;
  metodo: MetodoPagamento;
  dataAssinatura: string;
  proximoVencimento: string;
  status: 'Ativo' | 'Suspenso' | 'Finalizado';
  comprovanteUrl?: string;
}

export interface DocumentoPDF {
  id: string;
  nome: string;
  tipo: 'Proposta' | 'Edital' | 'Folder' | 'Habilitação' | 'Contrato' | 'Recurso' | 'Contra Razão';
  url: string;
}

export interface ProgressoModulos {
  moduloId: number;
  status: 'concluido' | 'em_andamento' | 'pendente';
}

export interface Licitacao {
  id: string;
  numero: string;
  orgao: string;
  cidade: string;
  estado: string;
  valor?: number;
  valorGanho?: number;
  motivoDesclassificacao?: string;
  data: string;
  hora?: string;
  portal?: string;
  resultado: StatusLicitacao;
  empresa: string;
  categoria: 'Hardware' | 'Software' | 'Serviços TI' | 'Cloud';
  documentos?: DocumentoPDF[];
  progresso?: ProgressoModulos[];
  aprovacao?: 'Sim' | 'Não' | null;
}

export interface EventoCalendario {
  id: string;
  data: string;
  hora: string;
  objeto: string;
  portal: string;
  empresa: string;
  importancia: 'alta' | 'media' | 'baixa';
}
