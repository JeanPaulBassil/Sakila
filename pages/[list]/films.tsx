import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Styles from '../../styles/films.module.sass'
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface FilmList {
    id: number;
    title: string;
    member: string;
    date: Date;
}
  
interface FilmProps {
    filmList: FilmList;
}

interface Film {
    title: string;
    actors: string[];
    duration: number;
}

const Button: React.FC<{ film: Film | null; onClick: () => void }> = ({ film, onClick }) => (
    <button
      className={`${Styles.filmButton} ${film ? Styles.pointerCursor : Styles.defaultCursor}`}
      onClick={onClick}
    >
      {film ? film.title : "..."}
    </button>
);



const Films: React.FC<FilmProps> = ({ filmList }) => {
    const [films, setFilms] = useState<Film[]>([]);
    const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
    const router = useRouter();

    const handleAddFilms = () => {
        router.push(`/${filmList.id}/addFilms`);
    };

    useEffect(() => {
        const fetchFilms = async () => {
          try {
            const response = await axios.get(`${process.env.API_URL}/api/films/${filmList.id}`);
            setFilms(response.data);
          } catch (error) {
            console.error('Error fetching films:', error);
          }
        };
    
        fetchFilms();

        
    }, [filmList]);

    const handleClick = (film: Film) => {
        setSelectedFilm(film);
    };

    const renderDetails = () => {
        if (!selectedFilm) {
            return (
            <>
                <p>...</p>
                <p>...</p>
                <p>...</p>
            </>
            );
        }

        const hours = Math.floor(selectedFilm.duration / 60);
        const minutes = selectedFilm.duration % 60;

        return (
            <>
            <p>{selectedFilm.title} details</p>
            <p>Actors: {selectedFilm.actors.join(', ')}</p>
            <p>Duration: {hours}h{minutes}</p>
            </>
        );
    };

    const buttons = films.slice(0, 5).map((film) => (
        <Button key={film.title} film={film} onClick={() => handleClick(film)} />
    ));

    while (buttons.length < 5) {
        buttons.push(<Button key={buttons.length} film={null} onClick={() => {}} />);
    }

    return (
        <div className={Styles.container}>
          <h1>films of favorite list: {filmList.title} - {filmList.member}</h1>
          <div className={Styles.films}>
            <div className={Styles.filmButtonsContainer}>
              {buttons}
            </div>
            <div className={Styles.filmDetailsContainer}>
              {renderDetails()}
            </div>
          </div>
          <div className={Styles.buttons}>
            <button onClick={() => router.push('/')}><p>Close</p></button>
            <button onClick={handleAddFilms}><p>Add Films</p></button>
          </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { film } = context.query;

    if (film) {
        return {
        props: {
            filmList: JSON.parse(film as string),
        },
        };
    } else {
        return {
        notFound: true,
        };
    }
};
  
export default Films;  
