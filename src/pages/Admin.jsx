import { useState } from "react"
import { Navigate } from "react-router-dom"
import {
PieChart,
Pie,
Cell,
Tooltip,
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid
} from "recharts"

function Admin({ foods, setFoods, orders = [] }) {

const role = localStorage.getItem("role")

/* BLOCK NON-ADMIN USERS */

if(role !== "admin"){
return <Navigate to="/" />
}

/* FORM STATE */

const [name,setName] = useState("")
const [price,setPrice] = useState("")
const [category,setCategory] = useState("Pizza")
const [editingId,setEditingId] = useState(null)
const [newPrice,setNewPrice] = useState("")

/* ADD FOOD */

const addFood = () => {

if(!name || !price) return

const newFood = {
id: Date.now(),
name,
price:Number(price),
category
}

setFoods([...foods,newFood])

setName("")
setPrice("")

}

/* DELETE FOOD */

const deleteFood = (id) => {

setFoods(foods.filter(food => food.id !== id))

}

const updatePrice = (id) => {

setFoods(
foods.map(food =>
food.id === id
? {...food, price: Number(newPrice)}
: food
)
)

setEditingId(null)
setNewPrice("")

}

/* DASHBOARD METRICS */

const totalOrders = orders.length

const revenue =
orders.reduce((sum,item)=> sum + item.price,0)

const menuItems = foods.length

/* MOST ORDERED FOOD */

const foodCount = {}

orders.forEach(order => {

foodCount[order.name] =
(foodCount[order.name] || 0) + 1

})

let topFood = "None"

let max = 0

for(let food in foodCount){

if(foodCount[food] > max){

max = foodCount[food]
topFood = food

}

}

/* ANALYTICS */

const categoryCount = {}

foods.forEach(food => {

categoryCount[food.category] =
(categoryCount[food.category] || 0) + 1

})

const pieData = Object.keys(categoryCount).map(cat => ({
name: cat,
value: categoryCount[cat]
}))

const barData = foods.map(food => ({
name: food.name,
price: food.price
}))

const COLORS = ["#ff5a3c","#f7b731","#20bf6b","#3867d6","#8854d0"]

return (

<div style={{padding:"40px"}}>

<h1>Admin Dashboard</h1>

{/* DASHBOARD CARDS */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:"20px",
marginTop:"20px"
}}>

<div style={{
background:"white",
padding:"20px",
borderRadius:"10px",
boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
}}>
<h3>Total Orders</h3>
<p style={{fontSize:"22px"}}>{totalOrders}</p>
</div>

<div style={{
background:"white",
padding:"20px",
borderRadius:"10px",
boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
}}>
<h3>Revenue</h3>
<p style={{fontSize:"22px"}}>${revenue}</p>
</div>

<div style={{
background:"white",
padding:"20px",
borderRadius:"10px",
boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
}}>
<h3>Top Food</h3>
<p style={{fontSize:"22px"}}>{topFood}</p>
</div>

<div style={{
background:"white",
padding:"20px",
borderRadius:"10px",
boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
}}>
<h3>Menu Items</h3>
<p style={{fontSize:"22px"}}>{menuItems}</p>
</div>

</div>

{/* ADD FOOD */}

<div style={{
marginTop:"20px",
display:"flex",
gap:"10px"
}}>

<input
placeholder="Food name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Price"
type="number"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>

<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
>

<option>Pizza</option>
<option>Burger</option>
<option>Pasta</option>
<option>Dessert</option>
<option>Main</option>

</select>

<button onClick={addFood}>
Add Food
</button>

</div>

{/* MENU LIST */}

<h2 style={{marginTop:"40px"}}>Manage Menu</h2>

<table style={{width:"100%",marginTop:"10px"}}>

<thead>

<tr>
<th>Name</th>
<th>Category</th>
<th>Price</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{foods.map(food => (

<tr key={food.id}>

<td>{food.name}</td>
<td>{food.category}</td>
<td>${food.price}</td>

<td>

{editingId === food.id ? (

<input
type="number"
value={newPrice}
onChange={(e)=>setNewPrice(e.target.value)}
style={{width:"80px"}}
/>

) : (

<>${food.price}</>

)}

</td>

<td style={{display:"flex",gap:"10px"}}>

{editingId === food.id ? (

<button
onClick={()=>updatePrice(food.id)}
style={{background:"green",color:"white"}}
>
Save
</button>

) : (

<button
onClick={()=>{
setEditingId(food.id)
setNewPrice(food.price)
}}
>
Edit
</button>

)}

<button
onClick={()=>deleteFood(food.id)}
style={{color:"red"}}
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

{/* ANALYTICS */}

<h2 style={{marginTop:"50px"}}>Menu Analytics</h2>

<div style={{
display:"flex",
gap:"40px",
flexWrap:"wrap",
marginTop:"20px"
}}>

<PieChart width={300} height={300}>

<Pie
data={pieData}
cx="50%"
cy="50%"
outerRadius={100}
dataKey="value"
>

{pieData.map((entry,index)=>(
<Cell key={index} fill={COLORS[index % COLORS.length]} />
))}

</Pie>

<Tooltip />

</PieChart>

<BarChart width={400} height={300} data={barData}>

<CartesianGrid strokeDasharray="3 3" />

<XAxis dataKey="name" />

<YAxis />

<Tooltip />

<Bar dataKey="price" fill="#ff5a3c" />

</BarChart>

</div>

</div>

)

}

export default Admin