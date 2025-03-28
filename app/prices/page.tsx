'use client';

import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import axios from 'axios';

interface PriceSection {
  title: string;
  items: string[];
}

export default function Prices() {
  const [sections, setSections] = useState<PriceSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await axios.get('/api/content');
        setSections(response.data.prices.sections);
        setLoading(false);
      } catch (err) {
        console.error('Error loading content:', err);
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <PageLayout title="Prices">
      <div className="prices-content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          sections.map((section, index) => (
            <div key={index} className="price-section">
              <h3>{section.title}</h3>
              {section.items.map((item, itemIndex) => (
                <p key={itemIndex}>{item}</p>
              ))}
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
} 