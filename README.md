# Artist Portfolio Website

A modern portfolio website for digital artists, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Responsive design
- Image gallery with categories (Gallery, Icons, Stickers)
- Like system for images
- Admin dashboard for content management
- About section with dynamic content
- Pricing section with customizable sections
- Contact form
- Authentication system
- Image upload with ImgBB integration

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Firebase Authentication
- ImgBB API
- Axios

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/artist-site-model.git
cd artist-site-model
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
artist-site-model/
├── app/
│   ├── admin/         # Admin dashboard
│   ├── about/         # About page
│   ├── contact/       # Contact page
│   ├── gallery/       # Gallery page
│   ├── icon/          # Icon page
│   ├── login/         # Login page
│   ├── prices/        # Prices page
│   ├── sticker/       # Sticker page
│   └── view/          # Image view page
├── components/        # Reusable components
├── config/           # Configuration files
├── context/          # React context providers
├── public/           # Static files
└── styles/           # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
