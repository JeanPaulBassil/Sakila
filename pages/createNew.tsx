import React, { ChangeEvent, MouseEvent } from "react";
import Styles from "../styles/createNew.module.sass";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const CreateNew: React.FC = () => {
  const [title, setTitle] = useState("");
  const [member, setMember] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [id, setId] = useState(Math.floor(performance.now()));
  const router = useRouter();

  const submit = async (e: MouseEvent<HTMLButtonElement>) => {
    if (title === "" || member === "") {
      alert("Please fill out all fields");
      return;
    }
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.API_URL}/api/saveList`, {
        id,
        title,
        member,
        date,
      });
      
      router.push('/')
      alert("List created successfully")
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main className={Styles.container}>
      <h1>Create Favorite Films List</h1>
      <div>
        <p>List Title</p>
        <input
          placeholder='Title'
          type="text"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <p>Family Member</p>
        <input
          placeholder='Name'
          type="text"
          value={member}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setMember(e.target.value)}
        />
      </div>
      <div>
        <p>Creation Date</p>
        <input
          placeholder="Date"
          type="date"
          value={date}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
        />
      </div>
      <div className={Styles.buttons}>
        <button onClick={submit}>Create</button>
        <button onClick={() => router.push("/")}><p>Home</p></button>
      </div>
    </main>
  );
};

export default CreateNew;
