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







// export class QuestionarioCadastroProf {
//     id!: number;
//     descricao!: string;
//     ativo!: boolean;
//     perguntas: PerguntaCadastro[] = [];
// }

// export class PerguntaCadastro {
//     id!: number;
//     enunciado!: string;
//     opcoes: PerguntaOpcaoCadastro[] = [];
// }

// export class PerguntaOpcaoCadastro {
//     texto!: string;
//     // isCorreta: boolean = false;
// }

export interface PerguntaOpcaoCadastro {
  texto: string;
  isCorreta: boolean;
}

export interface PerguntaCadastro {
  enunciado: string;
  opcoes: PerguntaOpcaoCadastro[];
}

export interface QuestionarioCadastroProf {
  id: number;
  descricao: string;
  ativo: boolean;
  perguntas: PerguntaCadastro[];
}

