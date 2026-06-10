import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'students.db')


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            roll_number TEXT NOT NULL UNIQUE,
            attendance REAL NOT NULL,
            internal_marks REAL NOT NULL,
            assignment_marks REAL NOT NULL,
            study_hours REAL NOT NULL,
            sleep_hours REAL NOT NULL,
            family_support INTEGER NOT NULL,
            previous_gpa REAL NOT NULL,
            final_marks REAL NOT NULL
        )
    ''')
    conn.commit()
    conn.close()


def get_all_students():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM students ORDER BY id ASC')
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def add_student(data):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO students (name, roll_number, attendance, internal_marks,
            assignment_marks, study_hours, sleep_hours, family_support,
            previous_gpa, final_marks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['name'], data['roll_number'], data['attendance'],
        data['internal_marks'], data['assignment_marks'], data['study_hours'],
        data['sleep_hours'], data['family_support'],
        data['previous_gpa'], data['final_marks']
    ))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def update_student(student_id, data):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE students SET
            name=?, roll_number=?, attendance=?, internal_marks=?,
            assignment_marks=?, study_hours=?, sleep_hours=?,
            family_support=?, previous_gpa=?, final_marks=?
        WHERE id=?
    ''', (
        data['name'], data['roll_number'], data['attendance'],
        data['internal_marks'], data['assignment_marks'], data['study_hours'],
        data['sleep_hours'], data['family_support'],
        data['previous_gpa'], data['final_marks'], student_id
    ))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected


def delete_student(student_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM students WHERE id=?', (student_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected
