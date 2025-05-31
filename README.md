# 🏩 Proyecto Final Talento Tech - FakeStore CLI API Client

Este proyecto es un cliente de línea de comandos (CLI) desarrollado en **Node.js**, que permite interactuar con la API pública de [Fake Store](https://fakestoreapi.com). Permite listar productos, ver detalles, crear nuevos productos y eliminarlos, todo desde la terminal.

## 🚀 Tecnologías usadas

* Node.js
* Módulo nativo `https` (sin dependencias externas)

## 📦 Instalación

1. Clona este repositorio:

   ```bash
   git clone <url-del-repo>
   cd <nombre-del-repo>
   ```

2. Ejecuta el script usando `npm run start` seguido de los parámetros.

> Asegúrate de tener Node.js instalado en tu sistema.

---

## 📌 Uso

### 📄 Comandos disponibles:

```bash
npm run start <METHOD> <RESOURCE> [PARAMS...]
```

### 📚 Ejemplos:

#### 1. Obtener todos los productos

```bash
npm run start GET products
```

#### 2. Obtener un producto por ID

```bash
npm run start GET products/3
```

#### 3. Crear un nuevo producto

```bash
npm run start POST products "Remera negra" 4999 "ropa"
```

#### 4. Eliminar un producto por ID

```bash
npm run start DELETE products/5
```

---

## 🧠 Estructura

* `main()` — Lógica principal que interpreta los comandos.
* `request()` — Función reutilizable para hacer peticiones HTTPS.
* `mostrarProductos()` — Muestra múltiples productos en formato legible.
* `mostrarProducto()` — Muestra un solo producto con más detalles.

---

## 🡩‍💻 Autor

Proyecto final desarrollado por Mauro Chapero para el curso de Node.js de **TalentoTech**.
