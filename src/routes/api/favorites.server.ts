import {gql} from '@shopify/hydrogen';
import type {HydrogenApiRouteOptions, HydrogenRequest} from '@shopify/hydrogen';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';

export async function api(_request: HydrogenRequest, { queryShop }: HydrogenApiRouteOptions) {
  const url = new URL(_request.url);
  const search = url.searchParams.get('search');
  var lim =  url.searchParams.get('limit')||'15';
  const pageBy = parseInt(lim);
  var queryKey = BEST_SELLING_QUERY;

  if(search == 'best-seller') {
    queryKey = BEST_SELLING_QUERY;
  }
  else if(search == 'on-sale'){
    queryKey = ON_SALE_QUERY;
  } else {
    queryKey = NEW_PRODUCTS_QUERY;
  }

  return await queryShop({
    query: queryKey,
    variables: {
      count: pageBy,
    },
  });
}

const NEW_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query newProducts(
    $count: Int
    $countryCode: CountryCode
    $languageCode: LanguageCode
  ) @inContext(country: $countryCode, language: $languageCode) {
    products(first: $count, sortKey: CREATED_AT) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

const BEST_SELLING_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query topProducts(
    $count: Int
    $countryCode: CountryCode
    $languageCode: LanguageCode
  ) @inContext(country: $countryCode, language: $languageCode) {
    products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

const ON_SALE_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query onSaleProducts(
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: "on-sale") {
      products(first: $count) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
`;
