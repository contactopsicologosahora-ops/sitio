import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/gracias/', '/gracias-reserva/', '/api/'],
        },
        sitemap: 'https://psicologosahora.cl/sitemap.xml',
    };
}
