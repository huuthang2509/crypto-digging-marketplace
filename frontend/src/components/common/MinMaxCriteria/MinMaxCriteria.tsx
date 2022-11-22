import { debounce } from "lodash";
import React, { useCallback, useState } from "react";

interface Props {
  title: string
  minPlaceHolder?: string
  maxPlaceHolder?: string
  minDefaultValue?: number
  maxDefaultValue?: number
  setMin: (value: number) => void
  setMax: (value: number) => void
}

const MinMaxCriteria: React.FC<Props> = (props) => {
  const { 
    title, minPlaceHolder = "Min", maxPlaceHolder = "Max", 
    minDefaultValue, maxDefaultValue, setMin = () => null, setMax = () => null
  } = props;

  const [error, setError] = useState("");

  const debounceOnChangeMin = useCallback(
    debounce((value) => {
      const validated = checkAndVerifyValidation();
      if (validated) setMin(value);
    }, 1000),
    []
  );
  const debounceOnChangeMax = useCallback(
    debounce((value) => {
      const validated = checkAndVerifyValidation();
      if (validated) setMax(value);
    }, 1000),
    []
  );

  const handleChangeMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    debounceOnChangeMin(value);
  }

  const handleChangeMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    debounceOnChangeMax(value);
  }

  const checkAndVerifyValidation = (): boolean => {
    const minElement = document.getElementById(`${title}-min-input-criteria`) as HTMLInputElement;
    const maxElement = document.getElementById(`${title}-max-input-criteria`) as HTMLInputElement;
    const minValue = minElement.value ? +minElement.value : "";
    const maxValue = maxElement.value ? +maxElement.value : "";
    if (minValue < 0) {
      setError("Min cannot be less than 0");
      return false;
    };
    if (!minValue || !maxValue) {
      setError("");
      return true;
    }
    if (minValue > maxValue) {
      setError("Min value cannot be greater than Max value");
      return false;
    };
    setError("");
    return true;
  };

  return (
    <div className="minmax-criteria-wrap">
      <div className="minmax-input">
        <input
          id={`${title}-min-input-criteria`}
          className="minmax-input"
          type="number"
          min={0}
          defaultValue={minDefaultValue}
          placeholder={minPlaceHolder}
          onChange={(e) => handleChangeMin(e)}
        />
        <p className="hyphen">-</p>
        <input
          id={`${title}-max-input-criteria`}
          className="minmax-input"
          type="number"
          defaultValue={maxDefaultValue}
          placeholder={maxPlaceHolder}
          onChange={(e) => handleChangeMax(e)}
        />
      </div>
      {
        error && <p className="error-message">{error}</p>
      }
    </div>
  );
};

export default MinMaxCriteria;
