'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

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

  const handleClose = () => {
    router.push(`/${category}`);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
        <img
          src={image.url}
          alt={image.title}
          className="w-auto h-auto object-contain"
          style={{
            maxWidth: '95%',
            maxHeight: '95%'
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