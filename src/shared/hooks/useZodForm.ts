import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm, UseFormProps } from 'react-hook-form';
import { ZodType } from 'zod';

export const useZodForm = <T extends FieldValues>(
  schema: ZodType<T>,
  props?: Omit<UseFormProps<T>, 'resolver'>,
) => {
  return useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    ...props,
  });
};
