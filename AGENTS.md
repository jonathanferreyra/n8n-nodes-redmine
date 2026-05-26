# AGENTS.md

Guia de trabajo para seguir construyendo el nodo comunitario `n8n-nodes-redmine`.

## Objetivo del paquete

Este repositorio implementa un nodo comunitario de n8n para consumir la API REST de Redmine. La superficie actual expone:

- Credenciales `Redmine API`, con `url` y `apiKey`.
- Recurso `Issue`, con operaciones `get`, `getAll`, `create`, `update`, `delete` y `addWatcher`.
- Recurso `Project`, con operaciones `get`, `getAll`, `create`, `update` y `delete`.
- Recurso `User`, con operaciones `get`, `getCurrent`, `getAll`, `create`, `update` y `delete`.
- Opcion global `Impersonate User`, enviada como header `X-Redmine-Switch-User`.

La referencia funcional principal es el `README.md`. Para detalles de endpoints y parametros, contrastar siempre contra la documentacion oficial de Redmine:

- https://www.redmine.org/projects/redmine/wiki/Rest_api

Version minima soportada de Redmine: `5.0`.

## Stack y comandos

- Runtime requerido: Node.js `22.x` (fijado en `.nvmrc`, `.node-version`, `package.json` y `.npmrc`).
- Package manager esperado: `pnpm@9.1.4`.
- Lenguaje: TypeScript, CommonJS, salida en `dist/`.
- Tests unitarios: Vitest.
- API n8n: `n8nNodesApiVersion: 1`.
- Flujo de release esperado: publicar en npm usando `pnpm prepublishOnly` antes de publicar.

Comandos habituales:

```bash
pnpm build
pnpm lint
pnpm test
pnpm format
pnpm dev
pnpm prepublishOnly
```

Antes de cerrar cambios de codigo, ejecutar como minimo:

```bash
pnpm build
pnpm lint
pnpm test
```

Si se tocaron descripciones, propiedades o estructura del nodo, tambien revisar manualmente que el nodo cargue en n8n y que los `displayOptions` muestren solo los campos esperados.

Los tests unitarios viven en `tests/` y usan Vitest. Priorizan validar el armado de requests, paginacion, filtros, payloads, headers, errores y `pairedItem` sin depender de una instancia Redmine real.

## Mapa del repositorio

- `credentials/RedmineApi.credentials.ts`: definicion de credenciales `redmineApi`.
- `nodes/Redmine/Redmine.node.ts`: descripcion principal del nodo, recursos, credenciales, opciones globales y dispatch de ejecucion.
- `nodes/Redmine/IssueOperations.ts`: agregador de propiedades para Issues.
- `nodes/Redmine/issue/operations.ts`: lista de operaciones de Issue.
- `nodes/Redmine/issue/fields.ts`: campos comunes, create y update de Issue.
- `nodes/Redmine/issue/additionalFields.ts`: campos adicionales de Issue.
- `nodes/Redmine/Issue.getAll.Operations.ts`: filtros y parametros especificos de `issue:getAll`.
- `nodes/Redmine/IssueExecute.ts`: ejecucion HTTP de operaciones de Issue.
- `nodes/Redmine/ProjectOperations.ts`: operaciones y campos de Project.
- `nodes/Redmine/ProjectExecute.ts`: ejecucion HTTP de operaciones de Project.
- `nodes/Redmine/UserOperations.ts`: operaciones y campos de User.
- `nodes/Redmine/UserExecute.ts`: ejecucion HTTP de operaciones de User.
- `nodes/Redmine/redmine.svg`: icono empaquetado por `gulp build:icons`.
- `tests/helpers.ts`: contexto fake de `IExecuteFunctions` para unit tests.
- `tests/IssueExecute.test.ts`: unit tests de operaciones de Issue.
- `tests/ProjectExecute.test.ts`: unit tests de operaciones de Project.
- `tests/UserExecute.test.ts`: unit tests de operaciones de User.
- `vitest.config.mts`: configuracion de Vitest, incluyendo alias para `n8n-workflow`.
- `package.json`: metadata n8n, scripts, keywords y archivos publicables.

## Patrones de implementacion

Mantener separada la declaracion UI de la ejecucion:

- Los campos del editor de n8n viven en archivos `*Operations.ts` o en subcarpetas especificas como `nodes/Redmine/issue/`.
- La logica que arma `endpoint`, `method`, `body` y `qs` vive en `*Execute.ts`.
- `Redmine.node.ts` solo debe orquestar recursos, credenciales, opciones globales y el dispatch hacia `execute*Operation`.

Para requests a Redmine:

- Usar `this.helpers.request(options)`.
- Enviar API key como header `X-Redmine-API-Key`.
- Enviar JSON con `Content-Type: application/json`.
- Construir URLs con `${baseUrl}/` + `endpoint.replace(/^\//, '')`.
- Si `body` queda vacio, eliminar `options.body`.
- Convertir errores HTTP en `NodeOperationError` con `{ itemIndex: i }`.
- Devolver siempre `{ json: responseData, pairedItem: { item: i } }`.
- Cuando `returnAll` sea `true`, traer todas las paginas que matcheen con los filtros. Manejar internamente el paginado de Redmine hasta agotar resultados.

Para impersonacion:

- Leer `options.impersonateUser`.
- Si existe, enviar `X-Redmine-Switch-User`.
- Documentar que requiere API key de admin.

Para colecciones de custom fields:

- En filtros de Issues, mapear a query params `cf_<id>`.
- En create/update, mapear a `custom_fields: [{ id, value }]`.

Para operaciones destructivas:

- Mantener `delete` como `DELETE /resource/:id.json`.
- No agregar confirmaciones artificiales dentro del nodo; n8n ya maneja la UX de ejecucion.

## Checklist para agregar una operacion

1. Confirmar endpoint, metodo, payload y respuesta en la API REST de Redmine.
2. Agregar la opcion en el `operations` del recurso correspondiente.
3. Agregar campos requeridos y opcionales con `displayOptions` precisos.
4. Implementar la rama en el archivo `*Execute.ts`.
5. Mantener nombres de parametros consistentes con Redmine cuando sean campos de API (`project_id`, `status_id`, etc.).
6. Envolver payloads con la clave raiz que Redmine espera (`issue`, `project`, `user`) cuando aplique.
7. Preservar `pairedItem`.
8. Verificar `continueOnFail` desde `Redmine.node.ts`.
9. Actualizar `README.md` si cambia la superficie publica.
10. Ejecutar `pnpm test`, `pnpm build` y `pnpm lint`.
11. Agregar o actualizar tests unitarios para el armado del request cuando la operacion tenga filtros, paginacion, payload o headers no triviales.

## Checklist para agregar un recurso nuevo

1. Crear `ResourceOperations.ts` con `resourceOperations` y `resourceFields`, o una subcarpeta si el recurso es grande.
2. Crear `ResourceExecute.ts` con una funcion `executeResourceOperation`.
3. Importar operaciones, campos y executor en `Redmine.node.ts`.
4. Agregar el recurso al selector `Resource`.
5. Agregar el spread de operaciones y campos en `properties`.
6. Agregar la rama de dispatch en `execute`.
7. Actualizar `README.md` con operaciones, parametros y notas de permisos.
8. Evaluar si la opcion global `Impersonate User` aplica al recurso.
9. Agregar tests unitarios para las operaciones principales del recurso.

## Convenciones de n8n

- Usar `displayName`, `name`, `type`, `default`, `description` y `displayOptions` de forma explicita.
- Para operaciones, incluir `name`, `value`, `description` y `action`.
- Usar `returnAll` + `limit` para listados.
- Implementar `returnAll` como paginacion completa real, no como un simple flag de UI.
- Usar `collection` para filtros/campos opcionales.
- Usar `fixedCollection` con `multipleValues: true` para listas como custom fields y enabled modules.
- Mantener `noDataExpression: true` en selectores estructurales como `resource` y `operation`.
- No romper compatibilidad de nombres de parametros existentes sin una migracion clara.

## Criterios de calidad

- El codigo compila con TypeScript estricto.
- El lint de `eslint-plugin-n8n-nodes-base` pasa o las excepciones quedan justificadas en `.eslintrc.js`.
- La documentacion publica coincide con lo que aparece en la UI del nodo.
- El `README.md` debe mantenerse bilingue.
- Los errores de Redmine incluyen contexto suficiente para depurar desde n8n.
- Las operaciones que trabajan sobre multiples items conservan `pairedItem`.
- Los cambios no dependen de una instancia Redmine especifica, salvo fixtures o ejemplos claramente marcados.
- Los tests unitarios cubren la logica nueva siempre que sea razonable aislarla de n8n y de Redmine.
- La paginacion real de `returnAll=true` esta marcada como `it.todo` en las suites actuales hasta que se implemente.

## Prioridades de evolucion

- Proximo recurso prioritario: `Issue Relations`.
- A futuro puede existir una instancia Redmine de staging para pruebas manuales, pero por ahora no asumir que esta disponible.

## Riesgos conocidos a revisar al tocar el nodo

- `getAll` debe implementar paginacion completa cuando `returnAll` sea `true`; revisar ramas existentes que hoy solo setean `limit`.
- Los campos numericos de Redmine suelen aceptarse como strings en la UI; conservar compatibilidad salvo que haya una razon clara para cambiar.
- Algunos endpoints de Redmine requieren permisos de administrador, especialmente usuarios, proyectos e impersonacion.
- Las diferencias entre versiones de Redmine pueden afectar filtros, includes y custom fields.
