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
  totalVisibleMetric: document.querySelector("#totalVisibleMetric"),
  liveMetric: document.querySelector("#liveMetric"),
  missingMetric: document.querySelector("#missingMetric"),
  monthsMetric: document.querySelector("#monthsMetric"),
  statusBreakdown: document.querySelector("#statusBreakdown"),
  serviceBreakdown: document.querySelector("#serviceBreakdown"),
  priorityIntro: document.querySelector("#priorityIntro"),
  shipmentsTableHead: document.querySelector("#shipmentsTableHead"),
  shipmentsTableBody: document.querySelector("#shipmentsTableBody"),
  tableSummary: document.querySelector("#tableSummary"),
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
  renderMetrics(filteredShipments);
  renderBreakdowns(filteredShipments);
  renderTable(filteredShipments);
}

function getFilteredShipments() {
  return state.shipments.filter((shipment) => {
    if (state.activeTab !== "general" && state.activeTab !== "priority" && shipment.mesEmbarque !== state.activeTab) {
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

  if (state.activeTab !== "general" && state.activeTab !== "priority" && !months.includes(state.activeTab)) {
    state.activeTab = "general";
  }

  refs.monthTabs.innerHTML = "";
  const allTabs = ["priority", "general", ...months];

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

  entries.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "breakdown-item";
    const width = maxValue > 0 ? (entry.count / maxValue) * 100 : 0;

    item.innerHTML = `
      <div class="breakdown-label">
        <strong>${entry.label || fallbackLabel}</strong>
        <div class="bar-track">
          <div class="bar-fill${serviceMode ? " service-fill" : ""}" style="width: ${width}%"></div>
        </div>
      </div>
      <strong>${entry.count}</strong>
    `;

    container.append(item);
  });
}

function renderTable(shipments) {
  const orderedShipments = state.activeTab === "priority"
    ? [...shipments].sort(comparePriorityShipments)
    : shipments;

  refs.shipmentsTableBody.innerHTML = "";
  refs.priorityIntro.hidden = state.activeTab !== "priority";
  refs.shipmentsTableHead.innerHTML = state.activeTab === "priority"
    ? `
      <tr>
        <th>Embarque / Cliente</th>
        <th>Mes</th>
        <th>Estatus</th>
        <th>Creado por</th>
        <th>Servicio</th>
        <th>Ultimo cambio</th>
        <th>Dias sin cambio</th>
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
            ${formatDateTime(shipment.statusLastChangedAt || shipment.firstSeenAt || shipment.updatedAt)}
            <small>Ultimo movimiento detectado</small>
          </div>
        </td>
        <td>
          <div class="secondary-cell">
            ${getStatusAgeDays(shipment)} dias
            <small>Sin cambio de estatus</small>
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

function getShipmentPrefix(code) {
  return toText(code).split("-")[0] || "";
}

function getTabLabel(tabKey) {
  if (tabKey === "priority") {
    return "Prioridad";
  }

  if (tabKey === "general") {
    return "General";
  }

  return formatMonthLabel(tabKey);
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
    return `${shipments.length} embarques vivos ordenados por antiguedad y tiempo sin cambio de estatus.`;
  }

  return `${shipments.length} embarques visibles en ${state.activeTab === "general" ? "la vista general" : formatMonthLabel(state.activeTab)}.`;
}

function comparePriorityShipments(a, b) {
  const scoreDiff = getPriorityScore(b) - getPriorityScore(a);
  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  const ageDiff = getStatusAgeDays(b) - getStatusAgeDays(a);
  if (ageDiff !== 0) {
    return ageDiff;
  }

  return a.codigoEmbarque.localeCompare(b.codigoEmbarque);
}

function getPriorityScore(shipment) {
  return (getShipmentMonthAgeDays(shipment) * 2) + getStatusAgeDays(shipment);
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

function getStatusAgeDays(shipment) {
  return getDaysSince(shipment.statusLastChangedAt || shipment.firstSeenAt || shipment.updatedAt);
}

function getDaysSince(value) {
  if (!value) {
    return 0;
  }

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
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
