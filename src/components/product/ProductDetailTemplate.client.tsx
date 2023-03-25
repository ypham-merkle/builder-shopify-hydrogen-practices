import { BuilderComponent, builder } from '@builder.io/react'
import {useEffect, useState, useCallback} from 'react';
import {
  isBrowser,
  useProductOptions,
  useCart,
  useUrl,
  OptionWithValues
} from '@shopify/hydrogen';
import type {
  Product
} from '@shopify/hydrogen/storefront-api-types';

builder.init('679c25f761c647f2a8e6bf979c2a6820')

const MODEL_NAME = 'product-template';

export function ProductDetailTemplate({
  product
}: {
  product: Product;
}) {
  const { linesAdd } = useCart();
  const [quantity, setQuantity] = useState(1);
  const {options, setSelectedOption, selectedOptions, selectedVariant} = useProductOptions();
  const variantId = selectedVariant?.id ? selectedVariant?.id : '';
  const {pathname, search} = useUrl();
  const [params, setParams] = useState(new URLSearchParams(search));

  if (!product) {
    return null;
  }

  // Load page builder content
  const [builderContentJson, setBuilderContentJson] = useState(undefined)
  useEffect(() => { 
    builder.get(MODEL_NAME, {
      query: {
        data: {
          active: 'true',
          someNumber: { $ne: 1 }
        }
      }
    }).promise().then(setBuilderContentJson)
  }, [])
  
  useEffect(() => {
    (options as OptionWithValues[]).map(({name, values}) => {
      if (!params) return;
      const currentValue = params.get(name.toLowerCase()) || null;
      if (currentValue) {
        const matchedValue = values.filter(
          (value) => encodeURIComponent(value.toLowerCase()) === currentValue,
        );
        setSelectedOption(name, matchedValue[0]);
      } else {
        params.set(
          encodeURIComponent(name.toLowerCase()),
          encodeURIComponent(selectedOptions![name]!.toLowerCase()),
        ),
          window.history.replaceState(
            null,
            '',
            `${pathname}?${params.toString()}`,
          );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Add "checked" class for selected Variant when loaded page
  useEffect(() => {
    const productVariants = document.getElementsByClassName('variant-item');

    for (const element of productVariants) {
      const nameVariants = element.querySelector('.variant-name span')?.textContent;
      const variantsValues = element.querySelectorAll('.variants-values label');

      for(const item of variantsValues) {
        if(typeof nameVariants === 'string') {
          if(item.getElementsByTagName('span')[0].innerText == selectedOptions![nameVariants]) {
            item.classList.add('checked');
          } else {
            item.classList.remove('checked');
          }
        }
      }
    };
  }, [selectedOptions, builderContentJson]);

  //Handle update variants
  const handleUpdateVariants = useCallback(
    (event: any) => {
      const labelParent = event.target.parentElement;
      const variantsValues = event.target.closest('.variants-values');
      const listLabel = variantsValues.getElementsByTagName('label');

      const value = event.target.innerText;
      const name = labelParent.getAttribute('for');
      setSelectedOption(name, value);

      for (const item of listLabel) {
        if(item.getElementsByTagName('span')[0].innerText === value) {
          item.classList.add('checked');
        } else {
          item.classList.remove('checked');
        }
      };

      if (!params) return;
      params.set(
        encodeURIComponent(name.toLowerCase()),
        encodeURIComponent(value.toLowerCase()),
      );
      
      if (isBrowser()) {
        window.history.replaceState(
          null,
          '',
          `${pathname}?${params.toString()}`,
        );
      }
    },
    [setSelectedOption, params, pathname]
  );

  // Handle update quantity
  const handleUpdateQuantity = (event: any) => {
    setQuantity(parseInt(event.target.value));
  }

  // Handle add to cart item
  const handleAddItem = () => {
    linesAdd([
      {
        quantity,
        merchandiseId: variantId
      },
    ]);
  };

  let my_options: []
  options?.forEach((result) => {
      //options.push({value: result?.value, name: result?.name})
  })
  console.log(options);

  return (
    <BuilderComponent model={MODEL_NAME} content={builderContentJson}
      data={{
        products: product,
        variantsOptions: options,
        selectedVariant: selectedVariant,
        addToCart: () => handleAddItem(),
        updateQuantity: (event: any) => handleUpdateQuantity(event),
        updateVariants: (event: any) => handleUpdateVariants(event)
      }}
    />
  )
}
