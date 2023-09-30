import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import './App.css';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default() =>
{
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  // Loading movies lists from API
  useEffect( 
    ()=>
    {
      const loadAll = async() =>
      {
        // Taking all the movies lists
        let list = await Tmdb.getHomeList();
        setMovieList(list);

        // Taking the featured movie from Netflix Originals
        let originals = list.filter(i=>i.slug === 'originals');
        let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
        let chosen = originals[0].items.results[randomChosen];
        let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
        setFeaturedData(chosenInfo);
      }
      loadAll();
    },
  []);

  useEffect(
    ()=>
    {
      const scrollListener = ()=>
      {
        if( window.scrollY > 10 )
        {
          setBlackHeader(true);
        }
        else
        {
          setBlackHeader(false);
        }
      }
      window.addEventListener('scroll', scrollListener);

      return() =>
      {
        window.removeEventListener('scroll', scrollListener);
      }
    },
  []);

  // Visual part
  return(
    <div className="Page">

      <Header black={blackHeader} />

      {featuredData &&
        <FeaturedMovie item={featuredData} />
      } 
      
      <section className="lists">
        {movieList.map( (item,key) =>
        (
          // Passing the title and items properties to MovieRow
          <MovieRow key={key} title={item.title} items={item.items} />
        )
        )}
      </section>

      <footer>
        Feito com <span role="img" aria-label="coração">❤️</span> pela B7Web <br/>
        Direitos de imagem para Netflix<br/>
        Dados pegos do site Themoviedb.org
      </footer>

      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif" alt="Carregando" />
        </div>
      }

    </div>
  );
}