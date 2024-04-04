import React from "react";
import { useAppSelector } from "./reduxHook";

const useRole = () => {
  const role = useAppSelector((s) => s?.auth?.user?.type);

  return {
    isPg: role === "PG",
    isSup: role === "SUP",
    isSupperAdmin: role === "SUPER_ADMIN",
    isUser: role === "QC",
    isAdmin: role === "ADMIN",
    isRating: role === "RATING",
    canWrite: role === "ADMIN" || role === "SUPER_ADMIN",
    canView:
      role === "ADMIN" || role === "SUPER_ADMIN" || role === "ADMIN_READONLY",
  };
};

export default useRole;
