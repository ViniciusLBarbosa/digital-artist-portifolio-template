'use client';

interface ImageModalProps {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, title, onClose }: ImageModalProps) {
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
        <img
          src={imageUrl}
          alt={title}
          className="max-w-[95vw] max-h-[90vh] object-contain"
          style={{
            margin: 'auto',
            boxShadow: '0 0 20px rgba(0,0,0,0.3)'
          }}
        />
      </div>
    </div>
  );
} 