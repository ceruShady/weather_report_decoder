import "../../css/WeatherDecoder.css";
import { type FormElementDecoder } from "../../types/TypeWeatherDecoder";
import { fetchDecodedReport } from "../../api/DecoderApi";
import FormCodeInput from "./FormCodeInput";
import { useState } from "react";
import DecodedGroup from "./DecodedGroup";

export default function WeatherDecoder() {
  // const handleHoverIn = (arg: number) => {
  //   console.log(arg);
  // };
  // const handleHoverOut = () => {
  //   console.log("Un Hovered!");
  // };

  const [decodedReport, setDecodedReport] = useState<string[][]>([]);

  const handleSubmit = (
    e: React.FormEvent<FormElementDecoder>,
    input: string
  ) => {
    e.preventDefault();

    fetchDecodedReport(input).then((data) => {
      setDecodedReport(data);
    });
  };

  return (
    <div className="cont-wrd-main">
      <div className="cont-decoder">
        {/* Tag item to transplant */}
        {/* <div
          className="tag-item"
          onMouseEnter={() => handleHoverIn(1)}
          onMouseLeave={handleHoverOut}
        >
          Decoder
        </div> */}
        {/* End of tag item */}

        <FormCodeInput submitFn={handleSubmit} />
      </div>
      <div className="cont-result">
        {decodedReport.length > 0
          ? decodedReport.map((aGroup) => <DecodedGroup reportGroup={aGroup} />)
          : null}{" "}
      </div>
    </div>
  );
}
