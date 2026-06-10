import numpy as np
import pandas as pd
import math

MIN_RECORDS = 7


def compute_regression(students):
    if len(students) < MIN_RECORDS:
        return None

    df = pd.DataFrame(students)
    feature_cols = ['attendance', 'internal_marks', 'assignment_marks',
                    'study_hours', 'previous_gpa']

    X_raw = df[feature_cols].values.astype(float)
    y = df['final_marks'].values.astype(float)

    ones = np.ones((X_raw.shape[0], 1))
    X = np.hstack([ones, X_raw])

    try:
        XtX = X.T @ X
        Xty = X.T @ y
        coefficients = np.linalg.solve(XtX, Xty)
    except np.linalg.LinAlgError:
        coefficients, _, _, _ = np.linalg.lstsq(X, y, rcond=None)

    intercept = coefficients[0]
    weights = coefficients[1:]

    predictions = X @ coefficients

    results = []
    for i, student in enumerate(students):
        results.append({
            'id': student['id'],
            'name': student['name'],
            'roll_number': student['roll_number'],
            'actual_marks': round(float(y[i]), 2),
            'predicted_marks': round(float(predictions[i]), 2),
            'error': round(float(y[i]) - round(float(predictions[i]), 2), 2)
        })

    return {
        'model': {
            'intercept': round(float(intercept), 4),
            'weights': {
                'attendance': round(float(weights[0]), 4),
                'internal_marks': round(float(weights[1]), 4),
                'assignment_marks': round(float(weights[2]), 4),
                'study_hours': round(float(weights[3]), 4),
                'previous_gpa': round(float(weights[4]), 4)
            }
        },
        'predictions': results
    }


def predict_for_new_student(students, new_data):
    if len(students) < MIN_RECORDS:
        return None

    regression = compute_regression(students)
    if regression is None:
        return None

    weights = regression['model']['weights']
    intercept = regression['model']['intercept']

    predicted = (
        intercept
        + weights['attendance'] * float(new_data['attendance'])
        + weights['internal_marks'] * float(new_data['internal_marks'])
        + weights['assignment_marks'] * float(new_data['assignment_marks'])
        + weights['study_hours'] * float(new_data['study_hours'])
        + weights['previous_gpa'] * float(new_data['previous_gpa'])
    )

    predicted = max(0.0, min(100.0, predicted))
    return round(predicted, 2)


def safe_corr(value):
    """Replace NaN/Inf with 0.0 for safe JSON serialization."""
    if math.isnan(value) or math.isinf(value):
        return 0.0
    return value


def compute_factor_analysis(students):
    if len(students) < MIN_RECORDS:
        return None

    df = pd.DataFrame(students)
    factor_cols = ['attendance', 'assignment_marks', 'internal_marks',
                   'study_hours', 'previous_gpa', 'family_support']

    target = df['final_marks'].values.astype(float)

    correlations = {}
    for col in factor_cols:
        feature = df[col].values.astype(float)
        if feature.std() == 0 or target.std() == 0:
            corr = 0.0
        else:
            corr = float(np.corrcoef(feature, target)[0, 1])
        correlations[col] = round(safe_corr(corr), 4)

    ranked = sorted(correlations.items(), key=lambda x: abs(x[1]), reverse=True)

    labels = {
        'attendance': 'Attendance Percentage',
        'assignment_marks': 'Assignment Marks',
        'internal_marks': 'Internal Marks',
        'study_hours': 'Study Hours Per Day',
        'previous_gpa': 'Previous Semester GPA',
        'family_support': 'Family Support Rating'
    }

    ranked_readable = [
        {'factor': labels[k], 'key': k, 'correlation': v, 'abs_correlation': round(abs(v), 4)}
        for k, v in ranked
    ]

    # Full correlation matrix — fill NaN with 0 before converting to dict
    all_cols = factor_cols + ['final_marks']
    matrix_df = df[all_cols].astype(float).corr().round(4)
    matrix_df = matrix_df.fillna(0)  # ← fixes NaN from zero-variance columns
    correlation_matrix = matrix_df.to_dict()

    return {
        'ranked_factors': ranked_readable,
        'strongest': ranked_readable[0] if ranked_readable else None,
        'second_strongest': ranked_readable[1] if len(ranked_readable) > 1 else None,
        'weakest': ranked_readable[-1] if ranked_readable else None,
        'correlation_matrix': correlation_matrix
    }


def compute_dashboard(students):
    if not students:
        return {
            'total_students': 0,
            'average_marks': 0,
            'highest_marks': 0,
            'lowest_marks': 0,
            'average_attendance': 0
        }

    df = pd.DataFrame(students)
    return {
        'total_students': len(df),
        'average_marks': round(float(df['final_marks'].mean()), 2),
        'highest_marks': round(float(df['final_marks'].max()), 2),
        'lowest_marks': round(float(df['final_marks'].min()), 2),
        'average_attendance': round(float(df['attendance'].mean()), 2)
    }