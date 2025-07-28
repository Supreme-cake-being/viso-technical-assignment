"use client";

import { useState } from "react";
import { Button, Input, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/src/hooks/auth/useLogin";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const onSuccess = () => router.push("/");

  const { handleSubmit } = useLogin({ email, password, onSuccess });

  const onSubmit = (e: any) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <section className="py-[32px] mx-auto w-[480px] sm:w-full">
      <h1 className="mb-[16px] font-medium text-2xl">Login</h1>

      <form className="mb-[16px] flex flex-col gap-[16px]" onSubmit={onSubmit}>
        <Input
          name="email"
          label="Email"
          value={email}
          type="email"
          isRequired
          onValueChange={setEmail}
        />

        <Input
          name="password"
          label="Password"
          value={password}
          type="password"
          isRequired
          onValueChange={setPassword}
        />

        <Button color="primary" type="submit" isDisabled={!email && !password}>
          Button
        </Button>
      </form>

      <Link href="/signup">Signup</Link>
    </section>
  );
};
