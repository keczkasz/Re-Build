import { memo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";

interface MaterialCardProps {
  title: string;
  category: string;
  location: string;
  quantity: string;
  price: string;
  postedDate: string;
  image: string;
  condition: string;
}

export const MaterialCard = memo(({
  title,
  category,
  location,
  quantity,
  price,
  postedDate,
  image,
  condition
}: MaterialCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">{title}</h3>
          <Badge variant="secondary" className="shrink-0">{condition}</Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{quantity}</span>
            <span className="font-semibold text-primary text-lg">{price}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{postedDate}</span>
        </div>
        <Button size="sm">Contact Seller</Button>
      </CardFooter>
    </Card>
  );
});

MaterialCard.displayName = "MaterialCard";
