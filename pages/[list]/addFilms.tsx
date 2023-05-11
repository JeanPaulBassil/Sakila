import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Styles from "../../styles/newFilms.module.sass";
import { GetServerSideProps } from "next";
import Globals from "../../styles/globals.module.sass";

interface FilmList {
  id: number;
  title: string;
  member: string;
  date: Date;
}

interface FilmProps {
  film: FilmList;
}

export interface FilmData {
  id: number;
  title: string;
}

const AddFilms: React.FC<FilmProps> = ({ film }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [actorName, setActorName] = useState("");
  const [filmTitle, setFilmTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Select category");
  const [categories, setCategories] = useState<string[]>([]);
  const [fetchedFilms, setFetchedFilms] = useState<FilmData[]>([]);
  const [disabledButtons, setDisabledButtons] = useState<boolean[]>([]);
  const router = useRouter();

  const handleListButtonClick = (index: number) => {
    addFilmToList(fetchedFilms[index]);
  };

  const addFilmToList = async (filmData: FilmData) => {
    try {
      await axios.post(`${process.env.API_URL}/api/addFilmToList`, {
        listId: film.id,
        filmId: filmData.id,
      });
      console.log(`Film "${filmData.title}" has been added to the list`);
    } catch (error) {
      console.error("Error adding film to the list", error);
    }
  };


  const searchFilms = async () => {
    if (!actorName && !filmTitle && selectedCategory === "Select category") {
      setFetchedFilms([]);
      return;
    }
    try {
      const response = await axios.get(`${process.env.API_URL}/api/searchFilms`, {
        params: {
          category: selectedCategory !== "Select category" ? selectedCategory : "",
          title: filmTitle,
          actor: actorName,
        },
      });
      const films: FilmData[] = response.data;
      setFetchedFilms(films);
      setDisabledButtons(films.map(() => true));
    } catch (error) {
      console.error("Error searching films", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.API_URL}/api/getCategories`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setShowDropdown(false);
  };

  

  const handleButtonClick = (index: number) => {
    const updatedDisabledButtons = [...disabledButtons];
    updatedDisabledButtons[index] = !updatedDisabledButtons[index];
    setDisabledButtons(updatedDisabledButtons);
  };
  console.log(disabledButtons)
  return (
    <div className={Styles.container}>
      <div className={Styles.home}>
        <h1>Add films to the Favorites List: {film.title}</h1>
        <div className={Styles.search}>
          <div className={Styles.input}>
            <div className={Styles.inputs}>
              <div className={Styles.formControl}>
                <input
                  title="name"
                  type="value"
                  value={actorName}
                  onChange={(e) => setActorName(e.target.value)}
                  placeholder=" "
                />

                <label>
                  <span style={{transitionDelay: "0ms"}}>A</span>
                  <span style={{transitionDelay: "50ms"}}>c</span>
                  <span style={{transitionDelay: "100ms"}}>t</span>
                  <span style={{transitionDelay: "150ms"}}>o</span>
                  <span style={{transitionDelay: "200ms"}}>r</span>
                  <span style={{transitionDelay: "250ms"}}> </span>
                  <span style={{transitionDelay: "300ms"}}>N</span>
                  <span style={{transitionDelay: "350ms"}}>a</span>
                  <span style={{transitionDelay: "400ms"}}>m</span>
                  <span style={{transitionDelay: "450ms"}}>e</span>
                </label>
                
              </div>
              
            </div>
            <div className={Styles.inputs}>
              <div className={Styles.formControl}>
                <input
                  title="title"
                  type="value"
                  value={filmTitle}
                  onChange={(e) => setFilmTitle(e.target.value)}
                  placeholder=" "
                />

                <label>
                  <span style={{transitionDelay: "0ms"}}>F</span>
                  <span style={{transitionDelay: "50ms"}}>i</span>
                  <span style={{transitionDelay: "100ms"}}>l</span>
                  <span style={{transitionDelay: "150ms"}}>m</span>
                  <span style={{transitionDelay: "200ms"}}></span>
                  <span style={{transitionDelay: "250ms"}}>T </span>
                  <span style={{transitionDelay: "300ms"}}>i</span>
                  <span style={{transitionDelay: "350ms"}}>t</span>
                  <span style={{transitionDelay: "400ms"}}>l</span>
                  <span style={{transitionDelay: "450ms"}}>e</span>
                </label>
              </div>
              
            </div>
              
          </div>
          <div className={Styles.dropdownWrapper}>
            <button onClick={toggleDropdown} className={Styles.btn}>
            <span className={Styles.icon}>
              <svg viewBox="0 0 175 80" width="40" height="40">
                  <rect width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                  <rect y="30" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                  <rect y="60" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
              </svg>
          </span>
              <span className={Styles.text}>{selectedCategory}</span>
            </button>
            {showDropdown && (
              <ul className={Styles.dropdown}>
                <button onClick={() => handleCategoryClick("Select category")} className={Styles.enabled}>
                  <p>Remove Category</p>
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={Styles.enabled}
                  >
                    <p>{category}</p>
                  </button>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className={Styles.lower}>
          <div className={Styles.buttons}>
            <button className={Styles.close} onClick={() => router.push('/')} className={Globals.darkBtn}>
              <p>close</p>
            </button>
            <button onClick={searchFilms} className={Globals.darkBtn}>
                  <p>Search</p>
            </button>
          </div>
          <div className={Styles.output}>
            <ul>
              {fetchedFilms.length === 0
                ? Array(5)
                    .fill(null)
                    .map((_, index) => (
                      <li key={index}>
                        <button disabled className={Styles.disabled}>
                          <p>---</p>
                        </button>
                      </li>
                    ))
                : fetchedFilms.map((filmData, index) => (
                    <li key={filmData.id}>
                      <button
                        onClick={() => handleListButtonClick(index)}
                        className={disabledButtons[index] ? Styles.enabled : Styles.disabled}
                      >
                        <p>{filmData.title}</p>
                      </button>
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.list;

  try {
    const response = await axios.get(`${process.env.API_URL}/api/getList`, {
      params: { id },
    });
    const film: FilmList = response.data;

    return {
      props: {
        film,
      },
    };
  } catch (error) {
    console.error("Error fetching film", error);

    return {
      notFound: true,
    };
  }
};

export default AddFilms;
