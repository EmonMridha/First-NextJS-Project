import { Button } from "@/components/ui/button";

export default async function HomePage() {

  // const user = await getMe();

  return (
    <div>
      Hello nextjs
      <Button size={"xs"} variant={"destructive"}>
        Click Me
      </Button>
    </div>
  );
}