"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formSchema, FormValues } from "@/schemas/form";
import { toast } from "@/components/ui/toast";
import { createForm } from "@/actions/form";

export default function CreateForm() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const formId = await createForm(values);
      toast.add({ title: "Form created successfully!", type: "success" });
      form.reset();
      setOpen(false);
      if (formId) {
        router.push(`/builder/${formId}`);
      }
    } catch {
      toast.add({ title: "Failed to create form. Please try again.", type: "error" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90">
        <Plus className="size-4" />
        <span>New form</span>
      </DialogTrigger>

      <DialogContent className="create-form-dialog rounded-2xl border border-border/50 bg-card p-6 sm:p-8 shadow-xl sm:max-w-lg">
        <DialogHeader className="border-b border-border/40 pb-5 pr-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/70 px-3 py-1 font-mono text-[11px] text-muted-foreground w-fit">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="tracking-wider uppercase">New Form</span>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
            Create a new form
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Set up your form title and optional description. You will add questions and layout components in the studio canvas.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
                    Form name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-11 rounded-xl border border-border/60 bg-secondary/50 px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="e.g. Customer Feedback Survey"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-24 resize-none rounded-xl border border-border/60 bg-secondary/50 p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Describe what this form is used for (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="border-t border-border/40 pt-5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={form.formState.isSubmitting}
                className="rounded-xl border border-border/60 text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-95 shadow-none transition-opacity"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-pulse" />
                    <span>Creating form...</span>
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Create form</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
