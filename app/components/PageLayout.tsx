import Link from 'next/link';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
}

export default function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <main className="main-container">
      <div className="content-wrapper">
        <div className="header">
          <div className="header-content">
            <h1 className="page-title">{title}</h1>
            <div className="page-content">
              {children}
            </div>
          </div>
          <Link href="/" className="back-button">
              <i className="fas fa-arrow-left"></i> Back
            </Link>
        </div>
      </div>
    </main>
  );
} 