import { ApiError, handleAndReturnErrorResponse } from "@/lib/api/errors";
import { Session, getSession } from "@/lib/auth";
import { getSearchParams } from "@/lib/utils";

interface WithSessionHandler {
  ({
    req,
    params,
    searchParams,
    session,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    session: Session;
  }): Promise<Response>;
}

export const withSession =
  (handler: WithSessionHandler) =>
  async (
    req: Request,
    { params }: { params: Promise<Record<string, string>> },
  ) => {
    try {
      const session = await getSession();

      if (!session?.user.id) {
        throw new ApiError({
          code: "unauthorized",
          message: "Unauthorized: Login required.",
        });
      }

      const searchParams = getSearchParams(req.url);
      const awaitedParams = await params;

      return await handler({
        req,
        searchParams,
        session,
        params: awaitedParams,
      });
    } catch (error) {
      return handleAndReturnErrorResponse(error);
    }
  };
