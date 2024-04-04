const filterOption = (input, option) => {
  return (option?.children?.toLowerCase() || "").includes(input?.toLowerCase());
};
export default filterOption;
