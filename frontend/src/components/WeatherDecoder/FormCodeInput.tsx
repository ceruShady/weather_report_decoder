import { useState } from "react";
import type { FormElementDecoder } from "../../types/TypeWeatherDecoder";

export default function FormCodeInput({
  submitFn,
}: {
  submitFn: (e: React.FormEvent<FormElementDecoder>, input: string) => void;
}) {
  const [input, setInput] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.currentTarget.value);
  };

  const handleInputClear = () => {
    setInput("");
  };

  return (
    <form
      onSubmit={(e: React.FormEvent<FormElementDecoder>) => submitFn(e, input)}
      className="form-decoder"
    >
      <div className={`cont-input ${isFocused ? "input-focus" : ""}`}>
        <textarea
          name="report"
          placeholder="Enter a report"
          className="input-decoder"
          value={input}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {input ? (
          <button onClick={handleInputClear} className="btn-input-clear">
            X
          </button>
        ) : null}
      </div>
      <button type="submit" className="btn-decoder">
        Decode
      </button>
    </form>
  );
}
