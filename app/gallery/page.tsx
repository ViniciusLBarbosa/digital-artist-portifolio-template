import PageLayout from '../components/PageLayout';
import ImageGrid from '../components/ImageGrid';

export default function Gallery() {
  return (
    <PageLayout title="Gallery">
      <div className="container mx-auto px-4">
        <ImageGrid category="gallery" />
      </div>
    </PageLayout>
  );
} 