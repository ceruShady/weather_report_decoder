import axios, { type AxiosResponse } from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function fetchDecodedReport(
  reportCode: string
): Promise<string[][]> {
  const reportString: string = reportCode.replaceAll("/", "_");
  // console.log(reportString);

  const res: AxiosResponse = await axios({
    url: API_URL + "/decoder/" + reportString,
    method: "GET",
  });

  // console.log(res.data);
  return res.data;
}
