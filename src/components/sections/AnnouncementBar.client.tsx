import { BuilderComponent, builder } from '@builder.io/react'
import {useEffect, useState} from 'react';
import Cookies from 'universal-cookie';

builder.init('679c25f761c647f2a8e6bf979c2a6820')
  
export const AnnouncementBar = () => {
  const [builderContentJson, setBuilderContentJson] = useState(undefined)

  const cookies = new Cookies();

  useEffect(() => { 
    builder.get('announcement-bar', { url: location.pathname })
      .promise()
      .then(setBuilderContentJson)
  }, [])

  const closeBar = (event) =>{
    event.preventDefault();
    cookies.set('hideBar', 'true', { path: '/',maxAge :15 });
  }

  return <BuilderComponent 
    model="announcement-bar" 
    context={{
    closeBar: (event) => closeBar(event),
    hide: cookies.get('hideBar')=="true"
  }}  content={builderContentJson} />
}