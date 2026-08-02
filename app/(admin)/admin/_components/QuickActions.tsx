import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";
import { Plus, Mail, House } from "lucide-react";

const QuickActions = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button asChild size="sm" className="rounded-lg">
        <Link href="/admin/properties/new">
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
      </Button>
      <Button asChild variant="outline" size="sm" className="rounded-lg">
        <Link href="/admin/inquiries">
          <Mail className="h-4 w-4" />
          View Inquiries
        </Link>
      </Button>
      <Button asChild variant="outline" size="sm" className="rounded-lg">
        <Link href="/admin/properties">
          <House className="h-4 w-4" />
          View Properties
        </Link>
      </Button>
    </div>
  );
};

export default QuickActions;
