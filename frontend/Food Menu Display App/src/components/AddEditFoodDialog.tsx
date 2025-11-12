import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
  available: boolean;
  dietaryTags: string[];
}

interface AddEditFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Omit<FoodItem, 'id'> | FoodItem) => void;
  editItem?: FoodItem | null;
  categories: string[];
  dietaryOptions: string[];
}

export function AddEditFoodDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  editItem,
  categories,
  dietaryOptions
}: AddEditFoodDialogProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [available, setAvailable] = useState(true);
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setPrice(editItem.price.toString());
      setCategory(editItem.category);
      setImageUrl(editItem.imageUrl);
      setDescription(editItem.description);
      setAvailable(editItem.available);
      setDietaryTags(editItem.dietaryTags);
    } else {
      setName('');
      setPrice('');
      setCategory('');
      setImageUrl('');
      setDescription('');
      setAvailable(true);
      setDietaryTags([]);
    }
  }, [editItem, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !price || !category || !imageUrl.trim()) {
      return;
    }

    const foodItem = {
      ...(editItem && { id: editItem.id }),
      name: name.trim(),
      price: parseFloat(price),
      category,
      imageUrl: imageUrl.trim(),
      description: description.trim(),
      available,
      dietaryTags
    };

    onSave(foodItem as any);
    setName('');
    setPrice('');
    setCategory('');
    setImageUrl('');
    setDescription('');
    setAvailable(true);
    setDietaryTags([]);
    onOpenChange(false);
  };

  const toggleDietaryTag = (tag: string) => {
    setDietaryTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Food Item' : 'Add Food Item'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter food name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                step="1"
                min="0"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter food description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="available">Available</Label>
              <Switch
                id="available"
                checked={available}
                onCheckedChange={setAvailable}
              />
            </div>
            <div className="space-y-2">
              <Label>Dietary Tags</Label>
              <div className="grid grid-cols-2 gap-3">
                {dietaryOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={dietaryTags.includes(option)}
                      onCheckedChange={() => toggleDietaryTag(option)}
                    />
                    <Label 
                      htmlFor={option}
                      className="cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editItem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
