import { useEffect, useState } from "react";

import type { Post } from "../../types/Post";

import { buscarPosts, listarPosts } from "../../services/postsService";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SearchBar from "../../components/SearchBar/SearchBar";
import PostCard from "../../components/PostCard/PostCard";

import "./Home.css";

function Home() {

    const [posts, setPosts] = useState<Post[]>([]);
    const [pesquisa, setPesquisa] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregar("");
    }, []);

    async function carregar(termo: string) {
        setCarregando(true);
        setErro("");

        try {
            setPosts(termo.trim() ? await buscarPosts(termo) : await listarPosts());
        } catch {
            setErro("Não foi possível conectar à API. Verifique se o servidor está no ar.");
        } finally {
            setCarregando(false);
        }
    }

    function pesquisar(texto: string) {
        setPesquisa(texto);
        carregar(texto);
    }

    return (

        <>
            <Header/>

            <main className="home">

                <div className="home__container">

                    <section className="home__cabecalho">

                        <h1 className="home__titulo">Área do Aluno</h1>

                        <p className="home__subtitulo">
                            Pesquise as postagens por título, conteúdo, professor ou matéria.
                        </p>

                    </section>

                    <SearchBar
                        valor={pesquisa}
                        aoAlterar={pesquisar}
                    />

                    {carregando && (
                        <p className="home__aviso">Carregando postagens...</p>
                    )}

                    {!carregando && erro && (
                        <p className="home__aviso home__aviso--erro" role="alert">{erro}</p>
                    )}

                    {!carregando && !erro && posts.length === 0 && (
                        <p className="home__aviso">
                            {pesquisa.trim() === ""
                                ? "Nenhuma postagem publicada ainda."
                                : `Nenhuma postagem encontrada para "${pesquisa}".`}
                        </p>
                    )}

                    {!carregando && !erro && posts.length > 0 && (

                        <section className="home__lista">

                            {posts.map(post=>(
                                <PostCard
                                    key={post.idAula}
                                    post={post}
                                />
                            ))}

                        </section>

                    )}

                </div>

            </main>

            <Footer/>

        </>

    );

}

export default Home;
