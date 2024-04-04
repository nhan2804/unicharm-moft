import { useState } from "react";
import useQueryString2 from "./useQueryString2";

const useSearchQuery = (initValue) => {
  const { qsParsed } = useQueryString2();
  const init = { ...qsParsed, ...initValue };
  const [search, setSearch] = useState(init);

  const handleSetSearch = (values) => {
    Object.keys(values).forEach((key) => {
      if (
        values[key] === undefined ||
        values[key] === null ||
        values[key] === ""
      ) {
        delete values[key];
      }
    });
    setSearch(values);
  };
  return {
    initSearchValues: init,
    setSearch: handleSetSearch,
    search: search || {},
  };
};

export default useSearchQuery;
