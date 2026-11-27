export const getProductPricing = product => {
  const rawOriginalPrice = product.originalPrice ?? product.price;
  const parsedOriginalPrice = Number(rawOriginalPrice);
  const originalPrice = rawOriginalPrice != null &&
    rawOriginalPrice !== '' &&
    Number.isFinite(parsedOriginalPrice) &&
    parsedOriginalPrice > 0
    ? parsedOriginalPrice
    : null;

  const parsedDiscountPrice = Number(product.discountPrice);
  const discountPrice = originalPrice !== null &&
    product.discountPrice != null &&
    product.discountPrice !== '' &&
    Number.isFinite(parsedDiscountPrice) &&
    parsedDiscountPrice > 0 &&
    parsedDiscountPrice < originalPrice
    ? parsedDiscountPrice
    : null;

  const calculatedDiscountPercent = discountPrice === null
    ? null
    : Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  const storedDiscountPercent = Number(product.discountPercentage);
  const discountPercent = discountPrice === null
    ? null
    : product.discountPercentage != null &&
      Number.isFinite(storedDiscountPercent) &&
      storedDiscountPercent > 0 &&
      storedDiscountPercent <= 100
      ? storedDiscountPercent
      : calculatedDiscountPercent;

  return {
    originalPrice,
    discountPrice,
    effectivePrice: discountPrice ?? originalPrice,
    discountPercent,
    hasPrice: originalPrice !== null
  };
};
