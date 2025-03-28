'use client';

import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import axios from 'axios';

export default function About() {
  const [content, setContent] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await axios.get('/api/content');
        setContent(response.data.about.paragraphs);
        setLoading(false);
      } catch (err) {
        console.error('Error loading content:', err);
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <PageLayout title="About">
      <div className="about-content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          content.map((paragraph, index) => (
            <p key={index} style={{ marginTop: index > 0 ? '1rem' : '0' }}>
              {paragraph}
            </p>
          ))
        )}
      </div>
    </PageLayout>
  );
} 