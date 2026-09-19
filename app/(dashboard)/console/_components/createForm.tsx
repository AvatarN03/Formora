"use client";

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
      <DialogTrigger className="rounded-md text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-2.5">
        Create form
      </DialogTrigger>

      <DialogContent className="rounded-md sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="text-xl">Create form</DialogTitle>
          <DialogDescription className="text-base">
            Give your new form a name to get started.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Name</FormLabel>
                  <FormControl>
                    <Input className="rounded-md text-base" placeholder="Contact form" {...field} />
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
                  <FormLabel className="text-base">Description</FormLabel>
                  <FormControl>
                    <Textarea className="rounded-md text-base" placeholder="A simple contact form" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                className="w-full rounded-md text-base"
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
                    Save
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
