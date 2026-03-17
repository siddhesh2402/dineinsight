import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

function Login(){

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [showPassword,setShowPassword] = useState(false)

const handleLogin = (e) => {

e.preventDefault()

const storedUser =
JSON.parse(localStorage.getItem("user"))

if(
storedUser &&
storedUser.email === email &&
storedUser.password === password
){

alert("Login successful")

}else{

alert("Invalid credentials")

}

}

return(

<div style={{
display:"flex",
justifyContent:"center",
alignItems:"center",
height:"80vh"
}}>

<form
onSubmit={handleLogin}
style={{
background:"white",
padding:"40px",
borderRadius:"10px",
width:"350px",
boxShadow:"0 0 10px rgba(0,0,0,0.1)"
}}
>

<h2>Login</h2>

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

<button
style={{
marginTop:"20px",
width:"100%",
padding:"10px",
background:"#1B4332",
color:"white",
border:"none"
}}
>
Login
</button>

</form>

</div>

)

}

export default Login