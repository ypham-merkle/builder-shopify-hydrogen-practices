import {Suspense} from 'react';
import {
  CacheLong,
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useShopQuery,
} from '@shopify/hydrogen';

import {NotFound, Layout} from '~/components/index.server';

import {BuilderComponent} from '~/components/BuilderComponent.client';
import {useQuery} from '@shopify/hydrogen';
import {builder} from '@builder.io/react';

builder.init('679c25f761c647f2a8e6bf979c2a6820');

const MODEL_NAME = 'homepage';

export default function Homepage(props: any) {
  const content = useQuery([MODEL_NAME, props.entry], async () => {
    return await builder
      .get(MODEL_NAME, {
        userAttributes: {
          entry: '679c25f761c647f2a8e6bf979c2a6820_e933474042e9449ab64c4432dff90c15'
        },
      })
      .promise();
  });

  const params = new URLSearchParams(props.search);
  const isPreviewing = params.has('builder.preview');
  console.log(content);

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.home,
    },
  });
  
  return (
    <>
      {!content.data && !isPreviewing ? (
        <NotFound></NotFound>
      ) : (
        <Layout>
          <Suspense>
            <SeoForHomepage />
          </Suspense>
          <Suspense>
            <BuilderComponent model={MODEL_NAME} content={content?.data} />
          </Suspense>
        </Layout>
      )}
    </>
  );
}

function SeoForHomepage() {
  const {
    data: {
      shop: {title, description},
    },
  } = useShopQuery({
    query: HOMEPAGE_SEO_QUERY,
    cache: CacheLong(),
    preload: true,
  });

  return (
    <Seo
      type="homepage"
      data={{
        title,
        description,
        titleTemplate: '%s · Powered by Hydrogen',
      }}
    />
  );
}

const HOMEPAGE_SEO_QUERY = gql`
  query homeShopInfo {
    shop {
      title: name
      description
    }
  }
`;
