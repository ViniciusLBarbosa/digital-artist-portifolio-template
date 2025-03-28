import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public/data/images.json');

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Error reading images:', error);
    return NextResponse.json({ images: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    
    const newImage = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };
    
    jsonData.images.push(newImage);
    await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));
    
    return NextResponse.json({ image: newImage });
  } catch (error) {
    console.error('Error adding image:', error);
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
    const jsonData = JSON.parse(data);
    
    jsonData.images = jsonData.images.filter((img: { id: string }) => img.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
} 