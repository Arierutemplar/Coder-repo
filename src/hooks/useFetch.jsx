import { useState, useEffect, use } from "react";

export const useFetch = (url)=> {
    const [data, setData]= useState(null);
    const [loading, setLoading]= useState(true)
    const [error, setError]= useState(null)

    useEffect(()=> {
        fetch(url)
        .then((res)=> res.json())
        .then((response)=> setData(response))
        .catch((err)=> setError(err))
        .finally(()=> setLoading(false))
    },[url])

return {data, loading, error}

}