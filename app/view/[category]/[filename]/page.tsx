import ImageView from './ImageView';

export default function ImagePage({ params }: { params: { category: string; filename: string } }) {
  return <ImageView category={params.category} filename={params.filename} />;
} 