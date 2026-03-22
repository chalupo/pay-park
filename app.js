const precioHora = 20;

function registrar(){

let email=document.getElementById("email").value;
let pass=document.getElementById("password").value;

if(!email || !pass){
alert("Completa todos los campos");
return;
}

localStorage.setItem(email,pass);

alert("Usuario registrado");

window.location.href="index.html";

}

function login(){

let email=document.getElementById("email").value;
let pass=document.getElementById("password").value;

let saved=localStorage.getItem(email);

if(saved===pass){

localStorage.setItem("usuarioActivo",email);

window.location.href="ventana-pago.html";

}else{

alert("Datos incorrectos");

}

}

function pagar(){

let placa=document.getElementById("placa").value;
let horas=document.getElementById("horas").value;

if(!placa || !horas){
alert("Completa los datos");
return;
}

let total=horas*precioHora;

let usuario=localStorage.getItem("usuarioActivo");

let historial=JSON.parse(localStorage.getItem("pagos")) || [];

historial.push({
usuario:usuario,
placa:placa,
horas:horas,
total:total
});

localStorage.setItem("pagos",JSON.stringify(historial));

alert("Pago realizado: $"+total);

}

function cargarHistorial(){

let usuario=localStorage.getItem("usuarioActivo");

let historial=JSON.parse(localStorage.getItem("pagos")) || [];

let tabla=document.getElementById("tabla");

tabla.innerHTML="";

historial.forEach(p=>{

if(p.usuario===usuario){

tabla.innerHTML+=`
<tr>
<td>${p.placa}</td>
<td>${p.horas}</td>
<td>$${p.total}</td>
</tr>
`;

}

});

}

function cargarAdmin(){

let historial=JSON.parse(localStorage.getItem("pagos")) || [];

let tabla=document.getElementById("tablaAdmin");

tabla.innerHTML="";

historial.forEach(p=>{

tabla.innerHTML+=`
<tr>
<td>${p.usuario}</td>
<td>${p.placa}</td>
<td>${p.horas}</td>
<td>$${p.total}</td>
</tr>
`;

});

}

function logout(){

localStorage.removeItem("usuarioActivo");

window.location.href="index.html";

}