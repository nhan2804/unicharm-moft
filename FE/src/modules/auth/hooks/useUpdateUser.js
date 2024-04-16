import { useMutation } from "react-query";

import { updateInfo } from "../services/auth";

const useUpdateUser = () => {
  return useMutation(
    async (requestData) => {
      const { data } = await updateInfo(requestData);
      return data;
    },
    {
      onSuccess: (data) => {},
    }
  );
};

export default useUpdateUser;
