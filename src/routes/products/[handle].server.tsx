import {Suspense} from 'react';
import {
  gql,
  ProductOptionsProvider,
  Seo,
  ShopifyAnalyticsConstants,
  useLocalization,
  useRouteParams,
  useServerAnalytics,
  useShopQuery,
} from '@shopify/hydrogen';

import {MEDIA_FRAGMENT} from '~/lib/fragments';
import {getExcerpt} from '~/lib/utils';
import {NotFound, Layout, ProductSwimlane} from '~/components/index.server';
import {
  Heading,
  ProductDetail,
  ProductForm,
  ProductGallery,
  Section,
  Text,
} from '~/components';

import {useQuery} from '@shopify/hydrogen';
import {builder} from '@builder.io/react';
import {BuilderComponent} from '~/components/BuilderComponent.client';

builder.init('679c25f761c647f2a8e6bf979c2a6820');

const MODEL_NAME = 'product-template';

export default function Product(props: any) {
  const content = useQuery([MODEL_NAME], async () => {
    return await builder
      .get(MODEL_NAME, {
        query: {
          data: {
            active: 'true',
            someNumber: { $ne: 1 }
          }
        }
      })
      .promise();
  });

  const params = new URLSearchParams(props.search);
  const isPreviewing = params.has('builder.preview');

  const {handle} = useRouteParams();
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {
    data: {product, shop},
  } = useShopQuery({
    query: PRODUCT_QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      handle,
    },
    preload: true,
  });

  if (!product) {
    return <NotFound type="product" />;
  }

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.product,
      resourceId: product.id,
    },
  });

  const {media, title, vendor, descriptionHtml, id} = product;
  const {shippingPolicy, refundPolicy} = shop;

  return (
    <>
      {!content.data && !isPreviewing ? (
        <NotFound></NotFound>
      ) : (
        <Layout>
          <Suspense>
            <Seo type="product" data={product} />
          </Suspense>
          <Suspense>
            <BuilderComponent model={MODEL_NAME} content={content?.data} data={{ products: product }} />
          </Suspense>
          <ProductOptionsProvider data={product}>
            <Section padding="x" className="px-0">
              <div className="grid items-start md:gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
                <ProductGallery
                  media={media.nodes}
                  className="w-screen md:w-full lg:col-span-2"
                />
                <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll">
                  <section className="flex flex-col w-full max-w-xl gap-8 p-6 md:mx-auto md:max-w-sm md:px-0">
                    <div className="grid gap-2">
                      <Heading as="h1" format className="whitespace-normal">
                        {title}
                      </Heading>
                      {vendor && (
                        <Text className={'opacity-50 font-medium'}>{vendor}</Text>
                      )}
                    </div>
                    <ProductForm />
                    <div className="grid gap-4 py-4">
                      {descriptionHtml && (
                        <ProductDetail
                          title="Product Details"
                          content={descriptionHtml}
                        />
                      )}
                      {shippingPolicy?.body && (
                        <ProductDetail
                          title="Shipping"
                          content={getExcerpt(shippingPolicy.body)}
                          learnMore={`/policies/${shippingPolicy.handle}`}
                        />
                      )}
                      {refundPolicy?.body && (
                        <ProductDetail
                          title="Returns"
                          content={getExcerpt(refundPolicy.body)}
                          learnMore={`/policies/${refundPolicy.handle}`}
                        />
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </Section>
            <Suspense>
              <ProductSwimlane title="Related Products" data={id} />
            </Suspense>
          </ProductOptionsProvider>
        </Layout>
      )}
    </>
  );
}

const PRODUCT_QUERY = gql`
  ${MEDIA_FRAGMENT}
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      descriptionHtml
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 100) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
          priceV2 {
            amount
            currencyCode
          }
          compareAtPriceV2 {
            amount
            currencyCode
          }
          sku
          title
          unitPrice {
            amount
            currencyCode
          }
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
`;
