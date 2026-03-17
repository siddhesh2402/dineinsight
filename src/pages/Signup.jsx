import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

function Signup(){

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [showPassword,setShowPassword] = useState(false)
const [error,setError] = useState("")

const validatePassword = (password) => {

const regex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

return regex.test(password)

}

const handleSignup = (e) => {

e.preventDefault()

if(!validatePassword(password)){
setError(
"Password must be 8 characters with uppercase, lowercase, number and symbol"
)
return
}

localStorage.setItem("user",JSON.stringify({email,password}))

alert("Signup successful! Please login.")

}

return(

<div style={{
display:"flex",
justifyContent:"center",
alignItems:"center",
height:"80vh"
}}>

<form
onSubmit={handleSignup}
style={{
background:"white",
padding:"40px",
borderRadius:"10px",
width:"350px",
boxShadow:"0 0 10px rgba(0,0,0,0.1)"
}}
>

<h2>Create Account</h2>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
style={{
width:"100%",
padding:"10px",
marginBottom:"15px"
}}
/>

<div style={{position:"relative"}}>

<input
type={showPassword ? "text":"password"}
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
style={{
width:"100%",
padding:"10px"
}}
/>

<span
onClick={()=>setShowPassword(!showPassword)}
style={{
position:"absolute",
right:"10px",
top:"12px",
cursor:"pointer"
}}
>

{showPassword ? <FaEyeSlash/> : <FaEye/>}

</span>

</div>

<p style={{fontSize:"12px",color:"#777",marginTop:"10px"}}>
Password must contain uppercase, lowercase, number and symbol.
</p>

{error && <p style={{color:"red"}}>{error}</p>}

<button
style={{
marginTop:"15px",
width:"100%",
padding:"10px",
background:"#1B4332",
color:"white",
border:"none"
}}
>
Sign Up
</button>

</form>

</div>

)

}

export default Signup