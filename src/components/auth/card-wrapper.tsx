"use-client";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import AuthHeader from "./auth-header";
import BackButton from "./back-button";
import { Children } from "react";
interface CardWrapperProps {
  label: string;
  title: string;
  backButtonHref: string;
  backButtonLabel: string;
  children: React.ReactNode;
}
const CardWrapper = ({
  label,
  title,
  backButtonHref,
  backButtonLabel,
  children,
}: CardWrapperProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="xl:w-1/4 md:w-1/2 sm:w-1/2 shadow-md flex mx-auto">
        <CardHeader>
          <AuthHeader label={label} title={title} />
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default CardWrapper;
