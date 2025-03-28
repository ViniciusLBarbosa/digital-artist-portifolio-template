import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contentFilePath = path.join(process.cwd(), 'app/data/content.json');

export async function GET() {
  try {
    const jsonData = fs.readFileSync(contentFilePath, 'utf-8');
    const content = JSON.parse(jsonData);
    return NextResponse.json(content);
  } catch (error) {
    console.error('Erro ao ler conteúdo:', error);
    return NextResponse.json(
      { error: 'Erro ao ler conteúdo' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const content = await request.json();
    fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar conteúdo:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar conteúdo' },
      { status: 500 }
    );
  }
} 