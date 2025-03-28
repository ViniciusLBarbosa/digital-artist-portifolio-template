import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

const imagesFilePath = path.join(process.cwd(), 'app/data/images.json');

export async function POST(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    const imageId = params.imageId;
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
    
    // Ler o arquivo de imagens
    const jsonData = fs.readFileSync(imagesFilePath, 'utf-8');
    const data = JSON.parse(jsonData);
    const images = data.images || [];
    
    // Encontrar a imagem
    const imageIndex = images.findIndex((img: any) => img.id === imageId);
    
    if (imageIndex === -1) {
      return NextResponse.json(
        { error: 'Imagem não encontrada' },
        { status: 404 }
      );
    }

    // Atualizar os likes
    const image = images[imageIndex];
    const currentLikes = image.likes || 0;
    const newLikes = currentLikes + 1;

    // Atualizar a imagem no array
    images[imageIndex] = {
      ...image,
      likes: newLikes
    };

    // Salvar o arquivo atualizado
    fs.writeFileSync(imagesFilePath, JSON.stringify({ images }, null, 2));

    // Atualizar o cookie com a nova imagem liked
    likedImages.push(imageId);
    const response = NextResponse.json({ likes: newLikes });
    response.cookies.set('liked_images', JSON.stringify(likedImages), {
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Erro ao atualizar likes:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar likes' },
      { status: 500 }
    );
  }
} 