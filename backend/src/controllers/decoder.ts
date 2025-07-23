import { Request, Response } from "express";
import { log } from "node:console";
import { parseCode, parseCodeString } from "../utils/UtilWeatherDecoder";
import { type TypeDecodeEntry } from "../types/TypeWeatherDecoder";

export async function getDecodedReport(req: Request, res: Response) {
  const reqCode: string = req.params.reportCode;
  const reportCode: string = reqCode
    .toUpperCase()
    .trim()
    .replaceAll("_", "/")
    .replace(/\s\s+/g, " ");

  const arrCode: string[] = reportCode.split(" ");

  // Remove "=" which marks end of reporting
  arrCode[arrCode.length - 1] = arrCode[arrCode.length - 1].replace("=", "");

  // const grouped = [];
  // let lastGroup: TypeDecodeEntry[] = [];
  // grouped.push(lastGroup);
  // let decoded: TypeDecodeEntry;

  // const arrDecode = arrCode.map((aCode) => parseCode(aCode));
  const arrDecode = parseCodeString(arrCode);

  // log(arrDecode);
  res.status(200).json(arrDecode);
}
