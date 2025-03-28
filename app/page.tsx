import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="main-container">
      <div className="content-wrapper">
        <div className="header">
          <div className="profile-image-container">
            
            <Image 
              src="/profile-banner.jpg"
              alt="Profile Banner"
              fill
              className="profile-image"
              priority
            />
            <h2>Your Banner</h2>
          </div>
          <div className="header-content">
            <div className="logo-container">
              <Image 
                src="/logo.png"
                alt="Logo"
                width={300}
                height={100}
                className="logo-image"
                priority
              />
              <h2>Your logo/name</h2>
            </div>
            <h1 className="title">Artist</h1>
            <h2 className="subtitle">Digital Artist / Illustrator</h2>
          </div>
        
          <nav className="navigation">
            <Link href="/about" className="nav-button">About</Link>
            <Link href="/gallery" className="nav-button">Gallery</Link>
            <Link href="/prices" className="nav-button">Prices</Link>
            <Link href="/icon" className="nav-button">Icon</Link>
            <Link href="/sticker" className="nav-button">Sticker</Link>
          </nav>

          <div className="social-links">
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="social-link discord">
              <i className="fab fa-discord"></i>
            </a>
            <Link href="/contact" className="social-link comments">
              <i className="far fa-comments"></i>
            </Link>
            <a href="mailto:your-email@example.com" className="social-link email">
              <i className="far fa-envelope"></i>
            </a>
            <Link href="/login" className="social-link login">
              <i className="fas fa-user"></i>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 