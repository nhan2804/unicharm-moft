import axios from "axios";
import { useMutation } from "react-query";

const useCheckCode = () => {
  return useMutation(
    async (values) => {
      const { data } = await axios.get(`gift-clients`, {
        params: { code: values?.otp },
      });
      return data;
    },
    { onSuccess: () => {} }
  );
};

export default useCheckCode;
