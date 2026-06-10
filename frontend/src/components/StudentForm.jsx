import { useState, useEffect } from 'react';

const API = 'http://127.0.0.1:5000';

const emptyForm = {
  name: '', roll_number: '', attendance: '', internal_marks: '',
  assignment_marks: '', study_hours: '', sleep_hours: '',
  family_support: '3', previous_gpa: '', final_marks: ''
};

function StudentForm({ onDataChange }) {
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API}/get_students`);
      const data = await res.json();
      if (data.success) setStudents(data.students);
    } catch {
      setStudents([]);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const showMsg = (text, type) => {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => setMessage(''), 3500);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId ? `${API}/update_student/${editId}` : `${API}/add_student`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        showMsg(data.message, 'success');
        handleReset();
        fetchStudents();
        if (onDataChange) onDataChange();
      } else {
        showMsg(data.error, 'error');
      }
    } catch {
      showMsg('Server error. Is the backend running?', 'error');
    }
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      roll_number: student.roll_number,
      attendance: student.attendance,
      internal_marks: student.internal_marks,
      assignment_marks: student.assignment_marks,
      study_hours: student.study_hours,
      sleep_hours: student.sleep_hours,
      family_support: student.family_support,
      previous_gpa: student.previous_gpa,
      final_marks: student.final_marks
    });
    setEditId(student.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      const res = await fetch(`${API}/delete_student/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showMsg('Student deleted.', 'success');
        fetchStudents();
        if (onDataChange) onDataChange();
      } else {
        showMsg(data.error, 'error');
      }
    } catch {
      showMsg('Server error.', 'error');
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  return (
    <div>
      <div className="card">
        <div className="card-title">{editId ? 'Edit Student Record' : 'Add Student Record'}</div>
        {message && <div className={`alert alert-${msgType}`}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Student Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="Enter full name" />
            </div>
            <div className="form-group">
              <label>Roll Number *</label>
              <input name="roll_number" value={form.roll_number} onChange={handleChange} required placeholder="e.g. CS2024001" />
            </div>
            <div className="form-group">
              <label>Attendance (%) *</label>
              <input type="number" name="attendance" value={form.attendance} onChange={handleChange} required min="0" max="100" step="0.01" placeholder="0 - 100" />
            </div>
            <div className="form-group">
              <label>Internal Marks (0–100) *</label>
              <input type="number" name="internal_marks" value={form.internal_marks} onChange={handleChange} required min="0" max="100" step="0.01" />
            </div>
            <div className="form-group">
              <label>Assignment Marks (0–100) *</label>
              <input type="number" name="assignment_marks" value={form.assignment_marks} onChange={handleChange} required min="0" max="100" step="0.01" />
            </div>
            <div className="form-group">
              <label>Study Hours / Day *</label>
              <input type="number" name="study_hours" value={form.study_hours} onChange={handleChange} required min="0" max="24" step="0.5" />
            </div>
            <div className="form-group">
              <label>Sleep Hours / Day *</label>
              <input type="number" name="sleep_hours" value={form.sleep_hours} onChange={handleChange} required min="0" max="24" step="0.5" />
            </div>
            <div className="form-group">
              <label>Family Support Rating (1–5) *</label>
              <select name="family_support" value={form.family_support} onChange={handleChange} required>
                {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Previous Semester GPA (0–10) *</label>
              <input type="number" name="previous_gpa" value={form.previous_gpa} onChange={handleChange} required min="0" max="10" step="0.01" />
            </div>
            <div className="form-group">
              <label>Final Exam Marks (0–100) *</label>
              <input type="number" name="final_marks" value={form.final_marks} onChange={handleChange} required min="0" max="100" step="0.01" />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editId ? 'Update Student' : 'Add Student'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>

      <StudentTable students={students} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

function StudentTable({ students, onEdit, onDelete }) {
  if (!students || students.length === 0) {
    return (
      <div className="card">
        <div className="card-title">Student Records (0)</div>
        <p className="loading">No students added yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">Student Records ({students.length})</div>
      {students.length < 7 && (
        <div className="alert alert-info">
          {7 - students.length} more student(s) needed to enable analysis and prediction.
        </div>
      )}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Roll No.</th>
              <th>Attend. (%)</th>
              <th>Internal</th>
              <th>Assignment</th>
              <th>Study Hrs</th>
              <th>Sleep Hrs</th>
              <th>Fam. Support</th>
              <th>Prev. GPA</th>
              <th>Final Marks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.roll_number}</td>
                <td>{s.attendance}</td>
                <td>{s.internal_marks}</td>
                <td>{s.assignment_marks}</td>
                <td>{s.study_hours}</td>
                <td>{s.sleep_hours}</td>
                <td>{s.family_support}</td>
                <td>{s.previous_gpa}</td>
                <td>{s.final_marks}</td>
                <td>
                  <button className="btn btn-warning" style={{marginRight: 6, padding: '4px 10px', fontSize: 12}} onClick={() => onEdit(s)}>Edit</button>
                  <button className="btn btn-danger" style={{padding: '4px 10px', fontSize: 12}} onClick={() => onDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentForm;
