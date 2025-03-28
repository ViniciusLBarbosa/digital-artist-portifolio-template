import fs from 'fs';
import path from 'path';
import { generateId } from '../utils/generateId';

const imagesFilePath = path.join(process.cwd(), 'app/data/images.json');

export interface StoredImage {
  id: string;
  category: 'gallery' | 'icon' | 'sticker';
  url: string;
  title: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export function getImages(): StoredImage[] {
  try {
    const jsonData = fs.readFileSync(imagesFilePath, 'utf-8');
    const data = JSON.parse(jsonData);
    return data.images || [];
  } catch (error) {
    console.error('Erro ao ler arquivo de imagens:', error);
    return [];
  }
}

export function saveImage(image: Omit<StoredImage, 'createdAt' | 'id' | 'likes' | 'isLiked'>): StoredImage {
  try {
    const images = getImages();
    const timestamp = new Date().toISOString();
    const newImage = {
      ...image,
      id: generateId(`${image.title}-${timestamp}`),
      createdAt: timestamp,
      likes: 0,
      isLiked: false
    };
    
    images.push(newImage);
    
    fs.writeFileSync(imagesFilePath, JSON.stringify({ images }, null, 2));
    return newImage;
  } catch (error) {
    console.error('Erro ao salvar imagem:', error);
    throw new Error('Falha ao salvar imagem');
  }
}

export function deleteImage(id: string): boolean {
  try {
    const images = getImages();
    const imageIndex = images.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
      return false;
    }

    images.splice(imageIndex, 1);
    fs.writeFileSync(imagesFilePath, JSON.stringify({ images }, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw new Error('Falha ao deletar imagem');
  }
} 