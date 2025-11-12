import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Edit2, Trash2, Leaf, Flame, ShoppingCart } from 'lucide-react';
import { FoodItem } from './AddEditFoodDialog';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FoodItemCardProps {
  item: FoodItem;
  onEdit: (item: FoodItem) => void;
  onDelete: (id: string) => void;
  onAddToCart?: (item: FoodItem) => void;
}

export function FoodItemCard({ item, onEdit, onDelete, onAddToCart }: FoodItemCardProps) {
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
      <CardFooter className="p-4 pt-0 gap-2 flex-col">
        {onAddToCart && (
          <Button
            size="sm"
            onClick={() => onAddToCart(item)}
            disabled={!item.available}
            className="w-full"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        )}
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            className="flex-1"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(item.id)}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
