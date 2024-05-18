# stockLister
Here's a basic README.md template for your GitHub repository for a React app with a Django backend. This template includes instructions for installing dependencies from a requirements.txt file for Django:

```markdown
# Project Name

Description of your project.

## Installation

### Backend (Django)

1. Clone the repository:
   ```sh
   git clone https://github.com/BLANCO-11/stockLister.git
   ```
2. Navigate to the Django app directory:
   
3. Create a virtual environment (optional but recommended):
   ```sh
   python -m venv env
   ```
4. Activate the virtual environment:
   - Windows:
     ```sh
     env\Scripts\activate
     ```
   - macOS/Linux:
     ```sh
     source env/bin/activate
     ```
5. Install dependencies from the requirements.txt file:
   ```sh
   pip install -r requirements.txt
   ```
6. Apply database migrations:
   ```sh
   python manage.py migrate
   ```
7. Start the Django development server:
   ```sh
   python manage.py runserver
   ```

### Frontend (React)

1. Navigate to the React frontend directory:
   ```sh
   cd stock-monitoring-frontend
   ```
2. Install dependencies using npm or yarn:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```sh
   npm start
   # or
   yarn start
   ```
4. Open your browser and navigate to http://localhost:3000 to view the app.

## Usage

Simply run the app with steps above and search for any stock add it to watchlist which is unique to each user.
