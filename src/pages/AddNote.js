import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import NoteList from "../components/notes/NoteList";
import "bootstrap/dist/css/bootstrap.min.css";

function AddNote() {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [notes, setNotes] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/v1/notes');
      const data = await response.json();
      if (data.success) setNotes(data.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Create note
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setAlert({ show: true, message: "Please fill in both fields", type: "danger" });
      return;
    }

    try {
      const response = await fetch('/api/v1/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setAlert({ show: true, message: "Note created successfully!", type: "success" });
        setFormData({ title: "", content: "" });
        fetchNotes(); // Refresh list
      }
    } catch (error) {
      setAlert({ show: true, message: "Network error", type: "danger" });
    }
  };

  // Delete note
  const handleDeleteNote = async (id) => {
    if (window.confirm("Delete this note?")) {
      try {
        const response = await fetch(`/api/v1/notes/${id}`, { method: 'DELETE' });
        const data = await response.json();
        
        if (data.success) {
          setAlert({ show: true, message: "Note deleted!", type: "success" });
          fetchNotes();
        }
      } catch (error) {
        setAlert({ show: true, message: "Delete failed", type: "danger" });
      }
    }
  };

  // Update note (when edited in NoteList)
  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="add-note py-5">
      <Container>
        {/* Form Section - SOLO PARA CREAR */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="text-center mb-4">
            <h2 className="text-white fw-bold">Create New Note</h2>
            <p className="gray-90">Add a new note to your collection</p>
          </div>

          <Card className="bg-black-100 rounded p-4 mx-auto" style={{ maxWidth: "600px" }}>
            <Card.Body>
              {alert.show && <Alert variant={alert.type}>{alert.message}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter note title"
                    className="bg-dark border-dark text-white"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-white">Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Enter your note content..."
                    className="bg-dark border-dark text-white"
                  />
                </Form.Group>

                <Button type="submit" className="w-100 mx-auto py-2 fw-bold" style={{ background: "linear-gradient(45deg, #6C63FF, #4A44C6)", border: "none" }}>
                  Create Note
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Notes List Section - CON EDICIÓN IN-PLACE */}
        <NoteList 
          notes={notes} 
          onDeleteNote={handleDeleteNote}
          onUpdateNote={handleUpdateNote}
        />
      </Container>
    </div>
  );
}

export default AddNote;