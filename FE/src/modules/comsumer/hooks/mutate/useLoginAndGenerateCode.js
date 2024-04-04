import { useAppDispatch } from "@hooks/reduxHook";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import axios from "axios";
import { login as loginAction } from "@modules/auth/slices";
import { Modal } from "antd";

const useLoginAndGenerateCode = () => {
  // const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  return useMutation(async (requestData) => {
    const { data } = await axios.post(`gift-clients/consumer`, requestData);
    return data;
  }, {});
};

export default useLoginAndGenerateCode;
