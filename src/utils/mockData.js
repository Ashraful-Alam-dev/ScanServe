export const MOCK_MENU = [
  {
    id: 'm1',
    name: 'Truffle Umami Burger',
    description: 'Aged wagyu beef, black truffle aioli, caramelized onions, and sharp white cheddar on a toasted brioche bun.',
    price: 349,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'm2',
    name: 'Hot Honey Pepperoni Pizza',
    description: 'Artisanal sourdough crust, spicy calabrian salami, fresh mozzarella, finished with a drizzle of organic hot honey.',
    price: 799,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'm3',
    name: 'Smoked Rosemary Old Fashioned',
    description: 'Premium bourbon, aromatic bitters, charred rosemary sprig, and cold-smoked table-side.',
    price: 279,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'm4',
    name: 'Deconstructed Matcha Tiramisu',
    description: 'Ceremonial grade Uji matcha soaked ladyfingers, layered with whipped mascarpone cream.',
    price: 199,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'm5',
    name: 'Buttermilk Fried Chicken',
    description: 'Crispy buttermilk fried chicken breast, honey butter glaze, served with house slaw and pickles.',
    price: 299,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'm6',
    name: 'Loaded Dirty Fries',
    description: 'Crispy golden fries topped with melted cheddar, bacon bits, jalapeños, and drizzled with truffle aioli.',
    price: 179,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&auto=format&fit=crop&q=60'
  }
];

export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  COOKING: 'PROCESSING',
  COOKED: 'COOKED',
  DELIVERED: 'DELIVERED'
};