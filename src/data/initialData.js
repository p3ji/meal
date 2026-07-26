export const INITIAL_FAMILY_MEMBERS = [
  { id: 'mom', name: 'Mom', color: '#e07a5f', icon: '🌸', role: 'Head Chef' },
  { id: 'dad', name: 'Dad', color: '#3d405b', icon: '👨‍🍳', role: 'Sous Chef' },
  { id: 'kids', name: 'Kids', color: '#81b29a', icon: '🐥', role: 'Helper' },
  { id: 'family', name: 'Family', color: '#f4a261', icon: '🏡', role: 'Everyone' }
];

export const INITIAL_RECIPES = [
  {
    id: 'rec-maple-curry-pork-chops',
    title: 'Maple-Curry Pork Chops (goodfood)',
    category: 'Dinner',
    defaultCook: 'Mom',
    prepTime: '15m',
    cookTime: '20m',
    servings: 4,
    rating: 5,
    isFavorite: true,
    imageEmoji: '🥩',
    description: 'Juicy pork chops seared to golden perfection and glazed with a sweet maple syrup and warm curry spice glaze. Sourced from GoodFood.',
    ingredients: [
      { name: 'Pork Chops', amount: '4 thick bone-in or boneless chops', category: 'Meat' },
      { name: 'Pure Maple Syrup', amount: '3 tbsp', category: 'Pantry' },
      { name: 'Mild Curry Powder', amount: '1.5 tbsp', category: 'Pantry' },
      { name: 'Dijon Mustard', amount: '1 tbsp', category: 'Pantry' },
      { name: 'Garlic', amount: '3 cloves minced', category: 'Produce' },
      { name: 'Butter', amount: '2 tbsp', category: 'Dairy' },
      { name: 'Olive Oil', amount: '1 tbsp', category: 'Pantry' },
      { name: 'Salt & Black Pepper', amount: 'to taste', category: 'Pantry' }
    ],
    instructions: [
      'Season pork chops generously with salt, black pepper, and 1 tsp of curry powder.',
      'Heat olive oil and butter in a heavy skillet over medium-high heat. Sear pork chops for 4-5 minutes per side until golden brown.',
      'Whisk maple syrup, Dijon mustard, minced garlic, and remaining curry powder in a small bowl.',
      'Pour maple-curry glaze into skillet over pork chops, lower heat to medium-low, and spoon glaze continuously until thickened and chops reach internal temp of 145°F.',
      'Rest for 3 minutes and serve hot with roasted potatoes and green beans!'
    ]
  },
  {
    id: 'rec-meatball-mushroom-stew',
    title: 'Hearty Meatball and Mushroom Stew (Hello Fresh)',
    category: 'Dinner',
    defaultCook: 'Dad',
    prepTime: '20m',
    cookTime: '30m',
    servings: 4,
    rating: 5,
    isFavorite: true,
    imageEmoji: '🧆',
    description: 'Savory handmade beef meatballs and earthy cremini mushrooms simmered in a rich garlic herb cream sauce. Sourced from Hello Fresh.',
    ingredients: [
      { name: 'Ground Beef', amount: '1 lb', category: 'Meat' },
      { name: 'Cremini Mushrooms', amount: '8 oz sliced', category: 'Produce' },
      { name: 'Yellow Onion', amount: '1 medium diced', category: 'Produce' },
      { name: 'Garlic', amount: '4 cloves minced', category: 'Produce' },
      { name: 'Beef Broth', amount: '2 cups', category: 'Pantry' },
      { name: 'Heavy Cream', amount: '1/2 cup', category: 'Dairy' },
      { name: 'Panko Breadcrumbs', amount: '1/3 cup', category: 'Pantry' },
      { name: 'Egg', amount: '1 large', category: 'Dairy' },
      { name: 'Fresh Parsley & Thyme', amount: '2 tbsp chopped', category: 'Produce' }
    ],
    instructions: [
      'In a bowl, combine ground beef, panko, egg, half the minced garlic, salt, and pepper. Roll into 12 even meatballs.',
      'Heat olive oil in a Dutch oven over medium heat. Sear meatballs until browned on all sides (approx. 6 mins), then set aside on a plate.',
      'In the same pot, sauté diced onions and sliced mushrooms until golden and tender.',
      'Stir in 1 tbsp flour, pour in beef broth and fresh thyme, then return meatballs to the pot. Cover and simmer for 15 minutes.',
      'Stir in heavy cream and fresh parsley. Simmer 2 mins until rich and creamy. Serve hot over egg noodles or mashed potatoes.'
    ]
  },
  {
    id: 'rec-pork-apple-burger',
    title: 'Pork and Apple Burger (Hello Fresh)',
    category: 'Dinner',
    defaultCook: 'Family',
    prepTime: '15m',
    cookTime: '15m',
    servings: 4,
    rating: 5,
    isFavorite: true,
    imageEmoji: '🍔',
    description: 'Gourmet juicy pork patties infused with grated sweet crisp apple, topped with melted sharp cheddar and sage mayo on toasted brioche buns. Sourced from Hello Fresh.',
    ingredients: [
      { name: 'Ground Pork', amount: '1 lb', category: 'Meat' },
      { name: 'Honeycrisp Apple', amount: '1 grated', category: 'Produce' },
      { name: 'Brioche Burger Buns', amount: '4 buns', category: 'Pantry' },
      { name: 'Sharp Cheddar Cheese Slices', amount: '4 slices', category: 'Dairy' },
      { name: 'Mayonnaise', amount: '3 tbsp', category: 'Pantry' },
      { name: 'Fresh Sage', amount: '1 tbsp minced', category: 'Produce' },
      { name: 'Baby Arugula', amount: '1 cup', category: 'Produce' },
      { name: 'Garlic Powder', amount: '1/2 tsp', category: 'Pantry' }
    ],
    instructions: [
      'Grate Honeycrisp apple finely and squeeze out excess juice with a clean paper towel.',
      'In a large bowl, combine ground pork, squeezed grated apple, minced sage, garlic powder, salt, and black pepper. Form into 4 round burger patties.',
      'Heat a skillet with 1 tbsp oil over medium-high heat. Cook patties 5-6 minutes per side until cooked through (160°F). Top with cheddar slices to melt.',
      'Lightly toast brioche buns. Stir remaining minced sage into mayonnaise.',
      'Spread sage mayo on buns, assemble with juicy pork apple patties and fresh baby arugula. Serve with crispy potato wedges!'
    ]
  },
  {
    id: 'rec-1',
    title: 'Fluffy Pancakes & Berries',
    category: 'Breakfast',
    defaultCook: 'Mom',
    prepTime: '15m',
    cookTime: '15m',
    servings: 4,
    rating: 5,
    isFavorite: true,
    imageEmoji: '🥞',
    description: 'Fluffy soufflé pancakes topped with whipped butter, maple syrup, and fresh mixed berries.',
    ingredients: [
      { name: 'Flour', amount: '2 cups', category: 'Pantry' },
      { name: 'Eggs', amount: '3 large', category: 'Dairy' },
      { name: 'Milk', amount: '1 cup', category: 'Dairy' },
      { name: 'Sugar', amount: '3 tbsp', category: 'Pantry' },
      { name: 'Fresh Strawberries', amount: '1 cup', category: 'Produce' },
      { name: 'Fresh Blueberries', amount: '1 cup', category: 'Produce' },
      { name: 'Maple Syrup', amount: '4 tbsp', category: 'Pantry' }
    ],
    instructions: [
      'Separate egg whites and yolks. Whip whites until stiff peaks form.',
      'Mix yolks, flour, sugar, and milk in a bowl until smooth.',
      'Gently fold whipped egg whites into yolk mixture.',
      'Cook on a greased non-stick skillet covered over low heat for 4 mins each side.',
      'Top with fresh berries, whipped butter, and warm maple syrup!'
    ]
  },
  {
    id: 'rec-2',
    title: 'Miso Soup & Onigiri',
    category: 'Breakfast',
    defaultCook: 'Dad',
    prepTime: '10m',
    cookTime: '10m',
    servings: 4,
    rating: 5,
    isFavorite: true,
    imageEmoji: '🍙',
    description: 'Comforting warm red miso soup with silken tofu and green onion paired with savory salmon-filled rice balls.',
    ingredients: [
      { name: 'Miso Paste', amount: '3 tbsp', category: 'Pantry' },
      { name: 'Dashi Stock', amount: '4 cups', category: 'Pantry' },
      { name: 'Silken Tofu', amount: '1 block', category: 'Produce' },
      { name: 'Green Onions', amount: '2 stalks', category: 'Produce' },
      { name: 'Sushi Rice', amount: '2 cups cooked', category: 'Pantry' },
      { name: 'Cooked Salmon', amount: '1/2 cup shredded', category: 'Meat' },
      { name: 'Nori Sheets', amount: '2 sheets cut into strips', category: 'Pantry' }
    ],
    instructions: [
      'Heat dashi stock in a pot until warm. Dissolve miso paste using a mesh strainer.',
      'Add cubed silken tofu and sliced green onions. Simmer gently for 2 minutes.',
      'Season warm cooked sushi rice with a pinch of salt.',
      'Form rice around salmon filling into triangle shapes and wrap with a strip of nori.',
      'Serve warm miso soup alongside cute onigiri!'
    ]
  },
  {
    id: 'rec-3',
    title: 'Fluffy Soup & Bread Rolls',
    category: 'Breakfast',
    defaultCook: 'Dad',
    prepTime: '15m',
    cookTime: '20m',
    servings: 4,
    rating: 4,
    isFavorite: false,
    imageEmoji: '🍲',
    description: 'Creamy sweet corn and potato chowder served with piping hot baked dinner rolls.',
    ingredients: [
      { name: 'Sweet Corn Kernels', amount: '2 cups', category: 'Produce' },
      { name: 'Yukon Gold Potatoes', amount: '2 medium cubed', category: 'Produce' },
      { name: 'Heavy Cream', amount: '1/2 cup', category: 'Dairy' },
      { name: 'Vegetable Broth', amount: '3 cups', category: 'Pantry' },
      { name: 'Butter', amount: '2 tbsp', category: 'Dairy' },
      { name: 'Fresh Bread Rolls', amount: '4 rolls', category: 'Pantry' }
    ],
    instructions: [
      'Melt butter in saucepan, add diced potatoes and corn.',
      'Pour in vegetable broth and simmer until potatoes are tender (12 mins).',
      'Blend half of the soup for extra creaminess, then stir in heavy cream.',
      'Serve hot with warm buttered dinner rolls.'
    ]
  },
  {
    id: 'rec-4',
    title: 'Veggie Ramen',
    category: 'Lunch',
    defaultCook: 'Kids',
    prepTime: '10m',
    cookTime: '15m',
    servings: 4,
    rating: 5,
    isFavorite: true,
    imageEmoji: '🍜',
    description: 'Rich shoyu veggie broth with chewy ramen noodles, ajitsuke tamago (soft boiled egg), baby spinach, and sweet corn.',
    ingredients: [
      { name: 'Ramen Noodles', amount: '4 portions', category: 'Pantry' },
      { name: 'Vegetable Broth', amount: '4 cups', category: 'Pantry' },
      { name: 'Soy Sauce', amount: '3 tbsp', category: 'Pantry' },
      { name: 'Sesame Oil', amount: '1 tbsp', category: 'Pantry' },
      { name: 'Eggs', amount: '4 soft boiled', category: 'Dairy' },
      { name: 'Baby Spinach', amount: '2 cups', category: 'Produce' },
      { name: 'Sweet Corn', amount: '1 cup', category: 'Produce' }
    ],
    instructions: [
      'Boil eggs for 6.5 minutes, transfer to ice bath, peel and slice in half.',
      'Heat broth with soy sauce, garlic, and sesame oil.',
      'Cook ramen noodles separately for 3 mins and drain.',
      'Divide noodles into bowls, pour over hot broth, top with corn, spinach, and soft egg halves.'
    ]
  },
  {
    id: 'rec-5',
    title: 'Chicken Salad Sandwich',
    category: 'Lunch',
    defaultCook: 'Mom',
    prepTime: '10m',
    cookTime: '0m',
    servings: 4,
    rating: 4,
    isFavorite: true,
    imageEmoji: '🥪',
    description: 'Shredded roasted chicken breast with crunchy celery, sweet grapes, and light herb mayo on artisanal bread.',
    ingredients: [
      { name: 'Rotisserie Chicken', amount: '2 cups shredded', category: 'Meat' },
      { name: 'Mayonnaise', amount: '3 tbsp', category: 'Pantry' },
      { name: 'Celery', amount: '2 stalks diced', category: 'Produce' },
      { name: 'Red Grapes', amount: '1/2 cup halved', category: 'Produce' },
      { name: 'Artisan Bread', amount: '8 slices', category: 'Pantry' },
      { name: 'Crisp Lettuce', amount: '4 leaves', category: 'Produce' }
    ],
    instructions: [
      'In a bowl, mix shredded chicken, mayo, celery, and halved grapes.',
      'Lightly toast artisan bread slices.',
      'Assemble sandwiches with fresh lettuce leaves and generous scoops of chicken salad.'
    ]
  },
  {
    id: 'rec-6',
    title: 'Elmon Picnic Sandwich',
    category: 'Lunch',
    defaultCook: 'Dad',
    prepTime: '5m',
    cookTime: '0m',
    servings: 4,
    rating: 4,
    isFavorite: false,
    imageEmoji: '🥪',
    description: 'Classic Ghibli style picnic sandwich with smoked ham, sharp cheddar, thin cucumber slices, and country butter.',
    ingredients: [
      { name: 'Smoked Ham Slices', amount: '8 slices', category: 'Meat' },
      { name: 'Cheddar Cheese', amount: '4 slices', category: 'Dairy' },
      { name: 'English Cucumber', amount: '1/2 sliced thin', category: 'Produce' },
      { name: 'Country Butter', amount: '2 tbsp softened', category: 'Dairy' },
      { name: 'Country White Bread', amount: '8 slices', category: 'Pantry' }
    ],
    instructions: [
      'Spread country butter evenly on bread slices.',
      'Layer smoked ham, cheddar cheese, and thin cucumber ribbons.',
      'Cut diagonally into cute triangular picnic sandwiches.'
    ]
  },
  {
    id: 'rec-7',
    title: 'Hearty Beef Stew',
    category: 'Dinner',
    defaultCook: 'Dad',
    prepTime: '25m',
    cookTime: '60m',
    servings: 6,
    rating: 5,
    isFavorite: true,
    imageEmoji: '🍲',
    description: 'Thick, comforting beef stew with slow-simmered tender beef chuck, chunky carrots, and potatoes.',
    ingredients: [
      { name: 'Beef Chuck Roast', amount: '2 lbs cubed', category: 'Meat' },
      { name: 'Carrots', amount: '4 large chopped', category: 'Produce' },
      { name: 'Yukon Gold Potatoes', amount: '4 large cubed', category: 'Produce' },
      { name: 'Yellow Onions', amount: '2 chopped', category: 'Produce' },
      { name: 'Beef Broth', amount: '4 cups', category: 'Pantry' },
      { name: 'Tomato Paste', amount: '2 tbsp', category: 'Pantry' },
      { name: 'Garlic', amount: '4 cloves minced', category: 'Produce' }
    ],
    instructions: [
      'Sear seasoned beef chuck cubes in a Dutch oven until browned on all sides.',
      'Sauté onions and garlic until fragrant, stir in tomato paste.',
      'Pour in beef broth, add carrots and potatoes.',
      'Cover and simmer on low for 60 mins until beef is melt-in-your-mouth tender.'
    ]
  },
  {
    id: 'rec-8',
    title: 'Homemade Pizza Night',
    category: 'Dinner',
    defaultCook: 'Family',
    prepTime: '20m',
    cookTime: '15m',
    servings: 6,
    rating: 5,
    isFavorite: true,
    imageEmoji: '🍕',
    description: 'Fun family interactive cooking night! Hand-stretched dough with sweet tomato passata, creamy mozzarella, and fresh basil.',
    ingredients: [
      { name: 'Pizza Dough Balls', amount: '2', category: 'Pantry' },
      { name: 'Tomato Sauce / Passata', amount: '1 cup', category: 'Pantry' },
      { name: 'Fresh Mozzarella', amount: '8 oz torn', category: 'Dairy' },
      { name: 'Fresh Basil Leaves', amount: '1 handful', category: 'Produce' },
      { name: 'Extra Virgin Olive Oil', amount: '2 tbsp', category: 'Pantry' },
      { name: 'Pepperoni Slices', amount: '1/2 cup (optional)', category: 'Meat' }
    ],
    instructions: [
      'Preheat oven to 475°F (245°C) with a pizza stone or baking sheet inside.',
      'Stretch dough into circles on parchment paper.',
      'Ladle tomato sauce, top with fresh mozzarella and pepperoni.',
      'Bake for 12-15 mins until crust is golden and cheese is bubbly. Finish with fresh basil!'
    ]
  },
  {
    id: 'rec-9',
    title: 'Eventy Salmon Bento',
    category: 'Dinner',
    defaultCook: 'Family',
    prepTime: '15m',
    cookTime: '20m',
    servings: 4,
    rating: 4,
    isFavorite: true,
    imageEmoji: '🍱',
    description: 'Pan-glazed teriyaki salmon over steamed jasmine rice with tamagoyaki sweet egg roll and pickled cucumber.',
    ingredients: [
      { name: 'Salmon Fillets', amount: '4 fillets', category: 'Meat' },
      { name: 'Teriyaki Sauce', amount: '4 tbsp', category: 'Pantry' },
      { name: 'Jasmine Rice', amount: '3 cups cooked', category: 'Pantry' },
      { name: 'Sesame Seeds', amount: '1 tbsp', category: 'Pantry' },
      { name: 'Pickled Cucumber', amount: '1 cup', category: 'Produce' },
      { name: 'Eggs (for Tamagoyaki)', amount: '3', category: 'Dairy' }
    ],
    instructions: [
      'Pan sear salmon fillets for 4 mins per side, glaze with teriyaki sauce until glossy.',
      'Prepare sweet rolled tamagoyaki omelet in a rectangular pan and slice into rounds.',
      'Pack jasmine rice into bento boxes, top with salmon, egg rolls, pickled cucumber, and toasted sesame seeds.'
    ]
  }
];

// Week starting Monday, July 27, 2026
export const INITIAL_DAYS = [
  {
    dayIndex: 0,
    dayName: 'Mon',
    dateNum: '27',
    fullDate: '2026-07-27',
    meals: {
      breakfast: { title: 'Fluffy Pancakes & Berries', cook: 'Mom', recipeId: 'rec-1', favorite: true, imageEmoji: '🥞' },
      lunch: { title: 'Veggie Ramen', cook: 'Kids', recipeId: 'rec-4', favorite: true, imageEmoji: '🍜' },
      dinner: { title: 'Maple-Curry Pork Chops (goodfood)', cook: 'Mom', recipeId: 'rec-maple-curry-pork-chops', favorite: true, imageEmoji: '🥩' }
    }
  },
  {
    dayIndex: 1,
    dayName: 'Tue',
    dateNum: '28',
    fullDate: '2026-07-28',
    meals: {
      breakfast: { title: 'Miso Soup & Onigiri', cook: 'Dad', recipeId: 'rec-2', favorite: true, imageEmoji: '🍙' },
      lunch: { title: 'Chicken Salad Sandwich', cook: 'Mom', recipeId: 'rec-5', favorite: true, imageEmoji: '🥪' },
      dinner: { title: 'Hearty Meatball and Mushroom Stew (Hello Fresh)', cook: 'Dad', recipeId: 'rec-meatball-mushroom-stew', favorite: true, imageEmoji: '🧆' }
    }
  },
  {
    dayIndex: 2,
    dayName: 'Wed',
    dateNum: '29',
    fullDate: '2026-07-29',
    meals: {
      breakfast: { title: 'Fluffy Pancakes & Berries', cook: 'Mom', recipeId: 'rec-1', favorite: true, imageEmoji: '🥞' },
      lunch: { title: 'Veggie Ramen', cook: 'Kids', recipeId: 'rec-4', favorite: true, imageEmoji: '🍜' },
      dinner: { title: 'Pork and Apple Burger (Hello Fresh)', cook: 'Family', recipeId: 'rec-pork-apple-burger', favorite: true, imageEmoji: '🍔' }
    }
  },
  {
    dayIndex: 3,
    dayName: 'Thu',
    dateNum: '30',
    fullDate: '2026-07-30',
    meals: {
      breakfast: { title: 'Fluffy Soup & Bread Rolls', cook: 'Dad', recipeId: 'rec-3', favorite: true, imageEmoji: '🍲' },
      lunch: { title: 'Chicken Salad Sandwich', cook: 'Mom', recipeId: 'rec-5', favorite: true, imageEmoji: '🥪' },
      dinner: { title: 'Homemade Pizza Night', cook: 'Family', recipeId: 'rec-8', favorite: true, imageEmoji: '🍕' }
    }
  },
  {
    dayIndex: 4,
    dayName: 'Fri',
    dateNum: '31',
    fullDate: '2026-07-31',
    meals: {
      breakfast: { title: 'Fluffy Pancakes & Berries', cook: 'Mom', recipeId: 'rec-1', favorite: true, imageEmoji: '🥞' },
      lunch: { title: 'Elmon Picnic Sandwich', cook: 'Dad', recipeId: 'rec-6', favorite: true, imageEmoji: '🥪' },
      dinner: { title: 'Eventy Salmon Bento', cook: 'Family', recipeId: 'rec-9', favorite: true, imageEmoji: '🍱' }
    }
  },
  {
    dayIndex: 5,
    dayName: 'Sat',
    dateNum: '1',
    fullDate: '2026-08-01',
    meals: {
      breakfast: { title: 'Miso Soup & Onigiri', cook: 'Dad', recipeId: 'rec-2', favorite: true, imageEmoji: '🍙' },
      lunch: { title: 'Elmon Picnic Sandwich', cook: 'Dad', recipeId: 'rec-6', favorite: true, imageEmoji: '🥪' },
      dinner: { title: 'Hearty Beef Stew', cook: 'Dad', recipeId: 'rec-7', favorite: true, imageEmoji: '🍲' }
    }
  },
  {
    dayIndex: 6,
    dayName: 'Sun',
    dateNum: '2',
    fullDate: '2026-08-02',
    meals: {
      breakfast: { title: 'Fluffy Pancakes & Berries', cook: 'Mom', recipeId: 'rec-1', favorite: true, imageEmoji: '🥞' },
      lunch: { title: 'Veggie Ramen', cook: 'Kids', recipeId: 'rec-4', favorite: true, imageEmoji: '🍜' },
      dinner: { title: 'Maple-Curry Pork Chops (goodfood)', cook: 'Mom', recipeId: 'rec-maple-curry-pork-chops', favorite: true, imageEmoji: '🥩' }
    }
  }
];
