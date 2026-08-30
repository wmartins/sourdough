export type RecipeInput = {
  weight: number;
  hydration: number;
  starter: number;
  salt: number;
};

export type RecipeResult = {
  hydration: number;
  flour: number;
  water: number;
  starter: {
    total: number;
    flour: number;
    water: number;
  };
  salt: number;
};
