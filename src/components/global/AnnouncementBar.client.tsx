import { BuilderComponent, builder } from '@builder.io/react'
import {useEffect, useState} from 'react';
import Cookies from 'universal-cookie';

builder.init('5392aabdddfe455c892d9897f30391a0')
  
export const AnnouncementBar = () => {
  const [builderContentJson, setBuilderContentJson] = useState(undefined)

  const cookies = new Cookies();

  useEffect(() => { 
    builder.get('announcement-bar-y',
    { entry: '2ac76806face405cb4589efb1d61997e' })
      .promise()
      .then(setBuilderContentJson)
  }, [])

  const closeBar = (event) =>{
    event.preventDefault();
    cookies.set('hideBar', 'true', { path: '/',maxAge :15 });
  }

  return <BuilderComponent 
    model="announcement-bar-y" 
    context={{
    closeBar: (event) => closeBar(event),
    hide: cookies.get('hideBar')=="true"
  }}  content={builderContentJson} />
}