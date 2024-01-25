import React ,{useState, useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { variables } from "../Variables";
import { useNavigate } from "react-router-dom";
import { makeDeleteRequest, makePostRequest } from "../DatabaseRequests.js";

function Home(props) {
    const [notes, setNotes] = useState([]);
    const [needsEdit, setNeedsEdit] = useState(null);

    const navigate = useNavigate();

    function getNotes(){
        const URL = variables.API_URL + "getNotes/" + props.email;
        fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: props.email })
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
        }).then(data => {
            setNotes(data);
        });
    }

    // Get notes from database
    useEffect(() => {
        if (props.loggedIn) {
            getNotes();
        } else {
            navigate("/");
        }
    }, [props.loggedIn, props.email]);

    async function addNote(newNote) {
        newNote.email = props.email;
        
        const URL = variables.API_URL + "addNote";
        
        if (newNote.title !== "" && newNote.content !== "" && newNote.color !== "") {
            try {
                let id = await makePostRequest(URL, newNote);
                console.log("id", id);
                newNote.id = id;
                
                setNotes((prevNotes) => {
                    return [...prevNotes, newNote];
                });
            } catch (error) {
                // Handle error if needed
                console.error('Error adding note:', error);
            }
        }
    }

    async function deleteNote(id) {
        const URL = variables.API_URL + "deleteNote/" + id;
        try {
            await makeDeleteRequest(URL);
            
            setNotes((prevNotes) => {
                const updatedNotes = prevNotes.filter((noteItem) => {
                    return noteItem.id !== id;
                });
                return updatedNotes;
            });
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }
    

    function enableEdit(id) {
        console.log("id", id);
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
                        id={note.id}
                        title={note.title}
                        content={note.content}
                        color={note.color}
                        needsEdit={needsEdit === note.id}
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