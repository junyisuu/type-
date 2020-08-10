# Type-

## Languages
- Javascript
- HTML
- CSS

## Tools / Technologies
- React
- Node/Express
- MongoDB (MongoDB Atlas)
- AWS EC2
- Socket.io
- Semantic UI React
- SendGrid

## References
React Typing: https://github.com/RodneyCumming/react-typing
Deploying MERN app on AWS EC2: https://medium.com/@rksmith369/how-to-deploy-mern-stack-app-on-aws-ec2-with-ssl-nginx-the-right-way-e76c1a8cd6c6
Setting up HTTPS: https://blog.cloudboost.io/setting-up-an-https-sever-with-node-amazon-ec2-nginx-and-lets-encrypt-46f869159469

## Features
- Copy to Clipboard
- Lobby 
  - Create/Join - Use ShortID
  - Real-time Race Progress
- Registration/Login
- Email Verification
- HTTPS/SSL
- Leaderboards
- Thousands of Excerpts

## Step-by-step Summary
- Research / watch MERN stack videos to learn best practices for setting up and learning the various components involved with making React work
- Look up typing applications based on React for reference
  - Figure out how I can implement typing functionality that looks good
- Implement base application 
  - Login / Register
- Create Single Player Typing Game 
  - Progress Bar
  - Excerpt Display
  - Typing Functionality
  - Race Summary
- Scrape website for data
- Pull excerpts from database instead of static data
- Research socket.io rooms 
- Implement multiplayer functionality
  - Create / Join Rooms
  - Rooms display list of all users joined
  - User list is updated when user leaves
  - Save room id to local storage to stay in room upon page refresh
  - Progress Bar synchromized across all users in room
  - Implement ready button and synchronized race start
  - Excerpts are randomly selected per lobby and another is selected for next race
  - Implement Race Summary that displays lobby leaderboard
- Profile Page
  - Add statistics tracking at end of race
  - Display profile statistics on profile page
- Host Application
  - Research and learn more about AWS
   - Learn more about their products, their differences, and what I should use
  - Follow a tutorial
   - Change to backhend hosting frontend build content
  - Get domain name from Name.com
  - Implement HTTP/SSL following a tutorial
- Finalize
  - Click to copy room id
  - Implement Excerpt Leaderboard
  - Email verification 
  - UI Changes / Color Scheme
  - Favicon / Logo
## Challenges
- Hosting on AWS
