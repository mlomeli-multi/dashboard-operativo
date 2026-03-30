# Dashboard Operativo

Dashboard estatico para GitHub Pages que:

- importa archivos Excel de embarques
- filtra solo embarques creados por tu equipo
- actualiza por `Codigo de Embarque`
- conserva registros aunque ya no aparezcan en la ultima carga
- separa la vista en `General` y pestañas por mes

## Reglas actuales

- Identificador unico: `Codigo de Embarque`
- Equipo visible: `Joselyn Valdez`, `Rodrigo Alanis`, `Luz Adriana Calatrava`, `Brenda Rodriguez`
- Estatus de cierre: `Embarque Finalizado`, `Entregado`, `Embarque Cancelado`
- Si un embarque desaparece del archivo nuevo, se marca como `Ya no viene en archivo`
- El mes se calcula desde el codigo, por ejemplo `AA-202512-0096` => `2025-12`

## Uso local

Abre [index.html](C:\Users\Miguel Lomeli\OneDrive - Multitraslados Internacionales SA de CV\Documentos\New project\index.html) en el navegador y carga el Excel.

## Publicar en GitHub Pages

1. Sube estos archivos al branch `main`.
2. En GitHub entra a `Settings > Pages`.
3. En `Build and deployment`, elige `Deploy from a branch`.
4. Selecciona el branch `main` y la carpeta `/root`.
5. Guarda y espera a que GitHub publique el sitio.

## Siguiente etapa sugerida

- agregar metricas mas finas por servicio y clasificacion
- mejorar reglas de estatus vivos
- mostrar cambios detectados entre cargas
