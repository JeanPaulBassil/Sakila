import React, { ChangeEvent, MouseEvent } from "react";
import Styles from "../styles/createNew.module.sass";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Global from "../styles/globals.module.sass";

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
      <div className={Styles.form}>
      <h1>Create Favorite Films List</h1>
      <div className={Styles.field}>
        <input
          placeholder='Title'
          type="text"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          className={Styles.input_field}
        />
      </div>
      <div className={Styles.field}>
        <input
          placeholder='Family Member'
          type="text"
          value={member}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setMember(e.target.value)}
          className={Styles.input_field}
        />
      </div>
      <div className={Styles.field}>
        <input
          placeholder="Date"
          type="date"
          value={date}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
          className={Styles.input_field}
        />
      </div>
      <div className={Styles.btn}>
        <button onClick={submit} className={Styles.button1}>Create</button>
        <button onClick={() => router.push("/")}className={Styles.button2}><p>Home</p></button>
      </div>
      </div>
    </main>
  );
};

export default CreateNew;
