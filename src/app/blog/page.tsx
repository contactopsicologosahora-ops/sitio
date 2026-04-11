import { blogPosts } from "@/lib/blogData";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Blog | Psicólogos Ahora",
    description: "Artículos, reflexiones y herramientas de nuestros especialistas en salud mental.",
};

export default function BlogIndex() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <header style={{ padding: "1.5rem 5%", borderBottom: "1px solid #eaeaea", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--primary)" }}>
                    Psicólogos Ahora.
                </div>
                <Navbar />
            </header>

            <main style={{ flex: 1, backgroundColor: "#fafbfc" }}>
                <section style={{ padding: "5rem 5%", textAlign: "center", backgroundColor: "white", borderBottom: "1px solid #eaeaea" }}>
                    <h1 style={{ fontSize: "3rem", color: "var(--primary)", marginBottom: "1rem" }}>
                        Nuestro Blog
                    </h1>
                    <p style={{ fontSize: "1.2rem", color: "var(--text-soft)", maxWidth: "600px", margin: "0 auto" }}>
                        Reflexiones clínicas, información científica y herramientas prácticas compartidas por nuestros especialistas para tu bienestar diario.
                    </p>
                </section>

                <section style={{ padding: "4rem 5%", maxWidth: "1200px", margin: "0 auto" }}>
                    <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", 
                        gap: "2.5rem" 
                    }}>
                        {blogPosts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <article style={{
                                    backgroundColor: "white",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                                    transition: "transform 0.3s ease, boxShadow 0.3s ease",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.04)';
                                }}
                                >
                                    <div style={{ 
                                        height: "220px", 
                                        backgroundImage: `url(${post.image})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center"
                                    }} />
                                    
                                    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.85rem", color: "var(--text-soft)", marginBottom: "1rem" }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                                <Calendar size={14} /> {post.date}
                                            </span>
                                            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                                <Clock size={14} /> {post.readTime}
                                            </span>
                                        </div>

                                        <h2 style={{ fontSize: "1.4rem", color: "var(--primary)", marginBottom: "1rem", lineHeight: 1.3 }}>
                                            {post.title}
                                        </h2>

                                        <p style={{ color: "var(--text-soft)", fontSize: "0.95rem", lineHeight: 1.6, flex: 1 }}>
                                            {post.excerpt}
                                        </p>

                                        <div style={{ 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "space-between", 
                                            marginTop: "2rem",
                                            borderTop: "1px solid #f0f0f0",
                                            paddingTop: "1rem"
                                        }}>
                                            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--primary)" }}>
                                                Por {post.author}
                                            </span>
                                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent)", fontWeight: 600, fontSize: "0.95rem" }}>
                                                Leer más <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
