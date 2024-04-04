import { array2Object } from "@helper/array2Obj";

import React from "react";
export const typeUser = [
  // { value: "SUPER_ADMIN", label: "Super admin" },
  { value: "PG", label: "PG" },
  { value: "SUP", label: "SUP" },
  { value: "ADMIN", label: "Quản lý" },
  { value: "ADMIN_READONLY", label: "Quản lý(chỉ xem)" },
  { value: "RATING", label: "Đánh giá" },
  { value: "RATING_POLICY", label: "Đánh giá Policy" },
];
const mappingUser = array2Object(typeUser, "value", "label");
const MappingTypeUser = ({ t }) => {
  console.log({ mappingUser });
  const map = mappingUser?.[t] || t;
  return <div>{map}</div>;
};

export default MappingTypeUser;
