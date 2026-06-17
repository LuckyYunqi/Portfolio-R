const API_BASE_URL = window.STOCKROOM_CONFIG?.apiBaseUrl || "/api";
const CURRENT_USER = window.STOCKROOM_CONFIG?.user || { name: "Demo User", role: "admin" };
const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]')?.content || "";

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const demoProducts = [
  { id: makeId(), name: "Wireless Mouse", sku: "IT-MSE-001", category: "Electronics", supplier: "Northline Supply", quantity: 14, cost: 250, reorder: 8 },
  { id: makeId(), name: "A4 Bond Paper", sku: "OFF-PAP-014", category: "Office", supplier: "Manila Paper Co.", quantity: 42, cost: 185, reorder: 30 },
  { id: makeId(), name: "Nitrile Gloves", sku: "SAF-GLV-010", category: "Safety", supplier: "PrimeMed Depot", quantity: 6, cost: 420, reorder: 12 },
  { id: makeId(), name: "Thermal Receipt Roll", sku: "POS-ROL-058", category: "POS", supplier: "RetailWorks", quantity: 0, cost: 68, reorder: 20 },
  { id: makeId(), name: "Packing Tape", sku: "WH-TAP-032", category: "Warehouse", supplier: "PackRight", quantity: 25, cost: 55, reorder: 10 },
  { id: makeId(), name: "USB-C Cable", sku: "IT-CBL-009", category: "Electronics", supplier: "Northline Supply", quantity: 18, cost: 145, reorder: 15 }
];

const demoMovements = [
  { id: makeId(), productName: "Wireless Mouse", type: "in", quantity: 10, user: "Admin", notes: "Opening balance", date: daysAgo(5) },
  { id: makeId(), productName: "Nitrile Gloves", type: "out", quantity: 4, user: "Admin", notes: "Issued to cleaning team", date: daysAgo(3) },
  { id: makeId(), productName: "Thermal Receipt Roll", type: "out", quantity: 8, user: "Cashier Lead", notes: "POS counter restock", date: daysAgo(2) },
  { id: makeId(), productName: "Packing Tape", type: "in", quantity: 20, user: "Warehouse", notes: "Supplier delivery", date: daysAgo(1) }
];

const demoSuppliers = [
  { id: makeId(), name: "Northline Supply", contact: "Ana Reyes", email: "sales@northline.example", phone: "+63 917 410 2110", leadTime: 5, category: "Electronics", status: "Active" },
  { id: makeId(), name: "Manila Paper Co.", contact: "Paolo Santos", email: "orders@manilapaper.example", phone: "+63 928 611 9920", leadTime: 3, category: "Office", status: "Active" },
  { id: makeId(), name: "PrimeMed Depot", contact: "Lara Cruz", email: "support@primemed.example", phone: "+63 915 220 8831", leadTime: 7, category: "Safety", status: "Active" },
  { id: makeId(), name: "RetailWorks", contact: "Miguel Lim", email: "po@retailworks.example", phone: "+63 922 711 4552", leadTime: 4, category: "POS", status: "Active" },
  { id: makeId(), name: "PackRight", contact: "Nina Dela Paz", email: "warehouse@packright.example", phone: "+63 919 330 7719", leadTime: 6, category: "Warehouse", status: "Active" }
];

const demoPurchaseOrders = [
  { id: makeId(), number: "PO-1001", supplier: "PrimeMed Depot", productName: "Nitrile Gloves", productId: null, quantity: 24, expectedDate: daysFromNow(3), status: "Pending", notes: "Reorder for low safety stock", paymentResponsibility: "Store/business pays supplier for restocking", paymentMethod: "Bank Transfer", paymentStatus: "Unpaid", createdAt: daysAgo(1) },
  { id: makeId(), number: "PO-1002", supplier: "RetailWorks", productName: "Thermal Receipt Roll", productId: null, quantity: 40, expectedDate: daysFromNow(5), status: "Pending", notes: "POS supplies replenishment", paymentResponsibility: "Store/business pays supplier for restocking", paymentMethod: "GCash", paymentStatus: "Partially Paid", createdAt: daysAgo(1) }
];

const demoProductRequests = [
  { id: makeId(), requester: "Staff User", productId: null, productName: "A4 Bond Paper", supplier: "Manila Paper Co.", quantity: 20, neededBy: daysFromNow(4), reason: "Front office paper stock is dropping before payroll week.", status: "Pending", createdAt: daysAgo(1) },
  { id: makeId(), requester: "Staff User", productId: null, productName: "USB-C Cable", supplier: "Northline Supply", quantity: 12, neededBy: daysFromNow(7), reason: "Replacement cables requested by IT.", status: "Approved", managerNote: "Approved for next purchasing batch.", createdAt: daysAgo(2) }
];

const state = loadState();
const pages = {
  inventory: 1,
  availability: 1,
  movements: 1,
  suppliers: 1,
  requests: 1,
  purchaseOrders: 1,
  receiving: 1,
  received: 1
};
const money = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });
const dateFormat = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" });
const monthNames = Array.from({ length: 12 }, (_, index) =>
  new Intl.DateTimeFormat("en-PH", { month: "short" }).format(new Date(2026, index, 1))
);

const els = {
  title: document.querySelector("#view-title"),
  navItems: document.querySelectorAll(".nav-item"),
  views: document.querySelectorAll(".view"),
  search: document.querySelector("#global-search"),
  reset: document.querySelector("#reset-demo"),
  quickToggle: document.querySelector("#quick-toggle"),
  quickDropdown: document.querySelector("#quick-dropdown"),
  profileToggle: document.querySelector("#profile-toggle"),
  profileDropdown: document.querySelector("#profile-dropdown"),
  openSettings: document.querySelector("#open-settings"),
  closeSettings: document.querySelector("#close-settings"),
  settingsModal: document.querySelector("#settings-modal"),
  openPoProductModal: document.querySelector("#open-po-product-modal"),
  closePoProductModal: document.querySelector("#close-po-product-modal"),
  poProductModal: document.querySelector("#po-product-modal"),
  poProductForm: document.querySelector("#po-product-form"),
  poNewProductSupplier: document.querySelector("#po-new-product-supplier"),
  poProductMessage: document.querySelector("#po-product-message"),
  confirmModal: document.querySelector("#confirm-modal"),
  confirmTitle: document.querySelector("#confirm-title"),
  confirmMessage: document.querySelector("#confirm-message"),
  confirmCancel: document.querySelector("#confirm-cancel"),
  confirmContinue: document.querySelector("#confirm-continue"),
  metrics: {
    skus: document.querySelector("#metric-skus"),
    value: document.querySelector("#metric-value"),
    low: document.querySelector("#metric-low"),
    out: document.querySelector("#metric-out")
  },
  priority: document.querySelector("#priority-list"),
  chart: document.querySelector("#category-chart"),
  recent: document.querySelector("#recent-activity"),
  productForm: document.querySelector("#product-form"),
  inventoryTable: document.querySelector("#inventory-table"),
  categoryFilter: document.querySelector("#category-filter"),
  inventoryStatusFilter: document.querySelector("#inventory-status-filter"),
  inventoryLimit: document.querySelector("#inventory-limit"),
  inventoryPagination: document.querySelector("#inventory-pagination"),
  availabilityList: document.querySelector("#availability-list"),
  availabilityCategoryFilter: document.querySelector("#availability-category-filter"),
  availabilityStatusFilter: document.querySelector("#availability-status-filter"),
  availabilityLimit: document.querySelector("#availability-limit"),
  availabilityPagination: document.querySelector("#availability-pagination"),
  movementForm: document.querySelector("#movement-form"),
  movementProduct: document.querySelector("#movement-product"),
  movementTable: document.querySelector("#movement-table"),
  movementMessage: document.querySelector("#movement-message"),
  movementTypeFilter: document.querySelector("#movement-type-filter"),
  movementLimit: document.querySelector("#movement-limit"),
  movementPagination: document.querySelector("#movement-pagination"),
  supplierForm: document.querySelector("#supplier-form"),
  supplierTable: document.querySelector("#supplier-table"),
  supplierCategoryFilter: document.querySelector("#supplier-category-filter"),
  supplierLimit: document.querySelector("#supplier-limit"),
  supplierPagination: document.querySelector("#supplier-pagination"),
  requestForm: document.querySelector("#request-form"),
  requestProduct: document.querySelector("#request-product"),
  requestMessage: document.querySelector("#request-message"),
  requestList: document.querySelector("#request-list"),
  requestStatusFilter: document.querySelector("#request-status-filter"),
  requestLimit: document.querySelector("#request-limit"),
  requestPagination: document.querySelector("#request-pagination"),
  purchaseOrderForm: document.querySelector("#purchase-order-form"),
  expectedDate: document.querySelector("#expected-date"),
  expectedMonth: document.querySelector("#expected-month"),
  expectedDay: document.querySelector("#expected-day"),
  expectedYear: document.querySelector("#expected-year"),
  poSupplier: document.querySelector("#po-supplier"),
  poProduct: document.querySelector("#po-product"),
  poPaymentMethod: document.querySelector("#po-payment-method"),
  poPaymentStatus: document.querySelector("#po-payment-status"),
  poStatusFilter: document.querySelector("#po-status-filter"),
  poSupplierFilter: document.querySelector("#po-supplier-filter"),
  poLimit: document.querySelector("#po-limit"),
  poPagination: document.querySelector("#po-pagination"),
  purchaseOrderTable: document.querySelector("#purchase-order-table"),
  purchaseOrderMessage: document.querySelector("#purchase-order-message"),
  receivingSupplierFilter: document.querySelector("#receiving-supplier-filter"),
  receivingLimit: document.querySelector("#receiving-limit"),
  receivingPagination: document.querySelector("#receiving-pagination"),
  receivedLimit: document.querySelector("#received-limit"),
  receivedPagination: document.querySelector("#received-pagination"),
  receivingTable: document.querySelector("#receiving-table"),
  receivedTable: document.querySelector("#received-table"),
  receivingSummary: document.querySelector("#receiving-summary"),
  reportTable: document.querySelector("#report-table"),
  reportNotes: document.querySelector("#report-notes")
};

function bind(element, eventName, handler, options) {
  if (!element) return;
  element.addEventListener(eventName, handler, options);
}

document.addEventListener("click", (event) => {
  const jump = event.target.closest("[data-view-jump]");
  if (jump) {
    if (jump.dataset.viewJump === "purchase-orders" && can("admin", "manager")) {
      askConfirmation({
        title: "Open Purchase Orders?",
        message: "Open the purchase order workspace for manager/admin ordering actions?",
        confirmText: "Open PO",
        onConfirm: () => setView(jump.dataset.viewJump)
      });
    } else {
      setView(jump.dataset.viewJump);
    }
  }

  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    pages[pageButton.dataset.page] = Number(pageButton.dataset.value);
    render();
  }

  const dateShortcut = event.target.closest("[data-date-shortcut]");
  if (dateShortcut) {
    applyDateShortcut(dateShortcut.dataset.dateShortcut);
  }

  const createPoButton = event.target.closest("[data-create-po]");
  if (createPoButton) {
    const product = state.products.find((item) => item.id === createPoButton.dataset.createPo);
    if (!product) return;
    if (CURRENT_USER.role === "staff") {
      askConfirmation({
        title: "Prepare Product Request?",
        message: `Open a request form for ${product.name} so Manager can review it?`,
        confirmText: "Prepare Request",
        onConfirm: () => prepareProductRequest(product)
      });
      return;
    }

    askConfirmation({
      title: "Prepare Purchase Order?",
      message: `Open a purchase order draft for ${product.name} from ${product.supplier}?`,
      confirmText: "Prepare PO",
      onConfirm: () => preparePurchaseOrder(product)
    });
  }

  const receiveButton = event.target.closest("[data-receive-po]");
  if (receiveButton) {
    const order = state.purchaseOrders.find((item) => item.id === receiveButton.dataset.receivePo);
    askConfirmation({
      title: "Receive Stock?",
      message: order ? `Receive ${order.quantity} ${order.productName} from ${order.supplier}? This will increase inventory stock.` : "Receive this purchase order?",
      confirmText: "Receive Stock",
      onConfirm: () => receivePurchaseOrder(receiveButton.dataset.receivePo)
    });
  }

  const inspectButton = event.target.closest("[data-inspect-po]");
  if (inspectButton) {
    setView("receiving");
    flashMessage(`Reviewing ${inspectButton.dataset.inspectPo} in Receiving.`);
  }

  const deleteButton = event.target.closest("[data-delete]");
  if (deleteButton) {
    if (!can("admin")) {
      flashMessage("Only Admin can remove products.");
      return;
    }

    const product = state.products.find((item) => item.id === deleteButton.dataset.delete);
    if (!product) return;
    askConfirmation({
      title: "Remove Product?",
      message: `Remove ${product.name} from inventory? This action is limited to Admin users.`,
      confirmText: "Remove Product",
      tone: "danger",
      onConfirm: () => {
        state.products = state.products.filter((item) => item.id !== product.id);
        sendToApi(`products/${encodeURIComponent(product.id)}`, {}, "DELETE");
        state.movements.unshift({
          id: makeId(),
          productName: product.name,
          type: "out",
          quantity: product.quantity,
          user: "Admin",
          notes: "Product removed from inventory",
          date: new Date().toISOString()
        });
        persistAndRender();
      }
    });
  }

  const requestAction = event.target.closest("[data-request-action]");
  if (requestAction) {
    handleRequestAction(requestAction.dataset.requestAction, requestAction.dataset.requestId);
  }

  const payButton = event.target.closest("[data-pay-po]");
  if (payButton) {
    markPurchaseOrderPaid(payButton.dataset.payPo);
  }

  const quickAction = event.target.closest("[data-quick-action]");
  if (quickAction) {
    handleQuickAction(quickAction.dataset.quickAction);
  }
});

bind(els.quickToggle, "click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const open = els.quickDropdown.classList.toggle("open");
  els.quickToggle.setAttribute("aria-expanded", String(open));
  els.profileDropdown?.classList.remove("open");
  els.profileToggle?.setAttribute("aria-expanded", "false");
});

function toggleProfileMenu(forceOpen = null, closeQuick = true) {
  if (!els.profileDropdown || !els.profileToggle) return;
  const open = forceOpen ?? !els.profileDropdown.classList.contains("open");
  els.profileDropdown.classList.toggle("open", open);
  els.profileToggle.classList.toggle("active", open);
  els.profileToggle.setAttribute("aria-expanded", String(open));
  if (closeQuick) closeQuickActions();
}

bind(els.profileToggle, "click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  toggleProfileMenu();
});

document.addEventListener("click", (event) => {
  if (event.target.closest("#profile-toggle")) {
    event.preventDefault();
    event.stopPropagation();
    toggleProfileMenu();
    return;
  }

  if (!event.target.closest(".profile-menu")) {
    toggleProfileMenu(false, false);
  }

  if (!event.target.closest(".quick-menu")) {
    closeQuickActions();
  }
});

bind(els.openSettings, "click", () => {
  els.profileDropdown?.classList.remove("open");
  els.settingsModal.classList.add("open");
  els.settingsModal.setAttribute("aria-hidden", "false");
});

bind(els.closeSettings, "click", closeSettings);
bind(els.settingsModal, "click", (event) => {
  if (event.target === els.settingsModal) closeSettings();
});

bind(els.openPoProductModal, "click", () => {
  if (!can("admin")) {
    els.purchaseOrderMessage.textContent = "Only Admin can add new products.";
    return;
  }

  openPoProductModal();
});

bind(els.closePoProductModal, "click", closePoProductModal);
bind(els.poProductModal, "click", (event) => {
  if (event.target === els.poProductModal) closePoProductModal();
});
bind(els.confirmCancel, "click", closeConfirmation);
bind(els.confirmModal, "click", (event) => {
  if (event.target === els.confirmModal) closeConfirmation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSettings();
    closePoProductModal();
    closeConfirmation();
    els.quickDropdown?.classList.remove("open");
    toggleProfileMenu(false);
  }
});

els.navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    setView(item.dataset.view);
  });
});

bind(els.search, "input", render);
bind(els.expectedMonth, "change", syncExpectedDate);
bind(els.expectedDay, "change", syncExpectedDate);
bind(els.expectedYear, "change", syncExpectedDate);
[
  [els.categoryFilter, "inventory"],
  [els.inventoryStatusFilter, "inventory"],
  [els.inventoryLimit, "inventory"],
  [els.availabilityCategoryFilter, "availability"],
  [els.availabilityStatusFilter, "availability"],
  [els.availabilityLimit, "availability"],
  [els.movementTypeFilter, "movements"],
  [els.movementLimit, "movements"],
  [els.supplierCategoryFilter, "suppliers"],
  [els.supplierLimit, "suppliers"],
  [els.requestStatusFilter, "requests"],
  [els.requestLimit, "requests"],
  [els.poStatusFilter, "purchaseOrders"],
  [els.poSupplierFilter, "purchaseOrders"],
  [els.poLimit, "purchaseOrders"],
  [els.receivingSupplierFilter, "receiving"],
  [els.receivingLimit, "receiving"],
  [els.receivedLimit, "received"]
].forEach(([control, page]) => {
  bind(control, "change", () => {
    pages[page] = 1;
    render();
  });
});

bind(els.poSupplier, "change", () => {
  renderPurchaseOrderControls();
});

bind(els.reset, "click", () => {
  loadFromApi();
});

bind(els.productForm, "submit", (event) => {
  event.preventDefault();
  if (!can("admin")) {
    flashMessage("Only Admin can add products.");
    return;
  }

  if (!consumeConfirmed(els.productForm)) {
    askConfirmation({
      title: "Add Product?",
      message: "Create this product and save it to inventory?",
      confirmText: "Add Product",
      onConfirm: () => confirmAndSubmit(els.productForm)
    });
    return;
  }

  const form = new FormData(els.productForm);
  const product = {
    id: makeId(),
    name: clean(form.get("name")),
    sku: clean(form.get("sku")).toUpperCase(),
    category: clean(form.get("category")),
    supplier: clean(form.get("supplier")),
    quantity: Number(form.get("quantity")),
    cost: Number(form.get("cost")),
    reorder: Number(form.get("reorder"))
  };

  state.products.unshift(product);
  sendToApi("products", product);
  state.movements.unshift({
    id: makeId(),
    productName: product.name,
    type: "in",
    quantity: product.quantity,
    user: "Admin",
    notes: "New product created",
    date: new Date().toISOString()
  });

  els.productForm.reset();
  els.productForm.quantity.value = 10;
  els.productForm.cost.value = 250;
  els.productForm.reorder.value = 5;
  persistAndRender();
});

bind(els.movementForm, "submit", (event) => {
  event.preventDefault();
  if (!can("admin", "staff")) {
    els.movementMessage.textContent = "Only Admin and Staff can record stock movements.";
    return;
  }

  els.movementMessage.textContent = "";
  const form = new FormData(els.movementForm);
  const product = state.products.find((item) => item.id === form.get("productId"));
  const quantity = Number(form.get("quantity"));
  const type = form.get("type");

  if (!product) return;
  if (type === "out" && quantity > product.quantity) {
    els.movementMessage.textContent = "Stock out cannot be higher than the available quantity.";
    return;
  }
  if (!consumeConfirmed(els.movementForm)) {
    askConfirmation({
      title: type === "in" ? "Record Stock In?" : "Record Stock Out?",
      message: `${type === "in" ? "Add" : "Remove"} ${quantity} ${product.name} ${type === "in" ? "to" : "from"} inventory?`,
      confirmText: "Save Movement",
      onConfirm: () => confirmAndSubmit(els.movementForm)
    });
    return;
  }

  product.quantity += type === "in" ? quantity : -quantity;
  const movement = {
    id: makeId(),
    productName: product.name,
    productId: product.id,
    type,
    quantity,
    user: clean(form.get("user")) || "Admin",
    notes: clean(form.get("notes")) || "No notes",
    date: new Date().toISOString()
  };
  state.movements.unshift(movement);
  sendToApi("stock-movements", movement);

  els.movementForm.reset();
  els.movementForm.quantity.value = 1;
  els.movementForm.user.value = CURRENT_USER.name;
  persistAndRender();
});

bind(els.supplierForm, "submit", (event) => {
  event.preventDefault();
  if (!can("admin")) {
    flashMessage("Only Admin can add suppliers.");
    return;
  }

  if (!consumeConfirmed(els.supplierForm)) {
    askConfirmation({
      title: "Add Supplier?",
      message: "Create this supplier profile and make it available for products and purchase orders?",
      confirmText: "Add Supplier",
      onConfirm: () => confirmAndSubmit(els.supplierForm)
    });
    return;
  }

  const form = new FormData(els.supplierForm);
  const supplier = {
    id: makeId(),
    name: clean(form.get("name")),
    contact: clean(form.get("contact")),
    email: clean(form.get("email")),
    phone: clean(form.get("phone")),
    leadTime: Number(form.get("leadTime")),
    category: clean(form.get("category")),
    status: "Active"
  };
  state.suppliers.unshift(supplier);
  sendToApi("suppliers", supplier);
  els.supplierForm.reset();
  els.supplierForm.leadTime.value = 7;
  persistAndRender();
});

bind(els.requestForm, "submit", (event) => {
  event.preventDefault();
  if (!can("admin", "staff")) {
    els.requestMessage.textContent = "Only Staff and Admin can submit product requests.";
    return;
  }

  els.requestMessage.textContent = "";
  const form = new FormData(els.requestForm);
  const product = state.products.find((item) => item.id === form.get("productId"));
  const quantity = Number(form.get("quantity"));
  if (!product) return;

  if (!consumeConfirmed(els.requestForm)) {
    askConfirmation({
      title: "Send Product Request?",
      message: `Ask the manager to review ${quantity} ${product.name} for restocking? If approved, the store pays the supplier.`,
      confirmText: "Send Request",
      onConfirm: () => confirmAndSubmit(els.requestForm)
    });
    return;
  }

  const productRequest = {
    id: makeId(),
    requester: CURRENT_USER.name,
    productId: product.id,
    productName: product.name,
    supplier: product.supplier,
    quantity,
    neededBy: form.get("neededBy") || null,
    reason: clean(form.get("reason")) || "Product replenishment request",
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  state.productRequests.unshift(productRequest);
  sendToApi("product-requests", productRequest);
  els.requestForm.reset();
  els.requestForm.quantity.value = 5;
  els.requestMessage.textContent = "Request sent to Manager for review.";
  persistAndRender();
});

bind(els.purchaseOrderForm, "submit", (event) => {
  event.preventDefault();
  if (!can("admin", "manager")) {
    els.purchaseOrderMessage.textContent = "Only Admin and Manager can create purchase orders.";
    return;
  }

  els.purchaseOrderMessage.textContent = "";
  const form = new FormData(els.purchaseOrderForm);
  const product = state.products.find((item) => item.id === form.get("productId"));
  if (!product) return;
  if (product.supplier !== form.get("supplier")) {
    els.purchaseOrderMessage.textContent = "Selected product is not supplied by this supplier.";
    renderPurchaseOrderControls();
    return;
  }
  if (!consumeConfirmed(els.purchaseOrderForm)) {
    askConfirmation({
      title: "Create Purchase Order?",
      message: `Order ${form.get("quantity")} ${product.name} from ${form.get("supplier")}? The store/business pays the supplier for this restock.`,
      confirmText: "Create PO",
      onConfirm: () => confirmAndSubmit(els.purchaseOrderForm)
    });
    return;
  }

  const order = {
    id: makeId(),
    number: nextPurchaseOrderNumber(),
    supplier: clean(form.get("supplier")),
    productId: product.id,
    productName: product.name,
    quantity: Number(form.get("quantity")),
    expectedDate: form.get("expectedDate"),
    status: "Pending",
    notes: clean(form.get("notes")) || "Inventory replenishment",
    paymentResponsibility: "Store/business pays supplier for restocking",
    paymentMethod: clean(form.get("paymentMethod")) || "Cash",
    paymentStatus: clean(form.get("paymentStatus")) || "Unpaid",
    paidAt: form.get("paymentStatus") === "Paid" ? new Date().toISOString() : null,
    createdAt: new Date().toISOString()
  };
  state.purchaseOrders.unshift(order);
  sendToApi("purchase-orders", order);

  els.purchaseOrderForm.reset();
  setDefaultPurchaseOrderDate();
  if (els.poPaymentMethod) els.poPaymentMethod.value = "Cash";
  if (els.poPaymentStatus) els.poPaymentStatus.value = "Unpaid";
  renderPurchaseOrderControls();
  els.purchaseOrderMessage.textContent = "Purchase order created. Store/business is responsible for paying the supplier.";
  persistAndRender();
});

bind(els.poProductForm, "submit", async (event) => {
  event.preventDefault();
  if (!can("admin")) {
    els.poProductMessage.textContent = "Only Admin can add new products.";
    return;
  }
  if (!consumeConfirmed(els.poProductForm)) {
    askConfirmation({
      title: "Add Product For Supplier?",
      message: `Add this new product under ${els.poNewProductSupplier.value}?`,
      confirmText: "Add Product",
      onConfirm: () => confirmAndSubmit(els.poProductForm)
    });
    return;
  }

  const form = new FormData(els.poProductForm);
  const product = {
    id: makeId(),
    name: clean(form.get("name")),
    sku: clean(form.get("sku")).toUpperCase(),
    category: clean(form.get("category")),
    supplier: clean(form.get("supplier")),
    quantity: Number(form.get("quantity")),
    cost: Number(form.get("cost")),
    reorder: Number(form.get("reorder"))
  };

  state.products.unshift(product);
  render();
  const created = await sendToApi("products", product);
  els.poProductMessage.textContent = "Product added to this supplier.";
  els.poProductForm.reset();
  els.poNewProductSupplier.value = els.poSupplier.value;

  if (created?.id) {
    await loadFromApi();
    els.poSupplier.value = created.supplier;
    renderPurchaseOrderControls(String(created.id));
  } else {
    renderPurchaseOrderControls(product.id);
  }

  window.setTimeout(closePoProductModal, 600);
});

function loadState() {
  return {
    products: structuredClone(demoProducts),
    movements: structuredClone(demoMovements),
    suppliers: structuredClone(demoSuppliers),
    purchaseOrders: hydrateDemoPurchaseOrders(),
    productRequests: hydrateDemoProductRequests()
  };
}

function saveState() {
  // MySQL through Laravel is the source of truth. Demo data only renders before API data loads.
}

function persistAndRender() {
  saveState();
  render();
}

function setView(view) {
  if (CURRENT_USER.role === "staff" && view === "purchase-orders") {
    view = "receiving";
  }

  els.navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  els.views.forEach((section) => section.classList.toggle("active", section.id === `${view}-view`));
  els.title.textContent = titleCase(view);
}

function render() {
  ensureStateShape();
  renderFilters();
  renderMetrics();
  renderPriority();
  renderChart();
  renderRecent();
  renderInventory();
  renderAvailability();
  renderMovementControls();
  renderMovements();
  renderSuppliers();
  renderRequestControls();
  renderProductRequests();
  renderPurchaseOrderControls();
  renderPurchaseOrders();
  renderReceiving();
  renderReports();
}

function renderMetrics() {
  const totalValue = state.products.reduce((sum, item) => sum + item.quantity * item.cost, 0);
  els.metrics.skus.textContent = state.products.length;
  els.metrics.value.textContent = money.format(totalValue);
  els.metrics.low.textContent = state.products.filter(isLowStock).length;
  els.metrics.out.textContent = state.products.filter((item) => item.quantity === 0).length;
}

function renderPriority() {
  const priority = [...state.products]
    .filter(isLowStock)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  els.priority.innerHTML = priority.length ? priority.map((item) => `
    <article class="priority-item">
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.sku)} - reorder at ${item.reorder}</span>
      </div>
      <div class="inline-actions">
        ${statusBadge(item)}
        <button class="text-button small" type="button" data-create-po="${item.id}">${CURRENT_USER.role === "staff" ? "Request" : "Create PO"}</button>
      </div>
    </article>
  `).join("") : empty("No priority restocks right now.");
}

function renderChart() {
  const grouped = groupByCategory();
  const totalUnits = grouped.reduce((sum, item) => sum + item.units, 0) || 1;
  els.chart.innerHTML = grouped.map((item) => {
    const percent = Math.round((item.units / totalUnits) * 100);

    return `
      <div class="bar-row">
        <strong>${escapeHtml(item.category)}</strong>
        <span class="bar-track" style="--fill:${percent}%"></span>
        <span class="bar-value"><small>${percent}%</small></span>
      </div>
    `;
  }).join("");
}

function renderRecent() {
  els.recent.innerHTML = state.movements.slice(0, 6).map((move) => `
    <tr>
      <td>${dateFormat.format(new Date(move.date))}</td>
      <td>${escapeHtml(move.productName)}</td>
      <td>${movementBadge(move.type)}</td>
      <td>${move.quantity}</td>
      <td>${escapeHtml(move.user)}</td>
    </tr>
  `).join("");
}

function renderFilters() {
  const selected = els.categoryFilter.value || "all";
  const selectedAvailabilityCategory = els.availabilityCategoryFilter.value || "all";
  const categories = uniqueCategories();
  els.categoryFilter.innerHTML = `<option value="all">All categories</option>${categories.map((category) => `
    <option value="${escapeHtml(category)}">${escapeHtml(category)}</option>
  `).join("")}`;
  els.categoryFilter.value = categories.includes(selected) ? selected : "all";
  els.availabilityCategoryFilter.innerHTML = `<option value="all">All categories</option>${categories.map((category) => `
    <option value="${escapeHtml(category)}">${escapeHtml(category)}</option>
  `).join("")}`;
  els.availabilityCategoryFilter.value = categories.includes(selectedAvailabilityCategory) ? selectedAvailabilityCategory : "all";

  setSelectOptions(els.supplierCategoryFilter, uniqueSupplierCategories(), "All categories");
  setSelectOptions(els.poSupplierFilter, uniqueSupplierNames(), "All suppliers");
  setSelectOptions(els.receivingSupplierFilter, uniqueSupplierNames(), "All suppliers");
}

function renderInventory() {
  const search = els.search.value.trim().toLowerCase();
  const category = els.categoryFilter.value;
  const status = els.inventoryStatusFilter.value;
  const products = state.products.filter((item) => {
    const matchesSearch = [item.name, item.sku, item.category, item.supplier].join(" ").toLowerCase().includes(search);
    const matchesCategory = category === "all" || item.category === category;
    const matchesStatus = status === "all" || stockStatus(item) === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  const page = paginate(products, "inventory", els.inventoryLimit.value);

  els.inventoryTable.innerHTML = page.rows.length ? page.rows.map((item) => `
    <tr>
      <td class="product-cell"><strong>${escapeHtml(item.name)}</strong><span>${money.format(item.cost)} per unit</span></td>
      <td>${escapeHtml(item.sku)}</td>
      <td>${escapeHtml(item.category)}</td>
      <td>${escapeHtml(item.supplier)}</td>
      <td>${item.quantity}</td>
      <td>${statusBadge(item)}</td>
      <td>
        <button class="delete-button" type="button" data-delete="${item.id}" aria-label="Delete ${escapeHtml(item.name)}" title="Delete product">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c-1.1 0-2-.9-2-2V7h14v12c0 1.1-.9 2-2 2H7ZM8 4h8l1 1h4v2H3V5h4l1-1Zm1 5v9h2V9H9Zm4 0v9h2V9h-2Z"/></svg>
        </button>
      </td>
    </tr>
  `).join("") : `<tr><td colspan="7" class="empty-state">No products match the current filters.</td></tr>`;
  renderPagination(els.inventoryPagination, "inventory", page, "products");
}

function renderAvailability() {
  const search = els.search.value.trim().toLowerCase();
  const category = els.availabilityCategoryFilter.value;
  const status = els.availabilityStatusFilter.value;
  const products = state.products.filter((item) => {
    const matchesSearch = [item.name, item.sku, item.category, item.supplier].join(" ").toLowerCase().includes(search);
    const matchesCategory = category === "all" || item.category === category;
    const matchesStatus = status === "all" || stockStatus(item) === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  const page = paginate(products, "availability", els.availabilityLimit.value);

  els.availabilityList.innerHTML = page.rows.length ? page.rows.map((item) => {
    const percent = availabilityPercent(item);
    return `
      <article class="availability-card">
        <div class="availability-main">
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(item.sku)} - ${escapeHtml(item.category)} - ${escapeHtml(item.supplier)}</span>
          </div>
          ${statusBadge(item)}
        </div>
        <div class="availability-meter">
          <div class="availability-track" aria-label="${percent}% available">
            <span class="availability-fill ${stockStatus(item)}" style="width:${percent}%"></span>
          </div>
          <strong>${percent}%</strong>
        </div>
        <div class="availability-meta">
          <span><small>On hand</small>${item.quantity}</span>
          <span><small>Reorder at</small>${item.reorder}</span>
          <span><small>Unit cost</small>${money.format(item.cost)}</span>
          <button class="text-button small" type="button" data-create-po="${item.id}">
            ${CURRENT_USER.role === "staff" ? "Request" : "Prepare PO"}
          </button>
        </div>
      </article>
    `;
  }).join("") : `<p class="empty-state">No products match the availability filters.</p>`;

  renderPagination(els.availabilityPagination, "availability", page, "products");
}

function renderMovementControls() {
  els.movementProduct.innerHTML = state.products.map((item) => `
    <option value="${item.id}">${escapeHtml(item.name)} (${item.quantity} available)</option>
  `).join("");
}

function renderMovements() {
  const type = els.movementTypeFilter.value;
  const movements = state.movements.filter((move) => type === "all" || move.type === type);
  const page = paginate(movements, "movements", els.movementLimit.value);

  els.movementTable.innerHTML = page.rows.map((move) => `
    <tr>
      <td>${dateFormat.format(new Date(move.date))}</td>
      <td>${escapeHtml(move.productName)}</td>
      <td>${movementBadge(move.type)}</td>
      <td>${move.quantity}</td>
      <td>${escapeHtml(move.notes)}</td>
    </tr>
  `).join("") || `<tr><td colspan="5" class="empty-state">No movements match the current filters.</td></tr>`;
  renderPagination(els.movementPagination, "movements", page, "movements");
}

function renderSuppliers() {
  const category = els.supplierCategoryFilter.value;
  const suppliers = state.suppliers.filter((supplier) => category === "all" || supplier.category === category);
  const page = paginate(suppliers, "suppliers", els.supplierLimit.value);

  els.supplierTable.innerHTML = page.rows.map((supplier) => {
    const productCount = state.products.filter((item) => item.supplier === supplier.name).length;
    return `
      <tr>
        <td class="product-cell"><strong>${escapeHtml(supplier.name)}</strong><span>${escapeHtml(supplier.email)}</span></td>
        <td>${escapeHtml(supplier.contact)}<br><span class="muted-text">${escapeHtml(supplier.phone)}</span></td>
        <td>${escapeHtml(supplier.category)}</td>
        <td>${supplier.leadTime} days</td>
        <td>${productCount}</td>
        <td><span class="badge ok">${escapeHtml(supplier.status)}</span></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="6" class="empty-state">No suppliers match the current filters.</td></tr>`;
  renderPagination(els.supplierPagination, "suppliers", page, "suppliers");
}

function renderRequestControls() {
  els.requestProduct.innerHTML = state.products.map((item) => `
    <option value="${item.id}">${escapeHtml(item.name)} - ${escapeHtml(item.supplier)} (${item.quantity} available)</option>
  `).join("");
}

function renderProductRequests() {
  const status = els.requestStatusFilter.value;
  const requests = state.productRequests.filter((request) => status === "all" || request.status === status);
  const page = paginate(requests, "requests", els.requestLimit.value);

  els.requestList.innerHTML = page.rows.length ? page.rows.map((request) => {
    const canReview = can("admin", "manager");
    const canApproveReject = canReview && request.status === "Pending";
    const canOrder = canReview && ["Pending", "Approved"].includes(request.status);
    const needed = request.neededBy ? dateFormat.format(new Date(request.neededBy)) : "Flexible";
    const poText = request.purchaseOrderNumber ? `PO: ${request.purchaseOrderNumber}` : "";

    return `
      <article class="request-card">
        <div class="request-main">
          <div>
            <strong>${escapeHtml(request.productName)}</strong>
            <span>${escapeHtml(request.supplier)} - requested by ${escapeHtml(request.requester)}</span>
          </div>
          ${requestBadge(request.status)}
        </div>
        <div class="request-meta">
          <span><small>Qty</small>${request.quantity}</span>
          <span><small>Needed</small>${escapeHtml(needed)}</span>
          <span><small>Reason</small>${escapeHtml(request.reason || "No reason added")}</span>
        </div>
        ${request.managerNote || poText ? `
          <p class="request-note">${escapeHtml([request.managerNote, poText].filter(Boolean).join(" - "))}</p>
        ` : ""}
        ${canReview ? `
          <div class="inline-actions request-actions">
            <button class="text-button small" type="button" data-request-action="approve" data-request-id="${request.id}" ${canApproveReject ? "" : "disabled"}>Approve</button>
            <button class="text-button small danger-text" type="button" data-request-action="reject" data-request-id="${request.id}" ${canApproveReject ? "" : "disabled"}>Reject</button>
            <button class="text-button small success" type="button" data-request-action="order" data-request-id="${request.id}" ${canOrder ? "" : "disabled"}>Create PO</button>
          </div>
        ` : ""}
      </article>
    `;
  }).join("") : `<p class="empty-state">No product requests match the current filters.</p>`;

  renderPagination(els.requestPagination, "requests", page, "requests");
}

function renderPurchaseOrderControls(preferredProductId = null) {
  const currentSupplier = els.poSupplier.value;
  const currentProduct = preferredProductId || els.poProduct.value;
  const suppliersWithProducts = state.suppliers.filter((supplier) =>
    state.products.some((product) => product.supplier === supplier.name)
  );
  const supplierOptions = suppliersWithProducts.length ? suppliersWithProducts : state.suppliers;

  els.poSupplier.innerHTML = supplierOptions.map((supplier) => `
    <option value="${escapeHtml(supplier.name)}">${escapeHtml(supplier.name)}</option>
  `).join("");
  if (supplierOptions.some((supplier) => supplier.name === currentSupplier)) {
    els.poSupplier.value = currentSupplier;
  }

  const selectedSupplier = els.poSupplier.value;
  const supplierProducts = state.products.filter((item) => item.supplier === selectedSupplier);
  els.poProduct.innerHTML = supplierProducts.length ? supplierProducts.map((item) => `
    <option value="${item.id}">${escapeHtml(item.name)} (${item.quantity} available)</option>
  `).join("") : `<option value="">No products assigned to this supplier</option>`;
  els.poProduct.disabled = supplierProducts.length === 0;
  els.purchaseOrderForm.querySelector('button[type="submit"]').disabled = supplierProducts.length === 0;

  if (supplierProducts.some((item) => item.id === currentProduct)) {
    els.poProduct.value = currentProduct;
  }

  if (!els.expectedDate.value) setDefaultPurchaseOrderDate();
}

function renderPurchaseOrders() {
  const status = els.poStatusFilter.value;
  const supplier = els.poSupplierFilter.value;
  const orders = state.purchaseOrders.filter((order) => {
    const matchesStatus = status === "all" || order.status === status;
    const matchesSupplier = supplier === "all" || order.supplier === supplier;
    return matchesStatus && matchesSupplier;
  });
  const page = paginate(orders, "purchaseOrders", els.poLimit.value);

  els.purchaseOrderTable.innerHTML = page.rows.length ? page.rows.map((order) => `
    <tr>
      <td>${escapeHtml(order.number)}</td>
      <td>${escapeHtml(order.supplier)}</td>
      <td class="product-cell">
        <strong>${escapeHtml(order.productName)}</strong>
        <span>${escapeHtml(restockingPaymentText(order))}</span>
      </td>
      <td>${order.quantity}</td>
      <td>${dateFormat.format(new Date(order.expectedDate))}</td>
      <td>
        ${paymentBadge(order.paymentStatus)}
        <span class="payment-method">${escapeHtml(order.paymentMethod || "Cash")}</span>
      </td>
      <td>${purchaseOrderBadge(order.status)}</td>
      <td>
        ${order.status === "Pending" ? `
          <div class="inline-actions">
            <button class="text-button small" type="button" data-inspect-po="${escapeHtml(order.number)}">Review</button>
            ${can("admin", "manager") && order.paymentStatus !== "Paid" ? `<button class="text-button small" type="button" data-pay-po="${order.id}">Mark Paid</button>` : ""}
            <button class="text-button small success" type="button" data-receive-po="${order.id}">Receive</button>
          </div>
        ` : ""}
      </td>
    </tr>
  `).join("") : `<tr><td colspan="8" class="empty-state">No purchase orders match the current filters.</td></tr>`;
  renderPagination(els.poPagination, "purchaseOrders", page, "purchase orders");
}

function renderReceiving() {
  const supplier = els.receivingSupplierFilter.value;
  const pending = state.purchaseOrders.filter((order) => order.status === "Pending" && (supplier === "all" || order.supplier === supplier));
  const received = state.purchaseOrders.filter((order) => order.status === "Received");
  const urgent = pending.filter((order) => new Date(order.expectedDate) <= tomorrow()).length;
  const pendingPage = paginate(pending, "receiving", els.receivingLimit.value);
  const receivedPage = paginate(received, "received", els.receivedLimit.value);

  els.receivingTable.innerHTML = pendingPage.rows.length ? pendingPage.rows.map((order) => {
    const expected = new Date(order.expectedDate);
    const isDueSoon = expected <= tomorrow();

    return `
      <article class="receiving-card">
        <div class="receiving-card-main">
          <div class="po-chip">${escapeHtml(order.number)}</div>
          <div>
            <strong>${escapeHtml(order.productName)}</strong>
            <span>${escapeHtml(order.supplier)}</span>
            <em>${escapeHtml(restockingPaymentText(order))}</em>
          </div>
        </div>
        <div class="receiving-meta">
          <span><small>Expected</small>${dateFormat.format(expected)}</span>
          <span><small>Ordered</small>${order.quantity}</span>
          <span><small>Restock Cost</small>${money.format(orderTotal(order))}</span>
          <span><small>Payment</small>${escapeHtml(order.paymentStatus || "Unpaid")}</span>
          <span>${isDueSoon ? `<b class="badge low">Due Soon</b>` : `<b class="badge ok">Scheduled</b>`}</span>
        </div>
        <button class="primary-button table-button" type="button" data-receive-po="${order.id}">Receive Stock</button>
      </article>
    `;
  }).join("") : `<p class="empty-state receiving-empty">No pending deliveries.</p>`;
  renderPagination(els.receivingPagination, "receiving", pendingPage, "pending deliveries");

  els.receivedTable.innerHTML = receivedPage.rows.length ? receivedPage.rows.map((order) => `
    <tr>
      <td>${escapeHtml(order.number)}</td>
      <td>${escapeHtml(order.supplier)}</td>
      <td>${escapeHtml(order.productName)}</td>
      <td>${order.quantity}</td>
      <td>${order.receivedAt ? dateFormat.format(new Date(order.receivedAt)) : "Recently"}</td>
      <td>${purchaseOrderBadge(order.status)}</td>
    </tr>
  `).join("") : `<tr><td colspan="6" class="empty-state">No deliveries received yet.</td></tr>`;
  renderPagination(els.receivedPagination, "received", receivedPage, "received deliveries");

  els.receivingSummary.innerHTML = [
    ["Pending deliveries", `${pending.length} order${pending.length === 1 ? "" : "s"} waiting to be received.`],
    ["Due soon", `${urgent} order${urgent === 1 ? "" : "s"} expected today or tomorrow.`],
    ["Completed receiving", `${received.length} order${received.length === 1 ? "" : "s"} already added to stock.`]
  ].map(([title, body]) => `
    <article class="note-item">
      <div>
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(body)}</span>
      </div>
    </article>
  `).join("");
}

function renderReports() {
  const grouped = groupByCategory();
  els.reportTable.innerHTML = grouped.map((item) => `
    <tr>
      <td>${escapeHtml(item.category)}</td>
      <td>${item.units}</td>
      <td>${money.format(item.value)}</td>
      <td>${item.low}</td>
    </tr>
  `).join("");

  const out = state.products.filter((item) => item.quantity === 0).length;
  const low = state.products.filter(isLowStock).length;
  const pendingOrders = state.purchaseOrders.filter((order) => order.status === "Pending").length;
  const pendingRestockCost = state.purchaseOrders
    .filter((order) => order.status === "Pending")
    .reduce((total, order) => total + orderTotal(order), 0);
  const highestValue = [...state.products].sort((a, b) => b.quantity * b.cost - a.quantity * a.cost)[0];
  els.reportNotes.innerHTML = [
    ["Reorder watch", `${low} product${low === 1 ? "" : "s"} at or below reorder level.`],
    ["Unavailable stock", `${out} product${out === 1 ? "" : "s"} currently out of stock.`],
    ["Open purchase orders", `${pendingOrders} supplier order${pendingOrders === 1 ? "" : "s"} awaiting receipt. Store/business pays suppliers for restocking.`],
    ["Restocking budget", `${money.format(pendingRestockCost)} estimated for pending supplier payments.`],
    ["Highest value item", highestValue ? `${highestValue.name} holds ${money.format(highestValue.quantity * highestValue.cost)} in stock value.` : "No inventory value recorded."]
  ].map(([title, body]) => `
    <article class="note-item">
      <div>
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(body)}</span>
      </div>
    </article>
  `).join("");
}

function groupByCategory() {
  const map = new Map();
  state.products.forEach((item) => {
    const current = map.get(item.category) || { category: item.category, units: 0, value: 0, low: 0 };
    current.units += item.quantity;
    current.value += item.quantity * item.cost;
    current.low += isLowStock(item) ? 1 : 0;
    map.set(item.category, current);
  });
  return [...map.values()].sort((a, b) => b.units - a.units);
}

function uniqueCategories() {
  return [...new Set(state.products.map((item) => item.category))].sort();
}

function uniqueSupplierCategories() {
  return [...new Set(state.suppliers.map((item) => item.category))].sort();
}

function uniqueSupplierNames() {
  return [...new Set(state.suppliers.map((item) => item.name))].sort();
}

function isLowStock(item) {
  return item.quantity <= item.reorder;
}

function stockStatus(item) {
  if (item.quantity === 0) return "out";
  if (isLowStock(item)) return "low";
  return "healthy";
}

function availabilityPercent(item) {
  if (item.quantity === 0) return 0;
  const target = Math.max(Number(item.reorder) * 2, Number(item.reorder) + 1, Number(item.quantity));
  return Math.min(Math.round((Number(item.quantity) / target) * 100), 100);
}

function statusBadge(item) {
  if (item.quantity === 0) return `<span class="badge out">Out</span>`;
  if (isLowStock(item)) return `<span class="badge low">Low</span>`;
  return `<span class="badge ok">Healthy</span>`;
}

function movementBadge(type) {
  return type === "in" ? `<span class="badge in">Stock In</span>` : `<span class="badge out-move">Stock Out</span>`;
}

function purchaseOrderBadge(status) {
  return status === "Received" ? `<span class="badge ok">Received</span>` : `<span class="badge low">Pending</span>`;
}

function paymentBadge(status = "Unpaid") {
  const classes = {
    Paid: "ok",
    "Partially Paid": "low",
    Unpaid: "out"
  };

  return `<span class="badge ${classes[status] || "out"}">${escapeHtml(status)}</span>`;
}

function restockingPaymentText(order) {
  const method = order.paymentMethod ? ` via ${order.paymentMethod}` : "";
  return `${order.paymentResponsibility || "Store/business pays supplier for restocking"}${method}`;
}

function orderTotal(order) {
  const product = state.products.find((item) => item.id === order.productId || item.name === order.productName);
  return Number(order.quantity || 0) * Number(product?.cost || 0);
}

function handleQuickAction(action) {
  closeQuickActions();

  const firstLowStock = [...state.products].filter(isLowStock).sort((a, b) => a.quantity - b.quantity)[0];

  if (action === "new-request") {
    setView("requests");
    if (firstLowStock) prepareProductRequest(firstLowStock, { keepView: true });
    focusFirstField(els.requestForm);
    return;
  }

  if (action === "receive-stock") {
    setView("receiving");
    els.receivingSupplierFilter.value = "all";
    pages.receiving = 1;
    render();
    return;
  }

  if (action === "stock-out") {
    setView("movements");
    els.movementForm.querySelector('[name="type"]').value = "out";
    els.movementMessage.textContent = "Stock out ready. Choose the product and quantity to issue.";
    focusFirstField(els.movementForm);
    return;
  }

  if (action === "review-requests") {
    setView("requests");
    els.requestStatusFilter.value = "Pending";
    pages.requests = 1;
    render();
    return;
  }

  if (action === "create-po") {
    askConfirmation({
      title: "Create Purchase Order?",
      message: "Open the purchase order form for supplier ordering? The store/business pays the supplier for restocking.",
      confirmText: "Open PO",
      onConfirm: () => {
        setView("purchase-orders");
        if (firstLowStock) {
          els.poSupplier.value = firstLowStock.supplier;
          renderPurchaseOrderControls(firstLowStock.id);
          els.purchaseOrderForm.quantity.value = Math.max(firstLowStock.reorder * 2 - firstLowStock.quantity, firstLowStock.reorder, 1);
          els.purchaseOrderMessage.textContent = `Draft prepared for ${firstLowStock.name}.`;
        }
        focusFirstField(els.purchaseOrderForm);
      }
    });
    return;
  }

  if (action === "low-stock") {
    setView("availability");
    els.availabilityCategoryFilter.value = "all";
    els.availabilityStatusFilter.value = "low";
    pages.availability = 1;
    render();
    return;
  }

  if (action === "add-product") {
    setView("inventory");
    focusFirstField(els.productForm);
    return;
  }

  if (action === "add-supplier") {
    setView("suppliers");
    focusFirstField(els.supplierForm);
  }
}

function closeQuickActions() {
  els.quickDropdown?.classList.remove("open");
  els.quickToggle?.setAttribute("aria-expanded", "false");
}

function focusFirstField(container) {
  window.setTimeout(() => container?.querySelector("input, select, textarea, button")?.focus(), 80);
}

function prepareProductRequest(product) {
  setView("requests");
  els.requestProduct.value = product.id;
  els.requestForm.quantity.value = Math.max(product.reorder * 2 - product.quantity, product.reorder, 1);
  els.requestMessage.textContent = `Request prepared for ${product.name}. If approved, the store pays the supplier for restocking.`;
}

function preparePurchaseOrder(product) {
  setView("purchase-orders");
  els.poSupplier.value = product.supplier;
  renderPurchaseOrderControls(product.id);
  els.purchaseOrderForm.quantity.value = Math.max(product.reorder * 2 - product.quantity, product.reorder, 1);
  els.purchaseOrderMessage.textContent = `Purchase order prepared for ${product.name}. Store/business pays the supplier.`;
}

function requestBadge(status) {
  const classes = {
    Pending: "low",
    Approved: "ok",
    Rejected: "out",
    Ordered: "in"
  };

  return `<span class="badge ${classes[status] || "low"}">${escapeHtml(status)}</span>`;
}

function handleRequestAction(action, id) {
  if (!can("admin", "manager")) {
    flashMessage("Only Admin and Manager can review product requests.");
    return;
  }

  const productRequest = state.productRequests.find((item) => item.id === id);
  if (!productRequest) return;

  const product = state.products.find((item) => item.id === productRequest.productId);
  const labels = {
    approve: ["Approve Request?", `Approve ${productRequest.quantity} ${productRequest.productName} for purchasing? The store/business will pay the supplier if this becomes a PO.`, "Approve"],
    reject: ["Reject Request?", `Reject the request for ${productRequest.productName}?`, "Reject"],
    order: ["Create Purchase Order?", `Create a purchase order for ${productRequest.quantity} ${productRequest.productName} from ${productRequest.supplier}? Store/business pays the supplier for restocking.`, "Create PO"]
  };
  const [title, message, confirmText] = labels[action] || labels.approve;

  askConfirmation({
    title,
    message,
    confirmText,
    tone: action === "reject" ? "danger" : "default",
    onConfirm: async () => {
      if (action === "approve") {
        productRequest.status = "Approved";
        productRequest.managerNote = "Approved for purchasing.";
      }

      if (action === "reject") {
        productRequest.status = "Rejected";
        productRequest.managerNote = "Request rejected by manager.";
      }

      if (action === "order") {
        productRequest.status = "Ordered";
        productRequest.managerNote = "Approved and converted to purchase order.";
        const order = {
          id: makeId(),
          number: nextPurchaseOrderNumber(),
          supplier: productRequest.supplier,
          productId: productRequest.productId,
          productName: productRequest.productName,
          quantity: Number(productRequest.quantity),
          expectedDate: productRequest.neededBy || daysFromNow(product?.leadTime || 7),
          status: "Pending",
          notes: `Created from request: ${productRequest.reason || "Product replenishment"}`,
          paymentResponsibility: "Store/business pays supplier for restocking",
          paymentMethod: "Cash",
          paymentStatus: "Unpaid",
          paidAt: null,
          createdAt: new Date().toISOString()
        };
        state.purchaseOrders.unshift(order);
      }

      const updated = await sendToApi(`product-requests/${encodeURIComponent(id)}/${action}`, {
        managerNote: productRequest.managerNote
      }, "PATCH");

      if (updated?.id) {
        const index = state.productRequests.findIndex((item) => item.id === id);
        state.productRequests[index] = normalizeProductRequest(updated);
      }

      flashMessage(action === "order" ? "Request converted to a purchase order. Store/business pays the supplier." : `Request ${productRequest.status.toLowerCase()}.`);
      persistAndRender();
    }
  });
}

function receivePurchaseOrder(id) {
  if (!can("admin", "staff")) {
    flashMessage("Only Admin and Staff can receive purchase orders.");
    return;
  }

  const order = state.purchaseOrders.find((item) => item.id === id);
  if (!order || order.status !== "Pending") return;
  const product = state.products.find((item) => item.id === order.productId || item.name === order.productName);
  if (!product) return;

  product.quantity += Number(order.quantity);
  order.status = "Received";
  order.receivedAt = new Date().toISOString();
  state.movements.unshift({
    id: makeId(),
    productName: product.name,
    type: "in",
    quantity: Number(order.quantity),
    user: "Receiving",
    notes: `${order.number} received from ${order.supplier}`,
    date: new Date().toISOString()
  });
  sendToApi(`purchase-orders/${encodeURIComponent(order.id)}/receive`, order, "PATCH");
  flashMessage(`${order.number} received. ${order.quantity} ${product.name} added to inventory.`);
  persistAndRender();
}

function markPurchaseOrderPaid(id) {
  if (!can("admin", "manager")) {
    flashMessage("Only Admin and Manager can record supplier payment.");
    return;
  }

  const order = state.purchaseOrders.find((item) => item.id === id);
  if (!order) return;

  askConfirmation({
    title: "Mark Supplier Payment Paid?",
    message: `Record ${order.number} as paid by the store/business to ${order.supplier}? Stock receiving is still handled separately.`,
    confirmText: "Mark Paid",
    onConfirm: async () => {
      order.paymentStatus = "Paid";
      order.paidAt = new Date().toISOString();
      const updated = await sendToApi(`purchase-orders/${encodeURIComponent(order.id)}/payment`, {
        paymentMethod: order.paymentMethod || "Cash",
        paymentStatus: "Paid"
      }, "PATCH");

      if (updated?.id) {
        const index = state.purchaseOrders.findIndex((item) => item.id === id);
        state.purchaseOrders[index] = normalizePurchaseOrders([updated])[0];
      }

      flashMessage(`${order.number} payment recorded as paid. Store/business paid the supplier.`);
      persistAndRender();
    }
  });
}

function flashMessage(message) {
  els.purchaseOrderMessage.textContent = message;
  window.setTimeout(() => {
    if (els.purchaseOrderMessage.textContent === message) els.purchaseOrderMessage.textContent = "";
  }, 3500);
}

async function loadFromApi() {
  try {
    const [products, movements, suppliers, purchaseOrders, productRequests] = await Promise.all([
      fetchApi("products"),
      fetchApi("stock-movements"),
      fetchApi("suppliers"),
      fetchApi("purchase-orders"),
      fetchApi("product-requests")
    ]);

    if (Array.isArray(products) && products.length) state.products = normalizeProducts(products);
    if (Array.isArray(movements)) state.movements = normalizeMovements(movements);
    if (Array.isArray(suppliers) && suppliers.length) state.suppliers = normalizeSuppliers(suppliers);
    if (Array.isArray(purchaseOrders)) state.purchaseOrders = normalizePurchaseOrders(purchaseOrders);
    if (Array.isArray(productRequests)) state.productRequests = productRequests.map(normalizeProductRequest);
    persistAndRender();
  } catch (error) {
    console.warn(`Using local demo data because API at ${API_BASE_URL} is unavailable.`, error);
  }
}

async function fetchApi(path) {
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" }
  });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  const payload = await response.json();
  return Array.isArray(payload) ? payload : payload.data;
}

async function sendToApi(path, payload, method = "POST") {
  try {
    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": CSRF_TOKEN
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`${path} returned ${response.status}`);
    const result = response.status === 204 ? null : await response.json().catch(() => null);
    window.setTimeout(loadFromApi, 100);
    return result?.data || result;
  } catch (error) {
    console.warn(`API write failed for ${path}.`, error);
    flashMessage("Database save failed. Check your role, API route, or MySQL connection.");
    return null;
  }
}

function can(...roles) {
  return roles.includes(CURRENT_USER.role);
}

function closeSettings() {
  els.settingsModal.classList.remove("open");
  els.settingsModal.setAttribute("aria-hidden", "true");
}

function openPoProductModal() {
  els.poNewProductSupplier.value = els.poSupplier.value;
  els.poProductMessage.textContent = "";
  els.poProductModal.classList.add("open");
  els.poProductModal.setAttribute("aria-hidden", "false");
  els.poProductForm.name.focus();
}

function closePoProductModal() {
  els.poProductModal.classList.remove("open");
  els.poProductModal.setAttribute("aria-hidden", "true");
}

function askConfirmation({ title, message, confirmText = "Continue", tone = "default", onConfirm }) {
  els.confirmTitle.textContent = title;
  els.confirmMessage.textContent = message;
  els.confirmContinue.textContent = confirmText;
  els.confirmContinue.classList.toggle("danger-confirm", tone === "danger");
  els.confirmModal.classList.add("open");
  els.confirmModal.setAttribute("aria-hidden", "false");
  els.confirmContinue.onclick = () => {
    closeConfirmation();
    onConfirm();
  };
  els.confirmCancel.focus();
}

function closeConfirmation() {
  els.confirmModal.classList.remove("open");
  els.confirmModal.setAttribute("aria-hidden", "true");
  els.confirmContinue.onclick = null;
}

function confirmAndSubmit(form) {
  form.dataset.confirmed = "true";
  form.requestSubmit();
}

function consumeConfirmed(form) {
  const confirmed = form.dataset.confirmed === "true";
  delete form.dataset.confirmed;
  return confirmed;
}

function setSelectOptions(select, values, allLabel) {
  const current = select.value || "all";
  select.innerHTML = `<option value="all">${allLabel}</option>${values.map((value) => `
    <option value="${escapeHtml(value)}">${escapeHtml(value)}</option>
  `).join("")}`;
  select.value = values.includes(current) ? current : "all";
}

function paginate(items, key, limitValue) {
  const limit = Number(limitValue || 5);
  const totalPages = Math.max(Math.ceil(items.length / limit), 1);
  pages[key] = Math.min(Math.max(pages[key] || 1, 1), totalPages);
  const start = (pages[key] - 1) * limit;
  return {
    rows: items.slice(start, start + limit),
    page: pages[key],
    totalPages,
    total: items.length,
    start: items.length ? start + 1 : 0,
    end: Math.min(start + limit, items.length)
  };
}

function renderPagination(container, key, page, label) {
  container.innerHTML = `
    <span>Showing ${page.start}-${page.end} of ${page.total} ${label}</span>
    <div class="pager-actions">
      <button class="text-button small" type="button" data-page="${key}" data-value="${page.page - 1}" ${page.page <= 1 ? "disabled" : ""}>Previous</button>
      <strong>Page ${page.page} of ${page.totalPages}</strong>
      <button class="text-button small" type="button" data-page="${key}" data-value="${page.page + 1}" ${page.page >= page.totalPages ? "disabled" : ""}>Next</button>
    </div>
  `;
}

function normalizeProducts(products) {
  return products.map((item) => ({
    id: String(item.id ?? makeId()),
    name: item.name ?? item.product_name ?? "Unnamed Product",
    sku: item.sku ?? item.code ?? "NO-SKU",
    category: item.category ?? item.category_name ?? "Uncategorized",
    supplier: item.supplier ?? item.supplier_name ?? "Unknown Supplier",
    quantity: Number(item.quantity ?? item.stock ?? item.qty ?? 0),
    cost: Number(item.cost ?? item.unit_cost ?? item.price ?? 0),
    reorder: Number(item.reorder ?? item.reorder_level ?? item.low_stock_level ?? 0)
  }));
}

function normalizeMovements(movements) {
  return movements.map((item) => ({
    id: String(item.id ?? makeId()),
    productId: item.productId ?? item.product_id ?? null,
    productName: item.productName ?? item.product_name ?? item.product?.name ?? "Unknown Product",
    type: item.type === "stock_in" ? "in" : item.type === "stock_out" ? "out" : item.type ?? "in",
    quantity: Number(item.quantity ?? item.qty ?? 0),
    user: item.user ?? item.handled_by ?? item.created_by ?? "API",
    notes: item.notes ?? item.remarks ?? "Imported from API",
    date: item.date ?? item.created_at ?? new Date().toISOString()
  }));
}

function normalizeSuppliers(suppliers) {
  return suppliers.map((item) => ({
    id: String(item.id ?? makeId()),
    name: item.name ?? item.supplier_name ?? "Unnamed Supplier",
    contact: item.contact ?? item.contact_person ?? "No contact",
    email: item.email ?? "No email",
    phone: item.phone ?? item.contact_number ?? "No phone",
    leadTime: Number(item.leadTime ?? item.lead_time ?? 7),
    category: item.category ?? item.category_focus ?? "General",
    status: item.status ?? "Active"
  }));
}

function normalizePurchaseOrders(orders) {
  return orders.map((item) => ({
    id: String(item.id ?? makeId()),
    number: item.number ?? item.po_number ?? `PO-${item.id ?? "API"}`,
    supplier: item.supplier ?? item.supplier_name ?? item.supplier?.name ?? "Unknown Supplier",
    productId: String(item.productId ?? item.product_id ?? ""),
    productName: item.productName ?? item.product_name ?? item.product?.name ?? "Unknown Product",
    quantity: Number(item.quantity ?? item.qty ?? 0),
    expectedDate: item.expectedDate ?? item.expected_date ?? item.created_at ?? new Date().toISOString(),
    status: item.status ?? "Pending",
    notes: item.notes ?? "Imported from API",
    paymentResponsibility: item.paymentResponsibility ?? item.payment_responsibility ?? "Store/business pays supplier for restocking",
    paymentMethod: item.paymentMethod ?? item.payment_method ?? "Cash",
    paymentStatus: item.paymentStatus ?? item.payment_status ?? "Unpaid",
    paidAt: item.paidAt ?? item.paid_at ?? null,
    createdAt: item.createdAt ?? item.created_at ?? new Date().toISOString()
  }));
}

function normalizeProductRequest(item) {
  return {
    id: String(item.id ?? makeId()),
    requester: item.requester ?? item.requester_name ?? item.requester?.name ?? "Staff User",
    productId: String(item.productId ?? item.product_id ?? ""),
    productName: item.productName ?? item.product_name ?? item.product?.name ?? "Unknown Product",
    supplier: item.supplier ?? item.supplier_name ?? item.supplier?.name ?? "Unknown Supplier",
    quantity: Number(item.quantity ?? item.qty ?? 0),
    neededBy: item.neededBy ?? item.needed_by ?? null,
    reason: item.reason ?? "Product replenishment request",
    status: item.status ?? "Pending",
    reviewedBy: item.reviewedBy ?? item.reviewed_by ?? null,
    reviewedAt: item.reviewedAt ?? item.reviewed_at ?? null,
    managerNote: item.managerNote ?? item.manager_note ?? "",
    purchaseOrderId: item.purchaseOrderId ?? item.purchase_order_id ?? null,
    purchaseOrderNumber: item.purchaseOrderNumber ?? item.purchase_order_number ?? null,
    createdAt: item.createdAt ?? item.created_at ?? new Date().toISOString()
  };
}

function nextPurchaseOrderNumber() {
  const next = state.purchaseOrders.length + 1001;
  return `PO-${next}`;
}

function setDefaultPurchaseOrderDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  setExpectedDate(date);
}

function initializeDateControl() {
  els.expectedMonth.innerHTML = monthNames.map((month, index) => `
    <option value="${index}">${month}</option>
  `).join("");

  const year = new Date().getFullYear();
  els.expectedYear.innerHTML = Array.from({ length: 6 }, (_, index) => year + index).map((value) => `
    <option value="${value}">${value}</option>
  `).join("");

  setDefaultPurchaseOrderDate();
}

function setExpectedDate(date) {
  const safeDate = new Date(date);
  els.expectedMonth.value = safeDate.getMonth();
  els.expectedYear.value = safeDate.getFullYear();
  populateExpectedDays(safeDate.getDate());
  syncExpectedDate();
}

function populateExpectedDays(preferredDay = 1) {
  const month = Number(els.expectedMonth.value);
  const year = Number(els.expectedYear.value);
  const days = new Date(year, month + 1, 0).getDate();
  const day = Math.min(preferredDay, days);

  els.expectedDay.innerHTML = Array.from({ length: days }, (_, index) => index + 1).map((value) => `
    <option value="${value}">${value}</option>
  `).join("");
  els.expectedDay.value = day;
}

function syncExpectedDate() {
  const currentDay = Number(els.expectedDay.value || 1);
  populateExpectedDays(currentDay);
  const date = new Date(Number(els.expectedYear.value), Number(els.expectedMonth.value), Number(els.expectedDay.value));
  els.expectedDate.value = date.toISOString().slice(0, 10);
}

function applyDateShortcut(shortcut) {
  const date = new Date();

  if (shortcut === "month-end") {
    date.setMonth(date.getMonth() + 1, 0);
  } else {
    date.setDate(date.getDate() + Number(shortcut));
  }

  setExpectedDate(date);
}

function hydrateDemoPurchaseOrders() {
  return structuredClone(demoPurchaseOrders).map((order) => {
    const product = demoProducts.find((item) => item.name === order.productName);
    return { ...order, productId: product ? product.id : null };
  });
}

function hydrateDemoProductRequests() {
  return structuredClone(demoProductRequests).map((request) => {
    const product = demoProducts.find((item) => item.name === request.productName);
    return { ...request, productId: product ? product.id : null };
  });
}

function ensureStateShape() {
  if (!Array.isArray(state.suppliers)) state.suppliers = structuredClone(demoSuppliers);
  if (!Array.isArray(state.purchaseOrders)) state.purchaseOrders = hydrateDemoPurchaseOrders();
  if (!Array.isArray(state.productRequests)) state.productRequests = hydrateDemoProductRequests();
}

function empty(message) {
  return `<p class="empty-state">${escapeHtml(message)}</p>`;
}

function clean(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function titleCase(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(23, 59, 59, 999);
  return date;
}

initializeDateControl();
render();
loadFromApi();
