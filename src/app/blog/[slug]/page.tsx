import { blogPosts } from "@/lib/blogData";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) return { title: "No encontrado" };
    
    return {
        title: `${post.title} | Blog Psicólogos Ahora`,
        description: post.excerpt,
    };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
    const post = blogPosts.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <header style={{ padding: "1.5rem 5%", borderBottom: "1px solid #eaeaea", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--primary)" }}>
                    {/* Recreating quick link to home */}
                    <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Psicólogos Ahora.
                    </Link>
                </div>
                <Navbar />
            </header>

            <main style={{ flex: 1, backgroundColor: "#fff" }}>
                <article style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 5%" }}>
                    
                    <Link href="/blog" style={{ 
                        display: "inline-flex", 
                        alignItems: "center", 
                        gap: "0.5rem", 
                        color: "var(--accent)", 
                        textDecoration: "none", 
                        fontWeight: 600,
                        marginBottom: "3rem"
                    }}>
                        <ArrowLeft size={18} /> Volver al Blog
                    </Link>

                    <header style={{ marginBottom: "3rem" }}>
                        <div style={{ display: "flex", gap: "1.5rem", color: "var(--text-soft)", fontSize: "0.95rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Calendar size={16} color="var(--primary)" /> {post.date}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Clock size={16} color="var(--primary)" /> {post.readTime}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <User size={16} color="var(--primary)" /> {post.author}
                            </span>
                        </div>

                        <h1 style={{ 
                            fontSize: "clamp(2rem, 5vw, 3.5rem)", 
                            color: "var(--primary)", 
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                            marginBottom: "2rem"
                        }}>
                            {post.title}
                        </h1>

                        <img 
                            src={post.image} 
                            alt={post.title} 
                            style={{ 
                                width: "100%", 
                                maxHeight: "400px", 
                                objectFit: "cover", 
                                borderRadius: "16px",
                                boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
                            }} 
                        />
                    </header>

                    <div 
                        className="blog-content"
                        dangerouslySetInnerHTML={{ __html: post.content }} 
                    />

                </article>

                <section style={{ backgroundColor: "#f4f6f8", padding: "4rem 5%", textAlign: "center", marginTop: "4rem" }}>
                    <h3 style={{ fontSize: "2rem", color: "var(--primary)", marginBottom: "1rem" }}>
                        ¿Buscas iniciar un proceso psicoterapéutico?
                    </h3>
                    <p style={{ color: "var(--text-soft)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
                        Nuestros especialistas están listos para acompañarte en este camino de forma ética y profesional.
                    </p>
                    <Link href="/terapeutas" style={{
                         backgroundColor: "var(--primary)",
                         color: "white",
                         padding: "1rem 2.5rem",
                         borderRadius: "50px",
                         textDecoration: "none",
                         fontWeight: 600,
                         display: "inline-block",
                         boxShadow: "0 10px 20px rgba(29, 53, 87, 0.2)"
                    }}>
                        Conocer a nuestros Psicólogos
                    </Link>
                </section>
            </main>
            <Footer />
        </div>
    );
}
