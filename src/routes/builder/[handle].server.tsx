import {Suspense} from 'react';

import {PageHeader} from '~/components';
import {NotFound, Layout} from '~/components/index.server';
import {BuilderComponent} from '~/components/BuilderComponent.client';

import {useQuery} from '@shopify/hydrogen';
import {builder} from '@builder.io/react';

builder.init('5392aabdddfe455c892d9897f30391a0');

const MODEL_NAME = 'page';

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
          <PageHeader heading={content?.data?.data?.title}>
            <BuilderComponent model={MODEL_NAME} content={content?.data} />
          </PageHeader>
        </Layout>
      )}
    </div>
  );
}
