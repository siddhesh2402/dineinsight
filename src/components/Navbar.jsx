import { Link } from "react-router-dom"

function Navbar({ cartCount, setShowLogin }) {

const user = localStorage.getItem("userName")
const role = localStorage.getItem("role")

const logout = () => {

localStorage.removeItem("role")
localStorage.removeItem("userName")
localStorage.removeItem("userEmail")

window.location.href="/"

}

return (

<div style={{
background:"#1B4332",
color:"white",
padding:"15px 40px",
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}>

<h2 style={{margin:0}}>DineInsight</h2>

<div style={{
display:"flex",
gap:"20px",
alignItems:"center"
}}>

<Link to="/" style={{color:"white",textDecoration:"none"}}>
Home
</Link>

<Link to="/cart" style={{color:"white",textDecoration:"none"}}>
Cart ({cartCount})
</Link>

{/* ADMIN LINK */}

{role === "admin" && (

<Link to="/admin" style={{color:"white",textDecoration:"none"}}>
Admin
</Link>

)}

{/* USER SESSION */}

{user ? (

<div style={{display:"flex",gap:"10px",alignItems:"center"}}>

<span>👤 {user}</span>

<button
onClick={logout}
style={{
padding:"6px 12px",
border:"none",
borderRadius:"5px",
background:"#ff5a3c",
color:"white",
cursor:"pointer"
}}
>
Logout
</button>

</div>

) : (

<button
onClick={()=>setShowLogin(true)}
style={{
padding:"6px 12px",
border:"none",
borderRadius:"5px",
background:"#ff5a3c",
color:"white",
cursor:"pointer"
}}
>
Sign In
</button>

)}

</div>

</div>

)

}

export default Navbar