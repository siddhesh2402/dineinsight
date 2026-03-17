function Cart({ cart, addToCart, removeFromCart, checkout }) {

const total = cart.reduce(
(sum, item) => sum + item.price * item.qty,
0
)

return (

<div style={{
maxWidth:"900px",
margin:"40px auto",
padding:"20px"
}}>

<h2>Your Cart</h2>

{cart.length === 0 ? (

<p>Your cart is empty</p>

) : (

<div>

{cart.map(item => (

<div
key={item.id}
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
borderBottom:"1px solid #ddd",
padding:"15px 0"
}}
>

<div>
<h4>{item.name}</h4>
<p>${item.price}</p>
</div>

<div style={{
display:"flex",
alignItems:"center",
gap:"10px"
}}>

<button
onClick={()=>removeFromCart(item.id)}
style={{
padding:"5px 10px",
cursor:"pointer"
}}
>
-
</button>

<span>{item.qty}</span>

<button
onClick={()=>addToCart(item)}
style={{
padding:"5px 10px",
cursor:"pointer"
}}
>
+
</button>

</div>

<div>
<b>${item.price * item.qty}</b>
</div>

</div>

))}

<h2 style={{marginTop:"30px"}}>
Total: ${total}
</h2>

<button
onClick={checkout}
style={{
marginTop:"20px",
padding:"12px 20px",
background:"#1B4332",
color:"white",
border:"none",
borderRadius:"6px",
cursor:"pointer"
}}
>
Place Order
</button>

</div>

)}

</div>

)

}

export default Cart