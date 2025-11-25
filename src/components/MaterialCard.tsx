import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface MaterialCardProps {
  id?: string;
  title: string;
  category: string;
  location: string;
  quantity: string;
  price: string;
  postedDate: string;
  image: string;
  condition: string;
  sellerId?: string;
  onDelete?: (id: string) => void;
  isMatched?: boolean;
}

export const MaterialCard = ({
  id,
  title,
  category,
  location,
  quantity,
  price,
  postedDate,
  image,
  condition,
  sellerId,
  onDelete,
  isMatched = false
}: MaterialCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = user && sellerId && user.id === sellerId;
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${isMatched ? 'ring-2 ring-primary' : ''}`}>
      {isMatched && (
        <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 text-center">
          ✓ Matches Project Needs
        </div>
      )}
      <div className="aspect-video overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title}
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
        <div className="flex items-center gap-2">
          {isOwner ? (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate(`/marketplace/edit/${id}`)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete && id && onDelete(id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <Button size="sm">Contact Seller</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
