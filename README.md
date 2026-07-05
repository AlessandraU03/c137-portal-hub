# Central de Portales C-137 - Rick & Morty Wiki 🪐🧬

Esta es una aplicación web interactiva desarrollada para la prueba técnica. Se trata del **Sistema de Expedientes y Hub de Portales C-137** de la franquicia Rick y Morty. Permite a los usuarios buscar personajes, navegar por episodios por temporada, examinar ubicaciones dimensionales y archivar expedientes en sus favoritos.

El proyecto está construido bajo **React (v19)**, **TypeScript**, **React Router**, **Tailwind CSS (v4)** y **TanStack Query (v5)**.

---

## 🚀 Instrucciones de Ejecución

Sigue estos pasos para instalar y arrancar el proyecto localmente en tu sistema:

### 1. Requisitos Previos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada) y npm (incluido con Node.js).

### 2. Navegar al directorio de la aplicación
Abre una terminal en la raíz de la carpeta del proyecto:
```bash
cd "C:\Users\aless\OneDrive\Documentos\9NOCUATRIMESTRE\estadia\rick"
```

### 3. Instalar las dependencias del proyecto
Instala los paquetes necesarios definidos en el `package.json` ejecutando:
```bash
npm install
```

### 4. Iniciar el servidor de desarrollo
Levanta el servidor de Vite local para visualizar la aplicación de manera interactiva:
```bash
npm run dev
```
Una vez iniciado, abre tu navegador e ingresa a la dirección local que imprima la consola (usualmente es **http://localhost:5173**).


---

## 🛠️ Requisitos Técnicos Cumplidos (Checklist)

A continuación se detalla cómo y dónde se implementó cada requisito técnico esperado:

* **React (v19) y TypeScript:** Toda la aplicación está desarrollada con componentes funcionales de React 19 y tipado estático estricto de TypeScript (sin uso de `any`), garantizando seguridad y autocompletado en el desarrollo.
* **Componentes Reutilizables:** Diseñados e implementados componentes atómicos y reutilizables globales bajo `src/shared/components/` (como `SearchBar.tsx`, `Skeleton.tsx` para estados de carga, `ErrorBoundary.tsx` y `ErrorState.tsx`).
* **Uso de Hooks:** Empleamos hooks personalizados de dos tipos: hooks de consumo de datos (`useCharacters.ts`, `useLocations.ts`, `useEpisodes.ts`) y hooks ViewModels para la presentación (`useCharactersViewModel.ts`, etc.).
* **Consumo Correcto de APIs:** Implementamos un cliente HTTP base desacoplado en `src/shared/api/client.ts` con manejo de errores HTTP nativos y tipado genérico para respuestas estructuradas y paginadas.
* **Manejo de Errores:** Atrapado de excepciones en tiempo de ejecución por medio del componente [ErrorBoundary.tsx] y pantallas de recuperación interactivas con [ErrorState.tsx] para reintentar la llamada de API fallida.
* **Estados de Carga:** Skeletons de carga animados (`Skeleton.tsx`) integrados en todas las vistas de listados y dossiers para dar un feedback inmediato al usuario durante la descarga asíncrona.
* **Código Organizado:** Estructurado bajo Clean Architecture modularizada por dominios (cada carpeta autocontiene su dominio, datos y vista).

---

## 🏛️ Decisiones Técnicas y Arquitectura

El proyecto implementa una **Clean Architecture Híbrida** organizada en **Módulos por Dominios (Feature-based)** y, a su vez, dividida en **Subcapas Limpias (data, domain, presentation)** dentro de cada módulo.

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

### Estructura Interna de Cada Módulo (Subcapas de Clean Architecture)
Dentro de cada carpeta de módulo, la lógica se separa estrictamente de la siguiente manera:
1. **`domain/` (Capa de Dominio):** Contiene tipos e interfaces puras de TypeScript (ej: `location.types.ts`). Es el núcleo del negocio y no depende de ninguna librería o framework externo.
2. **`data/` (Capa de Datos):**
   * **`api.ts`:** Se encarga de las llamadas HTTP directas a la API externa.
   * **`mapper.ts` (Mapeo de Datos):** Traduce el formato de respuesta del servidor (DTO) al modelo esperado por nuestro dominio. Decora los datos agregando estilos de Tailwind CSS, clasificaciones de peligro ("Riesgo Moderado", "Nivel de Peligro: Crítico") y botones de acción dinámicos. **Esto evita cablear lógica de condicionales de estilos complejas dentro del código JSX de la vista, manteniendo la presentación limpia.**
3. **`presentation/` (Capa de Presentación):**
   * **`hooks/` (Comportamiento):** Contiene el hook de React Query para la caché del servidor (`useLocations.ts`) y el hook **ViewModel** (`useLocationsViewModel.ts`), encargado de aislar y controlar todos los estados locales, sincronización de la URL y eventos de la UI.
   * **`pages/` (La Vista):** Componentes JSX declarativos (ej: `LocationsPage.tsx`) que consumen al ViewModel y están 100% libres de lógica de React (`useState`, `useEffect`).

---

## 🏗️ Justificación del Patrón de Diseño MVVM (Model-View-ViewModel)

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

## 🧠 Gestión del Estado

1. **Estado del Servidor (Caché asíncrono):** Administrado con **TanStack Query (React Query) v5**. Nos permite cachear los listados del multiverso y los dossiers detallados de los personajes. Al navegar entre pantallas, los datos se sirven instantáneamente desde la caché mientras se actualizan silenciosamente en segundo plano, proporcionando una experiencia veloz al usuario y reduciendo la carga en los servidores de la API.
2. **Estado Global (Favoritos):** Mantenido mediante **React Context API** (`FavoritesContext.tsx`). Provee un flujo reactivo para el contador de la barra superior. Su lógica se sincroniza automáticamente con el almacenamiento del navegador (`localStorage`) para que los expedientes marcados persistan incluso si el usuario cierra el navegador.
3. **Estado de UI local:** Variables locales gestionadas dentro del hook del ViewModel para capturar de forma reactiva pero controlada las acciones del usuario.

---

## ⚡ Estrategia de Búsqueda y Optimización de Red (Zero Debouncing)

* **Búsquedas de Catálogo bajo demanda (Sin Debouncing):**
  - El debouncing clásico en inputs de texto genera peticiones de red automáticas innecesarias a la API por cada intervalo de pausa al escribir.
  - Para evitar saturar la API pública y prevenir el parpadeo de recarga constante de la interfaz, los buscadores de personajes, episodios y dimensiones operan bajo un evento de **envío de formulario (on-submit)**. La consulta HTTP solo se gatilla cuando el usuario presiona Enter o hace clic en el botón de búsqueda, garantizando control absoluto del flujo de red.
* **Autocompletado con Umbral de Longitud Mínima:**
  - Para las sugerencias en tiempo real de la `SearchBar.tsx`, las peticiones solo se activan cuando el usuario ingresa **2 o más caracteres**. Si el input tiene 0 o 1 letra, el hook retorna inmediatamente una lista vacía en memoria sin realizar llamadas HTTP. Esto optimiza el consumo de red durante las primeras pulsaciones del teclado.

---


*Nota: Para más detalles de la arquitectura e implementación, puedes consultar el documento adjunto [DECISIONES_TECNICAS.md](./DECISIONES_TECNICAS.md) en la raíz del proyecto.*
