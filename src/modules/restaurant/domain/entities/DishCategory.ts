export enum DishCategory {
  Entradas = 'Entradas',
  PlatosFuertes = 'PlatosFuertes',
  Sopas = 'Sopas',
  Bebidas = 'Bebidas',
  Postres = 'Postres',
}

export const DishCategoryLabels: Record<DishCategory, string> = {
  [DishCategory.Entradas]: 'Entradas',
  [DishCategory.PlatosFuertes]: 'Platos Fuertes',
  [DishCategory.Sopas]: 'Sopas',
  [DishCategory.Bebidas]: 'Bebidas',
  [DishCategory.Postres]: 'Postres',
};

export const DishCategoryValues: Record<DishCategory, number> = {
  [DishCategory.Entradas]: 1,
  [DishCategory.PlatosFuertes]: 2,
  [DishCategory.Sopas]: 3,
  [DishCategory.Bebidas]: 4,
  [DishCategory.Postres]: 5,
};

export const getDishCategoryOptions = () => {
  // Orden específico: Entradas, PlatosFuertes, Sopas, Bebidas, Postres
  const orderedCategories: DishCategory[] = [
    DishCategory.Entradas,
    DishCategory.PlatosFuertes,
    DishCategory.Sopas,
    DishCategory.Bebidas,
    DishCategory.Postres,
  ];

  return orderedCategories.map((category) => ({
    value: DishCategoryValues[category],
    label: DishCategoryLabels[category],
  }));
};
