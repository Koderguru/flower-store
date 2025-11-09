# Bloom - Modern Flower E-commerce Store

A beautiful, modern, and responsive e-commerce website for flower delivery built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, and Lottie animations.

## Features

✨ **Modern UI/UX**
- Clean, minimalistic design
- Enhanced buttons and icons with smooth animations
- Beautiful product cards with hover effects
- Responsive layout for all devices

🎨 **Interactive Animations**
- Framer Motion for smooth page transitions
- Micro-interactions on buttons and cards
- Lottie animations for loading states
- Scroll-triggered animations

🛍️ **E-commerce Features**
- Product grid with filtering
- Category navigation
- Search functionality
- Shopping cart (UI ready)
- Product ratings and reviews

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lottie React** - Lottie animations
- **Lucide React** - Beautiful icon library

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
flower-store/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with Navbar & Footer
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Footer.tsx       # Footer component
│   │   ├── ProductCard.tsx  # Product card component
│   │   ├── CategoryChip.tsx # Category filter chip
│   │   └── Loading.tsx      # Loading component with Lottie
│   └── data/
│       ├── products.ts      # Product data
│       └── loading.json     # Lottie animation data
```

## Customization

- **Products**: Edit `src/data/products.ts` to add/modify products
- **Categories**: Update categories in `src/data/products.ts`
- **Colors**: Modify color scheme in `src/app/globals.css`
- **Images**: Products use Unsplash images - update URLs in product data

## Build for Production

```bash
npm run build
npm start
```

## License

MIT
