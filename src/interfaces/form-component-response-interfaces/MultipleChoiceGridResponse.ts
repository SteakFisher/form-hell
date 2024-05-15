type Selected = {
  [rowId: string]: Set<string>
}

export default interface MultipleChoiceGridResponse  {
  selected: Selected;
  type: "multiple-choice-grid";
}