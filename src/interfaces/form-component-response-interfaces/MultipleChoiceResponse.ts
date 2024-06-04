export type MultipleChoiceOther = {
  [key: string]: string;
};

export interface MultipleChoiceResponse {
  selected: MultipleChoiceOther;
  type: "multiple-choice";
}