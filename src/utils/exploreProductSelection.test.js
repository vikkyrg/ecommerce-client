import test from 'node:test';
import assert from 'node:assert/strict';
import { limitExploreProducts } from './exploreProductSelection.js';

const categories = [
  { slug: 'polishing' },
  { slug: 'adhesives' },
  { slug: 'machines' }
];
const products = categories.flatMap(category =>
  Array.from({ length: 10 }, (_, index) => ({
    category: category.slug,
    name: `${category.slug}-${index}`
  }))
);
const matchesCategory = (product, slug) => product.category === slug;

test('all products shows at most two products from each category', () => {
  const selected = limitExploreProducts(products, categories, 'All', matchesCategory);

  assert.equal(selected.length, 6);
  for (const category of categories) {
    assert.equal(selected.filter(product => product.category === category.slug).length, 2);
  }
});

test('a selected category view shows no more than eight products', () => {
  const categoryProducts = products.filter(product => product.category === 'adhesives');
  const selected = limitExploreProducts(categoryProducts, categories, 'adhesives', matchesCategory);

  assert.equal(selected.length, 8);
  assert.ok(selected.every(product => product.category === 'adhesives'));
});
