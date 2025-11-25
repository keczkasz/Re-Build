import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, MessageCircle } from "lucide-react";

interface ConnectionCardProps {
  name: string;
  type: string;
  location: string;
  specialty: string;
  description: string;
  tags: string[];
  onConnect: () => void;
}

export const ConnectionCard = memo(({
  name,
  type,
  location,
  specialty,
  description,
  tags,
  onConnect
}: ConnectionCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">{type}</p>
            </div>
          </div>
          <Badge variant="outline">{specialty}</Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Button className="w-full gap-2" variant="outline" onClick={onConnect}>
          <MessageCircle className="h-4 w-4" />
          Connect
        </Button>
      </CardContent>
    </Card>
  );
});

ConnectionCard.displayName = "ConnectionCard";
