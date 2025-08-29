import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Frown className="h-24 w-24 text-muted-foreground mb-6" />
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="text-xl text-muted-foreground mt-4 mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link to="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFound;
