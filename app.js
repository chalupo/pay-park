const precioHora = 20;

function registrar() {
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    if (!email || !pass) {
        alert("Completa todos los campos");
        return;
    }

    localStorage.setItem(email, pass);
    alert("Usuario registrado correctamente");
    window.location.href = "index.html";
}

function login() {
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    let saved = localStorage.getItem(email);

    if (saved === pass) {
        localStorage.setItem("usuarioActivo", email);
        window.location.href = "ventana-pago.html";
    } else {
        alert("Datos incorrectos");
    }
}

function pagar() {
    let placa = document.getElementById("placa").value;
    let horas = document.getElementById("horas").value;

    if (!placa || !horas) {
        alert("Completa los datos");
        return;
    }

    let total = Number(horas) * precioHora;
    let usuario = localStorage.getItem("usuarioActivo");

    if (!usuario) {
        alert("No hay un usuario activo");
        window.location.href = "index.html";
        return;
    }

    let historial = JSON.parse(localStorage.getItem("pagos")) || [];

    let pago = {
        usuario: usuario,
        placa: placa,
        horas: Number(horas),
        total: total,
        fecha: new Date().toLocaleString()
    };

    historial.push(pago);

    localStorage.setItem("pagos", JSON.stringify(historial));
    localStorage.setItem("pagoActual", JSON.stringify(pago));

    let estadoPago = document.getElementById("estadoPago");
    if (estadoPago) {
        estadoPago.innerText = "Pagado ✔";
        estadoPago.style.color = "green";
    }

    alert("Pago realizado: $" + total);
}

function cargarHistorial() {
    let usuario = localStorage.getItem("usuarioActivo");
    let historial = JSON.parse(localStorage.getItem("pagos")) || [];
    let tabla = document.getElementById("tabla");

    if (!tabla) return;

    tabla.innerHTML = "";

    let pagosUsuario = historial.filter(p => p.usuario === usuario);

    if (pagosUsuario.length === 0) {
        tabla.innerHTML = `
        <tr>
            <td colspan="4">No hay pagos registrados</td>
        </tr>
        `;
        return;
    }

    pagosUsuario.forEach(p => {
        tabla.innerHTML += `
        <tr>
            <td>${p.placa}</td>
            <td>${p.horas}</td>
            <td>$${p.total}</td>
            <td>${p.fecha}</td>
        </tr>
        `;
    });
}

function cargarAdmin() {
    let historial = JSON.parse(localStorage.getItem("pagos")) || [];
    let tabla = document.getElementById("tablaAdmin");

    if (!tabla) return;

    tabla.innerHTML = "";

    if (historial.length === 0) {
        tabla.innerHTML = `
        <tr>
            <td colspan="5">No hay pagos registrados</td>
        </tr>
        `;
    } else {
        historial.forEach(p => {
            tabla.innerHTML += `
            <tr>
                <td>${p.usuario}</td>
                <td>${p.placa}</td>
                <td>${p.horas}</td>
                <td>$${p.total}</td>
                <td>${p.fecha}</td>
            </tr>
            `;
        });
    }

    generarReporteAdmin(historial);
}

function generarReporteAdmin(historial) {
    let totalPagos = historial.length;
    let totalIngresos = 0;
    let totalHoras = 0;

    historial.forEach(p => {
        totalIngresos += Number(p.total);
        totalHoras += Number(p.horas);
    });

    let capacidadTotal = 50;
    let ocupados = totalPagos;
    let disponibles = capacidadTotal - ocupados;

    if (disponibles < 0) {
        disponibles = 0;
    }

    let porcentaje = capacidadTotal > 0
        ? ((ocupados / capacidadTotal) * 100).toFixed(2)
        : 0;

    document.getElementById("totalPagos").innerText = totalPagos;
    document.getElementById("totalIngresos").innerText = "$" + totalIngresos;
    document.getElementById("totalHoras").innerText = totalHoras;
    document.getElementById("ocupados").innerText = ocupados;
    document.getElementById("disponibles").innerText = disponibles;
    document.getElementById("porcentajeOcupacion").innerText = porcentaje + "%";
}

function logout() {
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("pagoActual");
    window.location.href = "index.html";
}

function autorizarPlaca() {
    let placa = document.getElementById("placaAdmin").value;

    if (!placa) {
        alert("Ingresa una placa");
        return;
    }

    let placas = JSON.parse(localStorage.getItem("placasAutorizadas")) || [];

    if (placas.includes(placa)) {
        alert("La placa ya está autorizada");
        return;
    }

    placas.push(placa);

    localStorage.setItem("placasAutorizadas", JSON.stringify(placas));

    alert("Placa autorizada correctamente");

    cargarPlacas();
}

function cargarPlacas() {
    let placas = JSON.parse(localStorage.getItem("placasAutorizadas")) || [];
    let tabla = document.getElementById("tablaPlacas");

    if (!tabla) return;

    tabla.innerHTML = "";

    if (placas.length === 0) {
        tabla.innerHTML = `
        <tr>
            <td>No hay placas autorizadas</td>
        </tr>
        `;
        return;
    }

    placas.forEach(p => {
        tabla.innerHTML += `
        <tr>
            <td>${p}</td>
        </tr>
        `;
    });
}