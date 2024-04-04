import { useAppDispatch } from "@hooks/reduxHook";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import axios from "axios";
import { login as loginAction } from "@modules/auth/slices";

const useCheckCode = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMutation(async (requestData) => {
    const { data } = await axios.get(`code/${requestData}/check`, requestData);
    return data;
  });
};

export default useCheckCode;
