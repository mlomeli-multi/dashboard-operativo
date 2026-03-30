const TEAM_MEMBERS = [
  "Joselyn Valdez",
  "Rodrigo Alanis",
  "Luz Adriana Calatrava",
  "Brenda Rodriguez",
];

const CLOSED_STATUSES = new Set([
  "Embarque Finalizado",
  "Entregado",
  "Embarque Cancelado",
]);

const STORAGE_KEY = "dashboard-operativo-shipments-v1";
const LAST_UPLOAD_KEY = "dashboard-operativo-last-upload-v1";

const NOMENCLATURES = {
  IA: { description: "Importacion Aerea", service: "Aereo", active: true },
  EA: { description: "Exportacion Aerea", service: "Aereo", active: true },
  IH: { description: "Importacion Handcarry", service: "Aereo", active: true },
  EH: { description: "Exportacion Handcarry", service: "Aereo", active: true },
  DH: { description: "Domestico Handcarry", service: "Aereo", active: true },
  DA: { description: "Domestico Aereo", service: "Aereo", active: true },
  IC: { description: "Importacion Charter", service: "Aereo", active: true },
  EC: { description: "Exportacion Charter", service: "Aereo", active: true },
  DC: { description: "Domestico Charter", service: "Aereo", active: true },
  AA: { description: "Arrastre Aereo", service: "Aereo", active: true },
  EM: { description: "Exportacion Maritima", service: "Maritimo", active: true },
  IM: { description: "Importacion Maritima", service: "Maritimo", active: true },
  DM: { description: "Domestico Maritimo", service: "Maritimo", active: false },
  AM: { description: "Arrastre Maritimo", service: "Maritimo", active: true },
  DT: { description: "Domestico Terrestre", service: "Terrestre", active: true },
  ET: { description: "Exportacion Terrestre", service: "Terrestre", active: true },
  IT: { description: "Importacion Terrestre", service: "Terrestre", active: true },
  WH: { description: "Warehouse", service: "Terrestre", active: true },
  DP: { description: "Domestico Proyecto", service: "Proyecto", active: false },
  EP: { description: "Exportacion Domestica", service: "Sin clasificar", active: false },
  IP: { description: "Importacion Domestico", service: "Sin clasificar", active: false },
  DPA: { description: "Domestico Proyecto Aereo", service: "Aereo", active: true },
  EPA: { description: "Exportacion Proyecto Aereo", service: "Aereo", active: true },
  IPA: { description: "Importacion Proyecto Aereo", service: "Aereo", active: true },
  APM: { description: "Arrastre Proyecto Maritimo", service: "Maritimo", active: true },
  EPM: { description: "Exportacion Proyecto Maritimo", service: "Maritimo", active: true },
  IPM: { description: "Importacion Proyecto Maritimo", service: "Maritimo", active: true },
  DPT: { description: "Domestico Proyecto Terrestre", service: "Terrestre", active: true },
  EPT: { description: "Exportacion Proyecto Terrestre", service: "Terrestre", active: true },
  IPT: { description: "Importacion Proyecto Terrestre", service: "Terrestre", active: true },
};

const state = {
  shipments: [],
  activeTab: "general",
  selectedClient: null,
  filters: {
    search: "",
    status: "all",
    creator: "all",
    service: "all",
    liveOnly: true,
    missingOnly: false,
  },
};

const refs = {
  excelFile: document.querySelector("#excelFile"),
  uploadSummary: document.querySelector("#uploadSummary"),
  monthTabs: document.querySelector("#monthTabs"),
  searchInput: document.querySelector("#searchInput"),
  statusFilter: document.querySelector("#statusFilter"),
  creatorFilter: document.querySelector("#creatorFilter"),
  serviceFilter: document.querySelector("#serviceFilter"),
  liveOnlyToggle: document.querySelector("#liveOnlyToggle"),
  missingOnlyToggle: document.querySelector("#missingOnlyToggle"),
  metricOneLabel: document.querySelector("#metricOneLabel"),
  metricTwoLabel: document.querySelector("#metricTwoLabel"),
  metricThreeLabel: document.querySelector("#metricThreeLabel"),
  metricFourLabel: document.querySelector("#metricFourLabel"),
  metricOneMeta: document.querySelector("#metricOneMeta"),
  metricTwoMeta: document.querySelector("#metricTwoMeta"),
  metricThreeMeta: document.querySelector("#metricThreeMeta"),
  metricFourMeta: document.querySelector("#metricFourMeta"),
  totalVisibleMetric: document.querySelector("#totalVisibleMetric"),
  liveMetric: document.querySelector("#liveMetric"),
  missingMetric: document.querySelector("#missingMetric"),
  monthsMetric: document.querySelector("#monthsMetric"),
  insightOneTitle: document.querySelector("#insightOneTitle"),
  insightOneDescription: document.querySelector("#insightOneDescription"),
  insightTwoTitle: document.querySelector("#insightTwoTitle"),
  insightTwoDescription: document.querySelector("#insightTwoDescription"),
  statusBreakdown: document.querySelector("#statusBreakdown"),
  serviceBreakdown: document.querySelector("#serviceBreakdown"),
  clientsIntro: document.querySelector("#clientsIntro"),
  priorityIntro: document.querySelector("#priorityIntro"),
  tableTitle: document.querySelector("#tableTitle"),
  shipmentsTableHead: document.querySelector("#shipmentsTableHead"),
  shipmentsTableBody: document.querySelector("#shipmentsTableBody"),
  tableSummary: document.querySelector("#tableSummary"),
  clientDetailPanel: document.querySelector("#clientDetailPanel"),
  clientDetailTitle: document.querySelector("#clientDetailTitle"),
  clientDetailSummary: document.querySelector("#clientDetailSummary"),
  clientMetricLive: document.querySelector("#clientMetricLive"),
  clientMetricHigh: document.querySelector("#clientMetricHigh"),
  clientMetricAge: document.querySelector("#clientMetricAge"),
  clientMetricService: document.querySelector("#clientMetricService"),
  clientMonthBreakdown: document.querySelector("#clientMonthBreakdown"),
  clientStatusBreakdown: document.querySelector("#clientStatusBreakdown"),
  clientDetailBody: document.querySelector("#clientDetailBody"),
};

bootstrap();

function bootstrap() {
  loadFromStorage();
  bindEvents();
  populateFilters();
  render();
}

function bindEvents() {
  refs.excelFile.addEventListener("change", handleFileUpload);
  refs.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value.trim().toLowerCase();
    render();
  });
  refs.statusFilter.addEventListener("change", (event) => {
    state.filters.status = event.target.value;
    render();
  });
  refs.creatorFilter.addEventListener("change", (event) => {
    state.filters.creator = event.target.value;
    render();
  });
  refs.serviceFilter.addEventListener("change", (event) => {
    state.filters.service = event.target.value;
    render();
  });
  refs.liveOnlyToggle.addEventListener("change", (event) => {
    state.filters.liveOnly = event.target.checked;
    render();
  });
  refs.missingOnlyToggle.addEventListener("change", (event) => {
    state.filters.missingOnly = event.target.checked;
    render();
  });
}

function loadFromStorage() {
  try {
    const rawShipments = localStorage.getItem(STORAGE_KEY);
    state.shipments = rawShipments ? JSON.parse(rawShipments) : [];
  } catch (error) {
    console.error("No se pudieron leer los datos guardados.", error);
    state.shipments = [];
  }

  const lastUpload = localStorage.getItem(LAST_UPLOAD_KEY);
  if (lastUpload) {
    refs.uploadSummary.textContent = `Ultima carga registrada: ${formatDateTime(lastUpload)}.`;
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.shipments));
  const now = new Date().toISOString();
  localStorage.setItem(LAST_UPLOAD_KEY, now);
  refs.uploadSummary.textContent = `Ultima carga registrada: ${formatDateTime(now)}.`;
}

async function handleFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    mergeRows(rows);
    populateFilters();
    persistState();
    render();
  } catch (error) {
    console.error(error);
    refs.uploadSummary.textContent = "No pude leer ese archivo. Revisa que sea un Excel valido.";
  } finally {
    refs.excelFile.value = "";
  }
}

function mergeRows(rows) {
  const uploadTag = new Date().toISOString();
  const incomingMap = new Map();

  rows.forEach((row) => {
    const shipment = normalizeRow(row, uploadTag);
    if (!shipment) {
      return;
    }
    incomingMap.set(shipment.codigoEmbarque, shipment);
  });

  const mergedMap = new Map(state.shipments.map((shipment) => [shipment.codigoEmbarque, shipment]));

  for (const shipment of mergedMap.values()) {
    shipment.presentInLatestUpload = false;
  }

  for (const [codigo, shipment] of incomingMap.entries()) {
    const existing = mergedMap.get(codigo);
    const statusLastChangedAt = existing && existing.estatus === shipment.estatus
      ? (existing.statusLastChangedAt || existing.firstSeenAt || existing.createdAt || existing.updatedAt || uploadTag)
      : uploadTag;

    mergedMap.set(codigo, {
      ...existing,
      ...shipment,
      presentInLatestUpload: true,
      missingInLatestUpload: false,
      firstSeenAt: existing?.firstSeenAt || existing?.createdAt || shipment.firstSeenAt || uploadTag,
      statusLastChangedAt,
      updatedAt: uploadTag,
    });
  }

  for (const shipment of mergedMap.values()) {
    if (!shipment.presentInLatestUpload) {
      shipment.missingInLatestUpload = true;
      shipment.updatedAt = uploadTag;
    }
  }

  state.shipments = Array.from(mergedMap.values()).sort((a, b) => a.codigoEmbarque.localeCompare(b.codigoEmbarque));
}

function normalizeRow(row, uploadTag) {
  const normalizedRow = normalizeRowKeys(row);
  const codigoEmbarque = toText(normalizedRow.codigo_de_embarque);
  const creadoPor = toText(normalizedRow.creado_por);

  if (!codigoEmbarque || !TEAM_MEMBERS.includes(creadoPor)) {
    return null;
  }

  const prefix = getShipmentPrefix(codigoEmbarque);
  const nomenclature = NOMENCLATURES[prefix] || {
    description: "Sin clasificar",
    service: "Sin clasificar",
    active: false,
  };

  return {
    codigoEmbarque,
    awb: toText(normalizedRow.awb),
    numeroPro: toText(normalizedRow.numero_pro),
    codigoCotizacion: toText(normalizedRow.codigo_de_cotizacion),
    estatus: toText(normalizedRow.estatus),
    cliente: toText(normalizedRow.cliente),
    fechaCreacion: toText(normalizedRow.fecha_creacion),
    creadoPor,
    ejecutivoOperaciones: toText(normalizedRow.ejecutivo_de_operaciones),
    ejecutivoVentas: toText(normalizedRow.ejecutivo_de_ventas),
    ejecutivoPricing: toText(normalizedRow.ejecutivo_de_pricing),
    prefijo: prefix,
    mesEmbarque: getMonthFromCode(codigoEmbarque),
    descripcionClasificacion: nomenclature.description,
    tipoServicio: nomenclature.service,
    clasificacionActiva: nomenclature.active,
    presentInLatestUpload: true,
    missingInLatestUpload: false,
    firstSeenAt: uploadTag,
    statusLastChangedAt: uploadTag,
    createdAt: uploadTag,
    updatedAt: uploadTag,
  };
}

function populateFilters() {
  populateSelect(refs.statusFilter, uniqueValues(state.shipments.map((item) => item.estatus)), "Todos");
  populateSelect(refs.creatorFilter, uniqueValues(state.shipments.map((item) => item.creadoPor)), "Todos");
  populateSelect(refs.serviceFilter, uniqueValues(state.shipments.map((item) => item.tipoServicio)), "Todos");
}

function populateSelect(select, values, allLabel) {
  const currentValue = select.value || "all";
  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = allLabel;
  select.append(defaultOption);

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });

  select.value = values.includes(currentValue) || currentValue === "all" ? currentValue : "all";
}

function render() {
  renderTabs();
  const filteredShipments = getFilteredShipments();
  if (state.activeTab === "clients") {
    const clientRows = aggregateClients(filteredShipments);
    renderClientMetrics(clientRows);
    renderClientBreakdowns(clientRows);
    renderClientTable(clientRows, filteredShipments);
    return;
  }

  renderShipmentMetrics(filteredShipments);
  renderShipmentBreakdowns(filteredShipments);
  renderShipmentTable(filteredShipments);
}

function getFilteredShipments() {
  return state.shipments.filter((shipment) => {
    if (!["general", "priority", "clients"].includes(state.activeTab) && shipment.mesEmbarque !== state.activeTab) {
      return false;
    }

    if ((state.filters.liveOnly || state.activeTab === "priority") && !isLiveShipment(shipment)) {
      return false;
    }

    if (state.filters.missingOnly && !shipment.missingInLatestUpload) {
      return false;
    }

    if (state.filters.status !== "all" && shipment.estatus !== state.filters.status) {
      return false;
    }

    if (state.filters.creator !== "all" && shipment.creadoPor !== state.filters.creator) {
      return false;
    }

    if (state.filters.service !== "all" && shipment.tipoServicio !== state.filters.service) {
      return false;
    }

    if (state.filters.search) {
      const haystack = [
        shipment.codigoEmbarque,
        shipment.numeroPro,
        shipment.awb,
        shipment.cliente,
        shipment.estatus,
        shipment.creadoPor,
        shipment.tipoServicio,
      ].join(" ").toLowerCase();

      if (!haystack.includes(state.filters.search)) {
        return false;
      }
    }

    return true;
  });
}

function renderTabs() {
  const months = uniqueValues(
    state.shipments
      .map((shipment) => shipment.mesEmbarque)
      .filter(Boolean),
  ).sort();

  if (!["general", "priority", "clients"].includes(state.activeTab) && !months.includes(state.activeTab)) {
    state.activeTab = "general";
  }

  refs.monthTabs.innerHTML = "";
  const allTabs = ["clients", "priority", "general", ...months];

  allTabs.forEach((tabKey) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tab-button${tabKey === "priority" ? " priority-tab" : ""}${state.activeTab === tabKey ? " active" : ""}`;
    button.textContent = getTabLabel(tabKey);
    button.addEventListener("click", () => {
      state.activeTab = tabKey;
      render();
    });
    refs.monthTabs.append(button);
  });
}

function renderMetrics(shipments) {
  refs.totalVisibleMetric.textContent = shipments.length;
  refs.liveMetric.textContent = shipments.filter(isLiveShipment).length;
  refs.missingMetric.textContent = shipments.filter((item) => item.missingInLatestUpload).length;
  refs.monthsMetric.textContent = uniqueValues(state.shipments.map((item) => item.mesEmbarque).filter(Boolean)).length;
}

function renderBreakdowns(shipments) {
  renderBreakdownList(
    refs.statusBreakdown,
    countBy(shipments, "estatus"),
    "Sin estatus",
    false,
  );
  renderBreakdownList(
    refs.serviceBreakdown,
    countBy(shipments, "tipoServicio"),
    "Sin servicio",
    true,
  );
}

function renderBreakdownList(container, entries, fallbackLabel, serviceMode) {
  container.innerHTML = "";

  if (!entries.length) {
    container.innerHTML = `<p class="empty-state">No hay datos para esta vista.</p>`;
    return;
  }

  const maxValue = entries[0].count;
  const total = entries.reduce((sum, entry) => sum + entry.count, 0);

  entries.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "breakdown-item";
    const width = maxValue > 0 ? (entry.count / maxValue) * 100 : 0;
    const percent = total > 0 ? Math.round((entry.count / total) * 100) : 0;

    item.innerHTML = `
      <div class="breakdown-label">
        <strong>${entry.label || fallbackLabel}</strong>
        <div class="bar-track">
          <div class="bar-fill${serviceMode ? " service-fill" : ""}" style="width: ${width}%"></div>
        </div>
      </div>
      <div class="breakdown-meta">
        <strong>${entry.count}</strong>
        <span class="breakdown-percent">${percent}%</span>
      </div>
    `;

    container.append(item);
  });
}

function renderShipmentMetrics(shipments) {
  refs.metricOneLabel.textContent = "Total visibles";
  refs.metricOneMeta.textContent = "Base filtrada actual";
  refs.metricTwoLabel.textContent = "Vivos";
  refs.metricTwoMeta.textContent = "Seguimiento activo";
  refs.metricThreeLabel.textContent = "No vienen en ultima carga";
  refs.metricThreeMeta.textContent = "Casos a revisar";
  refs.metricFourLabel.textContent = "Meses activos";
  refs.metricFourMeta.textContent = "Ventanas detectadas";

  renderMetrics(shipments);
}

function renderShipmentBreakdowns(shipments) {
  refs.insightOneTitle.textContent = "Por estatus";
  refs.insightOneDescription.textContent = "Conteo de embarques visibles.";
  refs.insightTwoTitle.textContent = "Por servicio";
  refs.insightTwoDescription.textContent = "Clasificado por nomenclatura del codigo.";

  renderBreakdowns(shipments);
}

function renderShipmentTable(shipments) {
  const orderedShipments = state.activeTab === "priority"
    ? [...shipments].sort(comparePriorityShipments)
    : shipments;

  refs.shipmentsTableBody.innerHTML = "";
  refs.clientDetailPanel.hidden = true;
  refs.clientDetailBody.innerHTML = "";
  refs.priorityIntro.hidden = state.activeTab !== "priority";
  refs.clientsIntro.hidden = true;
  refs.tableTitle.textContent = "Embarques";
  refs.shipmentsTableHead.innerHTML = state.activeTab === "priority"
    ? `
      <tr>
        <th>Embarque / Cliente</th>
        <th>Mes</th>
        <th>Estatus</th>
        <th>Creado por</th>
        <th>Servicio</th>
        <th>Fecha creacion</th>
        <th>Dias abiertos</th>
        <th>Prioridad</th>
      </tr>
    `
    : `
      <tr>
        <th>Embarque / Cliente</th>
        <th>Mes</th>
        <th>Estatus</th>
        <th>Creado por</th>
        <th>Servicio</th>
        <th>Clasificacion</th>
        <th>Ultimo cambio</th>
        <th>Ultima carga</th>
      </tr>
    `;
  refs.tableSummary.textContent = getTableSummary(orderedShipments);

  if (!orderedShipments.length) {
    refs.shipmentsTableBody.innerHTML = `<tr><td class="empty-state" colspan="8">No hay embarques que cumplan con los filtros actuales.</td></tr>`;
    return;
  }

  orderedShipments.forEach((shipment) => {
    const row = document.createElement("tr");
    row.innerHTML = state.activeTab === "priority"
      ? `
        <td>
          <div class="shipment-cell">
            <span class="shipment-code">${shipment.codigoEmbarque}</span>
            <span class="shipment-client">${shipment.cliente || "Cliente no disponible"}</span>
          </div>
        </td>
        <td><div class="secondary-cell">${formatMonthLabel(shipment.mesEmbarque)}</div></td>
        <td><span class="pill live">${shipment.estatus || "Sin estatus"}</span></td>
        <td><div class="secondary-cell">${shipment.creadoPor || "-"}</div></td>
        <td><div class="secondary-cell">${shipment.tipoServicio || "-"}</div></td>
        <td>
          <div class="secondary-cell">
            ${formatDateTime(shipment.fechaCreacion)}
            <small>Inicio del servicio</small>
          </div>
        </td>
        <td>
          <div class="secondary-cell">
            ${getOpenAgeDays(shipment)} dias
            <small>Sin entregar o finalizar</small>
          </div>
        </td>
        <td>
          <div class="priority-stack">
            <span class="priority-value">${Math.round(getPriorityScore(shipment))}</span>
            <span class="priority-label">${getPriorityLabel(shipment)}</span>
          </div>
        </td>
      `
      : `
        <td>
          <div class="shipment-cell">
            <span class="shipment-code">${shipment.codigoEmbarque}</span>
            <span class="shipment-client">${shipment.cliente || "Cliente no disponible"}</span>
          </div>
        </td>
        <td><div class="secondary-cell">${formatMonthLabel(shipment.mesEmbarque)}</div></td>
        <td>
          <span class="pill${isLiveShipment(shipment) ? " live" : ""}">${shipment.estatus || "Sin estatus"}</span>
        </td>
        <td><div class="secondary-cell">${shipment.creadoPor || "-"}</div></td>
        <td><div class="secondary-cell">${shipment.tipoServicio || "-"}</div></td>
        <td><div class="secondary-cell">${shipment.descripcionClasificacion || shipment.prefijo || "-"}</div></td>
        <td>
          <div class="secondary-cell">
            ${formatDateTime(shipment.statusLastChangedAt || shipment.firstSeenAt || shipment.updatedAt)}
            <small>Ultimo cambio de estatus</small>
          </div>
        </td>
        <td>
          ${shipment.missingInLatestUpload
            ? '<span class="pill missing">Ya no viene en archivo</span>'
            : `<div class="secondary-cell">${formatDateTime(shipment.updatedAt)}<small>Ultima importacion</small></div>`}
        </td>
      `;
    refs.shipmentsTableBody.append(row);
  });
}

function renderClientMetrics(clientRows) {
  refs.metricOneLabel.textContent = "Clientes visibles";
  refs.metricOneMeta.textContent = "Cuentas filtradas";
  refs.metricTwoLabel.textContent = "Con embarques vivos";
  refs.metricTwoMeta.textContent = "Clientes activos";
  refs.metricThreeLabel.textContent = "Con prioridad alta";
  refs.metricThreeMeta.textContent = "Seguimiento urgente";
  refs.metricFourLabel.textContent = "Edad promedio";
  refs.metricFourMeta.textContent = "Dias abiertos";

  refs.totalVisibleMetric.textContent = clientRows.length;
  refs.liveMetric.textContent = clientRows.filter((row) => row.vivos > 0).length;
  refs.missingMetric.textContent = clientRows.filter((row) => row.prioridadAlta > 0).length;
  refs.monthsMetric.textContent = clientRows.length
    ? Math.round(clientRows.reduce((sum, row) => sum + row.edadPromedio, 0) / clientRows.length)
    : 0;
}

function renderClientBreakdowns(clientRows) {
  refs.insightOneTitle.textContent = "Top clientes por vivos";
  refs.insightOneDescription.textContent = "Clientes con mas embarques activos en la vista actual.";
  refs.insightTwoTitle.textContent = "Top clientes por prioridad alta";
  refs.insightTwoDescription.textContent = "Clientes con mas embarques que requieren seguimiento urgente.";

  renderBreakdownList(
    refs.statusBreakdown,
    clientRows
      .filter((row) => row.vivos > 0)
      .sort((a, b) => b.vivos - a.vivos)
      .slice(0, 8)
      .map((row) => ({ label: row.cliente, count: row.vivos })),
    "Sin cliente",
    false,
  );
  renderBreakdownList(
    refs.serviceBreakdown,
    clientRows
      .filter((row) => row.prioridadAlta > 0)
      .sort((a, b) => b.prioridadAlta - a.prioridadAlta)
      .slice(0, 8)
      .map((row) => ({ label: row.cliente, count: row.prioridadAlta })),
    "Sin cliente",
    true,
  );
}

function renderClientTable(clientRows, shipments) {
  const orderedRows = [...clientRows].sort(compareClientRows);
  refs.shipmentsTableBody.innerHTML = "";
  refs.priorityIntro.hidden = true;
  refs.clientsIntro.hidden = false;
  refs.tableTitle.textContent = "Clientes";
  refs.clientDetailPanel.hidden = true;
  refs.shipmentsTableHead.innerHTML = `
    <tr>
      <th>Cliente</th>
      <th>Total</th>
      <th>Vivos</th>
      <th>Prioridad alta</th>
      <th>Edad promedio</th>
      <th>Servicio dominante</th>
      <th>Meses presentes</th>
    </tr>
  `;
  refs.tableSummary.textContent = `${orderedRows.length} clientes resumidos a partir de los embarques filtrados.`;

  if (!orderedRows.length) {
    refs.shipmentsTableBody.innerHTML = `<tr><td class="empty-state" colspan="7">No hay clientes que cumplan con los filtros actuales.</td></tr>`;
    refs.clientDetailPanel.hidden = true;
    refs.clientDetailBody.innerHTML = "";
    return;
  }

  if (state.selectedClient && !orderedRows.some((row) => row.cliente === state.selectedClient)) {
    state.selectedClient = null;
  }

  orderedRows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.className = `row-button${state.selectedClient === row.cliente ? " active-row" : ""}`;
    tr.innerHTML = `
      <td>
        <div class="shipment-cell">
          <span class="shipment-code">${row.cliente}</span>
          <span class="shipment-client">${row.vivos} vivos de ${row.total} embarques</span>
        </div>
      </td>
      <td><div class="secondary-cell">${row.total}</div></td>
      <td><div class="secondary-cell">${row.vivos}</div></td>
      <td>
        <div class="secondary-cell">
          ${row.prioridadAlta}
          <small>${row.prioridadMedia} media / ${row.prioridadBaja} baja</small>
        </div>
      </td>
      <td>
        <div class="secondary-cell">
          ${row.edadPromedio} dias
          <small>Promedio de embarques vivos</small>
        </div>
      </td>
      <td><div class="secondary-cell">${row.servicioDominante}</div></td>
      <td><div class="secondary-cell">${row.meses.join(", ") || "-"}</div></td>
    `;
    tr.addEventListener("click", () => {
      state.selectedClient = state.selectedClient === row.cliente ? null : row.cliente;
      renderClientTable(clientRows, shipments);
    });
    refs.shipmentsTableBody.append(tr);

    if (state.selectedClient === row.cliente) {
      const detailRow = document.createElement("tr");
      detailRow.className = "inline-detail-row";
      detailRow.innerHTML = `
        <td colspan="7">
          ${buildClientDetailMarkup(shipments, row.cliente)}
        </td>
      `;
      refs.shipmentsTableBody.append(detailRow);
    }
  });
}

function buildClientDetailMarkup(shipments, clientName) {
  const clientShipments = shipments
    .filter((shipment) => (shipment.cliente || "Cliente no disponible") === clientName)
    .sort(comparePriorityShipments);

  const monthBreakdown = renderBreakdownMarkup(
    countByLabel(clientShipments.map((shipment) => formatMonthLabel(shipment.mesEmbarque))),
    "Sin mes",
    true,
  );
  const statusBreakdown = renderBreakdownMarkup(
    countBy(clientShipments, "estatus"),
    "Sin estatus",
    false,
  );

  const rowsMarkup = clientShipments.length
    ? clientShipments.map((shipment) => `
        <tr>
          <td>
            <div class="shipment-cell">
              <span class="shipment-code">${shipment.codigoEmbarque}</span>
              <span class="shipment-client">${shipment.descripcionClasificacion || shipment.prefijo || "-"}</span>
            </div>
          </td>
          <td><div class="secondary-cell">${formatMonthLabel(shipment.mesEmbarque)}</div></td>
          <td><span class="pill${isLiveShipment(shipment) ? " live" : ""}">${shipment.estatus || "Sin estatus"}</span></td>
          <td><div class="secondary-cell">${shipment.tipoServicio || "-"}</div></td>
          <td><div class="secondary-cell">${shipment.creadoPor || "-"}</div></td>
          <td><div class="secondary-cell">${formatDateTime(shipment.fechaCreacion)}</div></td>
          <td><div class="secondary-cell">${getOpenAgeDays(shipment)} dias</div></td>
          <td>
            <div class="priority-stack">
              <span class="priority-value">${Math.round(getPriorityScore(shipment))}</span>
              <span class="priority-label">${getPriorityLabel(shipment)}</span>
            </div>
          </td>
        </tr>
      `).join("")
    : `<tr><td class="empty-state" colspan="8">No hay embarques visibles para este cliente.</td></tr>`;

  return `
    <section class="client-detail-card">
      <div class="panel-head">
        <h2>${clientName}</h2>
        <p>${clientShipments.length} embarques del cliente dentro de los filtros actuales.</p>
      </div>
      <div class="client-detail-metrics">
        <article class="mini-metric"><p>Embarques vivos</p><strong>${clientShipments.filter(isLiveShipment).length}</strong></article>
        <article class="mini-metric"><p>Prioridad alta</p><strong>${clientShipments.filter((shipment) => getPriorityLabel(shipment) === "Alta").length}</strong></article>
        <article class="mini-metric"><p>Edad promedio</p><strong>${getAverageOpenAge(clientShipments)} dias</strong></article>
        <article class="mini-metric"><p>Servicio dominante</p><strong>${getDominantServiceForShipments(clientShipments)}</strong></article>
      </div>
      <div class="client-detail-breakdowns">
        <div class="client-detail-breakdown">
          <div class="panel-head">
            <h2>Desglose por mes</h2>
            <p>Distribucion de embarques visibles para este cliente segun el mes del codigo.</p>
          </div>
          <div class="breakdown-list">${monthBreakdown}</div>
        </div>
        <div class="client-detail-breakdown">
          <div class="panel-head">
            <h2>Desglose por estatus</h2>
            <p>Etapa operativa actual de los embarques visibles para este cliente.</p>
          </div>
          <div class="breakdown-list">${statusBreakdown}</div>
        </div>
      </div>
      <div class="table-wrap detail-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Embarque</th>
              <th>Mes</th>
              <th>Estatus</th>
              <th>Servicio</th>
              <th>Creado por</th>
              <th>Fecha creacion</th>
              <th>Dias abiertos</th>
              <th>Prioridad</th>
            </tr>
          </thead>
          <tbody>${rowsMarkup}</tbody>
        </table>
      </div>
    </section>
  `;
}

function getAverageOpenAge(shipments) {
  const liveShipments = shipments.filter(isLiveShipment);
  if (!liveShipments.length) {
    return 0;
  }

  const total = liveShipments.reduce((sum, shipment) => sum + getOpenAgeDays(shipment), 0);
  return Math.round(total / liveShipments.length);
}

function getDominantServiceForShipments(shipments) {
  const counts = new Map();
  shipments.forEach((shipment) => {
    const key = shipment.tipoServicio || "Sin servicio";
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return getDominantLabel(counts);
}

function isLiveShipment(shipment) {
  return !CLOSED_STATUSES.has(shipment.estatus);
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function countBy(items, key) {
  const counts = new Map();

  items.forEach((item) => {
    const label = item[key] || "";
    counts.set(label, (counts.get(label) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function countByLabel(labels) {
  const counts = new Map();

  labels.forEach((label) => {
    const key = label || "";
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function renderBreakdownMarkup(entries, fallbackLabel, serviceMode) {
  if (!entries.length) {
    return `<p class="empty-state">No hay datos para esta vista.</p>`;
  }

  const maxValue = entries[0].count;
  const total = entries.reduce((sum, entry) => sum + entry.count, 0);

  return entries.map((entry) => {
    const width = maxValue > 0 ? (entry.count / maxValue) * 100 : 0;
    const percent = total > 0 ? Math.round((entry.count / total) * 100) : 0;
    return `
      <article class="breakdown-item">
        <div class="breakdown-label">
          <strong>${entry.label || fallbackLabel}</strong>
          <div class="bar-track">
            <div class="bar-fill${serviceMode ? " service-fill" : ""}" style="width: ${width}%"></div>
          </div>
        </div>
        <div class="breakdown-meta">
          <strong>${entry.count}</strong>
          <span class="breakdown-percent">${percent}%</span>
        </div>
      </article>
    `;
  }).join("");
}

function getShipmentPrefix(code) {
  return toText(code).split("-")[0] || "";
}

function getTabLabel(tabKey) {
  if (tabKey === "clients") {
    return "Clientes";
  }

  if (tabKey === "priority") {
    return "Prioridad";
  }

  if (tabKey === "general") {
    return "General";
  }

  return formatMonthLabel(tabKey);
}

function aggregateClients(shipments) {
  const clientMap = new Map();

  shipments.forEach((shipment) => {
    const cliente = shipment.cliente || "Cliente no disponible";
    const existing = clientMap.get(cliente) || {
      cliente,
      total: 0,
      vivos: 0,
      prioridadAlta: 0,
      prioridadMedia: 0,
      prioridadBaja: 0,
      totalEdad: 0,
      conteoEdad: 0,
      servicioCounts: new Map(),
      mesesSet: new Set(),
    };

    existing.total += 1;
    existing.mesesSet.add(shipment.mesEmbarque || "Sin mes");
    existing.servicioCounts.set(
      shipment.tipoServicio || "Sin servicio",
      (existing.servicioCounts.get(shipment.tipoServicio || "Sin servicio") || 0) + 1,
    );

    if (isLiveShipment(shipment)) {
      const priorityLabel = getPriorityLabel(shipment);
      existing.vivos += 1;
      existing.totalEdad += getOpenAgeDays(shipment);
      existing.conteoEdad += 1;

      if (priorityLabel === "Alta") {
        existing.prioridadAlta += 1;
      } else if (priorityLabel === "Media") {
        existing.prioridadMedia += 1;
      } else {
        existing.prioridadBaja += 1;
      }
    }

    clientMap.set(cliente, existing);
  });

  return Array.from(clientMap.values()).map((row) => ({
    cliente: row.cliente,
    total: row.total,
    vivos: row.vivos,
    prioridadAlta: row.prioridadAlta,
    prioridadMedia: row.prioridadMedia,
    prioridadBaja: row.prioridadBaja,
    edadPromedio: row.conteoEdad ? Math.round(row.totalEdad / row.conteoEdad) : 0,
    servicioDominante: getDominantLabel(row.servicioCounts),
    meses: Array.from(row.mesesSet).sort(compareMonthKeys).map(formatMonthLabel),
  }));
}

function getDominantLabel(countsMap) {
  const entries = Array.from(countsMap.entries()).sort((a, b) => b[1] - a[1]);
  return entries.length ? entries[0][0] : "Sin servicio";
}

function compareClientRows(a, b) {
  if (b.prioridadAlta !== a.prioridadAlta) {
    return b.prioridadAlta - a.prioridadAlta;
  }

  if (b.vivos !== a.vivos) {
    return b.vivos - a.vivos;
  }

  if (b.edadPromedio !== a.edadPromedio) {
    return b.edadPromedio - a.edadPromedio;
  }

  return a.cliente.localeCompare(b.cliente);
}

function compareMonthKeys(a, b) {
  if (a === "Sin mes") {
    return 1;
  }

  if (b === "Sin mes") {
    return -1;
  }

  return a.localeCompare(b);
}

function normalizeRowKeys(row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      normalizeHeaderKey(key),
      value,
    ]),
  );
}

function normalizeHeaderKey(value) {
  return toText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function getMonthFromCode(code) {
  const match = toText(code).match(/^[A-Z]+-(\d{4})(\d{2})-\d+/i);
  if (!match) {
    return "Sin mes";
  }

  return `${match[1]}-${match[2]}`;
}

function getTableSummary(shipments) {
  if (state.activeTab === "priority") {
    return `${shipments.length} embarques vivos ordenados por mes del embarque y dias abiertos desde su fecha de creacion.`;
  }

  return `${shipments.length} embarques visibles en ${state.activeTab === "general" ? "la vista general" : formatMonthLabel(state.activeTab)}.`;
}

function comparePriorityShipments(a, b) {
  const scoreDiff = getPriorityScore(b) - getPriorityScore(a);
  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  const ageDiff = getOpenAgeDays(b) - getOpenAgeDays(a);
  if (ageDiff !== 0) {
    return ageDiff;
  }

  return a.codigoEmbarque.localeCompare(b.codigoEmbarque);
}

function getPriorityScore(shipment) {
  return (getShipmentMonthAgeDays(shipment) * 2) + getOpenAgeDays(shipment);
}

function getPriorityLabel(shipment) {
  const score = getPriorityScore(shipment);
  if (score >= 90) {
    return "Alta";
  }

  if (score >= 40) {
    return "Media";
  }

  return "Baja";
}

function getShipmentMonthAgeDays(shipment) {
  if (!shipment.mesEmbarque || shipment.mesEmbarque === "Sin mes") {
    return 0;
  }

  const [year, month] = shipment.mesEmbarque.split("-");
  const shipmentDate = new Date(Number(year), Number(month) - 1, 1);
  return getDaysSince(shipmentDate.toISOString());
}

function getOpenAgeDays(shipment) {
  return getDaysSince(shipment.fechaCreacion || shipment.firstSeenAt || shipment.updatedAt);
}

function getDaysSince(value) {
  if (!value) {
    return 0;
  }

  const date = parseDateValue(value);
  if (!date) {
    return 0;
  }

  const diffMs = Date.now() - date.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function parseDateValue(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const raw = `${value}`.trim();
  if (!raw) {
    return null;
  }

  const nativeDate = new Date(raw);
  if (!Number.isNaN(nativeDate.getTime())) {
    return nativeDate;
  }

  const match = raw.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap])\.\s*m\.)?$/i,
  );

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);
  let hour = Number(match[4] || 0);
  const minute = Number(match[5] || 0);
  const second = Number(match[6] || 0);
  const meridiem = (match[7] || "").toLowerCase();

  if (meridiem === "p" && hour < 12) {
    hour += 12;
  }

  if (meridiem === "a" && hour === 12) {
    hour = 0;
  }

  return new Date(year, month, day, hour, minute, second);
}

function formatMonthLabel(value) {
  if (!value || value === "Sin mes") {
    return "Sin mes";
  }

  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" }).format(date);
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function toText(value) {
  return `${value ?? ""}`.trim();
}
