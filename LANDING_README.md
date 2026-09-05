# Trusted Accounts Landing Page

A professional, animated landing page for the Trusted Accounts account recovery service.

## Features

- **Modern Design**: Clean white and navy blue (#0a2342) color scheme
- **Smooth Animations**: Fade-in effects using Intersection Observer
- **Responsive**: Mobile-first design with Tailwind CSS
- **Components**:
  - Sticky navigation with mobile menu
  - Hero section with statistics
  - Features grid
  - How it works steps
  - Testimonials
  - Pricing cards
  - Footer with links

## File Structure

```
src/
  components/landing/
    navbar.js          - Navigation component
    hero.js            - Hero section with stats
    features.js        - Features grid
    how-it-works.js    - Process steps
    testimonials.js    - Customer reviews
    pricing.js         - Pricing packages
    footer.js          - Footer with links
    fade-in.js         - Animation component
  app/
    page.js            - Landing page (updated)
    layout.js          - Root layout (updated)
    globals.css        - Tailwind directives (updated)
```

## Setup

1. **Install dependencies** (already done):
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

2. **Configuration files** (already created):
   - `tailwind.config.js` - Tailwind configuration
   - `postcss.config.js` - PostCSS configuration

3. **Run the development server**:
   ```bash
   npm run dev
   ```

## Customization

### Colors
The primary navy blue color is `#0a2342`. To change it:
1. Update the color in `tailwind.config.js`
2. Replace all instances of `#0a2342` in component files

### Content
Edit the content in each component file:
- **navbar.js**: Navigation links and logo
- **hero.js**: Headline, description, statistics
- **features.js**: Feature cards with icons
- **how-it-works.js**: Process steps
- **testimonials.js**: Customer reviews
- **pricing.js**: Package prices and features
- **footer.js**: Footer links and copyright

### Animations
The `fade-in.js` component uses Intersection Observer for scroll animations. Adjust:
- `threshold`: When to trigger animation (0.1 = 10% visible)
- `delay`: Stagger delay in seconds
- Transition duration and easing in the style object

## Deployment

The landing page is ready for deployment on Vercel, Netlify, or any Next.js hosting platform.

1. Push to GitHub
2. Import to your hosting platform
3. Deploy

## Notes

- The landing page uses Tailwind CSS for styling
- No external animation libraries needed - uses native Intersection Observer
- All components are client-side rendered where needed for interactivity
- The page is fully responsive and works on all device sizes
