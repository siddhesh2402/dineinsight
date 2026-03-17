import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import FoodCard from "./components/Foodcard"
import { foods as initialFoods } from "./data/foods"
import { Routes, Route } from "react-router-dom"
import Cart from "./pages/Cart"
import Admin from "./pages/Admin"
import hero from "./assets/hero-food.jpg"
import LoginPopup from "./components/LoginPopup"

function App() {

const [foods, setFoods] = useState(initialFoods)
const [category, setCategory] = useState("All")
const [search, setSearch] = useState("")
const [cart, setCart] = useState([])
const [orders, setOrders] = useState([])
const [showLogin,setShowLogin] = useState(false)

/* CURRENT USER */

const userEmail = localStorage.getItem("userEmail")

/* LOAD CART WHEN USER LOGS IN */

useEffect(()=>{

if(userEmail){

const savedCart =
JSON.parse(localStorage.getItem("cart_"+userEmail)) || []

setCart(savedCart)

}else{

setCart([])

}

},[userEmail])

/* SAVE CART */

const saveCart = (updatedCart) => {

setCart(updatedCart)

if(userEmail){

localStorage.setItem(
"cart_"+userEmail,
JSON.stringify(updatedCart)
)

}

}

/* ADD TO CART */

const addToCart = (food) => {

const existingItem = cart.find(item => item.id === food.id)

let updatedCart

if(existingItem){

updatedCart =
cart.map(item =>
item.id === food.id
? {...item, qty: item.qty + 1}
: item
)

}else{

updatedCart = [...cart,{...food, qty:1}]

}

saveCart(updatedCart)

}

/* REMOVE FROM CART */

const removeFromCart = (foodId) => {

const updatedCart =
cart
.map(item =>
item.id === foodId
? {...item, qty: item.qty - 1}
: item
)
.filter(item => item.qty > 0)

saveCart(updatedCart)

}

const checkout = () => {

if(cart.length === 0) return

const newOrders = [...orders, ...cart]

setOrders(newOrders)

setCart([])

if(userEmail){
localStorage.setItem("cart_"+userEmail, JSON.stringify([]))
}

alert("Order placed successfully!")

}

/* CHECKOUT */

const checkout = () => {

if(cart.length === 0) return

const newOrder = {
id: Date.now(),
items: cart,
total: cart.reduce((sum,item)=>sum + item.price * item.qty,0)
}

setOrders(prev => [...prev,newOrder])

setCart([])

alert("Order placed successfully!")

}

/* FILTER FOODS */

const filteredFoods = foods.filter(food => {

const categoryMatch =
category === "All" || food.category === category

const searchMatch =
food.name.toLowerCase().includes(search.toLowerCase())

return categoryMatch && searchMatch

})

return (

<div style={{
background:"#f5f5f5",
minHeight:"100vh",
fontFamily:"Arial"
}}>

<Navbar
cartCount={cart.reduce((total,item)=>total+item.qty,0)}
setShowLogin={setShowLogin}
/>

{showLogin && <LoginPopup setShowLogin={setShowLogin} />}

<Routes>

{/* HOME */}

<Route
path="/"
element={

<div>

{/* HERO */}

<div style={{
maxWidth:"1200px",
margin:"40px auto",
borderRadius:"16px",
overflow:"hidden"
}}>

<img
src={hero}
style={{
width:"100%",
height:"300px",
objectFit:"cover"
}}
/>

</div>

{/* TITLE */}

<div style={{textAlign:"center"}}>

<h2>Explore Our Menu</h2>

<p style={{color:"#666"}}>
Choose from a variety of delicious dishes
</p>

</div>

{/* SEARCH */}

<div style={{
display:"flex",
justifyContent:"center",
marginTop:"20px"
}}>

<input
type="text"
placeholder="Search pizza, burger, pasta..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
width:"350px",
padding:"12px",
borderRadius:"30px",
border:"1px solid #ddd"
}}
/>

</div>

{/* CATEGORY */}

<div style={{
display:"flex",
justifyContent:"center",
gap:"15px",
margin:"30px 0",
flexWrap:"wrap"
}}>

{["All","Pizza","Burger","Pasta","Dessert","Main"].map(cat => (

<button
key={cat}
onClick={()=>setCategory(cat)}
style={{
background: category===cat ? "#1B4332" : "white",
color: category===cat ? "white" : "#333",
border:"1px solid #ddd",
padding:"10px 20px",
borderRadius:"30px",
cursor:"pointer"
}}
>
{cat}
</button>

))}

</div>

{/* FOOD GRID */}

<div style={{
maxWidth:"1200px",
margin:"auto",
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
gap:"30px",
padding:"20px"
}}>

{filteredFoods.map(food => (

<FoodCard
key={food.id}
food={food}
cart={cart}
addToCart={addToCart}
removeFromCart={removeFromCart}
/>

))}

</div>

</div>

}
/>

{/* CART */}

<Route
path="/cart"
element={
<Cart
cart={cart}
addToCart={addToCart}
removeFromCart={removeFromCart}
checkout={checkout}
/>
}
/>

{/* ADMIN */}

<Route
path="/admin"
element={
<Admin
foods={foods}
setFoods={setFoods}
orders={orders}
/>
}
/>

</Routes>

</div>

)

}

export default App