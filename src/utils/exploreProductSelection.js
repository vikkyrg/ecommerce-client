export const limitExploreProducts = (products, categories, selectedCategory, matchesCategory) => {
  if (selectedCategory === 'All') {
    return categories.flatMap(category =>
      products
        .filter(product => matchesCategory(product, category.slug))
        .slice(0, 2)
    );
  }

  return products.slice(0, 8);
};
