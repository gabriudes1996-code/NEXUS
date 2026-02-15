
import { Licitacao, EventoCalendario, DocumentoPDF } from './types';

const hoje = new Date().toISOString().split('T')[0];
const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const anteontem = new Date(Date.now() - 172800000).toISOString().split('T')[0];
const semanaPassada = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const mesPassado = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const amanha = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const depoisDeAmanha = new Date(Date.now() + 172800000).toISOString().split('T')[0];

const mockDocs: DocumentoPDF[] = [
  { id: 'd1', nome: 'Edital de Abertura', tipo: 'Edital', url: '#' },
  { id: 'd2', nome: 'Proposta Comercial', tipo: 'Proposta', url: '#' },
  { id: 'd3', nome: 'Folder Técnico', tipo: 'Folder', url: '#' },
];

const createModules = (progress: number) => Array.from({ length: 9 }, (_, i) => ({
  moduloId: i + 1,
  status: i < progress ? 'concluido' : i === progress ? 'em_andamento' : 'pendente' as any
}));

export const mockLicitacoes: Licitacao[] = [
  { 
    id: '1', 
    numero: 'PE 045/2024', 
    orgao: 'Ministério da Saúde',
    cidade: 'Brasília', 
    estado: 'DF', 
    valor: 1250000.00, 
    data: hoje, 
    resultado: 'Pendente', 
    empresa: 'Azul Papel',
    categoria: 'Cloud',
    progresso: createModules(4),
    documentos: mockDocs
  },
  { 
    id: '2', 
    numero: 'PE 112/2024', 
    orgao: 'TRT 2ª Região',
    cidade: 'São Paulo', 
    estado: 'SP', 
    valor: 850000.00, 
    data: ontem, 
    resultado: 'Ganhou', 
    empresa: 'Azul Tec',
    categoria: 'Hardware',
    progresso: createModules(9),
    documentos: mockDocs
  },
  { 
    id: '3', 
    numero: 'CP 009/2024', 
    orgao: 'Prefeitura de Curitiba',
    cidade: 'Curitiba', 
    estado: 'PR', 
    valor: 2100000.00, 
    data: anteontem, 
    resultado: 'Perdeu', 
    empresa: 'Mac Copiadora',
    categoria: 'Software',
    progresso: createModules(7),
    documentos: mockDocs
  },
  { 
    id: '4', 
    numero: 'PE 312/2024', 
    orgao: 'Câmara Municipal BH',
    cidade: 'Belo Horizonte', 
    estado: 'MG', 
    valor: 450000.00, 
    data: semanaPassada, 
    resultado: 'Ganhou', 
    empresa: 'Azul Papel',
    categoria: 'Serviços TI',
    progresso: createModules(9),
    documentos: mockDocs
  },
  { 
    id: '5', 
    numero: 'PE 002/2024', 
    orgao: 'UFPE',
    cidade: 'Recife', 
    estado: 'PE', 
    valor: 320000.00, 
    data: mesPassado, 
    resultado: 'Desclassificado', 
    empresa: 'Azul Tec',
    categoria: 'Hardware',
    progresso: createModules(5),
    documentos: mockDocs
  },
  { 
    id: '6', 
    numero: 'PE 99/2024', 
    orgao: 'Exército Brasileiro',
    cidade: 'Porto Alegre', 
    estado: 'RS', 
    valor: 1100000.00, 
    data: '2023-12-12', 
    resultado: 'Desclassificado', 
    empresa: 'Mac Copiadora',
    categoria: 'Software',
    progresso: createModules(4),
    documentos: mockDocs
  },
  { 
    id: '7', 
    numero: 'PE 88/2024', 
    orgao: 'Polícia Federal',
    cidade: 'Salvador', 
    estado: 'BA', 
    valor: 750000.00, 
    data: '2024-05-10', 
    resultado: 'Perdeu', 
    empresa: 'Azul Tec',
    categoria: 'Cloud',
    progresso: createModules(8),
    documentos: mockDocs
  }
];

export const mockEventosCalendario: EventoCalendario[] = [
  { id: 'e1', data: hoje, hora: '09:00', objeto: 'Renovação Microsoft 365', portal: 'ComprasNet', empresa: 'Azul Tec', importancia: 'alta' },
  { id: 'e2', data: hoje, hora: '10:30', objeto: 'Aquisição de Notebooks i7', portal: 'Licitações-e', empresa: 'Azul Papel', importancia: 'media' },
  { id: 'e3', data: hoje, hora: '14:00', objeto: 'Outsourcing de Impressão', portal: 'BBMNet', empresa: 'Mac Copiadora', importancia: 'alta' },
  { id: 'e4', data: hoje, hora: '16:30', objeto: 'Suporte Técnico Nível 3', portal: 'ComprasNet', empresa: 'Azul Tec', importancia: 'media' },
  { id: 'e5', data: amanha, hora: '09:00', objeto: 'Expansão de Data Center', portal: 'Licitações-e', empresa: 'Mac Copiadora', importancia: 'alta' },
  { id: 'e6', data: amanha, hora: '11:00', objeto: 'Licenciamento Adobe CC', portal: 'ComprasNet', empresa: 'Azul Papel', importancia: 'media' },
  { id: 'e7', data: depoisDeAmanha, hora: '10:00', objeto: 'Servidores de Alta Performance', portal: 'BBMNet', empresa: 'Azul Tec', importancia: 'alta' },
];
