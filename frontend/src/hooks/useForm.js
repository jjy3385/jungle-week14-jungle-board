import { useCallback, useState, useRef } from 'react';

export function useForm(initialvalues) {
  const initialRef = useRef(initialvalues);
  const [values, setValues] = useState(initialvalues);

  //모든 input에서 공통으로 사용하는 onChange 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  //무한요청 방지 useCallback 사용
  const reset = useCallback((newValues = initialRef.current) => {
    setValues(newValues);
  }, []);
  return { values, handleChange, reset };
}
