export type CatStatus =
  | "no_campus"
  | "em_tratamento"
  | "adotado"
  | "falecido"
  | "desconhecido";
export type CatSex = "macho" | "femea" | "desconhecido";

interface Protetor {
  id: string;
  nome: string;
  email: string;
  campus: string;
  data_cadastro: string;
  gatos_cadastrados: number;
  gatos_editados: number;
  foto_url: string | null;
  forma_de_contato: string | null;
}

interface Atividade {
  data_referencia: string;
  gatos_cadastrados_mes: number;
  gatos_editados_mes: number;
}

interface Cat {
  id: string;
  nome: string;
  sexo: string;
  status: CatStatus;
  castrado: boolean;
  vacinado: boolean;
  data_ultima_vacinacao: string | null;
  local_encontrado: string | null;
  caracteristicas: string | null;
  fotos: string[] | null;
  data_adocao_falecimento: Date | null;
  mensagem: string | null;
}

export type { Protetor, Atividade, Cat };
