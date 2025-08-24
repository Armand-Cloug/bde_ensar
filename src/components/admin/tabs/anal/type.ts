export type CoursNode = {
  id: string;
  title: string;
  description: string | null;
  filePath: string;
  createdAt: string;
};

export type MatiereNode = {
  id: string;
  nomMatiere: string;
  cours: CoursNode[];
};

export type UeNode = {
  id: string;
  ueNumber: number;
  nomUe: string | null;
  matieres: MatiereNode[];
};

export type SemestreNode = {
  id: string;
  semestre: string; // ex: "S5"
  ues: UeNode[];
};

export type FormationNode = {
  id: string;
  nom: string;
  semestres: SemestreNode[];
};
