import { MARK_WORDMARK } from "@/lib/utils";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Footer } from "../components/footer";

export default function LockAccount({
  email = "john@doe.com",
}: {
  email: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Your Mark Account has been locked</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
            <Section className="mt-8">
              <Img src={MARK_WORDMARK} height="32" alt="Mark" />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-lg font-medium text-black">
              Your Account has been locked
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Your account has been locked due to too many failed login
              attempts. Please contact support to unlock your account.
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
