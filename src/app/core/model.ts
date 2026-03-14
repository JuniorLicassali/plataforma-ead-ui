export class QuestionarioUsuario {
    id!: number;
    questionario = new Questionario();
    dataAbertura!: Date;
    dataFechamento!: Date;
    finalizado!: boolean;
}

export class Questionario {
    id!: number;
    descricao!: string;
    ativo: boolean = true;
    perguntas = new Array<Pergunta>();
}

export class Pergunta {
    id!: number;
    enunciado!: string;
    respostaSelecionada: string | null = null;
    opcoes = new Array<PerguntaOpcao>();
}

export class PerguntaOpcao {
    texto!: string;
}

export class CursoResumido {
  id!: number;
  nome?: string;
  descricao?: string;
  preco?: number;
  ativo = true;
  questionario?: Questionario | null;
}

export class Curso {
  id!: number;
  nome?: string;
  descricao?: string;
  preco?: number;
  ativo = true;
  modulo = new Array<Modulo>();
  questionario = new Array<Questionario>();
}

export class Modulo {
  id?: string;
	nome?: string
	descricao?: string;
	ordem?: number;
	aulas = new Array<Aula>();
}

export class Aula {
	id?: number;
	titulo?: string;
	descricao?: string;
	ordem?: number;
	urlVideo?: string;
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

