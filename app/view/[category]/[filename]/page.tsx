import ImageView from './ImageView';

interface PageProps {
  params: {
    category: string;
    filename: string;
  }
}

export default function Page({ params }: PageProps) {
  return <ImageView category={params.category} filename={params.filename} />;
}

function getCategoryName(category: string): string {
  switch (category) {
    case 'gallery':
      return 'Galeria';
    case 'icon':
      return 'Ícones';
    case 'sticker':
      return 'Stickers';
    default:
      return category;
  }
} 