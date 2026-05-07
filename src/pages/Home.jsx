import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    API.get("/productos")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  const addToCart = (product) => {
    const existe = cart.find(p => p.id_producto === product.id_producto);

    if (existe) {
      setCart(
        cart.map(p =>
          p.id_producto === product.id_producto
            ? { ...p, qty: p.qty + 1 }
            : p
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map(item =>
        item.id_producto === id
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map(item =>
          item.id_producto === id
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter(item => item.qty > 0)
    );
  };

  const total = cart.reduce(
    (acc, item) => acc + Number(item.precio) * item.qty,
    0
  );

  const confirmarPago = async () => {
    try {
      await API.post("/confirmar-pago", {
        carrito: cart,
        id_cliente: 1
      });

      alert("✅ Pago registrado correctamente");
      setCart([]);
    } catch (error) {
      alert("❌ Error al guardar");
    }
  };

  return (
    <div className="home-container">

      {/* PRODUCTOS */}
      <section className="products-section">
        <h1>Productos</h1>

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

      {/* CARRITO */}
      <aside className="cart-section">
        <h2>Carrito 🛒</h2>

        {cart.length === 0 ? (
          <p>No hay productos</p>
        ) : (
          cart.map(item => (
            <div key={item.id_producto}>
              <strong>{item.descripcion}</strong>
              <div>
                S/ {item.precio} x {item.qty}
                <button onClick={() => decreaseQty(item.id_producto)}>-</button>
                <button onClick={() => increaseQty(item.id_producto)}>+</button>
              </div>
            </div>
          ))
        )}

        <h3>Total: S/ {total.toFixed(2)}</h3>

        {cart.length > 0 && (
          <button onClick={confirmarPago}>
            Confirmar pago
          </button>
        )}

        {/* QR IMAGEN FIJA */}
        {cart.length > 0 && (
          <div>
            <h3>Paga con Yape</h3>
            <img 
              src="../../img/qr-yape.png" 
              alt="QR Yape" 
              width={180} 
            />
          </div>
        )}

      </aside>
    </div>
  );
}

export default Home;
