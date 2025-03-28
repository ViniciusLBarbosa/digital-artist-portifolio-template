'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface ImageData {
  url: string;
  title: string;
  category: string;
}

interface ImageViewProps {
  category: string;
  filename: string;
}

export default function ImageView({ category, filename }: ImageViewProps) {
  const router = useRouter();
  const [image, setImage] = useState<ImageData | null>(null);

  const handleClose = useCallback(() => {
    router.push(`/${category}`);
  }, [router, category]);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await axios.get('/api/images');
        const images = response.data.images;
        const foundImage = images.find((img: ImageData) => 
          img.title === decodeURIComponent(filename) && 
          img.category === category
        );
        
        if (foundImage) {
          setImage(foundImage);
        }
      } catch (error) {
        console.error('Erro ao carregar imagem:', error);
      }
    };

    loadImage();
  }, [category, filename]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  if (!image) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-90"
      onClick={handleClose}
    >
      <div 
        className="relative bg-white bg-opacity-5 rounded-lg p-8 flex items-center justify-center mx-auto"
        style={{
          width: '95vw',
          height: '85vh',
          maxWidth: '1200px',
          maxHeight: '800px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image 
          src={image.url}
          alt={image.title}
          width={800}
          height={600}
          className="max-w-[95vw] max-h-[90vh] object-contain"
          style={{
            margin: 'auto',
            boxShadow: '0 0 20px rgba(0,0,0,0.3)'
          }}
        />
      </div>

      <div 
        className="fixed bottom-8 left-0 right-0 flex justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="back-button"
        >
          <span>←</span>
          <span>Voltar</span>
        </button>
      </div>
    </div>
  );
} 