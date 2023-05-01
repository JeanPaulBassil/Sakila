import React from 'react';
import Styles from '../../styles/updateList.module.sass';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface FilmList {
  id: number;
  title: string;
  member: string;
  date: Date;
}

interface FilmProps {
  film: FilmList;
}

const Index: React.FC<FilmProps> = ({ film }) => {

    const [listTitle, setListTitle] = useState(film.title);
    const [familyMember, setFamilyMember] = useState(film.member);
    const [creationDate, setCreationDate] = useState(
    film.date ? new Date(film.date).toISOString().split('T')[0] : ''
  );
  const router = useRouter();
  
  const handleDeleteClick = async () => {
    console.log(film.id)
    try {
        const response = await axios.delete(`${process.env.API_URL}/api/updateList/${film.id}`);

        if (response.status === 200) {
            alert('List deleted successfully!');
            router.push('/');
        }

    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const handleUpdateClick = async () => {
    try {
      const response = await axios.post(`${process.env.API_URL}/api/updateList`, {
        id: film.id,
        title: listTitle,
        member: familyMember,
        date: creationDate,
      });

      if (response.status === 200) {
        alert('List updated successfully!');
        router.push('/');
      }
  
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };
  return (
    <div className={Styles.container}>
        <h1>Update Favorite Films List</h1>
        <div>
            <p>List Title</p>
            <input
            placeholder="List Title"
            type="text"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            />
        </div>
        <div>
            <p>Family Member</p>

            <input
            placeholder="Family Member"
            type="text"
            value={familyMember}
            onChange={(e) => setFamilyMember(e.target.value)}
            />
        </div>
        <div>
            <p>Creation Date</p>
            <input
            placeholder="List Title"
            type="date"
            value={creationDate}
            onChange={(e) => setCreationDate(e.target.value)}
            />
        </div>
        <div>
            <button onClick={handleUpdateClick}><p>Update</p></button>
            <button onClick={handleDeleteClick}><p>Delete List</p></button>
            <button><p>Show Films</p></button>
        </div>
    </div>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;

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
    console.error('Error fetching film', error);

    return {
      notFound: true,
    };
  }
};
