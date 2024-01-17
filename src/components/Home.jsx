import React ,{useState} from "react"
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function Home() {
    const [notes, setNotes] = useState([]);
    const [needsEdit, setNeedsEdit] = useState(null); // Initialize with null

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

    function enableEdit(id) {
        setNeedsEdit(id);
    }

    function editNote(id, title, content, color) {
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