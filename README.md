# Restaurant Finder Web App

## Overview

This web app helps users discover restaurants in Atlanta by integrating Google Maps and personalized features such as favorites and reviews. The app allows users to create accounts, log in, and interact with various features designed to enhance their restaurant search experience.

## Features

### 1. Create Account
- **Purpose**: Allows new users to create an account.
- **Details**: Users must provide credentials that meet certain requirements (e.g., password complexity). Once the requirements are met, the account is created, and the user's data is stored in a SQLite database.
- **Access**: Once registered, users can access personalized features such as favoriting restaurants.
- **User Stories Satisfied**: A

### 2. Login
- **Purpose**: Allows existing users to log in using their credentials.
- **Details**: Users can log in to their account to access personalized features like their favorites. If they do not have an account, they can click the "Create Account" button to be redirected to the registration page.
- **Access**: Users must provide valid credentials to access the homepage and personalized features.
- **User Stories Satisfied**: A

### 3. Restaurant Search and Maps Integration
- **Purpose**: Allows users to search for restaurants and view detailed information.
- **Details**:
  - Uses the **Google Maps API** to display a map and search bar.
  - Users can search for restaurants by name, cuisine type, or location.
  - Filters allow users to narrow down restaurants by **distance** and **ratings**.
  - Displays **reviews** and **ratings** from Google for each restaurant.
  - Users can click on a restaurant to get directions or click the star button to add it to their **favorites** list for quick access later.
- **User Stories Satisfied**: B, C, D, E

## Technologies Used
- **SQLite**: For storing user data such as account information and favorites.
- **Google Maps API**: For restaurant search, reviews, and navigation.

## Setup Instructions
1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```bash
    cd restaurant-finder-app
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up your `.env` file with the necessary environment variables (e.g., Google Maps API key).
5. Run the application:
    ```bash
    npm start
    ```

## User Stories and Backlog

### 1. User Authentication
- **Importance**: User authentication is essential for providing personalized experiences. It allows users to register, log in, and maintain accounts with custom preferences, favorites, and saved searches.
- **Alignment with Project Objectives**: This step ensures that users have access to personalized features, such as saving restaurant searches or preferences, enhancing their experience on the platform.
- **Why Prioritized First**: Authentication is foundational for personalization and secure access to more complex features. Many other user stories (like saving favorites) require a user account, making this a high-priority task.

### 2. Restaurant Search
- **Importance**: The primary function of the app is to allow users to search for restaurants based on criteria such as name, cuisine type, or location. Filtering results by ratings and distance is essential to provide relevant and convenient options.
- **Alignment with Project Objectives**: Restaurant search is the core of the web app and meets users’ needs for finding restaurants based on their preferences.
- **Why Prioritized First**: This is the main utility of the application, and without it, the platform doesn’t fulfill its primary purpose. Searching is a prerequisite for exploring other features like saving favorites.

### 3. Restaurant Details
- **Importance**: Providing detailed information about restaurants (e.g., addresses, contact info, ratings, reviews) helps users make informed decisions. The feature includes displaying restaurant locations on Google Maps for easy navigation.
- **Alignment with Project Objectives**: After finding restaurants, users need detailed information to decide where to dine. This feature ensures a smooth and informed user experience.
- **Why Prioritized Early**: Restaurant details are directly connected to search functionality. Users need access to this information after finding a restaurant.

### 4. Favorites
- **Importance**: Saving favorite restaurants enhances user engagement by allowing users to revisit restaurants quickly. This provides a personalized and convenient experience.
- **Alignment with Project Objectives**: Saving favorites is a natural progression after search and details, allowing users to curate a list of preferred restaurants.
- **Why Prioritized Early**: This feature works in conjunction with user authentication and search, adding value by personalizing the app experience.

### 5. Team Website Development
- **Importance**: A team website will showcase the development process and the roles of all team members.
- **Why Left for Later**: This is easier to implement after key features of the web app have been built.

### 6. Geolocation
- **Importance**: Visualizing restaurant locations on an interactive Google Map helps users understand proximity. Clicking on map markers for details adds interactivity.
- **Alignment with Project Objectives**: Geolocation is important for users making decisions based on restaurant proximity.
- **Why Left for Later**: While useful, geolocation is not as critical as core functionalities like search and restaurant details.

### 7. Extra Credit Features
- **Importance**: Features like writing reviews and resetting passwords add extra value to the user experience, making the app more interactive and user-friendly.
- **Alignment with Project Objectives**: These are bonus features that could help the app compete with established platforms but are not essential to core functionality.
- **Why Left for Later**: These are enhancements that can be developed once the primary objectives are completed.


## Team
- Scrum Master: Vihaan Nagarkar
- Product Owner: Jeshal Patel
- Team Members: Joshua Derival, Rohan Malla, Vihaan Nagarkar
