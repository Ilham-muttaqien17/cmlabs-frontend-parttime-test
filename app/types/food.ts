export type Ingredient = {
  id: string;
  title: string;
  name: string;
  description: string;
  thumbnail: string;
  type: string | null;
};

export type Meal = {
  id: string;
  title: string;
  thumbnail: string;
};

export type DetailMeal = Meal & {
  category: string;
  area: string;
  instructions: string;
  youtubeSrc: string;
  receipts: string[];
};
