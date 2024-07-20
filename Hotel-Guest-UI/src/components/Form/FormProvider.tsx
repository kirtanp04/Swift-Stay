import { CSSProperties, ReactNode } from "react";
import { FormProvider as Form, UseFormReturn } from "react-hook-form";

interface TProps {
  children: ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: () => void;
  sx?: CSSProperties;
}

export default function FormProvider({
  children,
  onSubmit,
  methods,
  sx,
}: TProps) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} style={{ ...sx! }}>
        {children}
      </form>
    </Form>
  );
}
