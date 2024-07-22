# Interactive GPA Calculator

## Overview

The Interactive GPA Calculator is a web application designed to help students calculate their GPA based on course scores and credit points. This tool allows users to add, edit, delete courses, and view the average GPA dynamically. It supports multiple languages for course names and includes features such as sorting courses and exporting/importing course data.

## Features

1. **Add Course**: Users can add new courses with default values.
2. **Edit Course**: Users can click on any course cell to edit the course name, score, or points.
3. **Delete Course**: Users can delete any course from the list.
4. **Calculate GPA**: The application calculates the average GPA based on the courses added.
5. **Sort Courses**: Courses can be sorted by name, score, or points in ascending or descending order.
6. **Export Courses**: Users can export the course list to a CSV file.
7. **Import Courses**: Users can import a course list from a CSV file.
8. **Multilingual Support**: Course names are translated based on the selected language.
9. **Interactive UI**: The user interface is interactive and responsive, providing a smooth user experience.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/gpa-calculator.git
    ```

2. Navigate to the project directory:

    ```bash
    cd gpa-calculator
    ```

3. Open the `index.html` file in your web browser to start using the application.

## Usage

### Adding a Course

- Click on the "Add Course" button to add a new course with default values.

### Editing a Course

- Click on any cell in the course list to edit the course name, score, or points. Press Enter or click outside the cell to save changes.

### Deleting a Course

- Click on the delete button (trash icon) next to the course you want to delete.

### Sorting Courses

- Click on the column headers (Name, Score, Points) to sort the courses by that column. Click again to toggle between ascending and descending order.

### Exporting Courses

- Click the "Export" button to download the course list as a CSV file.

### Importing Courses

- Click the "Upload" button to upload a CSV file containing courses. The file should have the format: `Course Name, Score, Points`.

### Multilingual Support

- The application supports multiple languages for course names. The language is determined by the `lang` attribute in the HTML tag.

## Contributing

1. Fork the repository.
2. Create a new branch:

    ```bash
    git checkout -b feature-branch
    ```

3. Make your changes.
4. Commit your changes:

    ```bash
    git commit -m "Add new feature"
    ```

5. Push to the branch:

    ```bash
    git push origin feature-branch
    ```

6. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
