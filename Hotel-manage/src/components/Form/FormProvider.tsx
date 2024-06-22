import { ReactNode } from "react";
import { FormProvider as Form, UseFormReturn } from "react-hook-form";

interface TProps {
  children: ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: () => void;
}

export default function FormProvider({ children, onSubmit, methods }: TProps) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}
