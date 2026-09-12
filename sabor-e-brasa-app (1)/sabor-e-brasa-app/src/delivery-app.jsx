import { useState, useEffect, useRef, useCallback } from "react";
import {
  Flame, IceCream, ShoppingCart, User, Star, Gift, Tag, Heart, MessageSquare,
  QrCode, Users, Lock, LayoutDashboard, Package, ClipboardList, Bell, LogOut,
  Plus, Minus, Trash2, Pencil, Check, X, ChevronLeft, MapPin, Phone, Clock,
  TrendingUp, DollarSign, ShoppingBag, AlertCircle, Loader2, Home as HomeIcon,
  Share2, BadgeCheck, RefreshCw
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { db } from "./firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

/* =========================================================================
   BRANDS / THEME
   ========================================================================= */
const BRANDS = {
  sabor: {
    id: "sabor",
    name: "Sabor & Brasa",
    tagline: "Hamburgueria",
    icon: Flame,
    bg: "#0a0806",
    panel: "#151009",
    accent: "#e8321f",
    accent2: "#f7941d",
    gold: "#f2c14e",
    text: "#f5ede1",
    sub: "#c9a97a",
    deliveryFeeKey: "fee-sabor",
    categories: ["Todos", "Hambúrgueres", "Adicionais"],
  },
  neve: {
    id: "neve",
    name: "Neve e Sabor",
    tagline: "Sorveteria / Açaí",
    icon: IceCream,
    bg: "#0b0714",
    panel: "#160f26",
    accent: "#ff6f3c",
    accent2: "#b455ff",
    gold: "#ffd166",
    text: "#f3ecff",
    sub: "#c3aee0",
    deliveryFeeKey: "fee-neve",
    categories: ["Todos", "Açaí", "Adicionais"],
  },
};

/* =========================================================================
   SEED DATA — apenas itens reais fornecidos (nada inventado)
   ========================================================================= */
const SEED_PRODUCTS_SABOR = [
  { id: "sb-trad", name: "Tradicional Burguer", desc: "Hambúrguer 100g, queijo mussarela, alface", price: 12, category: "Hambúrgueres", available: true, image: "" },
  { id: "sb-chef", name: "Do Cheff", desc: "Carne de costela, queijo mussarela, molho especial", price: 15, category: "Hambúrgueres", available: true, image: "" },
  { id: "sb-lord", name: "Lord Burguer", desc: "Hambúrguer 100g, queijo mussarela, banana", price: 15, category: "Hambúrgueres", available: true, image: "" },
  { id: "sb-beef", name: "Beef Burguer", desc: "Carne de costela, queijo cheddar, ovo, alface", price: 18, category: "Hambúrgueres", available: true, image: "" },
  { id: "sb-big", name: "Big Burguer", desc: "Hambúrguer 100g, queijo mussarela, tomate, alface, molho especial", price: 15, category: "Hambúrgueres", available: true, image: "" },
  { id: "sb-gourmet", name: "Gourmet Burguer", desc: "Hambúrguer 100g, queijo mussarela, abacaxi, tomate, alface", price: 18, category: "Hambúrgueres", available: true, image: "" },
  { id: "sb-kids", name: "Kids Burguer", desc: "Hambúrguer 100g, queijo mussarela", price: 10, category: "Hambúrgueres", available: true, image: "" },
  { id: "sb-rib", name: "Rib Gourmet", desc: "Carne de costela, queijo mussarela, cebola caramelizada", price: 18, category: "Hambúrgueres", available: true, image: "" },
  { id: "sb-especial", name: "Especial Burguer", desc: "Hambúrguer 100g, queijo cheddar, bacon", price: 20, category: "Hambúrgueres", available: true, image: "" },
  { id: "sb-raiz", name: "Raiz Burguer", desc: "2 Hambúrguer 100g, queijo mussarela, banana, tomate, alface", price: 18, category: "Hambúrgueres", available: true, image: "" },
  { id: "sb-smashdone", name: "Smash Done", desc: "Hambúrguer 100g, queijo cheddar, bacon, molho especial", price: 20, category: "Hambúrgueres", available: true, image: "" },
  { id: "sb-smashbig", name: "Smash Big", desc: "Hambúrguer 100g, queijo empanado, cebola caramelizada, carne costela, molho especial", price: 30, category: "Hambúrgueres", available: true, image: "" },
];

const SABOR_ADDONS = [
  { id: "ad-cebola", name: "Cebola caramelizada", price: 4 },
  { id: "ad-empanado", name: "Queijo empanado", price: 10 },
  { id: "ad-mussarela", name: "Queijo mussarela", price: 4 },
  { id: "ad-cheddar", name: "Queijo cheddar", price: 4 },
  { id: "ad-banana", name: "Banana", price: 3 },
  { id: "ad-ovo", name: "Ovo", price: 2 },
  { id: "ad-bacon", name: "Bacon", price: 5 },
  { id: "ad-carne", name: "Carne 100g", price: 6 },
  { id: "ad-abacaxi", name: "Abacaxi", price: 5 },
];

const SEED_PRODUCTS_NEVE = [
  { id: "nv-acai-300", name: "Açaí 300ml", desc: "Açaí tradicional, 300ml", price: 14, category: "Açaí", available: true, image: "" },
  { id: "nv-acai-400", name: "Açaí 400ml", desc: "Açaí tradicional, 400ml", price: 18, category: "Açaí", available: true, image: "" },
  { id: "nv-acai-500", name: "Açaí 500ml", desc: "Açaí tradicional, 500ml", price: 22, category: "Açaí", available: true, image: "" },
];

const NEVE_ADDONS = [
  { id: "na-sucrilhos", name: "Sucrilhos", price: 0 },
  { id: "na-amendoim", name: "Amendoim", price: 0 },
  { id: "na-chocobol", name: "Chocobol", price: 0 },
  { id: "na-leiteninho", name: "Leite Ninho", price: 0 },
  { id: "na-ovomaltine", name: "Ovomaltine", price: 0 },
  { id: "na-banana", name: "Banana", price: 0 },
];

const ADDONS_BY_STORE = { sabor: SABOR_ADDONS, neve: NEVE_ADDONS };
const SEED_BY_STORE = { sabor: SEED_PRODUCTS_SABOR, neve: SEED_PRODUCTS_NEVE };

const STATUS_FLOW = ["recebido", "preparo", "saiu_entrega", "entregue"];
const STATUS_LABEL = {
  recebido: "Pedido recebido",
  preparo: "Em preparação",
  saiu_entrega: "Saiu para entrega",
  entregue: "Entregue",
  cancelado: "Cancelado",
};
const STATUS_DOT = {
  recebido: "#f2c14e",
  preparo: "#3b82f6",
  saiu_entrega: "#f7941d",
  entregue: "#22c55e",
  cancelado: "#ef4444",
};

const ADMIN_PASSWORD = "2024";

/* =========================================================================
   STORAGE HELPERS  (Firebase Firestore = banco de dados central e compartilhado)
   Cada "chave" (customers, orders, products-sabor, ...) vira um documento
   na coleção "appdata", guardado como { value: <array ou objeto> }.
   ========================================================================= */
async function getRemote(key, fallback) {
  try {
    const snap = await getDoc(doc(db, "appdata", key));
    if (!snap.exists() || snap.data().value === undefined) return fallback;
    return snap.data().value;
  } catch (e) {
    console.error("Erro ao ler", key, e);
    return fallback;
  }
}
async function setRemote(key, value) {
  try {
    await setDoc(doc(db, "appdata", key), { value });
    return true;
  } catch (e) {
    console.error("Erro ao salvar", key, e);
    return false;
  }
}
// escuta em tempo real: chama onChange sempre que o documento mudar no Firestore
function watchRemote(key, onChange) {
  return onSnapshot(
    doc(db, "appdata", key),
    (snap) => {
      if (snap.exists() && snap.data().value !== undefined) onChange(snap.data().value);
    },
    (e) => console.error("Erro no listener", key, e)
  );
}

// sessão do dispositivo (login do cliente / login do admin): fica só no navegador,
// não precisa ir para o Firestore
function getLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function setLocal(key, value) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

const money = (n) => `R$ ${Number(n || 0).toFixed(2).replace(".", ",")}`;
const uid = (p = "") => p + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/* =========================================================================
   ROOT APP
   ========================================================================= */
export default function App() {
  const [booted, setBooted] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // dados "de banco" em memória (espelham o storage)
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState({ sabor: [], neve: [] });
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [config, setConfig] = useState({ "fee-sabor": 6, "fee-neve": 5, pointsPerReal: 1, redemptionRate: 100 });

  const [mySession, setMySession] = useState(null); // {phone}
  const [adminSession, setAdminSession] = useState(false);

  const [view, setView] = useState("home"); // home | store | admin-login | admin
  const [activeStore, setActiveStore] = useState(null);
  const [authPrompt, setAuthPrompt] = useState(false);

  // ---- boot: load everything from persistent storage ----
  useEffect(() => {
    (async () => {
      const [c, ps, pn, o, cp, rv, nt, cfg] = await Promise.all([
        getRemote("customers", []),
        getRemote("products-sabor", null),
        getRemote("products-neve", null),
        getRemote("orders", []),
        getRemote("coupons", []),
        getRemote("reviews", []),
        getRemote("admin-notifications", []),
        getRemote("config", null),
      ]);
      const sess = getLocal("my-session", null);
      const adm = getLocal("admin-session", null);

      const saborProducts = ps || SEED_PRODUCTS_SABOR;
      const neveProducts = pn || SEED_PRODUCTS_NEVE;
      if (!ps) await setRemote("products-sabor", saborProducts);
      if (!pn) await setRemote("products-neve", neveProducts);
      const cfgFinal = cfg || { "fee-sabor": 6, "fee-neve": 5, pointsPerReal: 1, redemptionRate: 100 };
      if (!cfg) await setRemote("config", cfgFinal);

      setCustomers(c);
      setProducts({ sabor: saborProducts, neve: neveProducts });
      setOrders(o);
      setCoupons(cp);
      setReviews(rv);
      setNotifications(nt);
      setConfig(cfgFinal);
      if (sess?.phone) setMySession(sess);
      if (adm?.loggedIn) setAdminSession(true);
      setBooted(true);
    })();
  }, []);

  // ---- sincronização em tempo real com o Firestore (substitui o polling) ----
  useEffect(() => {
    if (!booted) return;
    const unsubOrders = watchRemote("orders", (v) => setOrders(v));
    const unsubProdSabor = watchRemote("products-sabor", (v) => setProducts((p) => ({ ...p, sabor: v })));
    const unsubProdNeve = watchRemote("products-neve", (v) => setProducts((p) => ({ ...p, neve: v })));
    const unsubCoupons = watchRemote("coupons", (v) => setCoupons(v));
    const unsubCustomers = watchRemote("customers", (v) => setCustomers(v));
    const unsubNotifications = watchRemote("admin-notifications", (nt) => {
      setNotifications((prev) => {
        if (nt.length > prev.length && view === "admin" && adminSession) {
          try {
            if ("Notification" in window && Notification.permission === "granted") {
              const latest = nt[nt.length - 1];
              new Notification("🔔 Novo pedido recebido!", {
                body: `${latest.customerName} — ${money(latest.total)}`,
              });
            }
          } catch (e) {}
        }
        return nt;
      });
    });
    return () => {
      unsubOrders();
      unsubProdSabor();
      unsubProdNeve();
      unsubCoupons();
      unsubCustomers();
      unsubNotifications();
    };
  }, [booted, view, adminSession]);

  const persist = useCallback(async (key, value, setter) => {
    setter(value);
    const ok = await setRemote(key, value);
    if (!ok) setSaveError(true);
  }, []);

  const saveMySession = async (sess) => {
    setMySession(sess);
    setLocal("my-session", sess);
  };
  const logoutCustomer = async () => {
    setMySession(null);
    setLocal("my-session", null);
    setView("home");
  };
  const loginAdmin = async () => {
    setAdminSession(true);
    setLocal("admin-session", { loggedIn: true, since: Date.now() });
  };
  const logoutAdmin = async () => {
    setAdminSession(false);
    setLocal("admin-session", null);
    setView("home");
  };

  const me = mySession ? customers.find((c) => c.phone === mySession.phone) : null;

  if (!booted) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" color="#f7941d" size={36} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "600px", background: "#050505" }}>
      {saveError && (
        <div style={{ background: "#7f1d1d", color: "#fff", padding: "8px 14px", fontSize: 13, textAlign: "center" }}>
          Não foi possível salvar uma alteração agora. Tente novamente.
          <button onClick={() => setSaveError(false)} style={{ marginLeft: 10, background: "transparent", border: "1px solid #fff", color: "#fff", borderRadius: 6, padding: "1px 8px", cursor: "pointer" }}>ok</button>
        </div>
      )}

      {view === "home" && (
        <Home
          onPickStore={(id) => {
            setActiveStore(id);
            setView("store");
          }}
          onAdmin={() => setView(adminSession ? "admin" : "admin-login")}
        />
      )}

      {view === "store" && activeStore && (
        <StoreApp
          brand={BRANDS[activeStore]}
          products={products[activeStore]}
          addons={ADDONS_BY_STORE[activeStore]}
          config={config}
          me={me}
          mySession={mySession}
          customers={customers}
          orders={orders.filter((o) => o.storeId === activeStore)}
          coupons={coupons.filter((c) => c.storeId === activeStore || c.storeId === "all")}
          reviews={reviews}
          onExit={() => setView("home")}
          requireAuth={() => setAuthPrompt(true)}
          onLogout={logoutCustomer}
          persistCustomers={(v) => persist("customers", v, setCustomers)}
          persistOrders={(v) => persist("orders", v, setOrders)}
          persistNotifications={(v) => persist("admin-notifications", v, setNotifications)}
          persistReviews={(v) => persist("reviews", v, setReviews)}
          allOrders={orders}
          allNotifications={notifications}
        />
      )}

      {authPrompt && (
        <AuthModal
          customers={customers}
          onClose={() => setAuthPrompt(false)}
          onDone={async (customer, isNew) => {
            let next = customers;
            if (isNew) next = [...customers, customer];
            await persist("customers", next, setCustomers);
            await saveMySession({ phone: customer.phone });
            setAuthPrompt(false);
          }}
        />
      )}

      {view === "admin-login" && (
        <AdminLogin onBack={() => setView("home")} onSuccess={() => { loginAdmin(); setView("admin"); }} />
      )}

      {view === "admin" && adminSession && (
        <AdminPanel
          products={products}
          orders={orders}
          customers={customers}
          coupons={coupons}
          reviews={reviews}
          notifications={notifications}
          config={config}
          onExit={() => setView("home")}
          onLogout={logoutAdmin}
          persistProducts={async (storeId, list) => {
            const next = { ...products, [storeId]: list };
            setProducts(next);
            await setRemote(`products-${storeId}`, list);
          }}
          persistOrders={(v) => persist("orders", v, setOrders)}
          persistCoupons={(v) => persist("coupons", v, setCoupons)}
          persistNotifications={(v) => persist("admin-notifications", v, setNotifications)}
          persistConfig={(v) => persist("config", v, setConfig)}
          persistCustomers={(v) => persist("customers", v, setCustomers)}
        />
      )}
    </div>
  );
}

/* =========================================================================
   HOME
   ========================================================================= */
function Home({ onPickStore, onAdmin }) {
  return (
    <div style={{
      background: "radial-gradient(ellipse at 50% -10%, #2a0f05 0%, #0a0806 55%, #050403 100%)",
      minHeight: "600px", padding: "36px 20px 28px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#f2c14e", fontSize: 12, letterSpacing: 1, marginBottom: 10 }}>
          <MapPin size={14} /> Cruzeiro do Sul - AC
        </div>
        <h1 style={{ color: "#f5ede1", fontSize: 30, fontWeight: 800, margin: 0, lineHeight: 1.15 }}>
          Escolha onde vamos<br />matar sua fome hoje
        </h1>
        <p style={{ color: "#c9a97a", marginTop: 8, fontSize: 14 }}>Peça direto pelo app — sem complicação.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 420, margin: "0 auto" }}>
        <StoreCard
          title="Sabor & Brasa" subtitle="Hamburgueria • Espetos"
          bg="linear-gradient(135deg,#1a0904,#3a0f04)" accent="#e8321f" accent2="#f7941d"
          Icon={Flame} onClick={() => onPickStore("sabor")}
        />
        <StoreCard
          title="Neve e Sabor" subtitle="Sorveteria • Açaí"
          bg="linear-gradient(135deg,#150a26,#2a0f3d)" accent="#b455ff" accent2="#ff6f3c"
          Icon={IceCream} onClick={() => onPickStore("neve")}
        />
      </div>

      <button
        onClick={onAdmin}
        style={{
          position: "absolute", bottom: 14, right: 14, background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.15)", color: "#ccc", borderRadius: 20,
          padding: "6px 12px", fontSize: 12, display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
        }}
      >
        <Lock size={12} /> Painel ADM
      </button>
    </div>
  );
}

function StoreCard({ title, subtitle, bg, accent, accent2, Icon, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: bg, border: `1px solid ${hover ? accent2 : "rgba(255,255,255,0.08)"}`,
        borderRadius: 18, padding: "22px 20px", textAlign: "left", cursor: "pointer",
        boxShadow: hover ? `0 0 0 1px ${accent2}55, 0 12px 30px -10px ${accent}77` : "0 8px 20px -12px #000",
        transform: hover ? "translateY(-2px)" : "none", transition: "all .18s ease",
        display: "flex", alignItems: "center", gap: 16,
      }}
    >
      <div style={{
        width: 54, height: 54, borderRadius: 14, background: `linear-gradient(135deg, ${accent}, ${accent2})`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon color="#fff" size={26} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#fff", fontSize: 19, fontWeight: 800 }}>{title}</div>
        <div style={{ color: accent2, fontSize: 13, fontWeight: 600 }}>{subtitle}</div>
      </div>
      <div style={{ color: "#fff8", fontSize: 22 }}>›</div>
    </button>
  );
}

/* =========================================================================
   AUTH MODAL (cliente) — só nome + celular
   ========================================================================= */
function AuthModal({ customers, onClose, onDone }) {
  const [mode, setMode] = useState("login"); // login | register
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ref, setRef] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const p = phone.replace(/\D/g, "");
    if (mode === "login") {
      const found = customers.find((c) => c.phone === p);
      if (!found) { setError("Não encontramos cadastro com esse celular. Cadastre-se."); return; }
      onDone(found, false);
    } else {
      if (!name.trim() || p.length < 8) { setError("Preencha nome e um celular válido."); return; }
      if (customers.find((c) => c.phone === p)) { setError("Esse celular já tem cadastro. Faça login."); return; }
      const referredBy = ref.trim() ? customers.find((c) => c.referralCode === ref.trim().toUpperCase())?.phone : null;
      const customer = {
        name: name.trim(), phone: p, points: referredBy ? 20 : 0,
        favorites: [], coupons: [], referralCode: (name.trim().slice(0, 3) + p.slice(-4)).toUpperCase(),
        referredBy: referredBy || null, createdAt: Date.now(),
      };
      onDone(customer, true);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, maxWidth: 360 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>
            {mode === "login" ? "Entrar" : "Criar cadastro"}
          </div>
          <button onClick={onClose} style={iconBtnStyle}><X size={18} color="#fff" /></button>
        </div>

        {mode === "register" && (
          <Field label="Nome">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" style={inputStyle} />
          </Field>
        )}
        <Field label="Celular">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(68) 9xxxx-xxxx" style={inputStyle} />
        </Field>
        {mode === "register" && (
          <Field label="Código de indicação (opcional)">
            <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Ex: ABC1234" style={inputStyle} />
          </Field>
        )}

        {error && <div style={{ color: "#ff8a8a", fontSize: 13, marginBottom: 10 }}>{error}</div>}

        <button onClick={submit} style={primaryBtnStyle("#e8321f", "#f7941d")}>
          {mode === "login" ? "Entrar" : "Criar cadastro"}
        </button>

        <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#aaa" }}>
          {mode === "login" ? (
            <>Ainda não tem conta? <a onClick={() => { setMode("register"); setError(""); }} style={linkStyle}>Cadastre-se</a></>
          ) : (
            <>Já tem conta? <a onClick={() => { setMode("login"); setError(""); }} style={linkStyle}>Entrar</a></>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   STORE APP (área do cliente dentro de uma loja)
   ========================================================================= */
function StoreApp(props) {
  const { brand, products, addons, config, me, mySession, requireAuth, onExit, onLogout,
    persistCustomers, persistOrders, persistNotifications, persistReviews, customers, allOrders, allNotifications, coupons } = props;

  const [tab, setTab] = useState("cardapio"); // cardapio | perfil
  const [category, setCategory] = useState("Todos");
  const [cart, setCart] = useState([]);
  const [productModal, setProductModal] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null);

  const filtered = products.filter((p) => category === "Todos" || p.category === category);
  const cartTotal = cart.reduce((s, i) => s + i.lineTotal, 0);
  const feeKey = brand.deliveryFeeKey;

  const addToCart = (item) => setCart((c) => [...c, item]);
  const removeFromCart = (idx) => setCart((c) => c.filter((_, i) => i !== idx));

  const placeOrder = async ({ deliveryType, paymentMethod, changeFor, couponCode }) => {
    const deliveryFee = deliveryType === "delivery" ? (config[feeKey] ?? 5) : 0;
    let discount = 0;
    const coupon = coupons.find((c) => c.code === couponCode && c.active);
    if (coupon) discount = coupon.type === "percent" ? (cartTotal * coupon.value) / 100 : coupon.value;
    const total = Math.max(0, cartTotal + deliveryFee - discount);
    const pointsEarned = Math.floor(total * (config.pointsPerReal ?? 1));

    const order = {
      id: uid("PED-"), storeId: brand.id, customerPhone: me.phone, customerName: me.name,
      items: cart, subtotal: cartTotal, deliveryFee, discount, couponCode: coupon ? coupon.code : null,
      total, deliveryType, paymentMethod, changeFor: changeFor || null,
      status: "recebido", pointsEarned, createdAt: Date.now(),
      statusHistory: [{ status: "recebido", at: Date.now() }],
    };

    await persistOrders([...allOrders, order]);

    let nextCustomers = customers.map((c) =>
      c.phone === me.phone ? { ...c, points: (c.points || 0) + pointsEarned } : c
    );
    if (me.referredBy) {
      nextCustomers = nextCustomers.map((c) =>
        c.phone === me.referredBy && !me.referralBonusGiven ? { ...c, points: (c.points || 0) + 30 } : c
      );
      nextCustomers = nextCustomers.map((c) => (c.phone === me.phone ? { ...c, referralBonusGiven: true } : c));
    }
    await persistCustomers(nextCustomers);

    await persistNotifications([
      ...allNotifications,
      { id: uid("N-"), orderId: order.id, storeId: brand.id, customerName: me.name, total, time: Date.now(), read: false },
    ]);

    setCart([]);
    setCheckoutOpen(false);
    setLastOrder(order);
  };

  return (
    <div style={{ background: brand.bg, minHeight: "600px", color: brand.text, paddingBottom: 70, position: "relative" }}>
      {/* header */}
      <div style={{ padding: "16px 16px 10px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 5, background: `${brand.bg}ee`, backdropFilter: "blur(6px)" }}>
        <button onClick={onExit} style={iconBtnStyle}><ChevronLeft color={brand.text} size={20} /></button>
        <brand.icon size={20} color={brand.accent} />
        <div style={{ fontWeight: 800, fontSize: 17 }}>{brand.name}</div>
        <div style={{ flex: 1 }} />
        {me && (
          <button onClick={() => setCartOpen(true)} style={{ ...iconBtnStyle, position: "relative" }}>
            <ShoppingCart color={brand.text} size={20} />
            {cart.length > 0 && (
              <span style={{ position: "absolute", top: -2, right: -2, background: brand.accent, color: "#fff", fontSize: 10, borderRadius: 10, padding: "1px 5px" }}>{cart.length}</span>
            )}
          </button>
        )}
      </div>

      {!me && (
        <div style={{ margin: "8px 16px", padding: "10px 14px", background: "rgba(255,255,255,0.06)", borderRadius: 12, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Entre para pedir e acumular pontos.</span>
          <button onClick={requireAuth} style={primaryBtnStyle(brand.accent, brand.accent2, true)}>Entrar</button>
        </div>
      )}

      {tab === "cardapio" && (
        <>
          <div style={{ display: "flex", gap: 8, padding: "6px 16px 4px", overflowX: "auto" }}>
            {brand.categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding: "7px 14px", borderRadius: 20, whiteSpace: "nowrap", fontSize: 13, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${category === c ? brand.accent2 : "rgba(255,255,255,0.15)"}`,
                background: category === c ? `linear-gradient(135deg, ${brand.accent}, ${brand.accent2})` : "transparent",
                color: category === c ? "#fff" : brand.sub,
              }}>{c}</button>
            ))}
          </div>

          <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {category === "Adicionais" ? (
              addons.map((a) => (
                <div key={a.id} style={{ background: brand.panel, borderRadius: 14, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600 }}>{a.name}</span>
                  <span style={{ color: brand.accent2, fontWeight: 700 }}>{a.price > 0 ? money(a.price) : "incluso"}</span>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <EmptyState text="Nenhum produto cadastrado nesta categoria ainda." />
            ) : (
              filtered.map((p) => (
                <ProductRow key={p.id} p={p} brand={brand} me={me}
                  fav={me?.favorites?.includes(p.id)}
                  onToggleFav={async () => {
                    if (!me) return requireAuth();
                    const has = me.favorites?.includes(p.id);
                    const next = customers.map((c) => c.phone === me.phone
                      ? { ...c, favorites: has ? c.favorites.filter((f) => f !== p.id) : [...(c.favorites || []), p.id] }
                      : c);
                    await persistCustomers(next);
                  }}
                  onOpen={() => (me ? setProductModal(p) : requireAuth())}
                />
              ))
            )}
          </div>
        </>
      )}

      {tab === "perfil" && me && (
        <ProfileTab
          me={me} brand={brand} orders={allOrders.filter((o) => o.customerPhone === me.phone)}
          products={products} coupons={coupons} config={config}
          onLogout={onLogout}
          onReview={(order) => setReviewOrder(order)}
          reviewedIds={props.reviews.filter((r) => r.customerPhone === me.phone).map((r) => r.orderId)}
        />
      )}
      {tab === "perfil" && !me && (
        <div style={{ padding: 40, textAlign: "center" }}>
          <User size={40} color={brand.sub} />
          <p style={{ color: brand.sub, marginTop: 10 }}>Entre para ver seu perfil.</p>
          <button onClick={requireAuth} style={primaryBtnStyle(brand.accent, brand.accent2)}>Entrar</button>
        </div>
      )}

      {/* bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
        background: brand.panel, borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex", padding: "8px 0", zIndex: 10,
      }}>
        <NavBtn label="Cardápio" active={tab === "cardapio"} Icon={HomeIcon} onClick={() => setTab("cardapio")} color={brand.accent2} textColor={brand.text} />
        <NavBtn label="Perfil" active={tab === "perfil"} Icon={User} onClick={() => setTab("perfil")} color={brand.accent2} textColor={brand.text} />
      </div>

      {/* product modal */}
      {productModal && (
        <ProductModal p={productModal} addons={addons} brand={brand}
          onClose={() => setProductModal(null)}
          onAdd={(item) => { addToCart(item); setProductModal(null); }}
        />
      )}

      {/* cart drawer */}
      {cartOpen && (
        <CartDrawer cart={cart} brand={brand} onRemove={removeFromCart} onClose={() => setCartOpen(false)}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} total={cartTotal} />
      )}

      {/* checkout */}
      {checkoutOpen && (
        <CheckoutModal brand={brand} me={me} cart={cart} cartTotal={cartTotal} config={config} feeKey={feeKey}
          coupons={coupons} onClose={() => setCheckoutOpen(false)} onConfirm={placeOrder} />
      )}

      {/* order success */}
      {lastOrder && (
        <OrderSuccess brand={brand} order={lastOrder} onClose={() => setLastOrder(null)} />
      )}

      {/* review modal */}
      {reviewOrder && (
        <ReviewModal brand={brand} order={reviewOrder} onClose={() => setReviewOrder(null)}
          onSubmit={async (review) => {
            await persistReviews([...props.reviews, { id: uid("R-"), customerPhone: me.phone, orderId: reviewOrder.id, storeId: brand.id, createdAt: Date.now(), ...review }]);
            setReviewOrder(null);
          }} />
      )}
    </div>
  );
}

function NavBtn({ label, active, Icon, onClick, color, textColor }) {
  return (
    <button onClick={onClick} style={{ flex: 1, background: "transparent", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
      <Icon size={20} color={active ? color : `${textColor}88`} />
      <span style={{ fontSize: 11, color: active ? color : `${textColor}88`, fontWeight: active ? 700 : 500 }}>{label}</span>
    </button>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ textAlign: "center", padding: "30px 10px", color: "#ffffff77", fontSize: 13 }}>
      <AlertCircle size={22} style={{ marginBottom: 6 }} />
      <div>{text}</div>
    </div>
  );
}

function ProductRow({ p, brand, onOpen, fav, onToggleFav }) {
  return (
    <div style={{ background: brand.panel, borderRadius: 16, padding: 12, display: "flex", gap: 12, opacity: p.available ? 1 : 0.5 }}>
      <div onClick={onOpen} style={{
        width: 72, height: 72, borderRadius: 12, flexShrink: 0, cursor: "pointer",
        background: p.image ? `url(${p.image}) center/cover` : `linear-gradient(135deg, ${brand.accent}55, ${brand.accent2}55)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {!p.image && <brand.icon size={26} color="#fff9" />}
      </div>
      <div style={{ flex: 1, cursor: "pointer" }} onClick={onOpen}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
        <div style={{ fontSize: 12.5, color: brand.sub, marginTop: 2 }}>{p.desc}</div>
        <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: brand.accent2, fontWeight: 800 }}>{money(p.price)}</span>
          {!p.available && <span style={{ fontSize: 11, color: "#ff8a8a" }}>Indisponível</span>}
        </div>
      </div>
      <button onClick={onToggleFav} style={{ background: "transparent", border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
        <Heart size={18} color={fav ? brand.accent : "#ffffff55"} fill={fav ? brand.accent : "none"} />
      </button>
    </div>
  );
}

function ProductModal({ p, addons, brand, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState([]);
  const toggle = (a) => setSelected((s) => (s.find((x) => x.id === a.id) ? s.filter((x) => x.id !== a.id) : [...s, a]));
  const unit = p.price + selected.reduce((s, a) => s + a.price, 0);

  return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, maxWidth: 400 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>{p.name}</div>
          <button onClick={onClose} style={iconBtnStyle}><X size={18} color="#fff" /></button>
        </div>
        <div style={{
          height: 130, borderRadius: 12, marginBottom: 12,
          background: p.image ? `url(${p.image}) center/cover` : `linear-gradient(135deg, ${brand.accent}55, ${brand.accent2}55)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{!p.image && <brand.icon size={40} color="#fff9" />}</div>
        <p style={{ color: "#ccc", fontSize: 13.5 }}>{p.desc}</p>

        {addons.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 13, marginBottom: 6 }}>Adicionais</div>
            {addons.map((a) => (
              <label key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #ffffff12", cursor: "pointer" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#eee", fontSize: 13.5 }}>
                  <input type="checkbox" checked={!!selected.find((x) => x.id === a.id)} onChange={() => toggle(a)} />
                  {a.name}
                </span>
                <span style={{ color: brand.accent2, fontSize: 13 }}>{a.price > 0 ? `+${money(a.price)}` : "grátis"}</span>
              </label>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#ffffff12", borderRadius: 10, padding: "4px 10px" }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtn}><Minus size={14} color="#fff" /></button>
            <span style={{ color: "#fff", fontWeight: 700, minWidth: 16, textAlign: "center" }}>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} style={qtyBtn}><Plus size={14} color="#fff" /></button>
          </div>
          <button
            onClick={() => onAdd({ id: uid("it-"), productId: p.id, name: p.name, qty, addons: selected, unitPrice: unit, lineTotal: unit * qty })}
            style={primaryBtnStyle(brand.accent, brand.accent2)}
          >
            Adicionar • {money(unit * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, brand, onRemove, onClose, onCheckout, total }) {
  return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, maxWidth: 400 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>Seu carrinho</div>
          <button onClick={onClose} style={iconBtnStyle}><X size={18} color="#fff" /></button>
        </div>
        {cart.length === 0 ? <EmptyState text="Seu carrinho está vazio." /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 300, overflowY: "auto" }}>
            {cart.map((it, idx) => (
              <div key={it.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "#ffffff0c", borderRadius: 10, padding: 10 }}>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 13.5 }}>{it.qty}x {it.name}</div>
                  {it.addons.length > 0 && <div style={{ color: "#bbb", fontSize: 11.5 }}>{it.addons.map((a) => a.name).join(", ")}</div>}
                  <div style={{ color: brand.accent2, fontWeight: 700, fontSize: 13, marginTop: 3 }}>{money(it.lineTotal)}</div>
                </div>
                <button onClick={() => onRemove(idx)} style={iconBtnStyle}><Trash2 size={16} color="#ff8a8a" /></button>
              </div>
            ))}
          </div>
        )}
        {cart.length > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, color: "#fff", fontWeight: 700 }}>
              <span>Subtotal</span><span>{money(total)}</span>
            </div>
            <button onClick={onCheckout} style={{ ...primaryBtnStyle(brand.accent, brand.accent2), width: "100%", marginTop: 12 }}>Continuar</button>
          </>
        )}
      </div>
    </div>
  );
}

function CheckoutModal({ brand, me, cart, cartTotal, config, feeKey, coupons, onClose, onConfirm }) {
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [changeFor, setChangeFor] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState("");

  const fee = deliveryType === "delivery" ? (config[feeKey] ?? 5) : 0;
  const coupon = coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);
  const discount = coupon ? (coupon.type === "percent" ? (cartTotal * coupon.value) / 100 : coupon.value) : 0;
  const total = Math.max(0, cartTotal + fee - discount);

  const applyCoupon = () => {
    if (!couponCode.trim()) return;
    setCouponMsg(coupon ? `Cupom aplicado: -${money(discount)}` : "Cupom inválido ou expirado.");
  };

  return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, maxWidth: 400 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>Finalizar pedido</div>
          <button onClick={onClose} style={iconBtnStyle}><X size={18} color="#fff" /></button>
        </div>

        <div style={{ color: "#ddd", fontSize: 13, marginBottom: 10 }}>{me.name} • {me.phone}</div>

        <Field label="Entrega">
          <div style={{ display: "flex", gap: 8 }}>
            {["delivery", "retirada"].map((d) => (
              <button key={d} onClick={() => setDeliveryType(d)} style={pillBtn(deliveryType === d, brand)}>
                {d === "delivery" ? "Delivery" : "Retirada"}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Pagamento">
          <div style={{ display: "flex", gap: 8 }}>
            {["pix", "cartao", "dinheiro"].map((p) => (
              <button key={p} onClick={() => setPaymentMethod(p)} style={pillBtn(paymentMethod === p, brand)}>
                {p === "pix" ? "PIX" : p === "cartao" ? "Cartão" : "Dinheiro"}
              </button>
            ))}
          </div>
        </Field>

        {paymentMethod === "dinheiro" && (
          <Field label="Troco para quanto?">
            <input value={changeFor} onChange={(e) => setChangeFor(e.target.value)} placeholder="Ex: 50" style={inputStyle} />
          </Field>
        )}

        <Field label="Cupom">
          <div style={{ display: "flex", gap: 8 }}>
            <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Código" style={{ ...inputStyle, flex: 1 }} />
            <button onClick={applyCoupon} style={primaryBtnStyle(brand.accent, brand.accent2, true)}>Aplicar</button>
          </div>
          {couponMsg && <div style={{ fontSize: 12, marginTop: 4, color: discount > 0 ? "#7CFC00" : "#ff8a8a" }}>{couponMsg}</div>}
        </Field>

        <div style={{ borderTop: "1px solid #ffffff1a", marginTop: 10, paddingTop: 10 }}>
          <Row label="Subtotal" value={money(cartTotal)} />
          <Row label="Taxa de entrega" value={money(fee)} />
          {discount > 0 && <Row label="Desconto" value={`-${money(discount)}`} />}
          <Row label="Total" value={money(total)} bold />
        </div>

        <button
          onClick={() => onConfirm({ deliveryType, paymentMethod, changeFor, couponCode: coupon ? coupon.code : null })}
          style={{ ...primaryBtnStyle(brand.accent, brand.accent2), width: "100%", marginTop: 14 }}
        >
          Confirmar pedido
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", color: bold ? "#fff" : "#ccc", fontWeight: bold ? 800 : 500, fontSize: bold ? 15 : 13, padding: "3px 0" }}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

function OrderSuccess({ brand, order, onClose }) {
  return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, maxWidth: 360, textAlign: "center" }}>
        <BadgeCheck size={48} color="#22c55e" style={{ margin: "0 auto 10px" }} />
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Pedido enviado!</div>
        <p style={{ color: "#ccc", fontSize: 13, marginTop: 6 }}>
          Pedido {order.id} • {money(order.total)} <br /> Você ganhou {order.pointsEarned} pontos de fidelidade.
        </p>
        <button onClick={onClose} style={{ ...primaryBtnStyle(brand.accent, brand.accent2), width: "100%", marginTop: 14 }}>Ok</button>
      </div>
    </div>
  );
}

/* =========================================================================
   PERFIL DO CLIENTE
   ========================================================================= */
function ProfileTab({ me, brand, orders, products, coupons, config, onLogout, onReview, reviewedIds }) {
  const [section, setSection] = useState("pedidos");
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&bgcolor=00000000&color=ffffff&data=${encodeURIComponent("CLIENTE:" + me.phone)}`;
  const rewardValue = Math.floor((me.points || 0) / (config.redemptionRate || 100)) * 10;
  const favProducts = products.filter((p) => me.favorites?.includes(p.id));

  return (
    <div style={{ padding: "10px 16px 20px" }}>
      <div style={{ background: brand.panel, borderRadius: 16, padding: 16, display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${brand.accent}, ${brand.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 20 }}>
          {me.name[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 800 }}>{me.name}</div>
          <div style={{ color: brand.sub, fontSize: 12.5 }}>{me.phone}</div>
        </div>
        <button onClick={onLogout} style={iconBtnStyle}><LogOut size={18} color="#fff9" /></button>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <StatCard Icon={Star} label="Pontos" value={me.points || 0} brand={brand} />
        <StatCard Icon={Gift} label="Resgate" value={money(rewardValue)} brand={brand} />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14, overflowX: "auto" }}>
        {[
          ["pedidos", "Pedidos", ClipboardList],
          ["favoritos", "Favoritos", Heart],
          ["fidelidade", "Fidelidade", Star],
          ["indicacao", "Indicação", Share2],
          ["qrcode", "QR Code", QrCode],
        ].map(([key, label, Icon]) => (
          <button key={key} onClick={() => setSection(key)} style={{
            padding: "6px 12px", borderRadius: 20, whiteSpace: "nowrap", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            border: `1px solid ${section === key ? brand.accent2 : "rgba(255,255,255,0.15)"}`,
            background: section === key ? `linear-gradient(135deg, ${brand.accent}, ${brand.accent2})` : "transparent",
            color: section === key ? "#fff" : brand.sub, display: "flex", alignItems: "center", gap: 5,
          }}><Icon size={13} />{label}</button>
        ))}
      </div>

      {section === "pedidos" && (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.length === 0 ? <EmptyState text="Você ainda não fez nenhum pedido." /> :
            [...orders].sort((a, b) => b.createdAt - a.createdAt).map((o) => (
              <div key={o.id} style={{ background: brand.panel, borderRadius: 14, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 13.5 }}>{o.id}</span>
                  <span style={{ color: brand.accent2, fontWeight: 700 }}>{money(o.total)}</span>
                </div>
                <div style={{ color: brand.sub, fontSize: 11.5, marginTop: 2 }}>
                  {new Date(o.createdAt).toLocaleString("pt-BR")} • {o.paymentMethod.toUpperCase()}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_DOT[o.status] }} />
                  <span style={{ fontSize: 12.5, color: "#eee" }}>{STATUS_LABEL[o.status]}</span>
                </div>
                {o.status === "entregue" && !reviewedIds.includes(o.id) && (
                  <button onClick={() => onReview(o)} style={{ ...primaryBtnStyle(brand.accent, brand.accent2, true), marginTop: 8 }}>
                    <MessageSquare size={13} style={{ marginRight: 4 }} /> Avaliar pedido
                  </button>
                )}
              </div>
            ))}
        </div>
      )}

      {section === "favoritos" && (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {favProducts.length === 0 ? <EmptyState text="Nenhum favorito ainda — toque no coração de um produto." /> :
            favProducts.map((p) => (
              <div key={p.id} style={{ background: brand.panel, borderRadius: 14, padding: 12, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#fff", fontWeight: 600, fontSize: 13.5 }}>{p.name}</span>
                <span style={{ color: brand.accent2, fontWeight: 700 }}>{money(p.price)}</span>
              </div>
            ))}
        </div>
      )}

      {section === "fidelidade" && (
        <div style={{ marginTop: 14 }}>
          <div style={{ background: brand.panel, borderRadius: 14, padding: 14, color: "#ddd", fontSize: 13 }}>
            Você ganha {config.pointsPerReal || 1} ponto por real gasto. A cada {config.redemptionRate || 100} pontos, R$10 em recompensa.
          </div>
          <div style={{ marginTop: 10, fontWeight: 700, color: "#fff", fontSize: 13 }}>Extrato de pontos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
            {orders.filter((o) => o.pointsEarned > 0).length === 0 ? <EmptyState text="Nenhuma movimentação ainda." /> :
              orders.map((o) => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#ccc", padding: "4px 0", borderBottom: "1px solid #ffffff12" }}>
                  <span>Pedido {o.id}</span><span style={{ color: "#7CFC00" }}>+{o.pointsEarned}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {section === "indicacao" && (
        <div style={{ marginTop: 14, background: brand.panel, borderRadius: 14, padding: 16, textAlign: "center" }}>
          <Share2 size={26} color={brand.accent2} />
          <p style={{ color: "#ddd", fontSize: 13, margin: "8px 0" }}>Compartilhe seu código e ganhe pontos quando um amigo pedir pela primeira vez.</p>
          <div style={{ background: "#00000055", borderRadius: 10, padding: "10px 14px", color: "#fff", fontWeight: 800, letterSpacing: 2, fontSize: 18 }}>
            {me.referralCode}
          </div>
        </div>
      )}

      {section === "qrcode" && (
        <div style={{ marginTop: 14, background: brand.panel, borderRadius: 14, padding: 16, textAlign: "center" }}>
          <img src={qrUrl} alt="QR Code do cliente" style={{ borderRadius: 10 }} />
          <p style={{ color: "#ccc", fontSize: 12, marginTop: 8 }}>Mostre esse QR Code na loja para identificação rápida.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ Icon, label, value, brand }) {
  return (
    <div style={{ flex: 1, background: brand.panel, borderRadius: 14, padding: 12, display: "flex", alignItems: "center", gap: 10 }}>
      <Icon size={18} color={brand.gold} />
      <div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>{value}</div>
        <div style={{ color: brand.sub, fontSize: 11 }}>{label}</div>
      </div>
    </div>
  );
}

function ReviewModal({ brand, order, onClose, onSubmit }) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, maxWidth: 360 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>Avaliar pedido</div>
          <button onClick={onClose} style={iconBtnStyle}><X size={18} color="#fff" /></button>
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", margin: "10px 0" }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} size={28} onClick={() => setStars(n)} color={n <= stars ? brand.gold : "#ffffff33"} fill={n <= stars ? brand.gold : "none"} style={{ cursor: "pointer" }} />
          ))}
        </div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Conte como foi sua experiência..." style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
        <button onClick={() => onSubmit({ stars, comment })} style={{ ...primaryBtnStyle(brand.accent, brand.accent2), width: "100%", marginTop: 12 }}>Enviar avaliação</button>
      </div>
    </div>
  );
}

/* =========================================================================
   ADMIN LOGIN
   ========================================================================= */
function AdminLogin({ onBack, onSuccess }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  return (
    <div style={{ minHeight: "600px", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ maxWidth: 320, width: "100%" }}>
        <button onClick={onBack} style={{ ...iconBtnStyle, marginBottom: 14 }}><ChevronLeft color="#fff" size={20} /></button>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Lock size={30} color="#f7941d" />
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, marginTop: 8 }}>Painel Administrativo</div>
          <p style={{ color: "#999", fontSize: 12.5 }}>Acesso restrito — apenas senha.</p>
        </div>
        <input
          type="password" value={pw} onChange={(e) => setPw(e.target.value)}
          placeholder="Senha" style={inputStyle}
          onKeyDown={(e) => e.key === "Enter" && (pw === ADMIN_PASSWORD ? onSuccess() : setError("Senha incorreta."))}
        />
        {error && <div style={{ color: "#ff8a8a", fontSize: 12.5, marginTop: 6 }}>{error}</div>}
        <button
          onClick={() => (pw === ADMIN_PASSWORD ? onSuccess() : setError("Senha incorreta."))}
          style={{ ...primaryBtnStyle("#e8321f", "#f7941d"), width: "100%", marginTop: 12 }}
        >Entrar</button>
        <p style={{ color: "#666", fontSize: 11, marginTop: 14, textAlign: "center" }}>
          Nota: aqui a senha é validada no próprio app (é um protótipo). Numa hospedagem real, essa checagem deve ficar num servidor.
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   ADMIN PANEL
   ========================================================================= */
function AdminPanel(props) {
  const { products, orders, customers, coupons, reviews, notifications, config,
    onExit, onLogout, persistProducts, persistOrders, persistCoupons, persistNotifications, persistConfig, persistCustomers } = props;

  const [tab, setTab] = useState("dashboard");
  const [notifPermAsked, setNotifPermAsked] = useState(false);

  useEffect(() => {
    if (!notifPermAsked && "Notification" in window && Notification.permission === "default") {
      setNotifPermAsked(true);
    }
  }, [notifPermAsked]);

  const unread = notifications.filter((n) => !n.read).length;

  const TABS = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["pedidos", "Pedidos", ClipboardList],
    ["produtos", "Produtos", Package],
    ["cupons", "Cupons", Tag],
    ["clientes", "Clientes", Users],
    ["notificacoes", "Notificações", Bell],
  ];

  return (
    <div style={{ minHeight: "600px", background: "#0a0a0a", color: "#f2f2f2" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid #ffffff14" }}>
        <button onClick={onExit} style={iconBtnStyle}><ChevronLeft color="#fff" size={20} /></button>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Painel ADM</div>
        <div style={{ flex: 1 }} />
        {"Notification" in window && Notification.permission !== "granted" && (
          <button onClick={() => Notification.requestPermission()} style={{ fontSize: 11, background: "#ffffff14", border: "1px solid #ffffff22", color: "#ccc", borderRadius: 8, padding: "5px 8px", cursor: "pointer" }}>
            Ativar alerta sonoro/visual
          </button>
        )}
        <button onClick={onLogout} style={iconBtnStyle}><LogOut size={18} color="#fff9" /></button>
      </div>

      <div style={{ display: "flex", gap: 6, padding: "10px 16px", overflowX: "auto", borderBottom: "1px solid #ffffff10" }}>
        {TABS.map(([key, label, Icon]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 10, whiteSpace: "nowrap",
            border: `1px solid ${tab === key ? "#f7941d" : "#ffffff18"}`,
            background: tab === key ? "linear-gradient(135deg,#e8321f,#f7941d)" : "transparent",
            color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer", position: "relative",
          }}>
            <Icon size={14} />{label}
            {key === "notificacoes" && unread > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", borderRadius: 10, fontSize: 9, padding: "1px 5px" }}>{unread}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {tab === "dashboard" && <AdminDashboard orders={orders} customers={customers} coupons={coupons} />}
        {tab === "pedidos" && <AdminOrders orders={orders} onUpdate={persistOrders} />}
        {tab === "produtos" && <AdminProducts products={products} onUpdate={persistProducts} />}
        {tab === "cupons" && <AdminCoupons coupons={coupons} onUpdate={persistCoupons} />}
        {tab === "clientes" && <AdminCustomers customers={customers} orders={orders} reviews={reviews} />}
        {tab === "notificacoes" && (
          <AdminNotifications notifications={notifications}
            onMarkRead={(id) => persistNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))}
            onMarkAllRead={() => persistNotifications(notifications.map((n) => ({ ...n, read: true })))}
          />
        )}
      </div>
    </div>
  );
}

function AdminDashboard({ orders, customers, coupons }) {
  const revenue = orders.filter((o) => o.status !== "cancelado").reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => !["entregue", "cancelado"].includes(o.status)).length;
  const delivered = orders.filter((o) => o.status === "entregue").length;
  const cancelled = orders.filter((o) => o.status === "cancelado").length;
  const pointsGiven = orders.reduce((s, o) => s + (o.pointsEarned || 0), 0);
  const couponsUsed = orders.filter((o) => o.couponCode).length;

  const productCount = {};
  orders.forEach((o) => o.items.forEach((it) => { productCount[it.name] = (productCount[it.name] || 0) + it.qty; }));
  const topProducts = Object.entries(productCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty }));

  const byDay = {};
  orders.forEach((o) => {
    const d = new Date(o.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    byDay[d] = (byDay[d] || 0) + o.total;
  });
  const salesData = Object.entries(byDay).map(([date, total]) => ({ date, total }));

  const COLORS = ["#e8321f", "#f7941d", "#f2c14e", "#b455ff", "#22c55e"];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 16 }}>
        <MiniStat Icon={DollarSign} label="Faturamento" value={money(revenue)} color="#22c55e" />
        <MiniStat Icon={ShoppingBag} label="Pedidos" value={orders.length} color="#f7941d" />
        <MiniStat Icon={Clock} label="Pendentes" value={pending} color="#f2c14e" />
        <MiniStat Icon={BadgeCheck} label="Entregues" value={delivered} color="#3b82f6" />
        <MiniStat Icon={X} label="Cancelados" value={cancelled} color="#ef4444" />
        <MiniStat Icon={Users} label="Clientes" value={customers.length} color="#b455ff" />
        <MiniStat Icon={Star} label="Pontos distribuídos" value={pointsGiven} color="#f2c14e" />
        <MiniStat Icon={Tag} label="Cupons usados" value={couponsUsed} color="#e8321f" />
      </div>

      {orders.length === 0 ? (
        <EmptyState text="Ainda não há pedidos reais para gerar gráficos." />
      ) : (
        <>
          <div style={{ background: "#141414", borderRadius: 14, padding: 12, marginBottom: 14 }}>
            <div style={{ color: "#ccc", fontSize: 12.5, marginBottom: 6 }}>Faturamento por dia</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={salesData}>
                <CartesianGrid stroke="#ffffff12" />
                <XAxis dataKey="date" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "none" }} />
                <Line type="monotone" dataKey="total" stroke="#f7941d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: "#141414", borderRadius: 14, padding: 12 }}>
            <div style={{ color: "#ccc", fontSize: 12.5, marginBottom: 6 }}>Produtos mais vendidos</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={topProducts} layout="vertical">
                <XAxis type="number" stroke="#888" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="#888" fontSize={11} width={110} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "none" }} />
                <Bar dataKey="qty" radius={[0, 6, 6, 0]}>
                  {topProducts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

function MiniStat({ Icon, label, value, color }) {
  return (
    <div style={{ background: "#141414", borderRadius: 12, padding: 12 }}>
      <Icon size={16} color={color} />
      <div style={{ fontWeight: 800, fontSize: 16, marginTop: 4 }}>{value}</div>
      <div style={{ color: "#999", fontSize: 11 }}>{label}</div>
    </div>
  );
}

function AdminOrders({ orders, onUpdate }) {
  const [openId, setOpenId] = useState(null);
  const sorted = [...orders].sort((a, b) => b.createdAt - a.createdAt);

  const setStatus = (id, status) => onUpdate(orders.map((o) => (o.id === id ? { ...o, status, statusHistory: [...o.statusHistory, { status, at: Date.now() }] } : o)));

  if (sorted.length === 0) return <EmptyState text="Nenhum pedido real registrado ainda." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {sorted.map((o) => (
        <div key={o.id} style={{ background: "#141414", borderRadius: 14, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setOpenId(openId === o.id ? null : o.id)}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{o.id} — {o.customerName}</div>
              <div style={{ color: "#999", fontSize: 11.5 }}>{new Date(o.createdAt).toLocaleString("pt-BR")} • {o.storeId === "sabor" ? "Sabor & Brasa" : "Neve e Sabor"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#f7941d", fontWeight: 800 }}>{money(o.total)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_DOT[o.status] }} />
                <span style={{ fontSize: 11 }}>{STATUS_LABEL[o.status]}</span>
              </div>
            </div>
          </div>

          {openId === o.id && (
            <div style={{ marginTop: 10, borderTop: "1px solid #ffffff12", paddingTop: 10 }}>
              {o.items.map((it) => (
                <div key={it.id} style={{ fontSize: 12.5, color: "#ccc", marginBottom: 3 }}>
                  {it.qty}x {it.name}{it.addons.length ? ` (${it.addons.map((a) => a.name).join(", ")})` : ""} — {money(it.lineTotal)}
                </div>
              ))}
              <div style={{ fontSize: 12.5, color: "#999", marginTop: 6 }}>
                {o.deliveryType === "delivery" ? "Entrega" : "Retirada"} • {o.paymentMethod.toUpperCase()}
                {o.changeFor ? ` (troco p/ ${o.changeFor})` : ""}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                {STATUS_FLOW.map((s) => (
                  <button key={s} onClick={() => setStatus(o.id, s)} style={{
                    fontSize: 11, padding: "5px 9px", borderRadius: 8, cursor: "pointer",
                    border: `1px solid ${o.status === s ? "#f7941d" : "#ffffff22"}`,
                    background: o.status === s ? "#f7941d33" : "transparent", color: "#fff",
                  }}>{STATUS_LABEL[s]}</button>
                ))}
                <button onClick={() => setStatus(o.id, "cancelado")} style={{ fontSize: 11, padding: "5px 9px", borderRadius: 8, cursor: "pointer", border: "1px solid #ef444488", background: "transparent", color: "#ff8a8a" }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AdminProducts({ products, onUpdate }) {
  const [store, setStore] = useState("sabor");
  const [editing, setEditing] = useState(null);
  const list = products[store] || [];

  const save = (product) => {
    const exists = list.find((p) => p.id === product.id);
    const next = exists ? list.map((p) => (p.id === product.id ? product : p)) : [...list, product];
    onUpdate(store, next);
    setEditing(null);
  };
  const remove = (id) => onUpdate(store, list.filter((p) => p.id !== id));
  const toggleAvail = (p) => onUpdate(store, list.map((x) => (x.id === p.id ? { ...x, available: !x.available } : x)));

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {Object.keys(BRANDS).map((s) => (
          <button key={s} onClick={() => setStore(s)} style={{
            padding: "6px 12px", borderRadius: 10, fontSize: 12.5, cursor: "pointer",
            border: `1px solid ${store === s ? "#f7941d" : "#ffffff22"}`,
            background: store === s ? "#f7941d33" : "transparent", color: "#fff",
          }}>{BRANDS[s].name}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => setEditing({ id: uid("p-"), name: "", desc: "", price: 0, category: BRANDS[store].categories[1], available: true, image: "" })} style={primaryBtnStyle("#e8321f", "#f7941d", true)}>
          <Plus size={13} /> Produto
        </button>
      </div>

      {list.length === 0 ? <EmptyState text="Nenhum produto cadastrado ainda." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {list.map((p) => (
            <div key={p.id} style={{ background: "#141414", borderRadius: 12, padding: 10, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: p.image ? `url(${p.image}) center/cover` : "#222", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                <div style={{ color: "#999", fontSize: 11 }}>{p.category} • {money(p.price)}</div>
              </div>
              <button onClick={() => toggleAvail(p)} style={{ fontSize: 10.5, padding: "4px 8px", borderRadius: 8, border: "1px solid #ffffff22", background: p.available ? "#22c55e22" : "#ef444422", color: p.available ? "#7CFC00" : "#ff8a8a", cursor: "pointer" }}>
                {p.available ? "Disponível" : "Pausado"}
              </button>
              <button onClick={() => setEditing(p)} style={iconBtnStyle}><Pencil size={15} color="#f7941d" /></button>
              <button onClick={() => remove(p.id)} style={iconBtnStyle}><Trash2 size={15} color="#ff8a8a" /></button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, maxWidth: 380 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ color: "#fff", fontWeight: 800 }}>{list.find((p) => p.id === editing.id) ? "Editar produto" : "Novo produto"}</div>
              <button onClick={() => setEditing(null)} style={iconBtnStyle}><X size={18} color="#fff" /></button>
            </div>
            <Field label="Nome"><input style={inputStyle} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Descrição"><input style={inputStyle} value={editing.desc} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} /></Field>
            <Field label="Preço (R$)"><input type="number" style={inputStyle} value={editing.price} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })} /></Field>
            <Field label="Categoria">
              <select style={inputStyle} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {BRANDS[store].categories.filter((c) => c !== "Todos" && c !== "Adicionais").map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="URL da imagem"><input style={inputStyle} value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="https://..." /></Field>
            <button onClick={() => save(editing)} style={{ ...primaryBtnStyle("#e8321f", "#f7941d"), width: "100%", marginTop: 8 }}>Salvar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminCoupons({ coupons, onUpdate }) {
  const [editing, setEditing] = useState(null);
  const save = (c) => {
    const exists = coupons.find((x) => x.id === c.id);
    onUpdate(exists ? coupons.map((x) => (x.id === c.id ? c : x)) : [...coupons, c]);
    setEditing(null);
  };
  const remove = (id) => onUpdate(coupons.filter((c) => c.id !== id));
  const toggle = (c) => onUpdate(coupons.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)));

  return (
    <div>
      <button onClick={() => setEditing({ id: uid("cp-"), code: "", type: "percent", value: 10, storeId: "all", active: true })} style={{ ...primaryBtnStyle("#e8321f", "#f7941d", true), marginBottom: 12 }}>
        <Plus size={13} /> Cupom
      </button>
      {coupons.length === 0 ? <EmptyState text="Nenhum cupom cadastrado ainda." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {coupons.map((c) => (
            <div key={c.id} style={{ background: "#141414", borderRadius: 12, padding: 10, display: "flex", alignItems: "center", gap: 10 }}>
              <Tag size={16} color="#f7941d" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{c.code}</div>
                <div style={{ color: "#999", fontSize: 11 }}>{c.type === "percent" ? `${c.value}% off` : `${money(c.value)} off`}</div>
              </div>
              <button onClick={() => toggle(c)} style={{ fontSize: 10.5, padding: "4px 8px", borderRadius: 8, border: "1px solid #ffffff22", background: c.active ? "#22c55e22" : "#ef444422", color: c.active ? "#7CFC00" : "#ff8a8a", cursor: "pointer" }}>
                {c.active ? "Ativo" : "Inativo"}
              </button>
              <button onClick={() => setEditing(c)} style={iconBtnStyle}><Pencil size={15} color="#f7941d" /></button>
              <button onClick={() => remove(c.id)} style={iconBtnStyle}><Trash2 size={15} color="#ff8a8a" /></button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, maxWidth: 340 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ color: "#fff", fontWeight: 800 }}>Cupom</div>
              <button onClick={() => setEditing(null)} style={iconBtnStyle}><X size={18} color="#fff" /></button>
            </div>
            <Field label="Código"><input style={inputStyle} value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} /></Field>
            <Field label="Tipo">
              <select style={inputStyle} value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}>
                <option value="percent">Percentual (%)</option>
                <option value="fixed">Valor fixo (R$)</option>
              </select>
            </Field>
            <Field label="Valor"><input type="number" style={inputStyle} value={editing.value} onChange={(e) => setEditing({ ...editing, value: parseFloat(e.target.value) || 0 })} /></Field>
            <Field label="Loja">
              <select style={inputStyle} value={editing.storeId} onChange={(e) => setEditing({ ...editing, storeId: e.target.value })}>
                <option value="all">Ambas</option>
                <option value="sabor">Sabor & Brasa</option>
                <option value="neve">Neve e Sabor</option>
              </select>
            </Field>
            <button onClick={() => save(editing)} style={{ ...primaryBtnStyle("#e8321f", "#f7941d"), width: "100%", marginTop: 8 }}>Salvar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminCustomers({ customers, orders, reviews }) {
  if (customers.length === 0) return <EmptyState text="Nenhum cliente cadastrado ainda." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {customers.map((c) => {
        const cOrders = orders.filter((o) => o.customerPhone === c.phone);
        const cReviews = reviews.filter((r) => r.customerPhone === c.phone);
        return (
          <div key={c.phone} style={{ background: "#141414", borderRadius: 12, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{c.name}</div>
              <div style={{ color: "#f2c14e", fontSize: 12 }}>{c.points || 0} pts</div>
            </div>
            <div style={{ color: "#999", fontSize: 11.5, marginTop: 2 }}>{c.phone} • {cOrders.length} pedidos • {cReviews.length} avaliações</div>
            {c.referralCode && <div style={{ color: "#777", fontSize: 11, marginTop: 2 }}>Indicação: {c.referralCode}</div>}
          </div>
        );
      })}
    </div>
  );
}

function AdminNotifications({ notifications, onMarkRead, onMarkAllRead }) {
  const sorted = [...notifications].sort((a, b) => b.time - a.time);
  if (sorted.length === 0) return <EmptyState text="Nenhuma notificação ainda." />;
  return (
    <div>
      <button onClick={onMarkAllRead} style={{ ...primaryBtnStyle("#e8321f", "#f7941d", true), marginBottom: 10 }}>Marcar tudo como lido</button>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sorted.map((n) => (
          <div key={n.id} onClick={() => onMarkRead(n.id)} style={{
            background: n.read ? "#141414" : "#2a1608", borderRadius: 12, padding: 12, cursor: "pointer",
            border: n.read ? "1px solid transparent" : "1px solid #f7941d55",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>🔔 Novo pedido — {n.customerName}</span>
              <span style={{ color: "#f7941d", fontWeight: 700 }}>{money(n.total)}</span>
            </div>
            <div style={{ color: "#999", fontSize: 11, marginTop: 3 }}>
              {new Date(n.time).toLocaleString("pt-BR")} • {n.read ? "Lida" : "Não lida"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   PRIMITIVES / SHARED STYLES
   ========================================================================= */
const overlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50, padding: 0 };
const modalStyle = { background: "#181818", width: "100%", borderRadius: "20px 20px 0 0", padding: 18, maxHeight: "85vh", overflowY: "auto" };
const iconBtnStyle = { background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };
const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ffffff22", background: "#0f0f0f", color: "#fff", fontSize: 13.5, outline: "none", marginTop: 4, boxSizing: "border-box" };
const qtyBtn = { background: "#ffffff1a", border: "none", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };
const linkStyle = { color: "#f7941d", cursor: "pointer", fontWeight: 600 };

function primaryBtnStyle(c1, c2, small) {
  return {
    background: `linear-gradient(135deg, ${c1}, ${c2})`, color: "#fff", border: "none",
    borderRadius: 12, padding: small ? "7px 12px" : "11px 16px", fontWeight: 700,
    fontSize: small ? 12.5 : 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4,
  };
}
function pillBtn(active, brand) {
  return {
    flex: 1, padding: "9px 0", borderRadius: 10, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
    border: `1px solid ${active ? brand.accent2 : "#ffffff22"}`,
    background: active ? `linear-gradient(135deg, ${brand.accent}, ${brand.accent2})` : "transparent",
    color: "#fff",
  };
}
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ color: "#aaa", fontSize: 11.5, fontWeight: 600, marginBottom: 2 }}>{label}</div>
      {children}
    </div>
  );
}
