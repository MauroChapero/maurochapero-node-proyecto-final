import https from 'https'; // Módulo nativo para hacer peticiones HTTPS

// Obtenemos argumentos desde la terminal: método, recurso y parámetros extra
const [,, method, resource, ...params] = process.argv;
const BASE_URL = "https://fakestoreapi.com";

// Muestra varios productos en consola con formato legible
function mostrarProductos(productos) {
  console.log(`\n📦 Lista de productos (${productos.length} encontrados):\n`);
  productos.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title}`);
    console.log(`   🏷️ Precio: $${p.price}`);
    console.log(`   📂 Categoría: ${p.category}`);
    console.log(`   📝 Descripción: ${p.description.substring(0, 100)}...\n`);
  });
}

// Muestra un producto individual con más detalle
function mostrarProducto(p) {
  console.log(`\n🛒 Producto:\n`);
  console.log(`🔢 ID: ${p.id}`);
  console.log(`📌 Título: ${p.title}`);
  console.log(`💲 Precio: $${p.price}`);
  console.log(`📂 Categoría: ${p.category}`);
  console.log(`📝 Descripción: ${p.description}`);
  console.log(`🖼 Imagen: ${p.image}\n`);
}

// Función genérica para hacer peticiones HTTPS
function request({ method, path, data = null }) {
  const options = {
    hostname: 'fakestoreapi.com',
    path,
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let body = '';

      // Vamos armando la respuesta
      res.on('data', chunk => (body += chunk));

      // Cuando termina, parseamos y resolvemos
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json);
        } catch (e) {
          reject(new Error("Respuesta inválida del servidor"));
        }
      });
    });

    // Por si falla la request
    req.on('error', reject);

    // Si hay datos (ej: POST), los mandamos en el body
    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Función principal que interpreta los comandos del usuario
async function main() {
  if (!method || !resource) {
    // Si no se pasó método o recurso, mostramos ayuda
    console.log("\n⚠️ Uso incorrecto del comando.");
    console.log("👉 Formatos válidos:");
    console.log("   npm run start GET products");
    console.log("   npm run start GET products/<id>");
    console.log("   npm run start POST products \"Titulo\" 123 Categoria");
    console.log("   npm run start DELETE products/<id>\n");
    return;
  }

  const partes = resource.split("/"); // Por si viene con ID

  try {
    // GET a todos los productos o a uno solo
    if (method === "GET" && partes[0] === "products") {
      if (partes.length === 1) {
        const productos = await request({ method: 'GET', path: '/products' });
        mostrarProductos(productos);
      } else if (partes.length === 2) {
        const id = partes[1];
        const producto = await request({ method: 'GET', path: `/products/${id}` });
        mostrarProducto(producto);
      } else {
        console.log("⚠️ Comando GET inválido.");
      }

    // POST para crear producto nuevo
    } else if (method === "POST" && resource === "products") {
      const [title, price, category] = params;

      // Verificamos que no falten datos
      if (!title || !price || !category) {
        console.log("\n⚠️ Faltan datos. Uso:");
        console.log("npm run start POST products \"Titulo\" 123 Categoria\n");
        return;
      }

      // Armamos el objeto nuevo
      const nuevoProducto = {
        title,
        price: parseFloat(price),
        category,
        description: "Producto agregado desde script local.",
        image: "https://via.placeholder.com/150"
      };

      // Enviamos al servidor
      const productoCreado = await request({ method: 'POST', path: '/products', data: nuevoProducto });
      console.log("\n✅ Producto creado exitosamente:");
      mostrarProducto(productoCreado);

    // DELETE para eliminar un producto por ID
    } else if (method === "DELETE" && partes[0] === "products" && partes.length === 2) {
      const id = partes[1];
      const productoEliminado = await request({ method: 'DELETE', path: `/products/${id}` });
      console.log("\n🗑️ Producto eliminado:");
      console.log(productoEliminado);

    // Si no matchea con nada, mostramos ayuda
    } else {
      console.log("\n⚠️ Comando no reconocido.");
      console.log("👉 Formatos válidos:");
      console.log("   npm run start GET products");
      console.log("   npm run start GET products/<id>");
      console.log("   npm run start POST products \"Titulo\" 123 Categoria");
      console.log("   npm run start DELETE products/<id>\n");
    }

  } catch (error) {
    // Capturamos errores de red o formato
    console.error("\n❌ Error en la operación:");
    console.error("➡️", error.message);
  }
}

main(); // Ejecutamos el script principal
