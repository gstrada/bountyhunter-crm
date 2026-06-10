# BountyNet - Galactic Guild CRM

BountyNet es un **CRM conceptual de alta disponibilidad** diseñado para la gestión táctica de contratos en un gremio de caza-recompensas galácticos. Este proyecto nace como una pieza de portafolio para demostrar el dominio de arquitecturas modernas fullstack, el manejo crítico de la concurrencia y la integración inteligente de modelos de lenguaje (LLM).

La elección de una temática de ciencia ficción no es casual: permite explorar flujos de trabajo complejos (asignación de misiones, gestión de créditos, procesamiento de transmisiones) de forma creativa, evitando el código genérico de aplicaciones empresariales tradicionales.

---

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions).
- **Lenguaje:** [TypeScript](https://www.typescript.org/) (Tipado estricto en toda la capa de datos).
- **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security).
- **IA:** [Google Gemini 1.5 Pro](https://aistudio.google.com/) (Procesamiento de texto no estructurado).
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (Diseño "Táctico" personalizado).

---

## 🚀 Características Principales (Engineering Highlights)

### 1. Control de Concurrencia Optimista (Anti Double-Booking)
Para garantizar que dos Hunters no acepten el mismo contrato simultáneamente, se implementó un sistema de **concurrencia optimista** mediante una columna de versión en PostgreSQL. Cada intento de aceptación valida el estado y la versión en una sola operación atómica en el servidor.

### 2. Pipeline de IA para Ingesta de Datos
El sistema cuenta con una **Terminal de Ingesta** que procesa transmisiones de voz o texto libre de civiles. Utilizando Gemini 1.5 Pro y validación con **Zod**, el sistema extrae automáticamente:
- Objetivo y título táctico.
- Planeta (con creación automática si no existe en el registro).
- Recompensa calculada en Créditos Galácticos.
- Nivel de peligro estimado (1-10).

### 3. Seguridad de Grado Militar (RLS)
La base de datos está protegida mediante políticas **Row Level Security (RLS)**. Los Hunters solo pueden ver contratos disponibles o los suyos, mientras que los administradores del gremio tienen acceso exclusivo a las herramientas de ingesta de IA y gestión global de planetas.

### 4. Arquitectura de Sesión Híbrida
Implementación avanzada de `@supabase/ssr` para manejar sesiones de forma consistente entre el Middleware, Server Components y Client Components, garantizando que el acceso a la red BountyNet sea siempre seguro.

---

## 📋 Estructura del Proyecto

- `/src/app/admin`: Módulos de gestión y pipeline de IA.
- `/src/app/dashboard`: Centro de operaciones para cazadores.
- `/src/components`: Componentes UI con estética de terminal.
- `/src/utils/supabase`: Configuración de clientes SSR.
- `/supabase/migrations`: Historial de esquema y políticas SQL.

---

## 🛰️ Instalación Local

1. Clona el repositorio.
2. Configura las variables de entorno en `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_GENERATIVE_AI_API_KEY`
3. Instala dependencias: `npm install`.
4. Ejecuta las migraciones de `/supabase/migrations` en tu instancia de Supabase.
5. Inicia el motor: `npm run dev`.

---

*Proyecto desarrollado como demostración técnica de arquitectura de sistemas y flujos de IA.*
