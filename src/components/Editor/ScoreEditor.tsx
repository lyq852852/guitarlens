import React, { useState } from 'react';
import useEditor from '../hooks/useEditor';
import { downloadFile, exportToPDF, exportToMusicXML, exportToGuitarPro } from '../utils/exportUtils';
import { saveProject } from '../utils/projectManager';
import '../styles/editor.css';

interface ScoreEditorProps {
  result: any;
  onSave?: (state: any) => void;
}

const ScoreEditor: React.FC<ScoreEditorProps> = ({ result, onSave }) => {
  const editor = useEditor(result);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState('My Project');
  const [projectDesc, setProjectDesc] = useState('');

  const handleExport = async (format: 'pdf' | 'musicxml' | 'gp') => {
    try {
      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'pdf':
          blob = await exportToPDF(editor.state);
          filename = `${editor.state.title}.pdf`;
          break;
        case 'musicxml':
          blob = exportToMusicXML(editor.state);
          filename = `${editor.state.title}.musicxml`;
          break;
        case 'gp':
          blob = exportToGuitarPro(editor.state);
          filename = `${editor.state.title}.gpx`;
          break;
      }

      downloadFile(blob, filename);
      setShowExportDialog(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleSaveProject = () => {
    try {
      saveProject(projectName, projectDesc, editor.state);
      setShowSaveDialog(false);
      if (onSave) {
        onSave(editor.state);
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  return (
    <div className="score-editor">
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={editor.undo}
            disabled={!editor.canUndo}
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            className="toolbar-btn"
            onClick={editor.redo}
            disabled={!editor.canRedo}
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
        </div>

        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => setShowSaveProject(true)}
            title="Save Project"
          >
            💾 Save
          </button>
          <button
            className="toolbar-btn"
            onClick={() => setShowExportDialog(true)}
            title="Export"
          >
            📤 Export
          </button>
        </div>

        <div className="toolbar-info">
          <span>Notes: {editor.state.notes.length}</span>
          <span>Chords: {editor.state.chords.length}</span>
          <span>BPM: {editor.state.bpm}</span>
          <span>Key: {editor.state.key}</span>
        </div>
      </div>

      <div className="editor-content">
        <div className="editor-panel">
          <h3>📝 Notes ({editor.state.notes.length})</h3>
          <div className="notes-list">
            {editor.state.notes.map((note) => (
              <div key={note.id} className="note-item">
                <span>String {note.string}, Fret {note.fret}</span>
                <button
                  className="delete-btn"
                  onClick={() => editor.deleteNote(note.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="editor-panel">
          <h3>🎼 Chords ({editor.state.chords.length})</h3>
          <div className="chords-list">
            {editor.state.chords.map((chord) => (
              <div key={chord.id} className="chord-item">
                <span>{chord.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="dialog-overlay" onClick={() => setShowExportDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Export Score</h3>
            <div className="dialog-buttons">
              <button onClick={() => handleExport('pdf')}>📄 PDF</button>
              <button onClick={() => handleExport('musicxml')}>🎵 MusicXML</button>
              <button onClick={() => handleExport('gp')}>🎸 GuitarPro</button>
              <button onClick={() => setShowExportDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="dialog-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Save Project</h3>
            <input
              type="text"
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="dialog-input"
            />
            <textarea
              placeholder="Description"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="dialog-textarea"
            />
            <div className="dialog-buttons">
              <button onClick={handleSaveProject}>Save</button>
              <button onClick={() => setShowSaveDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreEditor;
