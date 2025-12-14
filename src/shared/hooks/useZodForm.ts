import { useForm, UseFormProps, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";

/**
 * Custom hook to create a form using react-hook-form
 * with Zod for schema validation.
 *
 * @template T - The type of the form values, extending from FieldValues.
 * @param {ZodType<T, any, any>} schema - The Zod schema used for validating form data.
 * @param {Omit<UseFormProps<T>, "resolver">} [props] - Optional props for configuring the useForm hook, excluding the resolver.
 * @returns {ReturnType<typeof useForm<T>>} The methods and properties of the useForm hook.
 */
export const useZodForm = <T extends FieldValues>(
  schema: ZodType<T, any, any>,
  props?: Omit<UseFormProps<T>, "resolver">
) => {
  return useForm<T>({
    resolver: zodResolver(schema) as any,
    ...props,
  });
};
