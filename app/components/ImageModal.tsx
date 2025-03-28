'use client';

import Image from 'next/image';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  // Fechar o modal quando clicar fora da imagem
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black w-screen h-screen flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)'
      }}
    >
      {/* Botão de fechar */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 z-[10000] cursor-pointer"
        style={{
          fontSize: '28px',
          background: 'none',
          border: 'none',
          padding: '10px'
        }}
      >
        ✕
      </button>

      {/* Container da Imagem */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <Image 
          src={imageUrl}
          alt="Modal Image"
          width={800}
          height={600}
          className="modal-image"
        />
      </div>
    </div>
  );
} 