import { Builder } from "@builder.io/react";
import { useEffect, useState, useCallback } from 'react';
import { Grid, ProductCard } from '~/components';
import { getImageLoadingPriority } from '~/lib/const';

export const ProductCollection = (props) => {
  const [products, setProducts] = useState([]);

  const funcFetch = useCallback(async (url: string) => {
    const postUrl = new URL(window.location.origin + url);
    const response = await fetch(postUrl, {
      method: 'POST',
    });
    const { data } = await response.json();
    setProducts(data?.collection?.products.nodes || []);
    console.log(data?.collection?.products.nodes || "[Error]");
  }, [props.collection, props.limit, props.sort]);

  console.log(products);

  useEffect(() => {
    try {
      funcFetch(`/api/collection?group=${encodeURIComponent(props.collection)}&sort=${props.sort}&limit=${encodeURIComponent(props.limit)}`);
    }
    catch (e) {
      console.log('Log ERROR:');
      console.log(e);
    }
    console.log(props.collection);
  }, [props.collection, props.limit, props.sort, props.carousel]);

  return (
    <div>
      <h2 style={{fontSize: "40px", fontWeight: "bold", textAlign: "center"}}>{props.title}</h2>
      {props.carousel ? "carousel" :
        <Grid layout="products">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              loading={getImageLoadingPriority(i)}
            />
          ))}
        </Grid>
      }
    </div>
  );
}

Builder.registerComponent(ProductCollection, {
  name: "Feature products",
  inputs: [
    {
      name: "title",
      type: "text",
      defaultValue: 'Feature Collection!'
    },
    {
      name: 'collection',
      type: 'ShopifyCollectionHandle',
    },
    {
      name: 'sort',
      type: 'string',
      defaultValue: 'TITLE',
      enum: ['TITLE', 'PRICE', 'BEST_SELLING', 'CREATED', 'ID', 'MANUAL', 'COLLECTION_DEFAULT', 'RELEVANCE'],
    },
    {
      name: "limit",
      type: "number",
      defaultValue: 15
    },
    {
      name: 'carousel',
      type: 'boolean',
      defaultValue: false,
      friendlyName:'Carousel',
    }
  ],
});