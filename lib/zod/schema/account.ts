import { z } from "zod";
import { nameSchema } from "./auth";

export const accountUpdateSchema = z.object({
  name: nameSchema,
});
