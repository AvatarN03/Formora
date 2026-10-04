import { Button } from "@/components/ui/button";

export default function PreviewDialogBtn({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      Preview
    </Button>
  );
}
