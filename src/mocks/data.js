const products =[
    {
        id:'01',
        name: 'Random 1',
        description: 'lorem lorem',
        price: 5200,
        stock: 15,
        img:'https://picsum.photos/200',
        category: 'nuevos'
    },
    {
        id:'02',
        name: 'Random 2',
        description: 'lorem lorem',
        price: 15200,
        stock: 14,
        img:'https://i.postimg.cc/L8RBBRpf/darth-vader.png',
        category: 'mas vendidos'
    },
     {
        id:'03',
        name: 'Random 3',
        description: 'lorem lorem',
        price: 17200,
        stock: 8,
        img:'https://i.postimg.cc/vB1KCwWM/D-NQ-NP-2X-790947-MLU74201862127-012024-F.webp',
        category: 'ofertas'
    },
     {
        id:'04',
        name: 'Random 4',
        description: 'lorem lorem',
        price: 8200,
        stock: 25,
        img:'https://picsum.photos/205',
        category: 'nuevos'
    },
]


export const getProducts = ()=> {
    return new Promise((resolve)=> {
        setTimeout(()=>{
            resolve(products)
        },3000)
    })
}

export const getOneProduct = (id)=> {
    return new Promise((resolve, reject)=> {
        const item = products.find((prd)=> prd.id === id)
        setTimeout(()=>{
            if(item){
                resolve(item)
            }else{
                reject('El producto no existe')
            }
        },3000)
    })
}