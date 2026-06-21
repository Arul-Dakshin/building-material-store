/* ============================================================
   Venkatesan Agency — interactivity
   Cart + WhatsApp ordering (no backend required)
   ============================================================ */

const WHATSAPP_NUMBER = "919003212728"; // +91 90032 12728

/* ---- Product catalogue ---- */
const PRODUCTS = [
  {
    id: "bricks",
    name: "Red Bricks",
    tag: "Kiln-fired",
    desc: "Strong, well-fired clay bricks with sharp edges — ideal for solid load-bearing walls.",
    img: "images/bricks.jpg",
    unit: "nos",
    units: ["nos", "1000s", "lorry load"],
  },
  {
    id: "cement",
    name: "Cement",
    tag: "Trusted brands",
    desc: "Fresh-stock OPC & PPC cement (50 kg bags) from leading, reliable brands.",
    img: "images/cement.jpg",
    unit: "bags",
    units: ["bags", "tonnes"],
  },
  {
    id: "blue-metal",
    name: "Blue Metal",
    tag: "Graded aggregate",
    desc: "Hard crushed granite aggregate (20mm / 40mm) for concrete and foundations.",
    img: "images/blue-metal.jpg",
    unit: "cft",
    units: ["cft", "lorry load", "tonnes"],
  },
  {
    id: "m-sand",
    name: "M Sand",
    tag: "For concrete",
    desc: "Manufactured sand — consistent grade, perfect for concreting and block work.",
    img: "images/m-sand.jpg",
    unit: "cft",
    units: ["cft", "lorry load", "tonnes"],
  },
  {
    id: "p-sand",
    name: "P Sand",
    tag: "For plastering",
    desc: "Fine plastering sand for smooth, crack-free wall finishes.",
    img: "images/p-sand.jpg",
    unit: "cft",
    units: ["cft", "lorry load", "tonnes"],
  },
  {
    id: "river-sand",
    name: "River Sand",
    tag: "Natural",
    desc: "Naturally sourced, well-washed river sand for premium concrete & plaster.",
    img: "images/river-sand.jpg",
    unit: "cft",
    units: ["cft", "lorry load", "tonnes"],
  },
  {
    id: "chips",
    name: "Stone Chips",
    tag: "Graded",
    desc: "Clean, graded stone chips for flooring, terrace work and concrete mixes.",
    img: "images/chips.jpg",
    unit: "cft",
    units: ["cft", "bags", "lorry load"],
  },
];

/* ---- State ---- */
const cart = {}; // id -> { qty, unit }

/* ---- DOM helpers ---- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ============================================================
   Render product cards
   ============================================================ */
function renderProducts() {
  const grid = $("#productGrid");
  grid.innerHTML = PRODUCTS.map(
    (p) => `
    <article class="card reveal" data-id="${p.id}">
      <div class="card__media">
        <span class="card__tag">${p.tag}</span>
        <img src="${p.img}" alt="${p.name} — building material" loading="lazy"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23f1f5f9%22/%3E%3Ctext x=%22200%22 y=%22155%22 font-size=%2220%22 fill=%22%2394a3b8%22 text-anchor=%22middle%22 font-family=%22Arial%22%3E${encodeURIComponent(p.name)}%3C/text%3E%3C/svg%3E'" />
      </div>
      <div class="card__body">
        <h3 class="card__title">${p.name}</h3>
        <p class="card__desc">${p.desc}</p>
      </div>
      <div class="card__foot">
        <span class="card__unit">by <b>${p.unit}</b></span>
        <button class="add-btn" data-add="${p.id}">+ Add to Order</button>
      </div>
    </article>`
  ).join("");

  $$("[data-add]").forEach((btn) =>
    btn.addEventListener("click", () => addToCart(btn.dataset.add, btn))
  );
  observeReveals();
}

/* ============================================================
   Cart logic
   ============================================================ */
function addToCart(id, btn) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!cart[id]) cart[id] = { qty: 1, unit: p.units[0] };
  else cart[id].qty += 1;

  renderCart();
  updateCount();
  showToast(`${p.name} added to your order`);

  if (btn) {
    btn.classList.add("added");
    btn.textContent = "✓ Added";
    setTimeout(() => {
      btn.classList.remove("added");
      btn.textContent = "+ Add to Order";
    }, 1300);
  }
}

function setQty(id, qty) {
  qty = Math.max(1, parseInt(qty || 1, 10));
  if (cart[id]) cart[id].qty = qty;
  renderCart();
  updateCount();
}

function setUnit(id, unit) {
  if (cart[id]) cart[id].unit = unit;
}

function removeItem(id) {
  delete cart[id];
  renderCart();
  updateCount();
}

function updateCount() {
  const n = Object.keys(cart).length;
  $("#cartCount").textContent = n;
}

function renderCart() {
  const wrap = $("#cartItems");
  const empty = $("#cartEmpty");
  const ids = Object.keys(cart);

  empty.style.display = ids.length ? "none" : "block";

  wrap.innerHTML = ids
    .map((id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      const item = cart[id];
      const options = p.units
        .map((u) => `<option value="${u}" ${u === item.unit ? "selected" : ""}>${u}</option>`)
        .join("");
      return `
      <div class="cart-item" data-id="${id}">
        <img class="cart-item__img" src="${p.img}" alt="${p.name}"
             onerror="this.style.visibility='hidden'" />
        <div class="cart-item__main">
          <div class="cart-item__name">${p.name}</div>
          <div class="cart-item__controls">
            <span class="qty">
              <button data-dec="${id}" aria-label="Decrease">−</button>
              <input type="number" min="1" value="${item.qty}" data-qty="${id}" aria-label="Quantity" />
              <button data-inc="${id}" aria-label="Increase">+</button>
            </span>
            <select class="cart-item__unit" data-unit="${id}">${options}</select>
            <button class="cart-item__remove" data-remove="${id}">Remove</button>
          </div>
        </div>
      </div>`;
    })
    .join("");

  // wire controls
  $$("[data-inc]").forEach((b) => (b.onclick = () => setQty(b.dataset.inc, cart[b.dataset.inc].qty + 1)));
  $$("[data-dec]").forEach((b) => (b.onclick = () => setQty(b.dataset.dec, cart[b.dataset.dec].qty - 1)));
  $$("[data-qty]").forEach((i) => (i.onchange = () => setQty(i.dataset.qty, i.value)));
  $$("[data-unit]").forEach((s) => (s.onchange = () => setUnit(s.dataset.unit, s.value)));
  $$("[data-remove]").forEach((b) => (b.onclick = () => removeItem(b.dataset.remove)));
}

/* ============================================================
   Build WhatsApp order message
   ============================================================ */
function buildMessage() {
  const name = $("#nameInput").value.trim();
  const address = $("#addressInput").value.trim();
  const other = $("#otherInput").value.trim();
  const ids = Object.keys(cart);

  let msg = "Hello Venkatesan Agency! 👋\nI'd like to place an order:\n";

  if (ids.length) {
    msg += "\n*🧱 Materials:*\n";
    ids.forEach((id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      msg += `• ${p.name} — ${cart[id].qty} ${cart[id].unit}\n`;
    });
  }
  if (other) msg += `\n*📦 Other materials:*\n${other}\n`;

  msg += `\n*👤 Name:* ${name || "-"}`;
  msg += `\n*📍 Delivery address:*\n${address}`;
  msg += `\n\nPlease confirm availability & price. Thank you!`;

  return msg;
}

function sendOrder() {
  const address = $("#addressInput").value.trim();
  const hasItems = Object.keys(cart).length > 0;
  const hasOther = $("#otherInput").value.trim().length > 0;

  // need at least something to order
  if (!hasItems && !hasOther) {
    showToast("Add a material or type your request first");
    return;
  }
  // address required
  const field = $("#addressInput").closest(".drawer__field");
  if (!address) {
    field.classList.add("invalid");
    $("#addressInput").focus();
    return;
  }
  field.classList.remove("invalid");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
  window.open(url, "_blank");
}

/* Quick-order link (hero / fab / contact) — opens WhatsApp with a generic greeting */
function quickOrderUrl() {
  const ids = Object.keys(cart);
  if (ids.length || $("#otherInput").value.trim()) {
    // if they already built an order, reuse it (address optional here)
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
  }
  const greeting =
    "Hello Venkatesan Agency! 👋 I'd like to enquire about building materials. My requirement:";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(greeting)}`;
}

/* ============================================================
   Drawer
   ============================================================ */
function openDrawer() {
  $("#drawer").classList.add("open");
  $("#drawerOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  $("#drawer").classList.remove("open");
  $("#drawerOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* ============================================================
   Toast
   ============================================================ */
let toastTimer;
function showToast(text) {
  const t = $("#toast");
  t.innerHTML = `<span class="toast__dot"></span>${text}`;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

/* ============================================================
   Scroll reveal
   ============================================================ */
let revealObserver;
function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
  }
  $$(".reveal:not(.in)").forEach((el) => revealObserver.observe(el));
}

/* ============================================================
   Init
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  observeReveals();

  $("#year").textContent = new Date().getFullYear();

  // nav scroll state
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // mobile menu
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    links.classList.toggle("open");
  });
  $$("#navLinks a").forEach((a) =>
    a.addEventListener("click", () => {
      toggle.classList.remove("open");
      links.classList.remove("open");
    })
  );

  // cart open/close
  $("#cartBtn").addEventListener("click", openDrawer);
  $("#drawerClose").addEventListener("click", closeDrawer);
  $("#drawerOverlay").addEventListener("click", closeDrawer);
  $("#sendOrderBtn").addEventListener("click", sendOrder);
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeDrawer());

  // "request other material" -> open drawer & focus the textarea
  $("#requestOtherBtn").addEventListener("click", () => {
    openDrawer();
    setTimeout(() => $("#otherInput").focus(), 350);
  });

  // quick WhatsApp links — refresh href just before navigating
  ["#heroWhatsApp", "#fabWhatsApp", "#contactWhatsApp"].forEach((sel) => {
    const el = $(sel);
    if (el)
      el.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(quickOrderUrl(), "_blank");
      });
  });
});
