# Camella-EC

[![License: MIT](https://img.shields.io/badge/License-MIT-44CC11?style=for-the-badge)](LICENSE)

A web platform connecting Ecuadorian artisans, trade workers, and service specialists with local clients. Built with Angular 17, TypeScript, SCSS, and Firebase.

<div align="center">
  <img src="https://img.shields.io/badge/Angular_17-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/License-MIT-44CC11?style=for-the-badge" alt="MIT License" />
</div>

---

## Features

### 👷 Artisan & Worker Portal (`sistematrabajadores`)
- Dedicated dashboard for local tradespeople and specialists to list skills, manage service availability, and showcase portfolio projects.
- Worker authentication and verified identity routing with `guardsTrabajadores`.

### 👥 Client & Consumer Hub (`sistemausuarios`)
- Directory of verified local service providers and handcrafted products across Ecuador.
- Interactive service booking, profile evaluations, and client authentication with `guardsUsuarios`.

### 🛡️ Role-Based Architecture & Security
- Strict Angular route guards preventing unauthorized access across portal boundaries.
- Centralized data services for real-time order tracking and profile updates.

---

## Project Structure

```
CAMELLAEC/
├── src/
│   ├── app/
│   │   ├── landingpage/         # Public discovery and landing view
│   │   ├── sistematrabajadores/ # Worker / artisan administration dashboard
│   │   ├── sistemausuarios/     # Client search and request portal
│   │   ├── guardsTrabajadores/  # Worker portal authentication guards
│   │   ├── guardsUsuarios/      # Client portal authentication guards
│   │   ├── services/            # Backend and data services
│   │   ├── app.routes.ts        # Modular client/worker route definitions
│   │   └── app.config.ts        # Application bootstrap configuration
│   └── environments/            # Firebase and backend environment configurations
└── angular.json                 # Angular build pipeline configuration
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`

### Installation
```bash
# Clone the repository
git clone https://github.com/adriangbustos/Camella-EC.git
cd Camella-EC

# Install dependencies
npm install

# Start development server
ng serve
```
Open `http://localhost:4200` in your web browser.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
