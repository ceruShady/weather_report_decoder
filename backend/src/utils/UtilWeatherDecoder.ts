import type {
  TypeDecodeGroup,
  TypeDecodeEntry,
  TypeRegexParser,
  TypeVarStringObj,
} from "../types/TypeWeatherDecoder";

const ReportTypeCode: TypeVarStringObj = {
  METAR: "Meteorological Aerodrome Report",
  SPECI: "Special Aviation Weather Report",
  TAF: "Terminal Aerodrome Forecast",
  AMD: "Amendments",
  COR: "Corrections",
};

const NewSectionCode: TypeVarStringObj = {
  TEMPO: "Expected temporary change in weather conditions",
  BECMG: "Expected change in weather conditions",
  RMK: "Remark",
};

const RegexLocation = /^[A-Z]{4}$/;
const RegexReportTime = /^[0-9]{6}Z$/;
const RegexValidity = /^[0-9]{4}\/[0-9]{4}$/;

const StaticCodes: TypeVarStringObj = {
  METAR: "Meteorological Aerodrome Report",
  SPECI: "Special Aviation Weather Report",
  TAF: "Terminal Aerodrome Forecast",
  AUTO: "Automated report",
  NSW: "No significant weather",
  SKC: "Sky clear (manual station)",
  NCD: "No cloud detected",
  CLR: "Sky clear (automated station)",
  NSC: "No significant clouds",
  NOSIG: "No signification change",
  TEMPO: "Expected temporary change in weather conditions",
  BECMG: "Expected change in weather conditions",
  CAVOK: "Ceiling And Visibility OK",
  AMD: "Amendments",
  COR: "Corrections",
  NIL: "Not available",
  CNL: "Cancelled",
  AO1: "Observation from AO1 automated weather station",
  AO2: "Observation from AO2 automated weather station",
};

const RegexCode: TypeRegexParser[] = [
  { regex: /^[A-Z]{4}$/, descFn: parseLocationString },
  // { regex: /^[0-9]{6}Z$/, descFn: parseReportTimeString },
  // { regex: /^[0-9]{4}\/[0-9]{4}$/, descFn: parseReportValidString },
  { regex: /^[0-9]{5}KT$/, descFn: parseWindSpeedString },
  // { regex: /^[0-9]{5,6}KT$/, descFn: parseWindSpeedString },
  // { regex: /^[0-9]{5,6}MPS$/, descFn: parseWindSpeedString },
  // { regex: /^[0-9]{5,6}KMH$/, descFn: parseWindSpeedString },
  { regex: /^[0-9]{5}G[0-9]{2}KT$/, descFn: parseWindGustString },
  // { regex: /^[0-9]{5}G[0-9]{2,3}KT$/, descFn: parseWindGustString },
  { regex: /^VRB[0-9]{2}KT$/, descFn: parseVariableWindString },
  { regex: /^[0-9]{3}V[0-9]{3}$/, descFn: parseWindVariationString },
  { regex: /^[0-9]{4}$/, descFn: parseVisibilityString },
  { regex: /[0-9]SM$/, descFn: parseVisibilityStringSM },
  { regex: /^[A-Z]{2,3}[0-9]{3}$/, descFn: parseCloudeString },
  { regex: /^[A-Z]{2,3}[0-9]{3}[A-Z]{2,3}$/, descFn: parseCloudeString },
  // { regex: /(FM|TL)/, descFn: parseFromTilString },
  { regex: /^FM[0-9]{4}$/, descFn: parseFromString },
  { regex: /^TL[0-9]{4}$/, descFn: parseTilString },
  { regex: /^([M]?)[0-9]{2}\/([M]?)[0-9]{2}$/, descFn: parseTempString },
  { regex: /^Q[0-9]{4}$/, descFn: parseAltiStringQ },
  { regex: /^A[0-9]{4}$/, descFn: parseAltiStringA },
  { regex: /^PROB[0-9]{2}$/, descFn: parseProbabilityString },
];

// const DistCodeToUnit: TypeVarStringObj = {
//   KT: "knots",
//   MPS: "m/s",
//   KMH: "km/h",
// };

const CloudCode: TypeVarStringObj = {
  SKC: "Sky clear (manual stations)",
  NCD: "No cloud detected",
  CLR: "Sky clear (automated station)",
  NSC: "No significant clouds",
  FEW: "Few clouds",
  SCT: "Scattered clouds",
  BKN: "Broken clouds",
  OVC: "Overcast",
  TCU: "Towering cumulus",
  CB: "Cumulonimbus",
  VV: "Vertical visibility",
};

const WeatherCode: TypeVarStringObj = {
  VC: "In the vicinity",
  RE: "Recent",
  MI: "Shallow",
  PR: "Partial",
  BC: "Patches",
  DR: "Low drifting",
  BL: "Blowing level",
  SH: "Showers",
  TS: "Thunderstorm",
  FZ: "Freezing",
  DZ: "Drizzle",
  RA: "Rain",
  SN: "Snow",
  SG: "Snow gains",
  GS: "Graupel",
  GR: "Hail",
  PL: "Ice pellets",
  IC: "Ice crystals",
  UP: "Unknown precipitation",
  FG: "Fog",
  BR: "Mist",
  HZ: "Haze",
  VA: "Volcanic ash",
  DU: "Widespread dust",
  FU: "Smoke",
  PY: "Spray",
  SQ: "Squall",
  PO: "Dust",
  DS: "Duststorm",
  SS: "Sandstorm",
  FC: "Funnel cloud",
};

// const FmTlCode: TypeVarStringObj = {
//   FM: "From",
//   TL: "Til",
// };

export function parseCodeString(code: string[]): string[][] {
  const groupArr: string[][] = [];
  let curGroup: string[] = [];
  groupArr.push(curGroup);

  code.forEach((aCode) => {
    if (aCode === "TEMPO" || aCode === "BECMG" || aCode === "RMK") {
      curGroup = [];
      groupArr.push(curGroup);
      curGroup.push(aCode);
    } else {
      curGroup.push(aCode);
    }
  });

  const decodedArr: string[][] = [];
  groupArr.forEach((aGroup) => {
    decodedArr.push(parseCodeGroup(aGroup));
  });

  // console.log(decodedArr);
  return decodedArr;
}

function parseCodeGroup(codeGroup: string[]): string[] {
  const decodedGroup: string[] = [];

  // Decode type and location
  let type: string = "";
  // for(let i = 0;i < codeGroup.length;i++){

  // }

  while (codeGroup.length !== 0) {
    if (ReportTypeCode[codeGroup[0]]) {
      type = type.concat(ReportTypeCode[codeGroup[0]] + " ");
      codeGroup.splice(0, 1);
      continue;
    }

    break;
  }

  let location: string = "";
  if (RegexLocation.test(codeGroup[0])) {
    location = codeGroup[0];
    codeGroup.splice(0, 1);
  }

  if (type || location) {
    decodedGroup.push(
      `${type ? type : "Report "}from ${
        location ? location : "unknown aerodrome"
      }`
    );
  }

  // Decode report change type for TEMPO and BECMG
  if (NewSectionCode[codeGroup[0]]) {
    decodedGroup.push(`${NewSectionCode[codeGroup[0]]}`);
    codeGroup.splice(0, 1);
  }

  // Decode report time and valid duration
  let reportTime: string = "";
  if (RegexReportTime.test(codeGroup[0])) {
    reportTime = parseReportTimeString(codeGroup[0]);
    codeGroup.splice(0, 1);
  }

  let validTime: string = "";
  if (RegexValidity.test(codeGroup[0])) {
    validTime = parseReportValidString(codeGroup[0]);

    if (reportTime) validTime = validTime.replace("V", ", v");
    codeGroup.splice(0, 1);
  }

  if (reportTime || validTime) {
    decodedGroup.push(`${reportTime}${validTime}`);
  }

  // Decode remaining code
  // Decode report time and valid time as backup incase header parsing fails
  codeGroup.forEach((aCode) => {
    decodedGroup.push(
      parseTimeCode(aCode) ||
        parseStaticCode(aCode) ||
        parseWeatherString(aCode) ||
        parseRegexCode(aCode) ||
        `Unknown code: ${aCode}`
    );
  });

  return decodedGroup;
}

export function parseCode(code: string): TypeDecodeEntry {
  const description =
    parseStaticCode(code) ||
    parseWeatherString(code) ||
    parseRegexCode(code) ||
    "Unknown code";

  return {
    code: code,
    description: description,
  };
}

function parseTimeCode(code: string): string {
  let reportTime: string = "";
  if (RegexReportTime.test(code)) {
    reportTime = parseReportTimeString(code);
  }

  let validTime: string = "";
  if (RegexValidity.test(code)) {
    validTime = parseReportValidString(code);

    if (reportTime) validTime = validTime.replace("V", ", v");
  }
  if (reportTime || validTime) {
    return `${reportTime}${validTime}`;
  }
  return "";
}

function parseStaticCode(code: string): string {
  return StaticCodes[code];
}

function parseRegexCode(code: string): string {
  for (const aRegex of RegexCode) {
    if (aRegex.regex.test(code)) {
      return aRegex.descFn(code);
    }
  }

  return "";
}

function parseLocationString(code: string): string {
  return `Reporting aerodrome: ${code}`;
}

function parseReportTimeString(code: string): string {
  return `Reported at ${formatDateTimeString(code.slice(0, 6))}`;
}

function parseReportValidString(code: string): string {
  const timeArr = code.split("/");
  return `Valid from ${formatDateTimeString(
    timeArr[0]
  )} to ${formatDateTimeString(timeArr[1])}`;
}

function parseWindSpeedString(code: string): string {
  // const unit = DistCodeToUnit[code.slice(-2)] || DistCodeToUnit[code.slice(-3)];

  const direction = code.slice(0, 3);
  const speed = code.slice(3, 5);

  // let speed;
  // if (/[A-Za-z]/.test(code.slice(3, 6))) {
  //   speed = code.slice(3, 5);
  // } else {
  //   speed = code.slice(3, 6);
  // }

  return `Wind ${formatLeadingZeroString(speed)} kt from ${direction} deg`;
  // return `Wind ${speed}${unit} from ${direction}`;
}

function parseWindVariationString(code: string): string {
  const dirFrom = code.slice(0, 3);
  const dirTo = code.slice(-3);

  return `Wind direction varying between ${dirFrom} deg and ${dirTo} deg`;
}

function parseWindGustString(code: string): string {
  const direction = code.slice(0, 3) + "deg";
  const speed = code.slice(3, 5);
  const gust = code.slice(6, 8);

  return `Wind ${formatLeadingZeroString(
    speed
  )} kt from ${direction}, gust ${gust} kt `;
}

function parseVariableWindString(code: string): string {
  const speed = code.slice(3, 5);
  return `Wind ${formatLeadingZeroString(speed)} kt from variable directions`;
}

function parseVisibilityString(code: string): string {
  let visibilityString: string;
  if (code === "9999") visibilityString = "10000 m or more";
  else visibilityString = `${code} m`;

  return `Visibility ${visibilityString}`;
}

function parseVisibilityStringSM(code: string): string {
  return `Visibility ${code.slice(0, -2)} statue mile`;
}

function parseCloudeString(code: string): string {
  const codeIndexMod = CloudCode[code.slice(0, 3)] ? 0 : 1;

  const cloud = code.slice(0, 3 - codeIndexMod);
  const flightLevel = code.slice(3, 6 - codeIndexMod);
  const supCloud = CloudCode[code.slice(6 - codeIndexMod)];

  if (!CloudCode[cloud]) return "";

  return `${CloudCode[cloud]} at ${formatFlightLevelString(flightLevel)}${
    supCloud ? `, ${supCloud}` : ""
  }`;
}

function parseFromString(code: string): string {
  return `Expected change in weather conditions from ${formatDateTimeString(
    code.slice(2)
  )}`;
}

function parseTilString(code: string): string {
  return `Expected change in weather conditions til ${formatDateTimeString(
    code.slice(2)
  )}`;
}

function parseTempString(code: string): string {
  const tempArr = code.split("/");
  const temperture = formatLeadingZeroString(tempArr[0].slice(-2));
  const dewpoint = formatLeadingZeroString(tempArr[1].slice(-2));

  return `Temperature ${
    tempArr[0].includes("M") ? "-" : ""
  }${temperture} °C Dewpoint ${
    tempArr[1].includes("M") ? "-" : ""
  }${dewpoint} °C`;
}

function parseAltiStringQ(code: string): string {
  const altimeterCode = code.slice(1);
  return `Altimeter setting ${formatLeadingZeroString(altimeterCode)} hpa`;
}

function parseAltiStringA(code: string): string {
  const altimeterCode = code.slice(1);
  const altimeterSetting = Number(altimeterCode) / 100;
  return `Altimeter setting ${altimeterSetting} inHg`;
}

function parseProbabilityString(code: string): string {
  const probability = code.slice(4);

  return `Probability ${probability} %`;
}

function parseWeatherString(code: string): string {
  // Tornadic activity
  // Thunderstorm
  // Most dominating weather
  // Precipitation
  // Obscuration

  let weatherCodeLastIndex;
  const intensity =
    code[0] === "+" ? "Heavy " : code[0] === "-" ? "Light " : "";

  if (intensity) {
    code = code.slice(1);
  }

  let weatherArr: string[] = [];
  let weatherString;
  while (code) {
    weatherString = WeatherCode[code.slice(0, 2)];

    if (weatherString) {
      weatherArr.push(weatherString);
      code = code.slice(2);
    } else {
      break;
    }
  }

  const regexB4Digit = /B[0-9]{4}/;
  const regexB2Digit = /B[0-9]{2}/;
  const regexE4Digit = /E[0-9]{4}/;
  const regexE2Digit = /E[0-9]{2}/;

  let bStartIndex: number;
  let endStartIndex: number;

  let beganCode: string = "";
  let beganString: string = "";
  let endCode: string = "";
  let endString: string = "";

  // Parse and remove began code
  if (regexB4Digit.test(code)) {
    bStartIndex = code.search(regexB4Digit);
    beganCode = code.slice(bStartIndex, bStartIndex + 5);
    beganString = `; Began at ${formatDateTimeString(beganCode.slice(1))}`;
  } else if (regexB2Digit.test(code)) {
    bStartIndex = code.search(regexB2Digit);
    beganCode = code.slice(bStartIndex, bStartIndex + 3);
    beganString = `; Began at ${beganCode.slice(1)} minutes pass the hour`;
  }

  if (beganCode) code = code.replace(beganCode, "");

  // Parse and remove end code
  if (regexE4Digit.test(code)) {
    endStartIndex = code.search(regexE4Digit);
    endCode = code.slice(endStartIndex, endStartIndex + 5);
    endString = `; Ended at ${formatDateTimeString(endCode.slice(1))}`;
  } else if (regexE2Digit.test(code)) {
    endStartIndex = code.search(regexE2Digit);
    endCode = code.slice(endStartIndex, endStartIndex + 3);
    endString = `; Ended at ${endCode.slice(1)} minutes pass the hour`;
  }

  if (endCode) code = code.replace(endCode, "");

  if (code) return "";
  else return `${intensity}${weatherArr.join(", ")}${beganString}${endString}`;
}

// Formatter

function formatDateTimeString(code: string): string {
  if (code.length === 4) return `${code.slice(0, 2)}:${code.slice(2)} UTC`;
  else if (code.length === 6)
    return `${code.slice(0, 2)} ${code.slice(2, 4)}:${code.slice(4)} UTC`;
  else return "ERROR";
}

function formatLeadingZeroString(aString: string): string {
  return aString.replace(/^0+/, "");
}

function formatFlightLevelString(flightLevel: string): string {
  return flightLevel.replace(/^0+/, "").concat("00 ft");
}
