# MediSaaS 🏥✨

MediSaaS es una plataforma web moderna y segura, diseñada específicamente para que doctores independientes y pequeñas clínicas puedan gestionar sus consultorios de forma profesional, sin fricciones y con un diseño de vanguardia.

##  Características Principales

- **Diseño Ultra-Premium**: Interfaz responsiva con *Advanced Glassmorphism*, fondos dinámicos y tipografía cuidada (Google Fonts: Outfit y Plus Jakarta Sans) para garantizar el "Efecto Wow" en los usuarios.
- **Onboarding sin fricción**: Autenticación rápida y segura con Google (Firebase Auth). Si es tu primera vez, el sistema te guía para crear tu espacio de trabajo privado.
- **Aislamiento de Datos Nivel Empresarial**: Arquitectura pensada para la seguridad. Los datos de la Clínica "A" están matemáticamente separados de la Clínica "B" a nivel de base de datos gracias a las **Security Rules de Firestore**.
- **Gestión de Pacientes**: Directorio completo con información de contacto, edad y un espacio para historial/notas médicas.
- **Agenda Inteligente**: Asigna citas a tus pacientes de forma rápida e intuitiva. 

## 🛠️ Stack Tecnológico

El proyecto está construido sobre tecnologías modernas, optimizadas para velocidad, bajo costo inicial y alta escalabilidad:

- **Frontend**: [React.js](https://react.dev/) + [Vite](https://vitejs.dev/) para una experiencia ultra rápida (SPA).
- **Estilos**: CSS Puro implementando un sistema de diseño propio (Dark Mode, UI de cristal flotante).
- **Iconografía**: [Lucide React](https://lucide.dev/).
- **Backend / Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) (Base de datos NoSQL en tiempo real).
- **Autenticación**: Firebase Auth (Google Provider).
- **Enrutamiento**: React Router v6.

## ⚙️ Estructura del Proyecto

```bash
📦 src
 ┣ 📂 components       # Componentes reutilizables de UI y Layouts (Ej. DashboardLayout)
 ┣ 📂 contexts         # Manejo de estado global (AuthContext para usuarios y clínica)
 ┣ 📂 firebase         # Configuración y conexión con los servicios de Google Cloud
 ┣ 📂 pages            # Vistas principales de la app (Login, Pacientes, Citas, etc.)
 ┣ 📜 App.jsx          # Configuración principal de Rutas y Privacidad
 ┣ 📜 index.css        # Sistema de Diseño Global y Variables Premium
 ┗ 📜 main.jsx         # Punto de entrada de React
```

## 💻 Instalación y Desarrollo Local

Sigue estos pasos para correr el proyecto en tu máquina local:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/carlos2024r3223rw/MediSaaS.git
   cd MediSaaS
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abre en tu navegador**:
   El proyecto estará corriendo generalmente en `http://localhost:5173`.

---
*Desarrollado con ❤️ para empoderar a los profesionales de la salud.*
