import { useAppDispatch } from "@hooks/reduxHook";
import { showCheckin } from "@modules/staff/services/checkin";
import { setCurrentCheckIn } from "@modules/staff/slices/staff";
import { message } from "antd";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";

const useShowCheckIn = (placeId, checkInId) => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  return useQuery(
    ["show-checkin", placeId, checkInId],
    async () => {
      const data = await showCheckin(placeId, checkInId);
      return data;
    },
    {
      onSuccess: (checkin) => {
        if (!checkin) {
          dispatch(setCurrentCheckIn(undefined));

          nav("/staff");
          message.warning("Vui lòng checkin để tiếp tục!");
        }
      },
      onError: () => {
        dispatch(setCurrentCheckIn(undefined));

        nav("/staff");
        message.warning("Có lỗi xảy ra, vui lòng truy cập lại");
      },
      enabled: !!checkInId && !!placeId,
      refetchInterval: 1000 * 10 * 60,
      refetchOnWindowFocus: true,
    }
  );
};

export default useShowCheckIn;
