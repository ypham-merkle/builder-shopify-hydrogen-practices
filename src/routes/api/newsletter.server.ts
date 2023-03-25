import {
    CacheNone,
    gql,
    type HydrogenRequest,
    type HydrogenApiRouteOptions,
  } from '@shopify/hydrogen';
import {getApiErrorMessage} from '~/lib/utils';

export async function api(
    request: HydrogenRequest,
    {queryShop}: HydrogenApiRouteOptions,
) {
    const jsonBody = await request.json();

    if (!jsonBody.email || jsonBody.email === '') {
        return new Response(
            JSON.stringify({error: 'Email are required'}),
            {status: 400},
        );
    }

    const {data, errors} = await queryShop<{customerCreate: any}>({
        query: CUSTOMER_CREATE_MUTATION,
        variables: {
            input: {
              email: jsonBody.email,
              password: '12345',
              acceptsMarketing: true
            },
        },
        // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
        cache: CacheNone(),
    });

    const errorMessage = getApiErrorMessage('customerCreate', data, errors);

    console.log('errorMessage: ' + errorMessage);
    console.log('data: ' + data);

    if (!errorMessage && data && data.customerCreate && data.customerCreate.customer && data.customerCreate.customer.id
    ) {
        return new Response(null, {
            status: 200,
        });
    } else {
        return new Response(
        JSON.stringify({
            error: errorMessage ?? 'Unknown error',
        }),
        {status: 401},
        );
    }
}

const CUSTOMER_CREATE_MUTATION = gql`
    mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
            customer {
                id
            }
            customerUserErrors {
                code
                field
                message
            }
        }
    }
`;