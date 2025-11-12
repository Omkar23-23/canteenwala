import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Leaf, Flame } from 'lucide-react';
import { FoodItem } from './AddEditFoodDialog';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CustomerMenuCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
}

export function CustomerMenuCard({ item, onAddToCart }: CustomerMenuCardProps) {
  const getDietaryIcon = (tag: string) => {
    if (tag === 'Vegetarian' || tag === 'Vegan') return <Leaf className="w-3 h-3" />;
    if (tag === 'Spicy') return <Flame className="w-3 h-3" />;
    return null;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {!item.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="flex-1">{item.name}</h3>
          <Badge variant="secondary">{item.category}</Badge>
        </div>
        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-green-600">₹{item.price.toFixed(0)}</p>
          {item.dietaryTags.length > 0 && (
            <div className="flex gap-1">
              {item.dietaryTags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs flex items-center gap-1">
                  {getDietaryIcon(tag)}
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(item)}
          disabled={!item.available}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
