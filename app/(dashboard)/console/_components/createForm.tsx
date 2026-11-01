"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { formSchema, FormValues } from "@/schemas/form";
import { toast } from "@/components/ui/toast";
import { createForm } from "@/actions/form";
import { useState } from "react";


export default function CreateForm() {
  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await createForm(values);
      toast.add({ title: "Form created successfully!", type: "success" });
      form.reset();
      setOpen(false);
    } catch {
      toast.add({ title: "Failed to create form. Please try again.", type: "error" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-sm bg-primary px-4 py-2.5 text-sm uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90">
        New form
      </DialogTrigger>

      <DialogContent className="create-form-dialog rounded-sm border sm:max-w-lg">
        <DialogHeader className="border-b pb-5">
          <div className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="h-0.5 w-8 bg-primary" />
            <span>New work / 01</span>
          </div>
          <DialogTitle className="text-3xl font-bold uppercase leading-none tracking-[-0.05em]">
            Create a new form
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-[10px] uppercase tracking-[0.14em]">
                    Form name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-11 rounded-sm bg-background text-base"
                      placeholder="Customer feedback"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                    <FormLabel className="font-mono text-[10px] uppercase tracking-[0.14em]">
                      What is this form for?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-28 resize-none rounded-sm bg-background text-base"
                        placeholder="Collect feedback from your customers"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )}
              />

              <DialogFooter className="border-t pt-5">
                <Button
                  type="submit"
                  className="w-full rounded-sm text-sm uppercase tracking-[0.08em]"
                  disabled={form.formState.isSubmitting}
                >
                {form.formState.isSubmitting ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-pulse" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create form
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
