import { getReport } from "@modules/staff/services/report";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
export type TypeReport =
  | "gift"
  | "sale"
  | "gift-exchange"
  | "oos"
  | "sampling"
  | "sup"
  | "image"
  | "end-shift";
export interface IUser {
  fullName: string;
  _id: string;
  username: string;
}
export interface IReport {
  name?: string;
  type: string;
  kind?: string;
  data?: object;
  dataImage?: object;
  endShiftInventory?: object;
  startShiftInventory?: object;
  midShiftAddProduct?: object;
  storeId: string;
  shiftId: string;
  image1?: string;
  image2?: string;
  checkinId?: string;
  creator?: IUser;
  updator?: IUser;
  creatorId?: string;
  updatorId?: string;
}
const useGetReport = (placeId: string, type: TypeReport, query: object) => {
  return useQuery<IReport, AxiosError>(
    ["report", placeId, type, query],
    async () => {
      const data = await getReport(placeId, type, query);
      return data;
    }
  );
};

export default useGetReport;
