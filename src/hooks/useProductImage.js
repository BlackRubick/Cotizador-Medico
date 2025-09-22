// src/hooks/useProductImage.js
import { useState, useEffect } from 'react';

export const useProductImage = (productCode) => {
  const [imageSrc, setImageSrc] = useState('/api/placeholder/64/64');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productCode) {
      setImageSrc('/api/placeholder/64/64');
      setIsLoading(false);
      return;
    }

    const findProductImage = async () => {
      setIsLoading(true);
      
      // Limpiar el código del producto
      const cleanCode = productCode.toString().trim();
      
      // Extensiones a probar en orden de preferencia
      const extensions = ['jpg', 'png', 'jpeg', 'svg', 'webp'];
      
      for (const ext of extensions) {
        try {
          const imageUrl = `/images/${cleanCode}.${ext}`;
          
          // Crear una promesa para verificar si la imagen existe
          const imageExists = await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imageUrl;
          });
          
          if (imageExists) {
            console.log(`✅ Imagen encontrada para código ${cleanCode}: ${imageUrl}`);
            setImageSrc(imageUrl);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.warn(`❌ Error verificando imagen para ${cleanCode}.${ext}:`, error);
        }
      }
      
      // Si no se encuentra ninguna imagen, usar placeholder
      console.warn(`⚠️ No se encontró imagen para código: ${cleanCode}`);
      setImageSrc('/api/placeholder/64/64');
      setIsLoading(false);
    };

    findProductImage();
  }, [productCode]);

  return { imageSrc, isLoading };
};

// Función helper para obtener imagen del producto de forma síncrona
export const getProductImageUrl = (productCode) => {
  if (!productCode) return '/api/placeholder/64/64';
  
  const cleanCode = productCode.toString().trim();
  
  // Por defecto intentamos con .jpg primero
  return `/images/${cleanCode}.jpg`;
};