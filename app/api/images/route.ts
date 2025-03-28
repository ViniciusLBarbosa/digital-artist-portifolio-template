import { getImages, saveImage, deleteImage } from '../../services/imageService';

export async function GET(request: Request) {
  try {
    const images = getImages();
    return Response.json({ images });
  } catch (error) {
    return Response.json(
      { error: 'Erro ao buscar imagens' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newImage = saveImage(body);
    return Response.json({ image: newImage });
  } catch (error) {
    return Response.json(
      { error: 'Erro ao salvar imagem' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { error: 'ID da imagem não fornecido' },
        { status: 400 }
      );
    }

    const success = deleteImage(id);
    
    if (!success) {
      return Response.json(
        { error: 'Imagem não encontrada' },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: 'Erro ao deletar imagem' },
      { status: 500 }
    );
  }
} 