interface ElementDecoder extends HTMLFormControlsCollection {
  report: HTMLInputElement;
}

export interface FormElementDecoder extends HTMLFormElement {
  readonly elements: ElementDecoder;
}

// export type TypeResDecodedWeather = {
//   entries: TypeDecodeEntry[];
// };

export type TypeDecodeEntry = {
  code: string;
  description: string;
};
