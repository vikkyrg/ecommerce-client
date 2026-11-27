import assert from 'node:assert/strict';
import test from 'node:test';
import { getProductPricing } from './productPricing.js';

test('uses saved prices and the supplied discount percentage when available', () => {
  assert.deepEqual(getProductPricing({
    price: 35,
    discountPrice: 30,
    discountPercentage: 15
  }), {
    originalPrice: 35,
    discountPrice: 30,
    effectivePrice: 30,
    discountPercent: 15,
    hasPrice: true
  });
});

test('calculates a discount percentage when the saved percentage is missing or invalid', () => {
  assert.equal(getProductPricing({
    originalPrice: 2500,
    discountPrice: 2000,
    discountPercentage: 101
  }).discountPercent, 20);
});

test('does not expose invalid or non-discount prices as a discount', () => {
  assert.equal(getProductPricing({ price: -1 }).hasPrice, false);
  assert.equal(getProductPricing({ price: 100, discountPrice: 100 }).discountPercent, null);
});
