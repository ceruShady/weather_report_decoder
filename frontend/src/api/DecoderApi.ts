import axios, { type AxiosResponse } from "axios";

export async function fetchDecodedReport(
  reportCode: string
): Promise<string[][]> {
  const reportString: string = reportCode.replaceAll("/", "_");
  // console.log(reportString);

  const res: AxiosResponse = await axios({
    url: "http://localhost:3000/decoder/" + reportString,
    method: "GET",
  });

  // console.log(res.data);
  return res.data;
}
