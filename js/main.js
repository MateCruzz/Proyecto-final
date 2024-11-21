let productosDisponibles = [];


function cargarProductos() {
    fetch('/productos.json')
        .then(response => response.json())
        .then(productos => {
            productosDisponibles = productos;

            const contenedor = document.getElementById('productos-container');
            contenedor.innerHTML = '';

            productos.forEach(producto => {
                console.log('Cargando producto:', producto);


                const productoDiv = document.createElement('div');
                productoDiv.classList.add('product');
                productoDiv.id = `producto-${producto.id}`;

                const h3 = document.createElement('h3');
                h3.textContent = producto.nombre;

                const img = document.createElement('img');
                img.src = producto.imagen;
                img.alt = producto.nombre;


                const pPrecio = document.createElement('p');
                pPrecio.textContent = `Precio: $${producto.precio}`;


                const botonAgregar = document.createElement('button');
                botonAgregar.textContent = 'Agregar al Carrito';
                botonAgregar.id = `agregar-${producto.id}`;


                botonAgregar.addEventListener('click', function () {
                    console.log(`Producto ${producto.nombre} agregado al carrito`);
                    agregarAlCarrito(producto.id);
                });


                productoDiv.appendChild(h3);
                productoDiv.appendChild(img);
                productoDiv.appendChild(pPrecio);
                productoDiv.appendChild(botonAgregar);


                contenedor.appendChild(productoDiv);
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}


function agregarAlCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


    const producto = productosDisponibles.find(p => p.id === id);

    if (producto) {
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();


        Swal.fire({
            title: '¡Producto agregado!',
            text: `${producto.nombre} ha sido agregado al carrito.`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    }
}


function mostrarCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let listaCarrito = document.getElementById("lista-carrito");
    let mensajeCarrito = document.getElementById("mensaje-carrito");

    listaCarrito.innerHTML = '';

    if (carrito.length > 0) {
        carrito.forEach((producto) => {
            let li = document.createElement("li");
            li.textContent = `${producto.nombre} - Precio: $${producto.precio}`;


            let botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.addEventListener("click", () => eliminarProducto(producto.id));

            li.appendChild(botonEliminar);
            listaCarrito.appendChild(li);
        });
        mensajeCarrito.textContent = `Total: $${carrito.reduce((total, item) => total + item.precio, 0)}`;
    } else {
        listaCarrito.innerHTML = '<li>El carrito está vacío.</li>';
        mensajeCarrito.textContent = '';
    }
}


function eliminarProducto(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const producto = carrito.find(p => p.id === id);

    if (producto) {

        carrito = carrito.filter(p => p.id !== id);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();


        Swal.fire({
            title: '¡Producto eliminado!',
            text: `${producto.nombre} ha sido eliminado del carrito.`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    }
}


function borrarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres vaciar todo el carrito?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Vaciar carrito',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {

            localStorage.removeItem("carrito");
            mostrarCarrito();
            Swal.fire(
                'Carrito vacío!',
                'Todo el carrito ha sido vaciado.',
                'success'
            );
        }
    });
}


function finalizarCompra() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length > 0) {

        localStorage.removeItem("carrito");


        mostrarCarrito();


        Swal.fire({
            title: '¡Compra Finalizada!',
            text: 'Gracias por tu compra. El carrito ha sido vaciado.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    } else {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'No tienes productos en el carrito para finalizar la compra.',
            icon: 'info',
            confirmButtonText: 'Aceptar'
        });
    }
}


document.addEventListener("DOMContentLoaded", function () {

    cargarProductos();


    let botonBorrar = document.getElementById("borrar-carrito");
    if (botonBorrar) {
        botonBorrar.addEventListener("click", borrarCarrito);
    }

    
    let botonFinalizar = document.getElementById("finalizar-compra");
    if (botonFinalizar) {
        botonFinalizar.addEventListener("click", finalizarCompra);
    }


    mostrarCarrito();
});