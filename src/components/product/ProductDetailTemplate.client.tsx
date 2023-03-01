import { BuilderComponent, builder } from '@builder.io/react'
import {useEffect, useState} from 'react';
import {
  useProductOptions,
  useCart
} from '@shopify/hydrogen';
import type {
  Product
} from '@shopify/hydrogen/storefront-api-types';

builder.init('679c25f761c647f2a8e6bf979c2a6820')

const MODEL_NAME = 'product-template';

export function ProductDetailTemplate({
  product,
  ...props
}: {
  product: Product;
}) {
  if (!product) {
    return null;
  }

  const [builderContentJson, setBuilderContentJson] = useState(undefined)

  useEffect(() => { 
    builder.get(MODEL_NAME, {
      query: {
        data: {
          active: 'true',
          someNumber: { $ne: 1 }
        }
      }
    })
      .promise().then(setBuilderContentJson)
  }, [])

  const { linesAdd } = useCart();
  const [quantity, setQuantity] = useState(1);
  const {selectedVariant} = useProductOptions();
  const variantId = selectedVariant?.id ? selectedVariant?.id : '';

  const handleUpdateQuantity = (event) => {
    setQuantity(parseInt(event.target.value));
  }

  const handleAddItem = () => {
    linesAdd([
      {
        quantity,
        merchandiseId: variantId
      },
    ]);
  };

  return (
    <BuilderComponent model={MODEL_NAME} content={builderContentJson}
      data={{
        products: product,
        addToCart: () => handleAddItem(),
        updateQuantity: (event) => handleUpdateQuantity(event)
      }}
    />
  )
}
