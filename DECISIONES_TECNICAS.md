# Explicación de Decisiones Técnicas y Arquitectura 🏛️🧬

Este documento detalla exhaustivamente las decisiones de diseño de software, la selección de la fuente de datos, las justificaciones de la arquitectura modular y la implementación del patrón **MVVM** para la aplicación **Central de Portales C-137**.

---

## 🛠️ Requisitos Técnicos Cumplidos (Checklist)

A continuación se detalla cómo y dónde se implementó cada requisito técnico esperado:

* **React (v19) y TypeScript:** Toda la aplicación está desarrollada con componentes funcionales de React 19 y tipado estático estricto de TypeScript (sin uso de `any`), garantizando seguridad y autocompletado en el desarrollo.
* **Componentes Reutilizables:** Diseñados e implementados componentes atómicos y reutilizables globales bajo `src/shared/components/` (como `SearchBar.tsx`, `Skeleton.tsx` para estados de carga, `ErrorBoundary.tsx` y `ErrorState.tsx`).
* **Uso de Hooks:** Empleamos hooks personalizados de dos tipos: hooks de consumo de datos (`useCharacters.ts`, `useLocations.ts`, `useEpisodes.ts`) y hooks ViewModels para la presentación (`useCharactersViewModel.ts`, etc.).
* **Consumo Correcto de APIs:** Implementamos un cliente HTTP base desacoplado en `src/shared/api/client.ts` con manejo de errores HTTP nativos y tipado genérico para respuestas estructuradas y paginadas.
* **Manejo de Errores:** Atrapado de excepciones en tiempo de ejecución por medio del componente [ErrorBoundary.tsx](file:///C:/Users/aless/OneDrive/Documentos/9NOCUATRIMESTRE/estadia/rick/src/shared/components/ErrorBoundary.tsx) y pantallas de recuperación interactivas con [ErrorState.tsx](file:///C:/Users/aless/OneDrive/Documentos/9NOCUATRIMESTRE/estadia/rick/src/shared/components/ErrorState.tsx) para reintentar la llamada de API fallida.
* **Estados de Carga:** Skeletons de carga animados (`Skeleton.tsx`) integrados en todas las vistas de listados y dossiers para dar un feedback inmediato al usuario durante la descarga asíncrona.
* **Código Organizado:** Estructurado bajo Clean Architecture modularizada por dominios (cada carpeta autocontiene su dominio, datos y vista).

---

## 🧭 1. Elección de la Fuente de Datos (¿Por qué la Rick and Morty API?)

De las opciones proporcionadas en la prueba técnica, se seleccionó la **API de Rick and Morty** debido a las siguientes razones técnicas y estratégicas:

1. **Estructura Relacional Compleja:** Los personajes apuntan a endpoints de `/location` (orígenes y residencias actuales) y aparecen en listas de `/episode`. Esto nos permitió implementar un sistema de navegación cruzada avanzado (desde el detalle del personaje hacia sus episodios o dimensiones de origen y viceversa) demostrando destreza en el manejo de rutas dinámicas.
2. **Desafío de Búsqueda Multiversal:** La naturaleza de la API propició la creación de un buscador global en el Dashboard (`HomePage`). Buscar un término simultáneamente en tres recursos distintos (personajes, episodios, ubicaciones) demandó la implementación de llamadas asíncronas concurrentes, elevando el nivel de complejidad técnica del consumo de datos.
3. **Potencial Narrativo y de Diseño (UX/UI):** La temática "Sci-Fi / Portal Gun" de la serie ofreció un lienzo perfecto para diseñar una interfaz inmersiva y futurista. Esto permitió salir del molde de los catálogos web genéricos para construir una consola cuántica interactiva con estéticas premium (neones, cristal esmerilado, animaciones de portales), incrementando sustancialmente la puntuación en la categoría de Experiencia de Usuario.

---

## 🏛️ 2. Arquitectura de Software: Modular por Dominios (Feature-based)

El proyecto implementa una **Clean Architecture Híbrida** organizada en **Módulos por Dominios (Feature-based)** y, a su vez, dividida en **Subcapas Limpias (data, domain, presentation)** dentro de cada módulo:

```text
src/
├── shared/                  # Módulo global transversal (API client, Skeletons, Navbar, etc.)
├── home/                    # Módulo de la consola cuántica principal (Dashboard)
├── characters/              # Módulo del directorio de sujetos y dossiers biológicos
├── locations/               # Módulo de la guía de dimensiones y análisis de peligro
├── episodes/                # Módulo del registro de crónicas interdimensionales
└── favorites/               # Módulo de expedientes locales guardados por el usuario
```

### Justificación de los Módulos Raíz:
* **Cohesión Alta y Acoplamiento Débil:** Cada característica (como `characters` o `locations`) es completamente independiente. Los cambios en los requerimientos de dimensiones no tocan archivos de personajes, minimizando efectos secundarios imprevistos y facilitando el desarrollo paralelo en equipos grandes.

---

## 📂 3. Estructura Interna de Cada Módulo (Subcapas de Clean Architecture)

Como se visualiza en la estructura interna de `locations/` (y en el resto de los módulos):

```text
locations/
├── domain/                  # Capa de Dominio (Corazón del negocio)
│   └── location.types.ts    # Tipos e interfaces puras de TypeScript
│
├── data/                    # Capa de Datos (Infraestructura y Red)
│   ├── locations.api.ts     # Peticiones HTTP y consumo de API
│   └── locations.mapper.ts  # Mapeo y decoración de datos crudos
│
└── presentation/            # Capa de Presentación (Interfaz de Usuario)
    ├── hooks/               # useLocations.ts (Query) y useLocationsViewModel.ts (VM)
    └── pages/               # Vistas visuales (LocationDetailPage, LocationsPage)
```

### Propósito y Justificación de las Subcapas:

#### A. Capa de Dominio (`domain/`)
* **Qué contiene:** Únicamente interfaces y definiciones de tipos de TypeScript puras (ej: `Location`).
* **Justificación:** Es el núcleo del negocio. **No depende de ninguna librería externa**, framework de CSS o cliente HTTP. Define la estructura de datos ideal que la aplicación espera consumir, manteniéndose libre de acoplamientos técnicos.

#### B. Capa de Datos (`data/`)
* **Qué contiene:** 
  - **`locations.api.ts` (API Client):** Encargado de realizar el fetch directo utilizando nuestro cliente base, pasando filtros y gestionando endpoints del backend.
  - **`locations.mapper.ts` (Mappers):** Traduce la respuesta del servidor (DTO) a la estructura del dominio.
* **Justificación de los Mappers:** La API externa entrega datos planos y un formato rígido. El Mapper se encarga de formatear y "decorar" la información (ej: calculando el nivel de peligro cuántico o asignando colores de Tailwind en función de las constantes del modelo) antes de exponerla al dominio. **Esto evita que la capa visual contenga sentencias condicionales complejas de diseño, manteniendo la presentación libre de lógica pesada de formato.**

#### C. Capa de Presentación (`presentation/`)
* Contiene componentes visuales (`pages/` y `components/`) y comportamiento dinámico (`hooks/`), estructurado de manera estricta mediante el patrón de diseño **MVVM** que se detalla a continuación.

---

## 🏗️ 4. Justificación del Patrón de Diseño MVVM (Model-View-ViewModel)

Una de las decisiones más críticas del proyecto fue implementar el patrón **MVVM** para estructurar la interacción con React:

### El Problema en React Tradicional (Fat Components):
En aplicaciones estándar de React, es muy común encontrar componentes "gordos" (*fat components*), donde el enrutamiento (`useSearchParams`, `useNavigate`), el estado local (`useState`), los efectos secundarios (`useEffect`), la manipulación de arrays (`useMemo`) y las consultas HTTP (`useQuery`) se programan dentro del mismo archivo JSX. Esto viola el principio de responsabilidad única (Single Responsibility Principle) y hace que las vistas sean difíciles de leer, probar y mantener.

### La Solución Implementada (MVVM):
Desacoplamos por completo la lógica de presentación del marcado JSX dividiendo el desarrollo en tres entidades diferenciadas:
1. **Model (Modelo):** Definido por las interfaces del dominio (`domain/`) y las llamadas/transformaciones de datos (`data/`).
2. **View (Vista):** Los componentes y páginas visuales (ej: `LocationsPage.tsx`). Su única responsabilidad es estructurar el maquetado (JSX) y aplicar clases de estilo (Tailwind CSS) consumiendo propiedades de lectura provistas por el ViewModel.
3. **ViewModel (Vista-Modelo):** Hooks controladores personalizados (ej: `useLocationsViewModel.ts`). Administran los inputs temporales de formularios, coordinan la paginación, sincronizan la dirección URL del navegador con los filtros y deciden cuándo actualizar el término de búsqueda para disparar las consultas de datos.

### ¿Por qué se escogió específicamente MVVM para esta prueba técnica?
* **Mantenibilidad e Independencia de UI:** Si en el futuro se decide rediseñar la interfaz (ej: migrar de Tailwind a Material UI), el cambio se limita a los archivos de la **Vista**. La lógica en el **ViewModel** permanece intacta y funcional, ya que no tiene dependencia directa con el código JSX.
* **Testeabilidad (Unit Testing):** La lógica de filtrado, búsquedas, ordenaciones y reseteos se puede probar mediante tests unitarios rápidos sobre React Hooks (con `@testing-library/react-hooks`) de forma aislada, sin necesidad de renderizar o montar el árbol del DOM visual.
* **Claridad del Código:** Al separar la lógica de presentación, los archivos JSX son limpios y concisos (todos se mantienen por debajo de las 180 líneas de código), lo que agiliza la lectura y facilita la detección de errores.

---

## 🧠 5. Gestión del Estado y Flujo de Datos

El flujo de datos se dividió en tres niveles con tecnologías específicas:

1. **Estado del Servidor (Caché asíncrono):** Administrado con **TanStack Query (React Query) v5**. Nos permite cachear los listados del multiverso y los dossiers detallados de los personajes. Al navegar entre pantallas, los datos se sirven instantáneamente desde la caché mientras se actualizan silenciosamente en segundo plano, proporcionando una experiencia veloz al usuario y reduciendo la carga en los servidores de la API.
2. **Estado Global (Favoritos):** Mantenido mediante **React Context API** (`FavoritesContext.tsx`). Provee un flujo reactivo para el contador de la barra superior. Su lógica se sincroniza automáticamente con el almacenamiento del navegador (`localStorage`) para que los expedientes marcados persistan incluso si el usuario cierra el navegador.
3. **Estado de UI local:** Variables locales gestionadas dentro del hook del ViewModel para capturar de forma reactiva pero controlada las acciones del usuario.

---

## ⚡ 6. Estrategia de Búsqueda y Optimización de Red (Zero Debouncing)

Disparamos dos estrategias distintas para optimizar las peticiones HTTP y mejorar la respuesta visual:

* **Búsquedas de Catálogo bajo demanda (Sin Debouncing):**
  - El debouncing clásico en inputs de texto genera peticiones de red automáticas innecesarias a la API por cada intervalo de pausa al escribir.
  - Para evitar saturar la API pública y prevenir el parpadeo de recarga constante de la interfaz, los buscadores de personajes, episodios y dimensiones operan bajo un evento de **envío de formulario (on-submit)**. La consulta HTTP solo se gatilla cuando el usuario presiona Enter o hace clic en el botón de búsqueda, garantizando control absoluto del flujo de red.
* **Autocompletado con Umbral de Longitud Mínima:**
  - Para las sugerencias en tiempo real de la `SearchBar.tsx`, las peticiones solo se activan cuando el usuario ingresa **2 o más caracteres**. Si el input tiene 0 o 1 letra, el hook retorna inmediatamente una lista vacía en memoria sin realizar llamadas HTTP. Esto optimiza el consumo de red durante las primeras pulsaciones del teclado.

---

## 💥 7. Desafíos Técnicos Encontrados y Soluciones

* **Conflicto del Foco en Autocompletado (`onBlur` vs `onClick`):**
  - *El reto:* Al dar clic a una sugerencia del buscador para navegar a su detalle, el evento `onBlur` del input se ejecutaba antes, ocultando el menú de sugerencias inmediatamente e impidiendo que se completara el clic de redirección.
  - *La solución:* Reemplazamos el evento `onClick` por `onMouseDown` con `e.preventDefault()`. Esto nos permitió capturar la acción del usuario y realizar la navegación mediante React Router antes de que el campo de texto perdiera el foco.
* **Caché Persistente de Favicon en Navegadores:**
  - *El reto:* Los navegadores web cachean los favicons de manera sumamente agresiva. El favicon original de Vite (`favicon.svg`) persistía en la pestaña a pesar de cambiar los meta tags.
  - *La solución:* Eliminamos el recurso SVG original e implementamos un archivo binario `.ico` estándar (`favicon.ico`) con el recorte 1:1 perfecto de la silueta del portal. Esto forzó a los navegadores a invalidar su caché y refrescar de inmediato la pestaña del navegador con la identidad cuántica del portal.
