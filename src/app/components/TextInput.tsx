import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface TextInputProps {
  placeholder: string;
}

export function TextInput({ placeholder }: TextInputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Input</CardTitle>
      </CardHeader>
      <CardContent>
        <Input type="email" placeholder={placeholder} />
      </CardContent>
    </Card>
  );
}
