import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function CenteredAlert({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gray-100">
      <div className="w-full max-w-sm">
        <Alert variant="destructive">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
