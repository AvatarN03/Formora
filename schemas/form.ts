
import z from "zod";

export const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;