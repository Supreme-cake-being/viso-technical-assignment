"use client";

import { useState } from "react";
import { Button, Input, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useSignup } from "@/src/hooks/auth/useSignup";

export const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reenteredPassword, setReenteredPassword] = useState("");

  const router = useRouter();

  const onSuccess = () => router.push("/login");

  const { handleSubmit } = useSignup({ name, email, password, onSuccess });

  const onSubmit = (e: any) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <section className="py-[32px] mx-auto w-[480px] sm:w-full">
      <h1 className="mb-[16px] font-medium text-2xl">Login</h1>

      <form className="mb-[16px] flex flex-col gap-[16px]" onSubmit={onSubmit}>
        <Input
          name="name"
          label="Name"
          value={name}
          isRequired
          onValueChange={setName}
        />

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

        <Input
          name="reenteredPassword"
          label="re-eneter Password"
          value={reenteredPassword}
          type="password"
          isRequired
          onValueChange={setReenteredPassword}
        />

        <Button
          color="primary"
          type="submit"
          isDisabled={!email && !password && password === reenteredPassword}
        >
          Button
        </Button>
      </form>

      <Link href="/login">Login</Link>
    </section>
  );
};
