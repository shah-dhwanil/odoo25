import React, { useEffect } from 'react'
import { useSimpleApi } from '../hooks/useApi';

const HomePage = () => {
  const { loading, error, get, post, put, patch, delete: deleteReq } = useSimpleApi();
  useEffect(()=>{
    const response = post("/posts",{
    title: 'foo',
    body: 'bar',
    userId: 1,
  });
    console.log(response);
  },[])
  return <button onClick={() => {throw new Error("This is your first error!");}}>Break the world</button>
}

export default HomePage