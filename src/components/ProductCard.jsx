import React from "react";

function ProductCard({ product, addToCart }) {
  // 1. Preparamos la ruta de la imagen una sola vez
  // Si product.imagen existe, armamos la ruta, si no, usamos el placeholder
  const imageSrc = product.imagen 
    ? `/img/${product.imagen}` 
    : "https://via.placeholder.com/200x200?text=Sin+Imagen";

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={imageSrc} // Usamos la variable que definimos arriba
          alt={product.descripcion}
          className="product-image" // Usamos la clase CSS para el estilo
          style={{ width: "100%", height: "180px", objectFit: "cover" }}
          onError={(e) => {
            // Por si el archivo .jpg no existe en la carpeta /img/
            e.target.src = "https://via.placeholder.com/150?text=No+Encontrada";
          }}
        />
      </div>

      <div className="product-info">
        <span className="product-category">{product.categoria}</span>
        <h3 className="product-title">{product.descripcion}</h3>
        <p className="product-price">S/ {Number(product.precio).toFixed(2)}</p>

        <button 
          className="btn-add" 
          onClick={() => addToCart(product)}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductCard;