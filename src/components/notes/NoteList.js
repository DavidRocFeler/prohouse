import { Card, Button, Row, Col, Badge, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { useState } from "react";

function NoteList({ notes, onDeleteNote, onUpdateNote }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  // Start editing
  const startEditing = (note) => {
    setEditingId(note.id);
    setEditForm({ title: note.title, content: note.content });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ title: "", content: "" });
  };

  // Save edited note
  const saveEdit = async (noteId) => {
    if (!editForm.title || !editForm.content) {
      alert("Please fill in both title and content");
      return;
    }

    try {
      const response = await fetch(`/api/v1/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (data.success) {
        onUpdateNote(data.data); // Update in parent
        setEditingId(null);
      }
    } catch (error) {
      alert("Error updating note");
    }
  };

  if (notes.length === 0) {
    return (
      <Card className="bg-black-100 rounded p-5 text-center mt-4">
        <Card.Body>
          <h5 className="text-white">No notes yet</h5>
          <p className="gray-90">Create your first note to get started!</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mt-5"
    >
      <h3 className="text-white mb-4">Your Notes ({notes.length})</h3>
      <Row>
        {notes.map((note) => (
          <Col key={note.id} lg={6} className="mb-3">
            <Card className="bg-black-100 rounded h-100">
              <Card.Body className="p-3">
                {editingId === note.id ? (
                  // Edit Mode
                  <>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        className="bg-dark border-dark text-white mb-2"
                        placeholder="Title"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={editForm.content}
                        onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                        className="bg-dark border-dark text-white"
                        placeholder="Content"
                      />
                    </Form.Group>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => saveEdit(note.id)}
                        className="flex-grow-1"
                      >
                        Save
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  // View Mode
                  <>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge bg="secondary" className="mb-1">
                        ID: {note.id}
                      </Badge>
                      <small className="gray-90">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </small>
                    </div>
                    
                    <h6 className="text-white mb-2">{note.title}</h6>
                    <p className="gray-90 small" style={{ whiteSpace: 'pre-wrap' }}>
                      {note.content}
                    </p>
                    
                    <div className="d-flex gap-2 mt-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => startEditing(note)}
                        className="flex-grow-1"
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => onDeleteNote(note.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </motion.div>
  );
}

export default NoteList;