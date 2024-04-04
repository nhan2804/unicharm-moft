export const array2Object = (arr = [], key, value_only) => {
  return arr?.reduce((all, cur) => {
    all[cur?.[key]] = value_only ? cur?.[value_only] || 0 : cur;
    return all;
  }, {});
};
export const array2Group = (arr, key) => {
  return arr?.reduce(function (r, a) {
    const k = a?.[key];
    r[k] = r[k] || [];
    r[k].push(a);
    return r;
  }, Object.create(null));
};
