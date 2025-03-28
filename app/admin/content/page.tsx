'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './styles.css';

interface ContentData {
  about: {
    paragraphs: string[];
  };
  prices: {
    sections: {
      title: string;
      items: string[];
    }[];
  };
}

export default function ContentAdmin() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'about' | 'prices'>('about');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadContent();
  }, [isAuthenticated, router]);

  const loadContent = async () => {
    try {
      const response = await axios.get('/api/content');
      setContent(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Error loading content');
      setLoading(false);
    }
  };

  const handleAboutChange = (index: number, value: string) => {
    if (!content) return;
    const newContent = { ...content };
    newContent.about.paragraphs[index] = value;
    setContent(newContent);
  };

  const handlePriceSectionChange = (
    sectionIndex: number,
    field: 'title' | 'items',
    value: string,
    itemIndex?: number
  ) => {
    if (!content) return;
    const newContent = { ...content };
    if (field === 'title') {
      newContent.prices.sections[sectionIndex].title = value;
    } else if (itemIndex !== undefined) {
      newContent.prices.sections[sectionIndex].items[itemIndex] = value;
    }
    setContent(newContent);
  };

  const addPriceItem = (sectionIndex: number) => {
    if (!content) return;
    const newContent = { ...content };
    newContent.prices.sections[sectionIndex].items.push('New item');
    setContent(newContent);
  };

  const removePriceItem = (sectionIndex: number, itemIndex: number) => {
    if (!content) return;
    const newContent = { ...content };
    newContent.prices.sections[sectionIndex].items.splice(itemIndex, 1);
    setContent(newContent);
  };

  const addPriceSection = () => {
    if (!content) return;
    const newContent = { ...content };
    newContent.prices.sections.push({
      title: 'New Section',
      items: ['New item']
    });
    setContent(newContent);
  };

  const removePriceSection = (sectionIndex: number) => {
    if (!content) return;
    const newContent = { ...content };
    newContent.prices.sections.splice(sectionIndex, 1);
    setContent(newContent);
  };

  const addAboutParagraph = () => {
    if (!content) return;
    const newContent = { ...content };
    newContent.about.paragraphs.push('New paragraph');
    setContent(newContent);
  };

  const removeAboutParagraph = (index: number) => {
    if (!content) return;
    const newContent = { ...content };
    newContent.about.paragraphs.splice(index, 1);
    setContent(newContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    try {
      setError('');
      setSuccess('');
      await axios.put('/api/content', content);
      setSuccess('Content updated successfully!');
    } catch (err) {
      console.error('Error updating content:', err);
      setError('Error updating content');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 text-xl font-semibold">
          <i className="fas fa-exclamation-circle mr-2"></i>
          Error loading content
        </div>
      </div>
    );
  }

  return (
    <div className="content-admin">
      <div className="content-container">
        <div className="content-card animate-fade-in">
          {/* Header */}
          <div className="content-header">
            <h2 className="content-title">Manage Content</h2>
            <Link href="/admin" className="back-button">
              <i className="fas fa-arrow-left"></i>
              Back
            </Link>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <button
              onClick={() => setActiveTab('about')}
              className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
            >
              <i className="fas fa-info-circle"></i>
              About
            </button>
            <button
              onClick={() => setActiveTab('prices')}
              className={`tab-button ${activeTab === 'prices' ? 'active' : ''}`}
            >
              <i className="fas fa-tag"></i>
              Prices
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="content-form">
            {error && (
              <div className="message error">
                <i className="fas fa-exclamation-circle"></i>
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="message success">
                <i className="fas fa-check-circle"></i>
                <p>{success}</p>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="section">
                <div className="section-header">
                  <h3 className="section-title">About</h3>
                  <button
                    type="button"
                    onClick={addAboutParagraph}
                    className="button button-primary"
                  >
                    <i className="fas fa-plus"></i>
                    Add Paragraph
                  </button>
                </div>
                <div className="space-y-4">
                  {content.about.paragraphs.map((paragraph, index) => (
                    <div key={index} className="relative group">
                      <textarea
                        value={paragraph}
                        onChange={(e) => handleAboutChange(index, e.target.value)}
                        className="text-area"
                        rows={4}
                        placeholder="Type the paragraph content..."
                      />
                      <button
                        type="button"
                        onClick={() => removeAboutParagraph(index)}
                        className="button button-danger absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                        title="Remove paragraph"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'prices' && (
              <div className="section">
                <div className="section-header">
                  <h3 className="section-title">Prices</h3>
                  <button
                    type="button"
                    onClick={addPriceSection}
                    className="button button-primary"
                  >
                    <i className="fas fa-plus"></i>
                    Add Section
                  </button>
                </div>
                <div className="space-y-6">
                  {content.prices.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="price-section">
                      <div className="flex justify-between items-center mb-4">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => handlePriceSectionChange(sectionIndex, 'title', e.target.value)}
                          className="section-title-input"
                          placeholder="Section title"
                        />
                        <button
                          type="button"
                          onClick={() => removePriceSection(sectionIndex)}
                          className="button button-danger"
                          title="Remove section"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <div className="space-y-4">
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handlePriceSectionChange(sectionIndex, 'items', e.target.value, itemIndex)}
                              className="item-input"
                              placeholder="Price item"
                            />
                            <button
                              type="button"
                              onClick={() => removePriceItem(sectionIndex, itemIndex)}
                              className="button button-danger"
                              title="Remove item"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addPriceItem(sectionIndex)}
                          className="button button-secondary"
                        >
                          <i className="fas fa-plus"></i>
                          Add Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="button button-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 