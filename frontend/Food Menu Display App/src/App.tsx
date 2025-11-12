import { useState } from 'react';
import { Plus, Filter, Search, ShoppingCart, Settings, UtensilsCrossed, Package } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { AddEditFoodDialog, FoodItem } from './components/AddEditFoodDialog';
import { FoodItemCard } from './components/FoodItemCard';
import { CustomerMenuCard } from './components/CustomerMenuCard';
import { Cart, CartItem } from './components/Cart';
import { CheckoutDialog, OrderData } from './components/CheckoutDialog';
import { OrdersList } from './components/OrdersList';
import { Alert, AlertDescription } from './components/ui/alert';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';

const CATEGORIES = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Snacks'];
const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Spicy'];

const INITIAL_ITEMS: FoodItem[] = [
  { 
    id: '1', 
    name: 'Caesar Salad', 
    price: 250, 
    category: 'Appetizers',
    imageUrl: 'https://images.unsplash.com/photo-1739436776460-35f309e3f887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZCUyMGZyZXNofGVufDF8fHx8MTc2Mjg4MzUwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Fresh romaine lettuce with parmesan cheese, croutons, and Caesar dressing',
    available: true,
    dietaryTags: ['Vegetarian']
  },
  { 
    id: '2', 
    name: 'Grilled Chicken Burger', 
    price: 350, 
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1584944868902-d06d1ba6ec55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnVyZ2VyJTIwZ3JpbGxlZHxlbnwxfHx8fDE3NjI5MjQ2NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Juicy grilled chicken breast with lettuce, tomato, and special sauce',
    available: true,
    dietaryTags: []
  },
  { 
    id: '3', 
    name: 'Chocolate Brownie', 
    price: 150, 
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBicm93bmllJTIwZGVzc2VydHxlbnwxfHx8fDE3NjI4Njk5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Rich, fudgy chocolate brownie served warm',
    available: true,
    dietaryTags: ['Vegetarian']
  },
  { 
    id: '4', 
    name: 'Fresh Orange Juice', 
    price: 80, 
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1641659735894-45046caad624?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBqdWljZSUyMGdsYXNzfGVufDF8fHx8MTc2MjkyNDY2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Freshly squeezed orange juice',
    available: true,
    dietaryTags: ['Vegan']
  },
  { 
    id: '5', 
    name: 'French Fries', 
    price: 120, 
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1717294978892-cef673e1d17b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBmcmllcyUyMGdvbGRlbnxlbnwxfHx8fDE3NjI4NDY2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Crispy golden french fries with sea salt',
    available: false,
    dietaryTags: ['Vegan']
  },
  { 
    id: '6', 
    name: 'Margherita Pizza', 
    price: 450, 
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1707896543317-da87bde75ff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emElMjBmcmVzaHxlbnwxfHx8fDE3NjI4NzA2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
    available: true,
    dietaryTags: ['Vegetarian']
  },
];

export default function App() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(INITIAL_ITEMS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart and Orders
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orders, setOrders] = useState<(OrderData & { id: string })[]>([]);

  const handleAddItem = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEditItem = (item: FoodItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
    toast.success('Item deleted successfully');
  };

  const handleSaveItem = (item: Omit<FoodItem, 'id'> | FoodItem) => {
    if ('id' in item) {
      setFoodItems(foodItems.map(foodItem => 
        foodItem.id === item.id ? item : foodItem
      ));
      toast.success('Item updated successfully');
    } else {
      const newItem: FoodItem = {
        ...item,
        id: Date.now().toString()
      };
      setFoodItems([...foodItems, newItem]);
      toast.success('Item added successfully');
    }
  };

  const handleAddToCart = (item: FoodItem) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    
    toast.success('Added to cart');
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    toast.success('Removed from cart');
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handlePlaceOrder = (orderData: OrderData) => {
    const newOrder = {
      ...orderData,
      id: Date.now().toString()
    };
    
    setOrders([newOrder, ...orders]);
    setCartItems([]);
    toast.success('Order placed successfully!');
  };

  const filteredItems = foodItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Cafe Delight</h1>
          <p className="text-gray-600">Your favorite food, just a click away</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="customer">
              <UtensilsCrossed className="w-4 h-4 mr-2" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="admin">
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="w-4 h-4 mr-2" />
              Orders
              {orders.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {orders.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Customer View */}
          <TabsContent value="customer">
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={() => setCartOpen(true)} className="relative ml-auto">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Cart
                  {cartCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <Alert>
                <AlertDescription>
                  {selectedCategory === 'all' 
                    ? 'No food items available.'
                    : `No items found in "${selectedCategory}" category.`
                  }
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <CustomerMenuCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Admin View */}
          <TabsContent value="admin">
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleAddItem} className="sm:w-auto">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Food Item
                </Button>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:ml-auto flex-1 sm:flex-initial">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Search menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <Alert>
                <AlertDescription>
                  {selectedCategory === 'all' 
                    ? 'No food items yet. Click "Add Food Item" to get started!'
                    : `No items found in "${selectedCategory}" category.`
                  }
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <FoodItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders View */}
          <TabsContent value="orders">
            <OrdersList orders={orders} />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AddEditFoodDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSaveItem}
          editItem={editingItem}
          categories={CATEGORIES}
          dietaryOptions={DIETARY_OPTIONS}
        />

        <Cart
          open={cartOpen}
          onOpenChange={setCartOpen}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />

        <CheckoutDialog
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          cartItems={cartItems}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
      <Toaster />
    </div>
  );
}
