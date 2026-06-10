from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, get_all_students, add_student, update_student, delete_student
from analysis import compute_regression, compute_factor_analysis, compute_dashboard, predict_for_new_student

app = Flask(__name__)
CORS(app)

# Initialize DB on startup
init_db()

MIN_RECORDS = 7


@app.route('/get_students', methods=['GET'])
def get_students():
    try:
        students = get_all_students()
        return jsonify({'success': True, 'students': students, 'count': len(students)})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/add_student', methods=['POST'])
def add_student_route():
    try:
        data = request.get_json()
        required = ['name', 'roll_number', 'attendance', 'internal_marks',
                    'assignment_marks', 'study_hours', 'sleep_hours',
                    'family_support', 'previous_gpa', 'final_marks']
        for field in required:
            if field not in data or data[field] == '' or data[field] is None:
                return jsonify({'success': False, 'error': f'Missing field: {field}'}), 400

        # Validate ranges
        if not (0 <= float(data['attendance']) <= 100):
            return jsonify({'success': False, 'error': 'Attendance must be 0-100'}), 400
        if not (0 <= float(data['internal_marks']) <= 100):
            return jsonify({'success': False, 'error': 'Internal marks must be 0-100'}), 400
        if not (0 <= float(data['assignment_marks']) <= 100):
            return jsonify({'success': False, 'error': 'Assignment marks must be 0-100'}), 400
        if not (0 <= float(data['study_hours']) <= 24):
            return jsonify({'success': False, 'error': 'Study hours must be 0-24'}), 400
        if not (0 <= float(data['sleep_hours']) <= 24):
            return jsonify({'success': False, 'error': 'Sleep hours must be 0-24'}), 400
        if not (1 <= int(data['family_support']) <= 5):
            return jsonify({'success': False, 'error': 'Family support must be 1-5'}), 400
        if not (0.0 <= float(data['previous_gpa']) <= 10.0):
            return jsonify({'success': False, 'error': 'GPA must be 0.0-10.0'}), 400
        if not (0 <= float(data['final_marks']) <= 100):
            return jsonify({'success': False, 'error': 'Final marks must be 0-100'}), 400

        new_id = add_student(data)
        return jsonify({'success': True, 'id': new_id, 'message': 'Student added successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/update_student/<int:student_id>', methods=['PUT'])
def update_student_route(student_id):
    try:
        data = request.get_json()
        affected = update_student(student_id, data)
        if affected == 0:
            return jsonify({'success': False, 'error': 'Student not found'}), 404
        return jsonify({'success': True, 'message': 'Student updated successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/delete_student/<int:student_id>', methods=['DELETE'])
def delete_student_route(student_id):
    try:
        affected = delete_student(student_id)
        if affected == 0:
            return jsonify({'success': False, 'error': 'Student not found'}), 404
        return jsonify({'success': True, 'message': 'Student deleted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/analyze_data', methods=['GET'])
def analyze_data():
    try:
        students = get_all_students()
        count = len(students)

        if count < MIN_RECORDS:
            return jsonify({
                'success': False,
                'error': f'Minimum {MIN_RECORDS} student records required for analysis. Currently have {count}.',
                'count': count,
                'min_required': MIN_RECORDS
            }), 200

        dashboard = compute_dashboard(students)
        regression = compute_regression(students)
        factor = compute_factor_analysis(students)

        return jsonify({
            'success': True,
            'count': count,
            'dashboard': dashboard,
            'regression': regression,
            'factor_analysis': factor
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/dashboard', methods=['GET'])
def dashboard():
    try:
        students = get_all_students()
        stats = compute_dashboard(students)
        return jsonify({'success': True, 'dashboard': stats, 'count': len(students)})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/predict_marks', methods=['POST'])
def predict_marks():
    try:
        students = get_all_students()
        count = len(students)

        if count < MIN_RECORDS:
            return jsonify({
                'success': False,
                'error': f'Minimum {MIN_RECORDS} student records required for prediction. Currently have {count}.',
                'count': count,
                'min_required': MIN_RECORDS
            }), 200

        data = request.get_json()
        required_fields = ['attendance', 'internal_marks', 'assignment_marks',
                           'study_hours', 'previous_gpa']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Missing field: {field}'}), 400

        predicted = predict_for_new_student(students, data)
        if predicted is None:
            return jsonify({'success': False, 'error': 'Prediction failed'}), 500

        return jsonify({
            'success': True,
            'predicted_marks': predicted,
            'message': f'Predicted Final Marks: {predicted}'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
