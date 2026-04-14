import { formatearPrecioCOP } from './productos.js';

// Constantes para localStorage
const STORAGE_KEYS = {
    products: 'hobbverse_products',
    categories: 'hobbverse_categories',
    cart: 'carrito' // Añadido para mayor consistencia
};

// API Endpoints
const API_ENDPOINTS = {
    products: '/api/productos',
    categories: '/api/categorias'
};

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Cargar productos primero
        await cargarProductos();
        
        // Mostrar los productos en la UI
        mostrarProductosDestacadosPorCategoria();
        renderFeaturedProducts();
        
        // Inicializar contador del carrito
        actualizarContadorCarrito();
        
        // Hacer global la función agregarAlCarrito para los botones
        window.agregarAlCarrito = agregarAlCarrito;
        
        // Agregar listener para cambios en el carrito desde otras pestañas
        window.addEventListener('storage', function(e) {
            if (e.key === STORAGE_KEYS.cart) {
                console.log('Carrito actualizado en otra pestaña, actualizando contador');
                actualizarContadorCarrito();
            }
        });
        
        console.log('Inicialización completa de la página de productos');
    } catch (error) {
        console.error('Error al inicializar la página de productos:', error);
        mostrarErrorDeCarga();
    }
});

/**
 * Carga los productos desde el backend y localStorage
 */
async function cargarProductos() {
    try {
        // Intentar cargar desde la API primero
        const response = await fetch(API_ENDPOINTS.products);
        
        if (response.ok) {
            const productos = await response.json();
            console.log('Productos cargados desde la API:', productos);
            
            // Normalizar formato
            const productosNormalizados = normalizarProductos(productos);
            
            // Guardar en localStorage
            localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(productosNormalizados));
            
            return productosNormalizados;
        } else {
            throw new Error(`Error al cargar productos desde la API: ${response.status}`);
        }
    } catch (error) {
        console.warn('No se pudieron cargar productos desde la API:', error);
        console.log('Intentando cargar desde localStorage...');
        
        // Intentar cargar desde localStorage como fallback
        const productosEnStorage = localStorage.getItem(STORAGE_KEYS.products);
        
        if (productosEnStorage) {
            const productos = JSON.parse(productosEnStorage);
            console.log('Productos cargados desde localStorage:', productos);
            return productos;
        } else {
            console.warn('No hay productos en localStorage. Usando datos de demostración.');
            
            // Productos de demostración como último recurso
            const productosDemostracion = [
                // Deportes
                {
                    id: 1,
                    name: 'Raqueta de Tenis Wilson Blade 100L V9',
                    category: 'Deportes',
                    description: 'La opción preferida de los competidores ávidos que buscan el máximo control, sensación y estabilidad.',
                    price: 1357990,
                    stock: 5,
                    mainImage: 'https://i.postimg.cc/0NGdy2rZ/HV-Producto-6-1.jpg',
                    additionalImages: [
                        'https://i.postimg.cc/wv65y8mz/HV-Producto-6-2.jpg',
                        'https://i.postimg.cc/HnnQzwzP/HV-Producto-6-3.jpg'
                    ],
                    featured: true
                },
                {
                    id: 5,
                    name: 'Juego de tenis de mesa de tamaño mediano',
                    category: 'Deportes',
                    description: 'incluye una mesa de tenis de mesa de tamaño mediano de 6 pies x 3 pies con 2 paletas, red de juego y 4 pelotas.',
                    price: 895000,
                    stock: 6,
                    mainImage: 'https://m.media-amazon.com/images/I/81+CSxrrzkL._AC_SX679_.jpg',
                    additionalImages: [
                        'https://m.media-amazon.com/images/I/818717-F3jL._AC_SX679_.jpg',
                        'https://m.media-amazon.com/images/I/81WFs-Kyq6L._AC_SX679_.jpg'
                    ],
                    featured: true
                },
                {
                    id: 6,
                    name: 'Kit Pesas Termoforradas 40kg',
                    category: 'Deportes',
                    description: 'El entrenamiento con pesas es uno de los deportes de fuerza más eficaces y bueno en el área de la salud y buen estado físico.',
                    price: 229900,
                    stock: 18,
                    mainImage: 'https://res.cloudinary.com/diljcypxv/image/upload/q_auto/f_auto/v1749572419/hobbverse_products/kit-pesas-termoforradas-80lb-40kg-pesa-rusa-fitness-homesale-442178_ftqk4y.jpg',
                    additionalImages: [
                        'https://res.cloudinary.com/diljcypxv/image/upload/q_auto/f_auto/v1749572412/hobbverse_products/kit-pesas-mancuernas-80lb-40kg-home-sale-rusas-termoforradas-pesas-y-accesorios-homesale-302619_kuifhf.jpg'
                    ],
                    featured: true
                },
                {
                    id: 7,
                    name: 'Caminadora Portátil 2 En 1',
                    category: 'Deportes',
                    description: 'Nuestra pequeña caminadora está diseñada para adaptarse a tu estilo de vida en el trabajo y en casa.',
                    price: 2350000,
                    stock: 25,
                    mainImage: 'https://http2.mlstatic.com/D_NQ_NP_850312-MCO76623936603_052024-O.webp',
                    additionalImages: [
                        'https://http2.mlstatic.com/D_NQ_NP_952749-MCO76623946167_052024-O.webp'
                                           
                    ],
                    featured: true
                },
                // Arte
                {
                    id: 2,
                    name: 'Esrich Juego De Lienzo De Pintura Acrlica, Kit',
                    category: 'Arte',
                    description: 'El Kit contiene un juego de pintura más completo para adultos y niños, es perfecto todos los niveles desde principiante.',
                    price: 196300,
                    stock: 30,
                    mainImage: 'https://http2.mlstatic.com/D_NQ_NP_681230-MCO81525977280_012025-O.webp',
                    additionalImages: [
                        'https://m.media-amazon.com/images/I/81OdFs8VU7L._AC_SX679_.jpg'
                    ],
                    featured: true
                },
                {
                    id: 8,
                    name: 'Prismacolor Premier Soft Core',
                    category: 'Arte',
                    description: 'Amplia gama de colores: disponible en un vibrante conjunto de 150 colores surtidos.',
                    price: 580000,
                    stock: 14,
                    mainImage: 'https://m.media-amazon.com/images/I/91NTgzXx5mL._AC_SX466_.jpg',
                    additionalImages: [
                        'https://m.media-amazon.com/images/I/81ComN-3LdL._AC_SX466_.jpg',
                        'https://m.media-amazon.com/images/I/91PIXiz-+5L._AC_SX466_.jpg'
                    ],
                    featured: true
                },
                {
                    id: 9,
                    name: 'Tableta Digitalizadora Wacom',
                    category: 'Arte',
                    description: 'Modelo One. DTC-133W0A black y white. Expresividad en tus creaciones.',
                    price: 1450000,
                    stock: 40,
                    mainImage: 'https://i.postimg.cc/Wz17KLN8/HV-Producto-3-1.png',
                    additionalImages: [
                        'https://i.postimg.cc/yxpTCQWH/HV-Producto-3-2.png',
                        'https://i.postimg.cc/HxHzw8Ff/HV-Producto-3-3.png'
                    ],
                    featured: true
                },
                {
                    id: 10,
                    name: 'Caballete De Madera Mediano Grafitos',
                    category: 'Arte',
                    description: 'Eleva tu arte a otro nivel con este caballete de madera super resistente y diseño ultra liviano.',
                    price: 55000,
                    stock: 12,
                    mainImage: 'https://www.grafitos.com.co/wp-content/uploads/2024/03/caballete-de-madera-mediano-grafitos.jpg',
                    additionalImages: [
                        'https://www.grafitos.com.co/wp-content/uploads/2024/03/parte-trasera-del-caballete.jpg'
                    ],
                    featured: true
                },
                // Música
                {
                    id: 3,
                    name: '1989 (Versión de Taylor)[2 LP]',
                    category: 'Música',
                    description: 'Portada del álbum coleccionable, con portada y contraportada exclusivas.',
                    price: 136308,
                    stock: 13,
                    mainImage: 'https://i.postimg.cc/kg3bR30H/HV-Producto-4-1.png',
                    additionalImages: [
                        'https://i.postimg.cc/kGR2Dff9/HV-Producto-4-2.png',
                        'https://i.postimg.cc/sXwY56Yh/HV-Producto-4-3.png'
                    ],
                    featured: true
                },
                {
                    id: 11,
                    name: 'Teclado CASIO CT-S100',
                    category: 'Música',
                    description: 'Con el CT-S100, puedes disfrutar de la música en cualquier momento y lugar.',
                    price: 568100,
                    stock: 15,
                    mainImage: 'https://www.miche.com.co/cdn/shop/files/CT-S100-galeria_4_942x503.jpg?v=1719675027',
                    additionalImages: [
                        'https://www.miche.com.co/cdn/shop/files/CT-S100-galeria_2_942x503.jpg?v=1719675027',
                        'https://www.miche.com.co/cdn/shop/files/CT-S100-galeria_3_942x503.jpg?v=1719675027'
                    ],
                    featured: true
                },
                {
                    id: 12,
                    name: 'Audífonos de Diadema SONY WH-CH520',
                    category: 'Música',
                    description: 'Disfruta de una gran calidad de sonido durante todo el día. Los Audífonos de diadema WH CH520 en color azul, mezclan un excelente balance entre confort y larga duración de batería',
                    price: 179900,
                    stock: 10,
                    mainImage: 'https://www.alkosto.com/medias/027242925472-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wxMjA4MHxpbWFnZS93ZWJwfGFETTRMMmcxT0M4eE5ETTFNRFE1TkRFM01URTJOaTh3TWpjeU5ESTVNalUwTnpKZk1EQXhYemMxTUZkNE56VXdTQXw1NzljNTg0MGZiZmQyY2IyOTExMmU2M2E4MzY3ZTc5NDQ3NDY0ODkxMzRiNTE5NDRiYjg3YmM0ODhlNDViNmRl',
                    additionalImages: [
                        'https://www.alkosto.com/medias/027242925472-002-750Wx750H?context=bWFzdGVyfGltYWdlc3wxMjgyNnxpbWFnZS93ZWJwfGFEZzBMMmcyT1M4eE5ETTFNRFE1TkRZNU5UUTFOQzh3TWpjeU5ESTVNalUwTnpKZk1EQXlYemMxTUZkNE56VXdTQXwxODBhNzBmYWNmMDg4NjdkOGI5OWM5ZWMyMDY4Y2RkNmE1ZmJhYjZhYzViMmMwNzM5YWM0NTA5NWZhMjE0NGQ1',
                        'https://www.alkosto.com/medias/027242925472-003-750Wx750H?context=bWFzdGVyfGltYWdlc3wxMTc4OHxpbWFnZS93ZWJwfGFHTmpMMmhqTkM4eE5ETTFNRFE1TlRJeE9UYzBNaTh3TWpjeU5ESTVNalUwTnpKZk1EQXpYemMxTUZkNE56VXdTQXwwYTM3ZDI0YjgxZmU4ZGRiZmQyOTZkYjk3MjFmNDdiMjJmNzQ1YzkxNjYwZWY5ODVkM2Y3ZWVlNmU1ODRiNzc1'
                    ],
                    featured: true
                },
                {
                    id: 13,
                    name: 'Violin GREKO VBC-3 PPF',
                    category: 'Música',
                    description: 'Violín GREKO VCB-3 PPF de tamaño 4/4 con un hermoso acabado púrpura degrade que realza la belleza natural del instrumento musical.',
                    price:  269900,
                    stock: 9,
                    mainImage: 'https://tiendadelmusico.com/24532-thickbox_default/greko-vbc-3-ppf-violin-con-estuche.jpg',
                    additionalImages: [
                        'https://tiendadelmusico.com/24535-thickbox_default/greko-vbc-3-ppf-violin-con-estuche.jpg',
                        'https://tiendadelmusico.com/24533-thickbox_default/greko-vbc-3-ppf-violin-con-estuche.jpg'
                    ],
                    featured: true
                },
                // Crochet
                {
                    id: 4,
                    name: 'Bolsa de Relleno Siliconado x 1 Kilo',
                    category: 'Crochet',
                    description: 'El relleno de algodón siliconado es la opción perfecta para quienes buscan añadir una textura suave, esponjosa y duradera a sus proyectos.',
                    price: 130000,
                    stock: 30,
                    mainImage: 'https://casatextil.com.co/cdn/shop/files/Relleno_Siliconado_1_kilo.jpg?v=1736012162&width=700',
                    additionalImages: [
                        'https://casatextil.com.co/cdn/shop/files/Relleno_siliconado_1_kilo_2.jpg?v=1736012162&width=700'
                    ],
                    featured: true
                },
                {
                    id: 14,
                    name: 'Bowser Amigurumi',
                    category: 'Crochet',
                    description: 'Hermoso amigurumi tejido a crochet en lana acrílica.',
                    price: 160000,
                    stock: 2,
                    mainImage: 'https://i.postimg.cc/dVh6cJqh/Bowser-1.jpg',
                    additionalImages: [
                        'https://i.postimg.cc/GpYj9zTr/Bowser-2.jpg',
                        'https://i.postimg.cc/cLPmsPHX/Bowser-3.jpg'
                    ],
                    featured: true
                },
                {
                    id: 15,
                    name: 'Sabrina Carpenter Amigurumi',
                    category: 'Crochet',
                    description: 'Hermoso amigurumi tejido a crochet en lana acrílica. Versión Juno',
                    price: 150000,
                    stock: 1,
                    mainImage: 'https://i.postimg.cc/Jhxm466M/264e307a-8557-403b-b757-0b7c24c12507.jpg',
                    additionalImages: [
                        'https://i.postimg.cc/bvg8NCCP/4ef5b8d4-4830-49d9-b9ea-0f167923044f.jpg',
                        'https://i.postimg.cc/jjcKdggK/b82c6ec4-8c69-489a-8ff7-9c7f674ae3a2.jpg'
                    ],
                    featured: true
                },
                {
                    id: 16,
                    name: 'Kit Agujas Crochet',
                    category: 'Crochet',
                    description: 'Este Kit ofrece una colección completa de herramientas perfecta tanto para principiantes como para tejerdores',
                    price: 32900,
                    stock: 42,
                    mainImage: 'https://i.postimg.cc/rwx5fFGc/HV-Producto-8-1.png',
                    additionalImages: [
                        'https://i.postimg.cc/KYbBwSQT/HV-Producto-8-2.png',
                        'https://i.postimg.cc/5tmLM7kR/HV-Producto-8-3.png'
                    ],
                    featured: true
                }
            ];
            
            // Guardar productos de demostración en localStorage
            localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(productosDemostracion));
            
            return productosDemostracion;
        }
    }
}

/**
 * Normaliza el formato de los productos para manejar tanto inglés como español
 */
function normalizarProductos(productos) {
    return productos.map(producto => ({
        id: producto.id || producto.idProducto || Date.now().toString(),
        name: producto.name || producto.nombreProducto || '',
        category: producto.category || producto.categoria || '',
        description: producto.description || producto.descripcion || '',
        price: parseFloat(producto.price || (producto.precio ? producto.precio : 0)),
        stock: parseInt(producto.stock || producto.cantidad || 0),
        mainImage: producto.mainImage || producto.imagen || '',
        additionalImages: producto.additionalImages || producto.imagenesAdicionales || [],
        featured: producto.featured || producto.destacado || false
    }));
}

/**
 * Carga productos destacados desde localStorage
 */
function cargarProductosDestacados() {
    try {
        const productosEnStorage = localStorage.getItem(STORAGE_KEYS.products);
        
        if (productosEnStorage) {
            const productos = JSON.parse(productosEnStorage);
            return productos.filter(p => p.featured === true);
        }
        
        return [];
    } catch (error) {
        console.error('Error al cargar productos destacados:', error);
        return [];
    }
}

/**
 * Muestra productos destacados agrupados por categoría
 */
function mostrarProductosDestacadosPorCategoria() {
    try {
        const productosDestacados = cargarProductosDestacados();
        const contenedor = document.getElementById('productos-destacados-container');
        
        if (!contenedor) {
            console.warn('El contenedor "productos-destacados-container" no existe en el DOM');
            return;
        }

        if (!productosDestacados.length) {
            contenedor.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">No hay productos destacados disponibles</p>
                </div>
            `;
            return;
        }

        // Agrupar productos por categoría
        const productosPorCategoria = productosDestacados.reduce((acc, producto) => {
            if (!acc[producto.category]) {
                acc[producto.category] = [];
            }
            acc[producto.category].push(producto);
            return acc;
        }, {});

        // Generar HTML para cada categoría
        const categoriasHTML = Object.entries(productosPorCategoria).map(([categoria, productos]) => `
            <div class="categoria-section mb-5">
                <h3 class="categoria-title mb-4">
                    <i class="bi bi-tag-fill me-2"></i>
                    ${categoria ? (categoria.charAt(0).toUpperCase() + categoria.slice(1)) : 'Sin categoría'}
                </h3>
                <div class="row g-4">
                    ${productos.map(producto => `
                        <div class="col-12 col-sm-6 col-lg-3">
                            <div class="card product-card h-100">
                                <div class="position-relative">
                                    <div id="carousel-${producto.id}" class="carousel slide" data-bs-ride="carousel">
                                        <div class="carousel-indicators">
                                            <button type="button" data-bs-target="#carousel-${producto.id}" data-bs-slide-to="0" class="active"></button>
                                            ${(producto.additionalImages || []).map((_, index) => `
                                                <button type="button" data-bs-target="#carousel-${producto.id}" data-bs-slide-to="${index + 1}"></button>
                                            `).join('')}
                                        </div>
                                        <div class="carousel-inner">
                                            <div class="carousel-item active">
                                                <img src="${producto.mainImage || 'https://via.placeholder.com/300x300?text=Sin+Imagen'}" class="card-img-top" alt="${producto.name}">
                                            </div>
                                            ${(producto.additionalImages || []).map(img => `
                                                <div class="carousel-item">
                                                    <img src="${img}" class="card-img-top" alt="Imagen adicional de ${producto.name}">
                                                </div>
                                            `).join('')}
                                        </div>
                                        ${(producto.additionalImages || []).length > 0 ? `
                                            <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${producto.id}" data-bs-slide="prev">
                                                <span class="carousel-control-prev-icon"></span>
                                            </button>
                                            <button class="carousel-control-next" type="button" data-bs-target="#carousel-${producto.id}" data-bs-slide="next">
                                                <span class="carousel-control-next-icon"></span>
                                            </button>
                                        ` : ''}
                                    </div>
                                    <span class="badge bg-primary position-absolute top-0 start-0 m-3">
                                        ${producto.category || 'Sin categoría'}
                                    </span>
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">${producto.name}</h5>
                                    <p class="card-text">${producto.description || 'Sin descripción'}</p>
                                    <div class="mt-auto">
                                        <p class="card-text">
                                            <strong>${formatearPrecioCOP(producto.price)}</strong>
                                        </p>
                                        <button class="btn btn-primary w-100" 
                                                onclick="agregarAlCarrito('${producto.id}')">
                                            <i class="bi bi-cart-plus"></i> Agregar al carrito
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        contenedor.innerHTML = categoriasHTML;
        
        // Inicializar todos los carruseles
        setTimeout(() => {
            try {
                productosDestacados.forEach(producto => {
                    if (producto.additionalImages?.length > 0) {
                        const carouselElement = document.getElementById(`carousel-${producto.id}`);
                        if (carouselElement) {
                            new bootstrap.Carousel(carouselElement, {
                                interval: 3000
                            });
                        }
                    }
                });
            } catch (e) {
                console.warn('Error al inicializar carruseles:', e);
            }
        }, 100);

    } catch (error) {
        console.error('Error al mostrar productos destacados por categoría:', error);
        mostrarErrorDeCarga('productos-destacados-container');
    }
}

/**
 * Muestra productos destacados en la sección principal
 */
function renderFeaturedProducts() {
    try {
        const productos = cargarProductosDestacados();
        const featuredProducts = productos.filter(p => p.featured);
        const container = document.getElementById('featured-products');
        
        if (!container) {
            console.warn('El contenedor "featured-products" no existe en el DOM');
            return;
        }

        if (!featuredProducts.length) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">No hay productos destacados disponibles</p>
                </div>
            `;
            return;
        }

        container.innerHTML = featuredProducts.map(producto => `
            <div class="producto-card featured" data-product-id="${producto.id}">
                <div id="featured-carousel-${producto.id}" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                        <button type="button" data-bs-target="#featured-carousel-${producto.id}" data-bs-slide-to="0" class="active"></button>
                        ${(producto.additionalImages || []).map((_, index) => `
                            <button type="button" data-bs-target="#featured-carousel-${producto.id}" data-bs-slide-to="${index + 1}"></button>
                        `).join('')}
                    </div>
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src="${producto.mainImage || 'https://via.placeholder.com/300x300?text=Sin+Imagen'}" class="d-block w-100" alt="${producto.name}">
                        </div>
                        ${(producto.additionalImages || []).map(img => `
                            <div class="carousel-item">
                                <img src="${img}" class="d-block w-100" alt="Imagen adicional de ${producto.name}">
                            </div>
                        `).join('')}
                    </div>
                    ${(producto.additionalImages || []).length > 0 ? `
                        <button class="carousel-control-prev" type="button" data-bs-target="#featured-carousel-${producto.id}" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon"></span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#featured-carousel-${producto.id}" data-bs-slide="next">
                            <span class="carousel-control-next-icon"></span>
                        </button>
                    ` : ''}
                </div>
                <div class="product-details">
                    <h3>${producto.name}</h3>
                    <p>${producto.description || 'Sin descripción'}</p>
                    <p class="price">${formatearPrecioCOP(producto.price)}</p>
                    <button class="buy-button" onclick="agregarAlCarrito('${producto.id}')">
                        <i class="fas fa-shopping-cart"></i> Agregar al carrito
                    </button>
                </div>
            </div>
        `).join('');

        // Inicializar todos los carruseles
        setTimeout(() => {
            try {
                featuredProducts.forEach(producto => {
                    if (producto.additionalImages?.length > 0) {
                        const carouselElement = document.getElementById(`featured-carousel-${producto.id}`);
                        if (carouselElement) {
                            new bootstrap.Carousel(carouselElement, {
                                interval: 3000
                            });
                        }
                    }
                });
            } catch (e) {
                console.warn('Error al inicializar carruseles destacados:', e);
            }
        }, 100);
    } catch (error) {
        console.error('Error al mostrar productos destacados en sección principal:', error);
        mostrarErrorDeCarga('featured-products');
    }
}

/**
 * Agrega un producto al carrito
 */
function agregarAlCarrito(idProducto) {
    try {
        console.log('Agregando al carrito producto con ID:', idProducto);
        
        // Cargar todos los productos
        const productosEnStorage = localStorage.getItem(STORAGE_KEYS.products);
        if (!productosEnStorage) {
            throw new Error('No hay productos disponibles');
        }
        
        const productos = JSON.parse(productosEnStorage);
        const producto = productos.find(p => p.id == idProducto);
        
        if (!producto) {
            throw new Error(`Producto con ID ${idProducto} no encontrado`);
        }
        
        // Cargar el carrito actual
        let carrito = [];
        const carritoGuardado = localStorage.getItem(STORAGE_KEYS.cart);
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
        }
        
        // Verificar si el producto ya está en el carrito
        const productoEnCarrito = carrito.find(item => item.id == idProducto);
        
        if (productoEnCarrito) {
            // Si ya está, incrementar cantidad
            productoEnCarrito.cantidad += 1;
            console.log('Incrementada cantidad de producto en carrito:', productoEnCarrito);
        } else {
            // Si no está, agregarlo con cantidad 1
            const nuevoItem = {
                id: producto.id,
                nombre: producto.name,
                precio: producto.price,
                imagen: producto.mainImage,
                cantidad: 1
            };
            carrito.push(nuevoItem);
            console.log('Nuevo producto agregado al carrito:', nuevoItem);
        }
        
        // Guardar carrito actualizado
        localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(carrito));
        
        // Mostrar confirmación
        mostrarNotificacion(`¡${producto.name} agregado al carrito!`);
        
        // Actualizar contador del carrito
        actualizarContadorCarrito();
        
        // Disparar evento personalizado para que otros scripts puedan reaccionar
        const event = new CustomEvent('carritoActualizado', { 
            detail: { carrito: carrito } 
        });
        document.dispatchEvent(event);
        
        return true;
        
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        mostrarNotificacion('Error al agregar producto al carrito', true);
        return false;
    }
}

/**
 * Muestra una notificación al usuario
 */
function mostrarNotificacion(mensaje, esError = false) {
    // Comprobar si ya existe un contenedor de notificaciones
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Crear elemento de notificación
    const notificacionId = 'toast-' + Date.now();
    const notificacion = document.createElement('div');
    notificacion.className = `toast ${esError ? 'bg-danger' : 'bg-success'} text-white border-0`;
    notificacion.id = notificacionId;
    notificacion.setAttribute('role', 'alert');
    notificacion.setAttribute('aria-live', 'assertive');
    notificacion.setAttribute('aria-atomic', 'true');
    
    notificacion.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${mensaje}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>
    `;
    
    // Agregar al contenedor
    toastContainer.appendChild(notificacion);
    
    // Inicializar toast de Bootstrap
    try {
        const toast = new bootstrap.Toast(notificacion, { delay: 3000 });
        toast.show();
        
        // Eliminar después de ocultarse
        notificacion.addEventListener('hidden.bs.toast', () => {
            notificacion.remove();
            // Eliminar contenedor si está vacío
            if (toastContainer.children.length === 0) {
                toastContainer.remove();
            }
        });
    } catch (error) {
        console.warn('Error al mostrar notificación con Bootstrap:', error);
        // Fallback simple si Bootstrap no está disponible
        alert(mensaje);
        notificacion.remove();
    }
}

/**
 * Actualiza el contador del carrito en la UI
 */
function actualizarContadorCarrito() {
    try {
        // Buscar todos los posibles contadores de carrito
        const contadores = document.querySelectorAll('.carrito-contador, #carrito-contador, [data-carrito-contador]');
        
        if (contadores.length === 0) {
            console.warn('No se encontraron elementos contadores de carrito en la página');
            return;
        }
        
        // Calcular total de items
        const carritoGuardado = localStorage.getItem(STORAGE_KEYS.cart);
        let totalItems = 0;
        
        if (carritoGuardado) {
            const carrito = JSON.parse(carritoGuardado);
            totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        }
        
        console.log('Total de items en carrito:', totalItems);
        
        // Actualizar todos los contadores encontrados
        contadores.forEach(contador => {
            contador.textContent = totalItems.toString();
            
            // Manejar visibilidad
            if (totalItems > 0) {
                contador.classList.remove('d-none');
                contador.style.display = ''; // Eliminar estilo display:none si existe
            } else {
                // Comprobar si el elemento debe ocultarse cuando es cero
                const ocultarEnCero = contador.getAttribute('data-ocultar-en-cero');
                if (ocultarEnCero !== 'false') {
                    contador.classList.add('d-none');
                }
            }
        });
        
        // Actualizar también los elementos padres que podrían mostrar/ocultar el contador
        const botonesCarrito = document.querySelectorAll('.btn-carrito, [data-carrito-btn]');
        botonesCarrito.forEach(btn => {
            const contador = btn.querySelector('.carrito-contador, [data-carrito-contador]');
            if (contador) {
                if (totalItems > 0) {
                    contador.classList.remove('d-none');
                } else {
                    contador.classList.add('d-none');
                }
            }
            
            // Opcional: añadir una clase al botón si hay items
            if (totalItems > 0) {
                btn.classList.add('tiene-items');
            } else {
                btn.classList.remove('tiene-items');
            }
        });
        
        console.log('Contador de carrito actualizado correctamente');
        return true;
    } catch (e) {
        console.error('Error al actualizar contador del carrito:', e);
        return false;
    }
}

/**
 * Muestra un mensaje de error cuando falla la carga
 */
function mostrarErrorDeCarga(containerId = null) {
    const mensaje = `
        <div class="col-12 text-center py-5">
            <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #dc3545;"></i>
            <p class="mt-3 text-danger">Error al cargar los productos. Por favor, intenta nuevamente más tarde.</p>
            <button class="btn btn-outline-primary mt-2" onclick="location.reload()">
                <i class="bi bi-arrow-clockwise"></i> Reintentar
            </button>
        </div>
    `;
    
    if (containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = mensaje;
        }
    } else {
        // Actualizar todos los contenedores principales
        const contenedores = [
            'productos-destacados-container',
            'featured-products'
        ];
        
        contenedores.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = mensaje;
            }
        });
    }
}

// Exportar funciones para uso en otros archivos
export {
    agregarAlCarrito,
    actualizarContadorCarrito,
    cargarProductos,
    mostrarNotificacion
};