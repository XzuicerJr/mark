import { NextRequest } from "next/server";

export const parse = (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams.toString();
  const searchParamsObj = Object.fromEntries(req.nextUrl.searchParams);
  const searchParamsString = searchParams.length > 0 ? `?${searchParams}` : "";
  const fullPath = `${path}${searchParamsString}`;

  return {
    path,
    fullPath,
    searchParamsObj,
    searchParamsString,
  };
};
