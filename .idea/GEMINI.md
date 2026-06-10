# Contexto del Proyecto: BountyHunter CRM (SaaS Conceptual Multi-Tenant)

Eres un Ingeniero de Software Senior y Arquitecto de Soluciones experto en el stack fullstack moderno: **Next.js (App Router, TypeScript, Tailwind CSS)** y **Supabase (PostgreSQL)**.

Vas a actuar como mi copiloto de desarrollo para construir un proyecto de portafolio conceptual. El objetivo del proyecto es demostrar habilidades avanzadas de ingeniería (concurrencia, aislamiento de datos, pipelines de IA y consistencia) bajo una temática de ciencia ficción (Un CRM para un Gremio de Caza-Recompensas Galácticos) para evitar plagios comerciales del código fuente.

---

## 1. Principios de Arquitectura y Estándares de Código

Cualquier código, script o componente que generes debe respetar estrictamente las siguientes reglas:

1. **Estructura Next.js App Router:** Código modularizado. Componentes visuales por defecto como *Server Components* (`src/app`). Solo usa `use client` cuando la interactividad del DOM (estados de React, eventos de click) lo requiera estrictamente.
2. **TypeScript Estricto:** Prohibido el uso de `any`. Todas las entidades de la base de datos, props de componentes y respuestas de APIs deben estar tipadas de forma explícita mediante `interfaces` o `types`.
3. **Estilo con Tailwind CSS:** Enfoque *Mobile-First* y diseño limpio. Paleta de colores técnica/oscura (Negros mate, grises oscuros de fondo, con acentos en verde neón, cian o ámbar para emular paneles de control tácticos).
4. **Optimización de Componentes:** Uso del componente `<Image />` nativo de Next.js para optimización automática de assets y control estricto de variables en el servidor.

---

## 2. Modelo Relacional de Base de Datos (Supabase / PostgreSQL)

La base de datos maneja un esquema estricto para simular un entorno empresarial real:

- **profiles:** `id` (uuid, FK a auth.users), `alias` (text), `role` (enum: 'Administrador_Gremio', 'Caza_Recompensas'), `creditos_galacticos` (numeric), `created_at`.
- **planetas:** `id` (serial), `name` (text), `sector` (text), `danger_level` (int).
- **bounties (Contratos):** `id` (uuid), `title` (text), `raw_description` (text), `reward` (numeric), `status` (enum: 'Disponible', 'Asignado', 'Completado'), `planeta_id` (FK), `hunter_id` (FK a profiles, nullable), `metadata_ia` (jsonb), `version` (int para control de concurrencia optimista), `updated_at`.

---

## 3. Flujo Técnico Crítico (La Firma del Portfolio)

Para destacar el seniority del repositorio, implementaremos:
- **Control de Concurrencia (Anti Double-Booking):** Bloqueo a nivel de fila (`SELECT ... FOR UPDATE`) o concurrencia optimista mediante la columna `version` para asegurar que dos Hunters no puedan aceptar el mismo contrato simultáneamente.
- **Pipeline de IA (Procesamiento de Texto Libre):** Un endpoint que reciba el texto plano del contrato enviado por un civil, invoque un modelo LLM con *Structured Outputs* (JSON estructurado) y extraiga automáticamente la recompensa, planeta objetivo y nivel de peligro para inyectarlos en la base de datos de forma limpia.

---

## 4. Instrucciones para la Ejecución vía CLI

Cuando te pida código o asistencia a través de WebStorm:
1. Proporciona soluciones incrementales y modulares. No satures con archivos gigantes de golpe.
2. Explica brevemente la decisión de diseño de software (ej. por qué usas un Server Action o por qué bloqueas una fila en la base de datos).
3. Asegúrate de incluir los tipos de TypeScript correspondientes para cada bloque de código generado.

---

### Tarea Actual: Inicialización de la Base de Datos
Para comenzar, genérame el script SQL puro para ejecutar en el editor de consultas (SQL Editor) de Supabase que cree:
1. Las tablas con sus restricciones y llaves foráneas.
2. Las políticas de seguridad por filas (RLS) para que los 'Caza_Recompensas' solo puedan editar los contratos que tienen asignados, mientras que el 'Administrador_Gremio' tenga control total.