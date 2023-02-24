import {gql} from '@shopify/hydrogen';
import type {HydrogenApiRouteOptions, HydrogenRequest} from '@shopify/hydrogen';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';

export async function api(_request: HydrogenRequest, { queryShop }: HydrogenApiRouteOptions) {
  const url = new URL(_request.url);
  const cursor = url.searchParams.get('cursor');
  const country = url.searchParams.get('country');
  const handle = url.searchParams.get('group');
  const sort = url.searchParams.get('sort');
  var lim =  url.searchParams.get('limit')||'15';
  const pageBy = parseInt(lim);

  return await queryShop({
    query: PAGINATE_COLLECTION_QUERY,
    variables: {
      handle,
      cursor,
      pageBy,
      country,
      sort
    },
  });
}

const PAGINATE_COLLECTION_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionPage(
    $handle: String!
    $pageBy: Int!
    $cursor: String
    $country: CountryCode
    $language: LanguageCode
    $sort: ProductCollectionSortKeys
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: $pageBy, sortKey: $sort, after: $cursor) {
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
