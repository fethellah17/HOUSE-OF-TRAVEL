import { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

export const useMetaTags = ({ title, description, image, url, type = 'website' }: MetaTagsProps) => {
  useEffect(() => {
    // Titre de la page avec branding
    const fullTitle = `${title} | HOUSE OF TRAVEL`;
    document.title = fullTitle;

    // Fonction helper pour créer ou mettre à jour une balise meta
    const setMetaTag = (property: string, content: string, isProperty = true) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Meta tags standards
    setMetaTag('description', description, false);

    // Open Graph tags (Facebook)
    setMetaTag('og:title', fullTitle);
    setMetaTag('og:description', description);
    setMetaTag('og:type', type);
    setMetaTag('og:site_name', 'HOUSE OF TRAVEL');
    setMetaTag('og:locale', 'fr_FR');
    
    if (url) {
      setMetaTag('og:url', url);
    }
    
    if (image) {
      // Image principale
      setMetaTag('og:image', image);
      setMetaTag('og:image:secure_url', image);
      setMetaTag('og:image:width', '1200');
      setMetaTag('og:image:height', '630');
      setMetaTag('og:image:alt', title);
      setMetaTag('og:image:type', 'image/jpeg');
    }

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image', false);
    setMetaTag('twitter:title', fullTitle, false);
    setMetaTag('twitter:description', description, false);
    setMetaTag('twitter:site', '@HouseOfTravel', false);
    
    if (image) {
      setMetaTag('twitter:image', image, false);
      setMetaTag('twitter:image:alt', title, false);
    }

    // Log pour debug en développement
    if (url && (url.includes('localhost') || url.includes('127.0.0.1'))) {
      console.info(
        '📋 Meta Tags configurés (mode développement):\n',
        `- Titre: ${fullTitle}\n`,
        `- Description: ${description}\n`,
        `- Image: ${image}\n`,
        `- URL: ${url}\n`,
        '⚠️ Note: Les aperçus sociaux nécessitent un domaine public pour fonctionner.'
      );
    }

    // Cleanup function pour réinitialiser au démontage
    return () => {
      document.title = 'HOUSE OF TRAVEL - Agence de Voyage';
    };
  }, [title, description, image, url, type]);
};
