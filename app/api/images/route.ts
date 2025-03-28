import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app/data/images.json');

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return NextResponse.json({ images: JSON.parse(data) });
  } catch {
    return NextResponse.json({ images: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const images = JSON.parse(data);
    
    const newImage = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    };
    
    images.push(newImage);
    await fs.writeFile(dataFilePath, JSON.stringify(images, null, 2));
    
    return NextResponse.json({ image: newImage });
  } catch {
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }
    
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const images = JSON.parse(data);
    
    const filteredImages = images.filter((img: { id: string }) => img.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(filteredImages, null, 2));
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
} 