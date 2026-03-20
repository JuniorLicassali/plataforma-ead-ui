export interface QuestionarioUsuario {
  id: number;
  questionario: Questionario;
  dataAbertura: string;
  dataFechamento: string;
  finalizado: boolean;
}

export interface Questionario {
  id: number;
  descricao: string;
  ativo: boolean;
  perguntas: Pergunta[];
}

export interface Pergunta {
  id: number;
  enunciado: string;
  respostaSelecionada: string | null;
  opcoes: PerguntaOpcao[];
}

export interface PerguntaOpcao {
  texto: string;
}

export interface CursoResumido {
  id: number;
  nome?: string;
  descricao?: string;
  preco?: number;
  ativo: boolean;
  questionario?: Questionario | null;
}

export interface Curso extends CursoResumido {
  modulos: Modulo[];
  questionario: Questionario | null;
}

export interface Modulo {
  id?: string;
  nome?: string;
  descricao?: string;
  ordem?: number;
  aulas: Aula[];
}

export interface Aula {
  id?: number;
  titulo?: string;
  descricao?: string;
  ordem?: number;
  urlVideo?: string;
}

export interface Matricula {
  id?: number;
  usuarioId?: number;
  cursoId?: number;
  dataMatricula?: string;
  statusMatricula?: string;
}

export interface Pagamento {
  id: number;
  matricula: Matricula;
  dataCriacao: string;
  preco: number;
  statusPagamento: string;
  metodoPagamento: string;
  asaasInvoiceUrl: string;
}

export class Page<T> {
  content: T[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  size: number = 0;
  number: number = 0;
}





export interface PerguntaOpcaoCadastro {
  texto: string;
  isCorreta: boolean;
}

export interface PerguntaCadastro {
  id: number;
  enunciado: string;
  opcoes: PerguntaOpcaoCadastro[];
}

export interface QuestionarioCadastroProf {
  id: number;
  descricao: string;
  ativo: boolean;
  perguntas: PerguntaCadastro[];
}

