import { Hr, Tailwind, Text } from "@react-email/components";

export function Footer({ email }: { email: string }) {
  return (
    <Tailwind>
      <Hr className="mx-0 my-6 w-full border border-neutral-200" />
      <Text className="text-[12px] leading-6 text-neutral-500">
        This email was intended for <span className="text-black">{email}</span>.
        If you were not expecting this email, you can ignore this email. If you
        are concerned about your account&apos;s safety, please contact support.
      </Text>

      <Text className="text-[12px] text-neutral-500">
        Mark - The Habit Tracker that helps you build good habits and break bad
        ones.
      </Text>
    </Tailwind>
  );
}
