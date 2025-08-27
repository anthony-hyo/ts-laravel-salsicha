# 🚀 TS-Laravel | Bun TypeScript Framework

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![Bun Version](https://img.shields.io/badge/bun-v1.0-blue.svg)](https://bun.sh/)  
[![TypeScript](https://img.shields.io/badge/typescript-5.5.3-blue.svg)](https://www.typescriptlang.org/)  

A simple, lightweight **TypeScript** web framework built on **Bun** inspired by Laravel's elegant MVC style.  
Fast, minimal, and developer-friendly with decorators, Prisma integration, and easy response rendering.

> ⚡ Note: This framework was used in the Salsicha Launcher project for building its home page, server list API, and dynamic rendering.
> 
## 📷 Preview

Here’s a preview of the **Launcher Home Page**:

<img src="./preview_1.gif" alt="Preview" width="auto" height="250">

---

## 🌟 Features

- **TypeScript & Bun-powered** for speed and type safety  
- MVC architecture with Controllers, Routes, and Middleware  
- Route decorators for clean route definitions  
- EJS templating with dynamic rendering support  
- Response helpers: HTML, JSON, XML, redirects, errors  
- Built-in middleware support and request logging  
- Prisma ORM for database management  
- Easy to extend and customize  

---

## ⚙️ Installation

### Prerequisites

- [Bun](https://bun.sh/) installed on your system  
- Node.js and npm/yarn (optional, for Prisma CLI)

```bash
bun install
````

---

## 🚀 Usage

Start the development server:

```bash
bun run start
```

Access the app at:

```
http://localhost:3000
```

---

## 🏗️ Project Structure

```
/app
  /controllers       # Controller classes
  /middlewares       # Middleware functions
  /models            # Prisma models and business logic
/config              # Configuration files
/public              # Static files (CSS, JS, images)
/views               # EJS templates for rendering
/server.ts           # Server entry point
```

---

## 🔥 Example Routes

| Method | Path        | Description                       |
| ------ | ----------- | --------------------------------- |
| GET    | `/`         | Render home page with EJS view    |
| GET    | `/json`     | Returns a JSON response           |
| GET    | `/html`     | Returns raw HTML response         |
| GET    | `/redirect` | Redirects to external URL         |
| GET    | `/error`    | Returns 500 Internal Server Error |

---

## 📦 Example Controller

```ts
import RequestMethod from "../enums/RequestMethod";
import { Route } from "../decorators/Route";
import Renderer from "../helpers/Renderer";

export default class HomeController {
  @Route("/", RequestMethod.GET)
  async index() {
    return await Renderer.view("home", { title: "Welcome", message: "Hello from Bun Framework!" });
  }

  @Route("/json", RequestMethod.GET)
  jsonExample() {
    return Renderer.json({ message: "Hello from JSON response!" });
  }
}
```

---

## 🛠 Database (Prisma)

Setup your database using Prisma ORM.

```bash
npx prisma migrate dev --name init
```

Usage in code:

```ts
import Database from "../utils/Database";

const users = await Database.prisma.user.findMany();
```

---

## ⚡ Middleware Example

```ts
export function logger(request: Request, response: Response, next: Function): void {
  console.log(`${request.method} ${request.url} - ${new Date().toISOString()}`);
  next();
}
```

Register middleware as needed in your server setup.

---

## 📦 Deployment

* Build your project with Bun if needed.
* Deploy on any platform supporting Bun (Linux servers, Docker containers, or cloud providers).
* Ensure environment variables and database credentials are configured correctly.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork the repo and submit pull requests.

---

## 📜 License

This project is licensed under the MIT License.
