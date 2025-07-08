console.log("it's alive")

const express = require("express")
const path = require('path')
const app = express()
const port = 3030

app.use(express.static(path.join(__dirname, './')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname , "pages" , 'hello_world.html'));
})

app.listen(port, ()=>{
    console.log(`app listening in port ${port}`)
})


const addProduct = async (itemToAdd)=>{
    //add data db
    const response = await addDataDB(itemToAdd)
    const productData = response.json()

}

const getProduct = async (searchItem)=>{
    //get data db
    const response = await getDataDB(searchItem)
    const productData = response.json()

}

buttonAddProduct.addEventListener("click", (e)=>{
    const elemento = inputAddProduct.value

})
//esta no esta decidido aun :$
buttonSearch.addEventListener("click", (e)=>{
})

