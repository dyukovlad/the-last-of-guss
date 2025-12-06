# The Last of Guss

A browser game where players compete to see who can tap the virtual goose the most and fastest, after it contracted the G-42 mutation.

## Game Features

- **Login System**: Enter a username and password. If the account doesn't exist, it will be created automatically.
- **Round Management**: View active and scheduled rounds.
- **Goose Tapping**: Tap the goose when a round is active to score points.
- **Admin Functionality**: Admin users can create new rounds.

## How to Play

1. Access the login page: `http://localhost:5173`
2. Login with the admin account:
   - Username: `admin`
   - Password: `pass`
3. Or create your own account by entering a new username and password

## Game Rules

- Only active rounds can be tapped
- The more you tap the goose, the higher your score
- Admins can create new rounds

## API Integration

The game connects to the backend API at: `http://v2991160.hosted-by-vdsina.ru`

## Pages

- `/login` - Login page for authentication
- `/rounds` - List of all rounds (active, pending, completed)
- `/round/:id` - Individual round page where you can tap the goose

## Technologies Used

- React with TypeScript
- Vite as build tool
- Material UI for styling
- Zustand for state management
- React Router for navigation
- Axios for API requests