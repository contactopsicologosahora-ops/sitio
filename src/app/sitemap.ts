import { MetadataRoute } from 'next';
import { therapistsData } from '@/lib/therapists';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://psicologosahora.cl';

    // Rutas estáticas principales
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/terapeutas`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    // Rutas dinámicas de los terapeutas
    const therapistRoutes: MetadataRoute.Sitemap = Object.keys(therapistsData).map((id) => ({
        url: `${baseUrl}/terapeutas/${id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
    }));

    return [...staticRoutes, ...therapistRoutes];
}
