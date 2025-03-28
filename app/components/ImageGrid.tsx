'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Image {
  id: string;
  category: 'gallery' | 'icon' | 'sticker';
  url: string;
  title: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

interface ImageGridProps {
  category: 'gallery' | 'icon' | 'sticker';
}

export default function ImageGrid({ category }: ImageGridProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedImages, setLikedImages] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await axios.get('/api/images');
        const filteredImages = response.data.images.filter(
          (img: Image) => img.category === category
        );
        setImages(filteredImages);
        setLoading(false);

        // Load likes from cookie
        const likedCookie = document.cookie.split(';').find(c => c.trim().startsWith('liked_images='));
        if (likedCookie) {
          const likedIds = JSON.parse(decodeURIComponent(likedCookie.split('=')[1]));
          setLikedImages(likedIds);
        }
      } catch (err) {
        setError('Error loading images');
        console.error('Error loading images:', err);
        setLoading(false);
      }
    };

    loadImages();
  }, [category]);

  const handleImageClick = (image: Image, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('.like-button')) {
      return;
    }
    router.push(`/view/${category}/${encodeURIComponent(image.title)}`);
  };

  const handleLike = async (imageId: string) => {
    try {
      const response = await axios.post(`/api/likes/${imageId}`);
      
      setImages(prevImages => 
        prevImages.map(img => 
          img.id === imageId 
            ? { 
                ...img, 
                likes: response.data.likes
              }
            : img
        )
      );
      
      // Add image ID to likes list
      setLikedImages(prev => [...prev, imageId]);

    } catch (err: any) {
      if (err.response?.status === 400) {
        // User already liked
        const button = document.querySelector(`[data-image-id="${imageId}"]`);
        if (button) {
          button.classList.add('already-liked');
          setTimeout(() => {
            button.classList.remove('already-liked');
          }, 1000);
        }
      } else {
        console.error('Error liking image:', err);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading images...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (images.length === 0) {
    return <div className="text-center py-8">No images found.</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div 
            key={image.id} 
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={(e) => handleImageClick(image, e)}
          >
            <div className="image-container">
              <div 
                className="flex justify-center items-center bg-gray-50" 
                style={{ 
                  minHeight: '200px',
                  maxHeight: category === 'gallery' ? '400px' : '250px'
                }}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  style={{
                    maxWidth: category === 'gallery' ? '100%' : '250px',
                    maxHeight: category === 'gallery' ? '400px' : '250px',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <button 
                className="like-button"
                data-image-id={image.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(image.id);
                }}
              >
                <i className={`fas fa-heart ${likedImages.includes(image.id) ? 'liked' : ''}`}></i>
                <span>{image.likes || 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 