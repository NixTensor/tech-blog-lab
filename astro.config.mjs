import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations:[
    starlight({
      title: 'Tech Blog Lab',
      customCss: [],
      // Génération automatique du menu
      sidebar:[
        {
          label: 'Tutoriels (Français)',
          autogenerate: { directory: 'fr/guides' },
        },
        {
          label: 'Tutorials (English)',
          autogenerate: { directory: 'en/guides' },
        }
      ],
    }),
  ],
});
