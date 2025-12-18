import "./App.css";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type Note = {
  id: number;
  text: string;
};

function App() {
  const [text, setText] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);
  // load notes from chrome storage
  useEffect(() => {
    chrome.storage.sync.get({ notes: [] }, (items) => {
      const loaded = (items as { notes?: Note[] }).notes ?? [];
      setNotes(loaded);
    });
  }, []);

  // saving notes to chrome storage
  useEffect(() => {
    chrome.storage.sync.set({ notes });
  }, [notes]);

  const addNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;
    const newNote: Note = { id: Date.now(), text: text.trim() };
    setNotes([newNote, ...notes]);
    setText("");
  };
  const deleteNote = (id: number) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="w-72 p-4 bg-[#1B3C53] rounded-lg shadow-md font-sans">
      <h2 className="text-xl text-orange-500 font-bold mb-2">Notes Pulse</h2>
      <div className="mb-4">
        <form onSubmit={addNote} className="flex gap-2 justify-around">
          <input
            className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-300 transition:[outline] duration-300 text-white font-semibold"
            type="text"
            placeholder="Add a Note"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="bg-orange-400 text-white px-3 py-1 rounded hover:bg-orange-500 transition:color duration-300 hover:delay-55">
            Add
          </button>
        </form>
      </div>

      <div className="max-h-64 overflow-y-auto overflow-x-hidden">
        {notes.length === 0 && (
          <p className="text-[#E3E3E3] text-sm">no notes yet</p>
        )}
        {notes.map((note) => {
          return (
            <div
              key={note.id}
              className="flex justify-between items-start mb-2 p-2 bg-[#234C6A] rounded shadow-sm "
            >
              <span className="min-w-0 wrap-break-word whitespace-normal flex-1 mr-2 text-[#E3E3E3]">
                {note.text}
              </span>
              <button
                className="text-red-500 hover:text-red-400 font-bold transition:color hover:delay-75 transition:transform duration:100 hover:scale-105"
                onClick={() => deleteNote(note.id)}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
