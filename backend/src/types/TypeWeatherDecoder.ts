// export type TypeResDecodedWeather = {
//   entries: TypeDecodeEntry[];
// };

export type TypeDecodeEntry = {
  code: string;
  description: string;
};

export type TypeDecodeResult = {
  text: string;
  context: string;
};

export type TypeDecodeGroup = {
  header: string[];
  info: string[];
};

export type TypeRegexParser = {
  regex: RegExp;
  descFn: (code: string) => string;
};

export type TypeVarStringObj = {
  [key: string]: string;
};
