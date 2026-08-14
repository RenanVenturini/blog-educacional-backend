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

    useEffect(() => {

        carregarPosts();

    }, []);

    async function carregarPosts() {

        const resultado = await listarPosts();

        setPosts(resultado);

    }

    async function pesquisar(texto:string){

        setPesquisa(texto);

        if(texto.trim()===""){

            carregarPosts();

            return;
        }

        const resultado = await buscarPosts(texto);

        setPosts(resultado);

    }

    return (

        <>
            <Header/>

            <main className="container">

                <SearchBar
                    valor={pesquisa}
                    aoAlterar={pesquisar}
                />

                {posts.map(post=>(
                    <PostCard
                        key={post.idAula}
                        post={post}
                    />
                ))}

            </main>

            <Footer/>

        </>

    );

}

export default Home;