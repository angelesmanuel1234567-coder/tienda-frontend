import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Home.css"; // 👈 Importamos los estilos

function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [qr, setQr] = useState("");
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    API.get("/productos")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  const addToCart = (product) => {
    const existe = cart.find(p => p.id_producto === product.id_producto);
    if (existe) {
      setCart(cart.map(p => p.id_producto === product.id_producto ? { ...p, qty: p.qty + 1 } : p));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(cart.map(item => item.id_producto === id ? { ...item, qty: item.qty + 1 } : item));
  };

  const decreaseQty = (id) => {
    setCart(cart.map(item => item.id_producto === id ? { ...item, qty: item.qty - 1 } : item).filter(item => item.qty > 0));
  };

  const total = cart.reduce((acc, item) => acc + Number(item.precio) * item.qty, 0);

  const generarQR = async () => {
    try {
      const res = await API.get(`/qr/${total}`);
      setQr(res.data.qr);
      setShowQR(true);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmarPago = async () => {
    try {
      await API.post("/confirmar-pago", { carrito: cart, id_cliente: 1 });
      alert("✅ Pago registrado correctamente");
      setCart([]);
      setShowQR(false);
      setQr("");
    } catch (error) {
      alert("❌ Error al guardar");
    }
  };

  return (
    <div className="home-container">
      {/* SECCIÓN IZQUIERDA: PRODUCTOS */}
      <section className="products-section">
        <h1>Explora nuestros productos</h1>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product.id_producto}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </section>

      {/* SECCIÓN DERECHA: CARRITO */}
      <aside className="cart-section">
        <h2>Tu Carrito 🛒</h2>
        
        {cart.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>No hay productos aún.</p>
        ) : (
          cart.map(item => (
            <div key={item.id_producto} className="cart-item">
              <strong>{item.descripcion}</strong>
              <div className="cart-item-actions">
                <span>S/ {item.precio}</span>
                <button className="btn-qty" onClick={() => decreaseQty(item.id_producto)}>-</button>
                <span>{item.qty}</span>
                <button className="btn-qty" onClick={() => increaseQty(item.id_producto)}>+</button>
              </div>
            </div>
          ))
        )}

        <div className="total-display">
          Total: S/ {total.toFixed(2)}
        </div>

        {cart.length > 0 && (
          <button className="btn-pay" onClick={generarQR}>
            Pagar con Yape
          </button>
        )}

        {showQR && (
          <div className="qr-container">
            <h3>Escanea el QR</h3>
            <img 
              src="../../img/qr-yape.png" 
              alt="QR Yape" 
              width={180} 
              className="qr-image" 
            />
            <button className="btn-confirm" onClick={confirmarPago}>
              Ya pagué, confirmar
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

export default Home;