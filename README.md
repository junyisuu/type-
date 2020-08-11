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
- BeautifulSoup
- Selenium 

## Links/References
React Typing: https://github.com/RodneyCumming/react-typing

Deploying MERN app on AWS EC2: https://medium.com/@rksmith369/how-to-deploy-mern-stack-app-on-aws-ec2-with-ssl-nginx-the-right-way-e76c1a8cd6c6

Setting up HTTPS: https://blog.cloudboost.io/setting-up-an-https-sever-with-node-amazon-ec2-nginx-and-lets-encrypt-46f869159469

League of Legends scraper: https://github.com/kshiftw/league_scraper/blob/master/scraper.py

Project Gutenberg scraper: https://github.com/kshiftw/league_scraper/blob/master/gutenberg.py

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

## Full Step-by-step Summary
### Research MERN
First, I needed to learn more about the MERN stack. Although I had used the web stack once before, it was part of a group project and therefore, I was not fully familiar with every part of the components. My main focus was to learn how to set up the project and learn more about how to use React. This involved watching several youtube tutorials (https://youtu.be/Ke90Tje7VS0) and reading React documentation (https://reactjs.org/docs/introducing-jsx.html).

### Typing functionality
I wanted to start the project by developing the single player portion of the typing game. This meant that I needed to build a functioning application where the application determines whether the user's typed characters are correct, the speed at which the user types at, and a progress bar. In order to tackle this, I started to research and take ideas from others on how they approached developing typing applications. I searched for typing applications, with a focus on ones made with React, on Github and Google. There were many that I came across: https://github.com/p-society/typeracer-cli, https://github.com/itssamuelrowe/typify, https://github.com/brodavi/supersimpletypingpractice, https://github.com/RodneyCumming/react-typing, https://github.com/awran5/react-typing-speed-test-game. They all had a different approaches where some determined correctness based on fully typed words whereas others used individual characters. Some allowed the use of backspace to correct mistakes whereas others ignored backspaces to let users focus on everything after their correctly typed characters. From all of these ideas, I was able to determine the approach that I thought would work best, which was the approach used by https://github.com/RodneyCumming/react-typing.

### Implement Base Application
Now that I had an approach in mind, I begun to actually code. But before I started creating the typing functionality, I wanted to create the base application with user registration and login. Because I had worked on other school projects that had used similar user authentication ideas, it only took me some reviewing of old code to re-use it towards this application.

### Create Single Player Typing Game
After implementing registration and login, I moved on to creating the single player functionality. The goal of this part was to create a fully functioning single player typing game, including a progress bar, an excerpt display that showed where the user was at and what characters they should be typing, a functioning typing component that read the user's input and compared it to the expected characters, and a race summary at the end that displayed statistics. The idea would be for me to later on build on this single player functionality in order to make it work as an online multiplayer game. 

### Excerpts database
Now that I had a working typing game, I needed to populate a database with excerpts that I could pull from so that the user would have many excerpts to type from. For the first iteration of excerpts, I decided to pull paragraphs from League of Legends short stories: https://universe.leagueoflegends.com/en_US/explore/short-stories/newest/. I chose to do this because the short stories had good content and they all followed the same format. I decided to write a python script (https://github.com/kshiftw/league_scraper/blob/master/scraper.py) that would access the web pages and extract paragraphs as excerpts into a MongoDB database. The script accesses all short stories by scrolling down through the dynamic main page and copying all the short story links. It then extracts data including the title, author, url, and all paragraphs which are all then inserted into a MongoDB database.

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
