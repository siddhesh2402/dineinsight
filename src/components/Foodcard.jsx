function FoodCard({ food, cart, addToCart, removeFromCart }) {

const cartItem = cart.find(item => item.id === food.id)
const qty = cartItem ? cartItem.qty : 0

return (

<div style={{
background:"white",
borderRadius:"10px",
padding:"15px",
textAlign:"center",
boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
}}>

<img
src={food.image}
style={{
width:"100%",
height:"150px",
objectFit:"cover",
borderRadius:"8px"
}}
/>

<h3>{food.name}</h3>

{/* ⭐ Rating */}
<div style={{color:"#FFA41C", marginBottom:"6px"}}>
{"⭐".repeat(Math.floor(food.rating))} {food.rating} ({food.reviews})
</div>

<p>${food.price}</p>

{qty === 0 ? (

<button
onClick={()=>addToCart(food)}
style={{
background:"#1B4332",
color:"white",
border:"none",
padding:"8px 18px",
borderRadius:"20px",
cursor:"pointer"
}}
>
Add
</button>

) : (

<div style={{
display:"flex",
justifyContent:"center",
alignItems:"center",
gap:"10px",
marginTop:"10px"
}}>

<button
onClick={()=>removeFromCart(food.id)}
style={{
padding:"5px 12px",
borderRadius:"20px",
border:"1px solid #ccc",
cursor:"pointer"
}}
>
-
</button>

<span>{qty}</span>

<button
onClick={()=>addToCart(food)}
style={{
padding:"5px 12px",
borderRadius:"20px",
border:"1px solid #ccc",
cursor:"pointer"
}}
>
+
</button>

</div>

)}

</div>

)

}

export default FoodCard