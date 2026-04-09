import { Metadata } from 'next';
import { therapistsData } from '@/lib/therapists';

type Props = {
    params: { id: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const t = therapistsData[params.id];

    if (!t) {
        return {
            title: 'Terapeuta no encontrado | Psicólogos Ahora',
        }
    }

    const title = `${t.name} - ${t.specialty} | Psicólogos Ahora`;
    const description = `Agenda tu sesión con ${t.name}. ${t.bio.substring(0, 150)}...`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [t.image],
            type: 'profile',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [t.image],
        }
    }
}

export default function TerapeutaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // The layout just wraps the page and provides metadata
    return <>{children}</>;
}
