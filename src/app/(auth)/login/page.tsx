"use-client";

import * as yup from "yup";

const loginSchema = yup.object({
  email: yup.string().email("Email is invalid"),
  password: yup.string().min(6, "Password must have at least 6 characters"),
});

export default function LoginPage() {
  const Loading;
}
