'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { IMGBB_CONFIG } from '../config/imgbb';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

type ImageCategory = 'gallery' | 'icon' | 'sticker';

interface UploadedImage {
  id: string;
  category: ImageCategory;
  url: string;
  title: string;
  createdAt?: string;
  likes?: number;
}

interface AdminPageLayoutProps {
  children: React.ReactNode;
  title: string;
  onLogout: () => Promise<void>;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({ children, title, onLogout }) => {
  return (
    <main className="main-container">
      <div className="content-wrapper">
        <div className="header">
          <div className="header-content">
          <button onClick={onLogout} className="back-button">
            <i className="fas fa-arrow-left"></i> Logout
          </button>
            <h1 className="page-title">{title}</h1>
            
            <div className="page-content">
              {children}
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
};

export default function Admin() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<ImageCategory>('gallery');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Load images when component mounts
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await axios.get('/api/images');
      const imagesWithLikes = await Promise.all(
        response.data.images.map(async (img: UploadedImage) => {
          try {
            const likesResponse = await axios.get(`/api/likes?imageId=${img.id}`);
            return {
              ...img,
              likes: likesResponse.data.likes
            };
          } catch (err) {
            console.error(`Error loading likes for image ${img.id}:`, err);
            return {
              ...img,
              likes: 0
            };
          }
        })
      );
      setUploadedImages(imagesWithLikes);
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Error loading images');
    }
  };

  const handleImageClick = (image: UploadedImage) => {
    router.push(`/view/${image.category}/${encodeURIComponent(image.title)}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      setDeleting(id);
      setError('');
      
      await axios.delete(`/api/images?id=${id}`);
      
      setUploadedImages(prev => prev.filter(img => img.id !== id));
      setSuccess('Image deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting image:', err);
      setError('Error deleting image: ' + (err.response?.data?.error || err.message));
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      if (file.size > 32 * 1024 * 1024) {
        throw new Error('File is too large. Maximum size: 32MB');
      }

      const formData = new FormData();
      formData.append('image', file);

      // Upload to ImgBB
      const imgbbResponse = await axios.post(
        `${IMGBB_CONFIG.apiUrl}?key=${IMGBB_CONFIG.apiKey}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (imgbbResponse.data.success) {
        const imageData = imgbbResponse.data.data;

        // Create new image object
        const newImage = {
          category,
          url: imageData.url,
          title: file.name
        };

        // Save to our API
        const apiResponse = await axios.post('/api/images', newImage);
        
        // Update state with new image
        setUploadedImages(prev => [...prev, apiResponse.data.image]);
        setSuccess('Image uploaded successfully!');
        setFile(null);

        // Clear file input
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error('Failed to upload image');
      }

    } catch (err: any) {
      console.error('Complete error:', err);
      let errorMessage = 'Error uploading image. Please try again.';
      
      if (err.response?.data?.error) {
        errorMessage = `Error: ${err.response.data.error.message}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminPageLayout title="Admin Area" onLogout={handleLogout}>
      <div className="admin-container">
        <form onSubmit={handleUpload} className="upload-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="flex justify-between items-center mb-6">
          <Link 
              href="/admin/content" 
              className="flex items-center gap-2 bg-indigo-500 text-white px-5 py-2.5 rounded-md hover:bg-indigo-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i className="fas fa-edit back-button"></i>
              
            </Link>
            <h2 className="text-2xl font-bold">Image Upload</h2>
            
          </div>

          <div className="form-group">
            <label htmlFor="image">Select an image (max: 32MB)</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ImageCategory)}
              required
              disabled={uploading}
            >
              <option value="gallery">Gallery</option>
              <option value="icon">Icon</option>
              <option value="sticker">Sticker</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="back-button"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>

        <div className="images-grid">
          {uploadedImages.map((image) => (
            <div key={image.id} className="image-card">
              <div className="image-container">
                <img
                  src={image.url}
                  alt={image.title}
                  onClick={() => handleImageClick(image)}
                />
                <div className="image-overlay">
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(image.id)}
                    disabled={deleting === image.id}
                  >
                    {deleting === image.id ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-trash"></i>
                    )}
                  </button>
                </div>
              </div>
              <div className="image-info">
                <p className="image-title">{image.title}</p>
                <p className="image-category">{image.category}</p>
                <p className="image-likes">
                  <i className="fas fa-heart"></i> {image.likes || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPageLayout>
  );
} 