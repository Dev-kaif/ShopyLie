# ShopyLie 📊

A modern, feature-rich product dashboard built with **React**, **TypeScript**, and **TailwindCSS**.  
_All the data, none of the truth!_

ShopyLie is a comprehensive dashboard for managing products, viewing analytics, and tracking orders, all powered by the **DummyJSON API**.  
It was built to demonstrate a modern frontend stack and best practices, including robust data management with **TanStack Query** and a polished UI using **shadcn/ui**.

---

## ✨ Features

This project goes beyond a simple CRUD app and includes a wide range of professional features:

- 📊 **Interactive Dashboard**

  - Dynamic overview with key metrics and live charts for at-a-glance insights.

- 📦 **Full Product Management (CRUD)**

  - Create, Read, Update, and Delete products seamlessly.
  - **Server-Side Pagination:** Efficiently browse through hundreds of products.
  - **Debounced Search & Filtering:** Instantly find products by name or filter by category.
  - **Modern UI:** Slide-in panel for viewing/editing product details without leaving the page.

- 📈 **Advanced Analytics**

  - Product distribution by category.
  - Top brands by total stock value.
  - Synthesized monthly revenue trends.

- 🛒 **Orders Page**

  - A simulated order tracking page showcasing scalability.

- 🚀 **Professional UX**
  - Dark & Light Mode with persistent theme toggle.
  - Command Menu (`Cmd+K`) for quick navigation.
  - Toast notifications for clear, non-intrusive feedback.
  - Skeleton loaders and robust error handling.

---

## ⚠️ API Limitations & Simulations

Due to the nature of the **DummyJSON API**, several features were simulated on the client-side to provide a complete user experience:

- **CRUD Persistence**  
  The DummyJSON API simulates success for `POST`, `PUT`, and `DELETE` requests but does not actually save, update, or delete data on the server.  
  To handle this, the project uses manual cache updates with **TanStack Query** so the UI reacts instantly as if the changes were persisted.

- **Orders Page**  
  The API does not provide a dedicated `/orders` endpoint. The Orders page was created by repurposing the `/carts` endpoint to simulate a list of customer orders.

- **Order Status**  
  Each order status (`Processing`, `Shipped`, etc.) is randomly generated on the client-side to create a more realistic experience.

- **Time-Series Data**  
  The "Revenue Trends" chart on the Analytics page uses synthesized monthly data since the API does not provide historical sales information.

---

## 🧠 Approach & Philosophy

The goal was to build a professional-grade, scalable frontend, not just meet assignment basics.  
Three guiding principles shaped the architecture:

1. **Server State is King**  
   All API interactions are handled exclusively by **TanStack Query**.  
   This centralizes fetching, caching, and mutations, keeping UI clean and snappy with background refetching and auto cache updates.

2. **Single Source of Truth for Data**  
   Data schemas are defined with **Zod**, and TypeScript types are inferred directly from them.  
   This ensures runtime validation and static typing stay in sync, eliminating entire categories of bugs.

3. **User Experience is a Feature**  
   Cmd+K command menu, toast notifications, and smooth page transitions were deliberately added to make the app modern, responsive, and enjoyable.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** React (with Vite)  
  _Fast UI + lightning-fast dev server and optimized builds._

- **Language:** TypeScript  
  _Static typing, safer refactoring, and fewer runtime errors._

- **Data Fetching & State Management:** TanStack Query  
  _Definitive server-state manager with caching, background updates, and simplified error/loading handling._

- **Forms & Validation:** React Hook Form + Zod  
  _Single schema source of truth → Type inference + runtime validation._

- **Styling:** TailwindCSS  
  _Utility-first CSS for rapid, consistent UI development._

- **UI Components:** shadcn/ui  
  _Accessible, unstyled building blocks with full control over design._

- **Charts:** Recharts  
  _Composable, interactive data visualizations._

- **API:** DummyJSON  
  _Realistic REST API with products, carts, and users._

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm (comes with Node.js) or [yarn](https://yarnpkg.com/)

---

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/shopylie.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd shopylie
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

   _(or use `yarn install` if you prefer yarn)_

4. **Run the development server**

   ```bash
   npm run dev
   ```

---

### Open in Browser

After starting the dev server, open:
👉 [http://localhost:5173](http://localhost:5173)
