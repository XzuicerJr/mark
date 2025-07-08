export const getSearchParams = (url: string) => {
  let params = {} as Record<string, string>;

  new URL(url).searchParams.forEach(function (val, key) {
    params[key] = val;
  });

  return params;
};

export const getSearchParamsWithArray = (url: string) => {
  let params = {} as Record<string, string | string[]>;

  new URL(url).searchParams.forEach(function (val, key) {
    if (key in params) {
      const param = params[key];
      Array.isArray(param) ? param.push(val) : (params[key] = [param, val]);
    } else {
      params[key] = val;
    }
  });

  return params;
};

export const getParamsFromURL = (url: string) => {
  if (!url) return {};
  try {
    const params = new URL(url).searchParams;
    const paramsObj: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
      if (value && value !== "") {
        paramsObj[key] = value;
      }
    }
    return paramsObj;
  } catch (e) {
    return {};
  }
};
