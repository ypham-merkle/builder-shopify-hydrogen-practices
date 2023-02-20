import { Builder } from "@builder.io/react";
import { useEffect, useState, useCallback } from 'react';
import { Grid, ProductCard } from '~/components';
import { getImageLoadingPriority } from '~/lib/const';

export const ProductCollection = (props) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('new');

  const funcFetch = useCallback(async (url: string) => {
    const postUrl = new URL(window.location.origin + url);
    const response = await fetch(postUrl, {
      method: 'POST',
    });
    const { data } = await response.json();
    setProducts(data?.collection?.products.nodes || data?.products?.nodes || []);
    console.log(data || "[Error]");
  }, [search]);

  console.log(search);

  useEffect(() => {
    try {
      funcFetch(`/api/bestSellers?search=${encodeURIComponent(search)}&limit=${encodeURIComponent(props.limit)}`);
    }
    catch (e) {
      console.log('Log ERROR:');
      console.log(e);
    }
    console.log(props.collection);
  }, [search]);

  return (
    <>
      <h2 style={{fontSize: "40px", fontWeight: "bold", textAlign: "center"}}>{props.title}</h2>

      <div className="tab-best-seller">
        <button className={(search == 'best-seller' ? "active" : "") + " tablinks"} onClick={() => setSearch('best-seller')}>Best Seller</button>
        <button className={(search == 'new' ? "active" : "") + " tablinks"} onClick={() => setSearch('new')}>New Arrivals</button>
        <button className={(search == 'on-sale' ? "active" : "") + " tablinks"} onClick={() => setSearch('on-sale')}>On Sale</button>
      </div>

      <Grid layout="products">
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            loading={getImageLoadingPriority(i)}
          />
        ))}
      </Grid>
    </>
  );
}

Builder.registerComponent(ProductCollection, {
  name: "Best Seller",
  inputs: [
    {
      name: "title",
      type: "text",
      defaultValue: 'Best Seller!'
    },
    {
      name: "limit",
      type: "number",
      defaultValue: 8
    }
  ],
});