'use strict';

// Catálogo oficial de POW! Magazine con las categorías exactas de la tienda
const productos = [
  {
    id: 1,
    nombre: 'The Dead Constellar #1',
    categoria: 'Revista & Cómics',
    precio: 350,
    anterior: 500,
    imagen: 'img/tdc reco.png',
    descripcion: 'Edición especial recopilatoria de colección The Dead Constellar #0, #1, #2, #3 y #4.'
  },
  {
    id: 2,
    nombre: 'Figura Zodiac Guardian - Leo',
    categoria: 'Coleccionables',
    precio: 850,
    anterior: 1100,
    imagen: 'img/figura.png',
    descripcion: 'Figura articulada de 18cm con acabados metálicos y accesorios.'
  },
  {
    id: 3,
    nombre: 'Playera Oficial POW! logo',
    categoria: 'Ropa & Merch',
    precio: 350,
    anterior: 450,
    imagen: 'img/camiseta.png', 
    descripcion: 'Playera 100% algodón, con estampado serigráfico de alta duración.'
  },
  {
    id: 4,
    nombre: 'Artbook POW! Vol. 1',
    categoria: 'Arte Exclusivo',
    precio: 600,
    anterior: 0,
    imagen: 'img/artbook.png',
    descripcion: 'Recopilatorio de arte y bocetos, de nuestros artistas.'
  },
  {
    id: 5,
    nombre: 'Revista POW! (Suscripción anual)',
    categoria: 'Revista & Cómics',
    precio: 984,
    anterior: 1200,
    imagen: 'img/revistasub.png',
    descripcion: 'Resive en tu casa las 12 ediiones fisicas de nuestra revista.'
  },
  {
    id: 6,
    nombre: 'Taza Térmica POW! Naranja',
    categoria: 'Ropa & Merch',
    precio: 250,
    anterior: 0,
    imagen: 'img/tazas.png',
    descripcion: 'Cambia de color con bebidas calientes.'
  },
  {
    id: 7,
    nombre: 'Póster Metalizado Lord Drakkou',
    categoria: 'Arte Exclusivo',
    precio: 299,
    anterior: 399,
    imagen: 'img/Postermetal.png',
    descripcion: 'Impresión en papel fotográfico metalizado de 60x90cm.'
  },
  {
    id: 8,
    nombre: 'Set de Pines Esmaltados POW!',
    categoria: 'Coleccionables',
    precio: 199,
    anterior: 0,
    imagen: 'img/pins.png',
    descripcion: 'Pack de 4 pines de colección con los logos de la revista.'
  }
];

const $ = id => document.getElementById(id);
const dinero = n => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(n);
const carrito = new Map();
const aviso = mensaje => { $('toastTexto').textContent=mensaje;bootstrap.Toast.getOrCreateInstance($('toastAviso'),{delay:1800}).show(); };

function pintarCatalogo(){
  const texto = $('buscar').value.toLocaleLowerCase('es').trim();
  const filtro = $('filtro').value;
  
  const visibles = productos.filter(p => 
    (p.nombre + ' ' + p.descripcion + ' ' + p.categoria).toLocaleLowerCase('es').includes(texto) &&
    (filtro === 'todos' || (filtro === 'ofertas' ? p.anterior > p.precio : p.categoria === filtro))
  );

  $('sinResultados').classList.toggle('d-none', visibles.length !== 0);

  $('catalogo').innerHTML = visibles.map(p => `
    <div class="col-sm-6 col-lg-3">
      <article class="card product-card h-100 border-0 shadow-sm" draggable="true" data-id="${p.id}" aria-label="${p.nombre}, arrastrable al carrito">
        
        <!-- Al hacer clic en la imagen se abre el pop-up de detalles -->
        <div class="product-art position-relative" style="background-color: #f8f9fa; cursor: pointer;" onclick="verDetalles(${p.id})">
          
          <!-- Etiqueta de descuento -->
          ${p.anterior > p.precio ? `<span class="badge position-absolute top-0 start-0 m-2 z-3" style="background-color: #EF7909;">-${Math.round((1 - p.precio / p.anterior) * 100)}%</span>` : ''}
          
          <!-- Imagen del producto adaptada al contenedor completo -->
          <img src="${p.imagen}" alt="${p.nombre}" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;" />
          
        </div>
        <div class="card-body d-flex flex-column">
          <span class="text-secondary small fw-bold">${p.categoria}</span>
          
          <!-- Al hacer clic en el título también se abre el pop-up -->
          <h5 class="card-title fw-bold" style="font-family: 'Lexend', sans-serif; cursor: pointer;" onclick="verDetalles(${p.id})">${p.nombre}</h5>
          
          <p class="card-text small text-secondary">${p.descripcion}</p>
          <div class="mt-auto pt-2">
            ${p.anterior ? `<div class="text-decoration-line-through text-muted small">${dinero(p.anterior)}</div>` : ''}
            <div class="fs-5 fw-bold mb-3" style="color: #EF7909;">${dinero(p.precio)}</div>
            
            <!-- Tu botón original de Agregar al carrito a lo ancho -->
            <button class="btn w-100 agregar fw-bold text-white" style="background-color: #EF7909;" data-id="${p.id}" type="button">
              <i class="bi bi-cart-plus me-1" style="pointer-events: none;"></i> <span style="pointer-events: none;">Agregar al carrito</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  `).join('');
}

function verDetalles(id) {
  const p = productos.find(x => x.id === Number(id));
  if (!p) return;

  if ($('detalleImagen')) $('detalleImagen').src = p.imagen;
  if ($('detalleImagen')) $('detalleImagen').alt = p.nombre;
  if ($('detalleCategoria')) $('detalleCategoria').textContent = p.categoria;
  if ($('detalleTitulo')) $('detalleTitulo').textContent = p.nombre;
  if ($('detalleDescripcion')) $('detalleDescripcion').textContent = p.descripcion;
  if ($('detallePrecio')) $('detallePrecio').textContent = dinero(p.precio);
  
  if ($('detalleAnterior')) {
    if (p.anterior > p.precio) {
      $('detalleAnterior').textContent = dinero(p.anterior);
    } else {
      $('detalleAnterior').textContent = '';
    }
  }

  const btnAgregarModal = $('detalleBotonAgregar');
  if (btnAgregarModal) {
    btnAgregarModal.onclick = () => {
      agregar(p.id);
      const modalEl = $('detalleModal');
      if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
    };
  }

  const modalEl = $('detalleModal');
  if (modalEl) {
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }
}



function agregar(id) {
  console.log("ID recibido:", id); // Esto saldrá en la consola del navegador (F12)
  const p = productos.find(x => x.id === Number(id));
  if (!p) {
    console.error("Producto no encontrado con ID:", id);
    return;
  }
  carrito.set(p.id, (carrito.get(p.id) || 0) + 1);
  pintarCarrito();
  aviso(`${p.nombre} agregado al carrito`);
}

function calcular(){const subtotal=[...carrito].reduce((s,[id,cantidad])=>s+productos.find(p=>p.id===id).precio*cantidad,0);const envio=subtotal===0||subtotal>=750?0:99;return {subtotal,envio,total:subtotal+envio};}

function pintarCarrito(){
  const cantidad = [...carrito.values()].reduce((a, b) => a + b, 0);
  
  // Actualizar contadores de manera segura (evita errores si falta algún ID)
  if ($('cartCount'))$('cartCount').textContent = cantidad;
  if ($('cartCountMobile'))$('cartCountMobile').textContent = cantidad;

  if ($('itemsCarrito')) {$('itemsCarrito').innerHTML = cantidad ? [...carrito].map(([id, n]) => {
      const p = productos.find(x => x.id === id);
      return `<div class="cart-item"><div class="cart-icon"><i class="bi ${p.icono}"></i></div><div class="flex-grow-1"><div class="fw-semibold">${p.nombre}</div><div class="small text-secondary">${dinero(p.precio)} c/u</div><div class="qty-controls mt-2"><button type="button" data-accion="menos" data-id="${id}" aria-label="Quitar una unidad de ${p.nombre}">−</button><span>${n}</span><button type="button" data-accion="mas" data-id="${id}" aria-label="Añadir una unidad de ${p.nombre}">+</button><button class="btn btn-link btn-sm text-danger" type="button" data-accion="quitar" data-id="${id}">Eliminar</button></div></div><strong>${dinero(p.precio * n)}</strong></div>`;
    }).join('') : '<p class="text-secondary text-center py-4">Tu carrito está vacío.</p>';
  }
  
  const c = calcular();
  if ($('subtotal'))$('subtotal').textContent = dinero(c.subtotal);
  if ($('envio'))$('envio').textContent = c.envio ? dinero(c.envio) : 'Gratis';
  if ($('total'))$('total').textContent = dinero(c.total);
  if ($('abrirPago'))$('abrirPago').disabled = !cantidad;
}

$('catalogo').addEventListener('click',e=>{const boton=e.target.closest('.agregar');if(boton)agregar(boton.dataset.id);});
$('catalogo').addEventListener('dragstart',e=>{const tarjeta=e.target.closest('[draggable="true"]');if(!tarjeta)return;e.dataTransfer.setData('text/plain',tarjeta.dataset.id);e.dataTransfer.effectAllowed='copy';});
const drop=$('zonaDrop');drop.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';drop.classList.add('drag-over');});drop.addEventListener('dragleave',()=>drop.classList.remove('drag-over'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('drag-over');agregar(e.dataTransfer.getData('text/plain'));});
$('itemsCarrito').addEventListener('click',e=>{const b=e.target.closest('[data-accion]');if(!b)return;const id=Number(b.dataset.id),accion=b.dataset.accion,n=carrito.get(id)||0;if(accion==='mas')carrito.set(id,n+1);else if(accion==='menos'){if(n<=1)carrito.delete(id);else carrito.set(id,n-1);}else if(accion==='quitar')carrito.delete(id);pintarCarrito();});
$('vaciarCarrito').addEventListener('click',()=>{carrito.clear();pintarCarrito();});$('buscar').addEventListener('input',pintarCatalogo);$('filtro').addEventListener('change',pintarCatalogo);
const modalPago=bootstrap.Modal.getOrCreateInstance($('pagoModal'));
$('abrirPago').addEventListener('click',()=>{if(!carrito.size)return;const c=calcular();$('resumenPago').innerHTML=[...carrito].map(([id,n])=>{const p=productos.find(x=>x.id===id);return `<div class="d-flex justify-content-between small"><span>${n} × ${p.nombre}</span><span>${dinero(n*p.precio)}</span></div>`}).join('')+`<div class="d-flex justify-content-between small"><span>Envío</span><span>${c.envio?dinero(c.envio):'Gratis'}</span></div>`;$('totalPago').textContent=dinero(c.total);bootstrap.Offcanvas.getOrCreateInstance($('carritoPanel')).hide();setTimeout(()=>modalPago.show(),350);});
// Validadores y formateadores de inputs
const soloDigitos = (s, max) => s.replace(/\D/g, '').slice(0, max);

if ($('numeroPago')) {
  $('numeroPago').addEventListener('input', e => {
    const d = soloDigitos(e.target.value, 16);
    e.target.value = d.replace(/(.{4})/g, '$1 ').trim();
    $('vistaNumero').textContent = e.target.value || '•••• •••• •••• ••••';
  });
}

if ($('nombrePago')) {
  $('nombrePago').addEventListener('input', e => {
    $('vistaNombre').textContent = e.target.value.toUpperCase() || 'NOMBRE APELLIDO';
  });
}

if ($('fechaPago')) {
  $('fechaPago').addEventListener('input', e => {
    const d = soloDigitos(e.target.value, 4);
    e.target.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
    $('vistaFecha').textContent = e.target.value || 'MM/AA';
  });
}

if ($('cvvPago')) {
  $('cvvPago').addEventListener('input', e => {
    e.target.value = soloDigitos(e.target.value, 3);
  });
}

// Procesar pago con datos libres
if ($('formPago')) {
  $('formPago').addEventListener('submit', e => {
    e.preventDefault();
    
    const numero = soloDigitos($('numeroPago').value, 16);
    const fecha = $('fechaPago').value;
    const cvv = $('cvvPago').value;
    const nombre = $('nombrePago').value.trim();
    const correo = $('correoPago').value.trim();

    let error = '';

    // Validaciones estándar (libres de valores fijos)
    if (nombre.length < 3) {
      error = 'Por favor ingresa un nombre válido.';
    } else if (numero.length < 16) {
      error = 'El número de tarjeta debe tener 16 dígitos.';
    } else if (!/^\d{2}\/\d{2}$/.test(fecha)) {
      error = 'Ingresa una fecha válida en formato MM/AA.';
    } else if (cvv.length < 3) {
      error = 'Ingresa un CVV válido de 3 dígitos.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      error = 'Ingresa un correo electrónico válido.';
    } else if (!carrito.size) {
      error = 'El carrito está vacío.';
    }

    // Mostrar u ocultar mensaje de error
    if ($('errorPago')) {
      $('errorPago').classList.toggle('d-none', !error);
      $('errorPago').textContent = error;
    }

    if (error) return;

    // Si todo está correcto, generamos el pedido
    const folio = 'POW-' + String(Date.now()).slice(-7);
    if ($('folioPedido')) $('folioPedido').textContent = 'Folio de compra: ' + folio;
    
    // Limpiar carrito y formulario
    carrito.clear();
    pintarCarrito();
    $('formPago').reset();
    
    if ($('vistaNumero')) $('vistaNumero').textContent = '•••• •••• •••• ••••';
    if ($('vistaNombre')) $('vistaNombre').textContent = 'NOMBRE APELLIDO';
    if ($('vistaFecha')) $('vistaFecha').textContent = 'MM/AA';
    
    modalPago.hide();
    setTimeout(() => bootstrap.Modal.getOrCreateInstance($('exitoModal')).show(), 350);
  });
}
pintarCatalogo();pintarCarrito();


$('catalogo').addEventListener('dragstart', e => {
  const tarjeta = e.target.closest('[draggable="true"]');
  if (!tarjeta) return;
  
  e.dataTransfer.setData('text/plain', tarjeta.dataset.id);
  e.dataTransfer.effectAllowed = 'copy';

  // Abrir el carrito 
  setTimeout(() => {
    const carritoPanelEl = document.getElementById('carritoPanel');
    if (carritoPanelEl) {
      const offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(carritoPanelEl);
      offcanvasInstance.show();
    }
  }, 100);
});

// 1. Procesar Inicio de Sesión
function procesarLogin(event) {
  event.preventDefault();
  
  const correoInput = document.getElementById('loginCorreo');
  const correo = correoInput ? correoInput.value.trim() : '';
  const nombreUsuario = correo ? correo.split('@')[0] : 'Fan POW!';

  // Guardar la sesión en localStorage del navegador
  localStorage.setItem('pow_usuario', JSON.stringify({
    nombre: nombreUsuario,
    correo: correo,
    conectado: true
  }));

  // Ocultar modal de login si existe
  const loginModalEl = document.getElementById('loginModal');
  if (loginModalEl) {
    const modalInstance = bootstrap.Modal.getInstance(loginModalEl);
    if (modalInstance) {
      modalInstance.hide();
    } else {
      const bsModal = new bootstrap.Modal(loginModalEl);
      bsModal.hide();
    }
  }

  // Actualizar inmediatamente la barra de navegación
  verificarSesion();
  
  // Mostrar mensaje seguro
  if (typeof aviso === 'function' && document.getElementById('toastTexto')) {
    aviso(`¡Bienvenido de nuevo, ${nombreUsuario}!`);
  } else {
    alert(`¡Bienvenido de nuevo, ${nombreUsuario}!`);
  }
}

// 2. Procesar Registro de Cuenta
function procesarRegistro(event) {
  event.preventDefault();

  const nombre = document.getElementById('regNombre')?.value.trim() || 'Fan POW!';
  const correo = document.getElementById('regCorreo')?.value.trim() || '';

  // Guardar la sesión directamente
  localStorage.setItem('pow_usuario', JSON.stringify({
    nombre: nombre,
    correo: correo,
    conectado: true
  }));

  // Ocultar modal de registro
  const loginModalEl = document.getElementById('loginModal');
  if (loginModalEl) {
    const modalInstance = bootstrap.Modal.getInstance(loginModalEl) || new bootstrap.Modal(loginModalEl);
    modalInstance.hide();
  }

  // Actualizar la barra de navegación
  verificarSesion();

  if (typeof aviso === 'function' && document.getElementById('toastTexto')) {
    aviso(`¡Cuenta creada con éxito! Bienvenido, ${nombre}.`);
  } else {
    alert(`¡Cuenta creada con éxito! Bienvenido, ${nombre}.`);
  }
}

// 3. Cerrar Sesión
function cerrarSesion() {
  localStorage.removeItem('pow_usuario');
  verificarSesion();
  if (typeof aviso === 'function' && document.getElementById('toastTexto')) {
    aviso('Has cerrado sesión correctamente.');
  } else {
    alert('Has cerrado sesión correctamente.');
  }
}

// 4. Estado de sesión entre páginas
function verificarSesion() {
  const contenedor = document.getElementById('contenedorUsuario');
  if (!contenedor) return;

  const sesionGuardada = localStorage.getItem('pow_usuario');

  if (sesionGuardada) {
    try {
      const usuario = JSON.parse(sesionGuardada);

      if (usuario && usuario.conectado) {
        // Muestra el perfil activo con botón dropdown
        contenedor.innerHTML = `
          <div class="dropdown">
            <button class="btn btn-warning fw-bold px-3 py-1 rounded-pill small text-white dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #EF7909; border-color: #EF7909;">
              <i class="bi bi-person-check-fill me-1"></i> Hola, ${usuario.nombre}
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-1">
              <li><span class="dropdown-item-text small text-muted">${usuario.correo}</span></li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item text-danger small fw-bold" type="button" onclick="cerrarSesion()">
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        `;
        return;
      }
    } catch (e) {
      console.error("Error al leer sesión:", e);
    }
  }

  // Si no hay sesión iniciada
  contenedor.innerHTML = `
    <button class="btn btn-outline-light fw-bold px-3 py-1 rounded-pill small" type="button" data-bs-toggle="modal" data-bs-target="#loginModal">
      <i class="bi bi-person-circle me-1"></i> Iniciar Sesión
    </button>
  `;
}

// Verificación automática en todas las páginas
document.addEventListener('DOMContentLoaded', () => {
  verificarSesion();
});