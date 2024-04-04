import { useAppDispatch } from "@hooks/reduxHook";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { login as loginAction } from "../slices";
import { login } from "../services/auth";

const useLogin = (projectId) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMutation(
    async (requestData) => {
      const { data } = await login(requestData);
      return data;
    },
    {
      onSuccess: (data, vari) => {
        dispatch(loginAction(data));
        if (data?.user?.type === "SUPER_ADMIN") {
          navigate("/manager/", {
            replace: true,
          });
        } else if (
          data?.user?.type === "RATING" ||
          data?.user?.type === "RATING_POLICY"
        ) {
          navigate("/rating/identify", {
            replace: true,
          });
        } else if (data?.user?.type === "ADMIN_READONLY") {
          navigate("/manager/", {
            replace: true,
          });
        } else {
          navigate("/staff/", {
            replace: true,
          });
        }

        // }
      },
    }
  );
};

export default useLogin;
