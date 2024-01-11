import React ,{useState} from "react"
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function Home() {
    const [notes, setNotes] = useState([]);
    function addNote(newNote) {
        if (newNote.title !== "" && newNote.content !== "") {
            setNotes((prevNotes) => {
                return [...prevNotes, newNote];
            });
        }
    }

    function deleteNote(id) {
        setNotes((prevNotes) => {
            return prevNotes.filter((noteItem, index) => {
                return index !== id;
            });
        });
    }

    const navigate = useNavigate();
    return (
        <div>
            <Header />
            <CreateArea onAdd={addNote} />
            {notes.map((note, index) => {
                return (
                    <Note
                        key={index}
                        id={index}
                        title={note.title}
                        content={note.content}
                        color={note.color}
                        onDelete={deleteNote}
                    />
                );
            })}
            <Footer />
        </div>
    );
}
export default Home;