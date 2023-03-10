import {Suspense} from 'react';

import {PageHeader} from '~/components';
import {NotFound, Layout} from '~/components/index.server';
import {BuilderComponent} from '~/components/BuilderComponent.client';

import {useQuery} from '@shopify/hydrogen';
import {builder} from '@builder.io/react';

builder.init('679c25f761c647f2a8e6bf979c2a6820');

const MODEL_NAME = 'builder';

export default function Page(props: any) {
  const content = useQuery([MODEL_NAME, props.pathname], async () => {
    return await builder
      .get(MODEL_NAME, {
        userAttributes: {
          urlPath: props.pathname,
        },
      })
      .promise();
  });

  const params = new URLSearchParams(props.search);
  const isPreviewing = params.has('builder.preview');
  console.log(content);

  return (
    <div>
      {!content.data && !isPreviewing ? (
        <NotFound></NotFound>
      ) : (
        <Layout>
          <Suspense></Suspense>
          <BuilderComponent model={MODEL_NAME} content={content?.data} />
        </Layout>
      )}
    </div>
  );
}
