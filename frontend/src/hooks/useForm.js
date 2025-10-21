import { useState } from 'react';

export function useForm(initialvalues) {
  const [values, setValues] = useState(initialvalues);

  //모든 input에서 공통으로 사용하는 onChange 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  // initialvalues가 기본값으로 적용됨
  const reset = (newValues = initialvalues) => {
    setValues(newValues);
  };
  return { values, handleChange, reset };
}
