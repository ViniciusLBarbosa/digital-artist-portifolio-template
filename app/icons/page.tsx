import PageLayout from '../components/PageLayout';
import ImageGrid from '../components/ImageGrid';

export default function Icons() {
  return (
    <PageLayout title="Ícones">
      <div className="container mx-auto px-4">
        <ImageGrid category="icon" />
      </div>
    </PageLayout>
  );
} 