import PageLayout from '../components/PageLayout';
import ImageGrid from '../components/ImageGrid';

export default function Stickers() {
  return (
    <PageLayout title="Stickers">
      <div className="container mx-auto px-4">
        <ImageGrid category="sticker" />
      </div>
    </PageLayout>
  );
} 