import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

const dataFilePath = path.join(process.cwd(), 'app/data/images.json');

interface Image {
  id: string;
  likes: number;
}

type RouteContext = {
  params: {
    imageId: string;
  };
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const images: Image[] = JSON.parse(data);
    const image = images.find(img => img.id === context.params.imageId);
    
    if (!image) {
      return NextResponse.json({ likes: 0 });
    }
    
    return NextResponse.json({ likes: image.likes });
  } catch (error) {
    console.error('Error reading likes:', error);
    return NextResponse.json({ likes: 0 });
  }
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const imageId = context.params.imageId;
    const cookieStore = cookies();
    const likedImagesCookie = cookieStore.get('liked_images');
    const likedImages = likedImagesCookie?.value 
      ? JSON.parse(likedImagesCookie.value)
      : [];

    // Verificar se já deu like nesta imagem
    if (likedImages.includes(imageId)) {
      return NextResponse.json(
        { error: 'Você já deu like nesta imagem' },
        { status: 400 }
      );
    }
    
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const images: Image[] = JSON.parse(data);
    const imageIndex = images.findIndex(img => img.id === imageId);
    
    if (imageIndex === -1) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    images[imageIndex].likes = (images[imageIndex].likes || 0) + 1;
    await fs.writeFile(dataFilePath, JSON.stringify(images, null, 2));
    
    // Atualizar o cookie com a nova imagem liked
    likedImages.push(imageId);
    const response = NextResponse.json({ likes: images[imageIndex].likes });
    response.cookies.set('liked_images', JSON.stringify(likedImages), {
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error updating likes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 