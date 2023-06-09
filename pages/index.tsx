import Head from 'next/head';
import { Inter } from '@next/font/google';
import Styles from '../styles/index.module.sass';
import { useRouter } from 'next/router';
import { MouseEvent, useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
import Global from '../styles/globals.module.sass';

const inter = Inter({ subsets: ['latin'] });

interface FilmList {
  id: number;
  title: string;
  member: string;
  date: Date;
}

const Home: React.FC = () => {

  const router = useRouter();

  const [favorites, setFavorites] = useState<FilmList[]>([]);

  useEffect(():void => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL}/api/getLists`);
        const data: FilmList[] = response.data.map((film: FilmList) => ({
          ...film,
          date: new Date(film.date),
        }));

        while (data.length < 5) {
          data.push({ id: Math.floor(performance.now()), title: '...', member: '', date: new Date() });
        }

        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites', error);
      }
    }

    fetchFavorites();
  }, []);

  const handleClick = (film: FilmList) => {
    router.push({
      pathname: `/${film.id}`,
      query: { id: film.id },
    });
  };

  const favoriteElements = favorites.map((film, index) => {
    const isClickable = film.title !== '...';
    return (
      <li key={index}>
        <button disabled={!isClickable} className={!isClickable ? Styles.disabled : Styles.enabled} onClick={() => {
          if (isClickable) {
            handleClick(film);
          }
        }}
        >
          {film.title} - {film.member}
        </button>
      </li>
    );
  });

  const handleCreateNewClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push('/createNew');
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={Styles.container}>
        <h1>Favorite Films List</h1>
        <div className={Styles.home}>
          <button className={Global.darkBtn} onClick={handleCreateNewClick}>
            <p>Create New</p>
          </button>

          <ul>{favoriteElements}</ul>
        </div>
      </main>
    </>
  );
};

export default Home;
