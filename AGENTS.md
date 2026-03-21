# Repository Guidelines

## Project Structure & Module Organization
This is a **Node.js/Express** backend using **CommonJS** (`require`/`module.exports`). The architecture follows a router-controller pattern:
- **`server.js`**: Main entry point that aggregates multiple routers.
- **`/sales`**: Dedicated module for sales requests, customers, and invoices.
- **`packing_routes.js` & `packing_controller.js`**: Handle packing lists, stickers, and material reports.
- **`db.js`**: Central PostgreSQL connection pool management using `pg`.
- **`apiconfig.js`**: Environment and network configuration.
- **Utility Scripts**: Numerous `check_*.js` and `setup_*.js` files in the root for database validation and initial data seeding.

## Build, Test, and Development Commands
The project uses `npm` for dependency management:
- **Start server**: `npm start` (runs `node server.js`).
- **Development**: Run `node <script_name>.js` for individual setup or check scripts.
- **Database Connection**: Configured in `db.js`. Ensure PostgreSQL is running locally on port 5432.

## Coding Style & Naming Conventions
- **Module System**: Strictly uses `CommonJS`.
- **Naming**: 
  - File names are generally lowercase (e.g., `inventorycontroller.js`, `packing_routes.js`).
  - Route prefixes: `/sales`, `/packing`, `/api`, `/head/inventory`.
- **Logging**: Uses console emojis for status updates (e.g., `✅`, `❌`).

## Testing Guidelines
There is currently no testing framework (e.g., Jest, Mocha) configured. The `npm test` script is a placeholder. Manual verification is typically done via the `check_*.js` utility scripts.

## Database & Filesystem
- **PostgreSQL**: Primary data store. 
- **Uploads**: Located in `/uploads/pdfs` and `/uploads/qrcodes`. These are served as static files via the `/uploads` route.
