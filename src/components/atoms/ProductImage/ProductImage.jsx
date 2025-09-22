// src/components/atoms/ProductImage/ProductImage.jsx
import React, { useState, useEffect } from 'react';

const ProductImage = ({ 
  productCode, 
  productName = '', 
  className = "w-16 h-16 object-contain",
  containerClassName = "w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center"
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [showNoImage, setShowNoImage] = useState(false);
  const [extensionIndex, setExtensionIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(true);

  const extensions = ['jpg', 'png', 'jpeg', 'svg', 'webp'];

  useEffect(() => {
    if (!productCode) {
      setShowNoImage(true);
      setIsSearching(false);
      return;
    }

    const findImage = () => {
      setIsSearching(true);
      setShowNoImage(false);
      setExtensionIndex(0);
      
      const cleanCode = productCode.toString().trim();
      // Empezamos con .jpg como primera opción
      setImageSrc(`/images/${cleanCode}.jpg`);
    };

    findImage();
  }, [productCode]);

  const handleImageError = (e) => {
    const cleanCode = productCode?.toString().trim();
    
    if (!cleanCode) {
      setShowNoImage(true);
      setIsSearching(false);
      return;
    }

    const nextIndex = extensionIndex + 1;
    
    if (nextIndex < extensions.length) {
      // Probar la siguiente extensión
      const nextExt = extensions[nextIndex];
      console.log(`🔄 Intentando extensión ${nextExt} para código ${cleanCode}`);
      setExtensionIndex(nextIndex);
      setImageSrc(`/images/${cleanCode}.${nextExt}`);
    } else {
      // No se encontró ninguna imagen, mostrar "Sin foto"
      console.warn(`⚠️ No se encontró imagen para código: ${cleanCode}`);
      setShowNoImage(true);
      setIsSearching(false);
    }
  };

  const handleImageLoad = () => {
    console.log(`✅ Imagen cargada exitosamente para código: ${productCode}`);
    setIsSearching(false);
  };

  if (showNoImage) {
    return (
      <div className={containerClassName}>
        <div className="text-center text-xs text-gray-400 px-1">
          <div className="text-lg mb-1">📷</div>
          <div>Sin foto</div>
        </div>
      </div>
    );
  }

  if (isSearching && !imageSrc) {
    return (
      <div className={containerClassName}>
        <div className="text-center text-xs text-gray-400">
          <div className="text-lg">⏳</div>
          <div>Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <img 
        src={imageSrc}
        alt={productName || `Producto ${productCode}`}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
    </div>
  );
};

export default ProductImage;