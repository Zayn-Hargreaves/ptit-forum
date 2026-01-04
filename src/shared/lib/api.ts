import { AxiosResponse } from "axios";
import type { UseFormReturn, FieldValues } from "react-hook-form";

function applyFieldErrors<TForm extends FieldValues>(
  form: UseFormReturn<TForm>,
  fieldErrors: Record<string, string>
): string[] {
  const unmapped: string[] = [];

  Object.entries(fieldErrors).forEach(([key, msg]) => {
    const state = form.getFieldState(key as any);

    const isMapped =
      state != null &&
      (state.isTouched !== undefined ||
        state.isDirty !== undefined ||
        state.invalid !== undefined);

    if (isMapped) {
      form.setError(key as any, { message: msg });
    } else {
      unmapped.push(msg);
    }
  });

  return unmapped;
}

export async function unwrapData<T>(p: Promise<AxiosResponse<T>>): Promise<T> {
  const res = await p;
  return res.data;
}
