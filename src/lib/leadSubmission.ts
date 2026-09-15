import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

export const contactDetailsSchema = z.object({
  fullName: z.string().trim().min(1, "Please enter your name.").max(120, "Use at most 120 characters."),
  phone: z.string().trim().max(30).refine(
    (value) => /^[+\d\s().-]+$/.test(value) && value.replace(/\D/g, "").length >= 10 && value.replace(/\D/g, "").length <= 15,
    "Please enter a valid phone number (10–15 digits).",
  ),
  email: z.string().trim().email("Please enter a valid email.").max(254),
});

export function validateContactDetails(values: z.input<typeof contactDetailsSchema>) {
  const result = contactDetailsSchema.safeParse(values);
  const errors: Partial<Record<keyof typeof values, string>> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof typeof values;
      errors[key] ??= issue.message;
    }
  }
  return errors;
}

// Keep network failures on the same error path as PostgREST errors.
export async function submitLead(values: TablesInsert<"leads">) {
  try {
    const { error } = await supabase.from("leads").insert({
      ...values,
      name: values.name.trim(),
      phone: values.phone?.trim(),
      email: values.email?.trim(),
      message: values.message?.trim(),
    });
    return { error };
  } catch {
    return { error: new Error("Unable to send your request. Please try again.") };
  }
}
