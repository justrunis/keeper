import React ,{useState} from "react"
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import Axios from "axios";

function Home() {
    const [notes, setNotes] = useState([]);
    const [needsEdit, setNeedsEdit] = useState(null);

    function makePostRequest(url, data) {

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function addNote(newNote) {
        makePostRequest('http://localhost:4000/addNote', newNote);
        if (newNote.title !== "" && newNote.content !== "") {
            setNotes((prevNotes) => {
                return [...prevNotes, newNote];
            });
        }
    }

    function deleteNote(id) {
        makePostRequest('http://localhost:4000/deleteNote', {id: id});
        setNotes((prevNotes) => {
            return prevNotes.filter((noteItem, index) => {
                return index !== id;
            });
        });
    }

    function enableEdit(id) {
        setNeedsEdit(id);
    }

    function editNote(id, title, content, color) {
        makePostRequest('http://localhost:4000/editNote', {id: id, title: title, content: content, color: color});
        setNotes((prevNotes) => {
            return prevNotes.map((noteItem, index) => {
                if (index === id) {
                    return {
                        title: title,
                        content: content,
                        color: color
                    };
                } else {
                    return noteItem;
                }
            });
        });
        setNeedsEdit(null);
    }

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
                        needsEdit={needsEdit === index}
                        onDelete={deleteNote}
                        onEdit={enableEdit}
                        onSave={editNote}
                    />
                );
            })}
            <Footer />
        </div>
    );
}
export default Home;