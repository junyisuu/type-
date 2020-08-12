# Typedash
## Description
Typedash is a online multiplayer type racing game created using the MERN stack (MongoDB, Express, React, Node). It utilizes Socket.IO for real-time race progress as well as lobby management. Typedash is hosted on AWS EC2 and can be accessed via this link: https://www.typedash.live/. Its features include:
- User registration, email verification, and login
- Online type racing against other players
- Create and join private lobbies
- Real-time race progress
- Race statistics
- Lobby and excerpt leaderboards
- Thousands of excerpts to type from

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

## Full step-by-step summary
### Research MERN
First, I needed to learn more about the MERN stack. Although I had used the web stack once before, it was part of a group project and therefore, I was not fully familiar with every part of the components. My main focus was to learn how to set up the project and learn more about how to use React. This involved watching several youtube tutorials (https://youtu.be/Ke90Tje7VS0) and reading React documentation (https://reactjs.org/docs/introducing-jsx.html).

### Typing Functionality
I wanted to start the project by developing the single player portion of the typing game. This meant that I needed to build a functioning application where the application determines whether the user's typed characters are correct, the speed at which the user types at, and a progress bar. In order to tackle this, I started to research and take ideas from others on how they approached developing typing applications. I searched for typing applications, with a focus on ones made with React, on Github and Google. There were many that I came across: https://github.com/p-society/typeracer-cli, https://github.com/itssamuelrowe/typify, https://github.com/brodavi/supersimpletypingpractice, https://github.com/RodneyCumming/react-typing, https://github.com/awran5/react-typing-speed-test-game. They all had a different approaches where some determined correctness based on fully typed words whereas others used individual characters. Some allowed the use of backspace to correct mistakes whereas others ignored backspaces to let users focus on everything after their correctly typed characters. From all of these ideas, I was able to determine the approach that I thought would work best, which was the approach used by https://github.com/RodneyCumming/react-typing.

### Implement Base Application
Now that I had an approach in mind, I begun to actually code. But before I started creating the typing functionality, I wanted to create the base application with user registration and login. Because I had worked on other school projects that had used similar user authentication ideas, it only took me some reviewing of old code to re-use it towards this application.

### Create Single Player Typing Game
After implementing registration and login, I moved on to creating the single player functionality. The goal of this part was to create a fully functioning single player typing game, including a progress bar, an excerpt display that showed where the user was at and what characters they should be typing, a functioning typing component that read the user's input and compared it to the expected characters, and a race summary at the end that displayed statistics. The idea would be for me to later on build on this single player functionality in order to make it work as an online multiplayer game. 

### Excerpts Database
Now that I had a working typing game, I needed to populate a database with excerpts that I could pull from so that the user would have many excerpts to type from. For the first iteration of excerpts, I decided to pull paragraphs from League of Legends short stories: https://universe.leagueoflegends.com/en_US/explore/short-stories/newest/. I chose to do this because the short stories had good content and they all followed the same format. I decided to write a python script (https://github.com/kshiftw/league_scraper/blob/master/scraper.py) that would access the web pages and extract paragraphs as excerpts into a MongoDB database. The script accesses all short stories by scrolling down through the dynamic main page and copying all the short story links. It then extracts data including the title, author, url, and all paragraphs which are all then inserted into a MongoDB database.

### Implement Multiplayer Functionality
With everything set up on the single player portion of the game, it was time for me to move on to implementing multiplayer functionality. I wanted to use Socket.IO for its real-time bidirectional communication so that every player would get real time progress of other player's completion status during a race. Socket.IO was also chosen because I had used the library previously but only in a basic capacity, so I wanted to take the opportunity to learn more about websocket usage. The first goal was for users to be able to create their own lobbies and have a lobby ID that other users could join the lobby with. Most of the server-client interaction is done through socket communication. 

### Additional Multiplayer Functionality
Now that users were able to create and join rooms, I needed to implement functionality to have the application update if users left a room. Specifically, I needed to update the lobby's user list when a user clicked "Leave Lobby". I also needed to decide on what happens when users refresh their page because on Socket.IO side, it would be seen as a new client. I decided that the user should still remain in the lobby, so I needed to save the lobby ID to local storage so that the client would rejoin the room upon page refresh if they were already in a lobby. 

I also needed to decide on how a lobby's race started. I had occasionally played TypeRacer (https://play.typeracer.com/) which had the approach of only have a race start for players who manually joined a race. This meant that a race was always happening and that players could be in a lobby but not in a race. I took a different approach and instead required all users to "ready up" before the race started. The application would then ensure that all players were ready before starting a countdown for the race to start. It would also ensure that the excerpt was displayed at the same time for all players (ie. they all start at the same time).  

Another feature I needed to implement was for all player's race progress to be synchronized for the entire lobby. This meant that all players could see where every other player was at in the race. This required attaching a socket event to each keyboard type event that would be sent from the client to server and then broadcasted from server to all other clients. After that, I added two more features, one for having lobbies randomly select excerpts for each race and the other for a lobby leaderboard at the end of the race for users to see how they rank up against their lobby.

### Profile Page
Next, I wanted to add a Profile page for users to see their race statistics such as average WPM and how many races they had completed. This required two parts, the first being that I needed to store a user's race summary at the end of each race. This required adding a new field to the existing user document in the database. The second part was for me to have the profile page pull those statistics from the database. 

### Deployment
Now that I was done the bulk of the application, I wanted to move onto deployment before working on the remaining features I had in mind. I knew that deployment would be a challenge for me because I had only used Heroku in the past, which provides a very user friendly way of deploying without having to worry about the details. For this project, I wanted to try using AWS so I started doing research into their various products: AWS EC2, AWS Elastic Beanstalk, AWS Lambda, etc. It seemed that AWS EC2 was the way for me to take, so I signed up for an AWS Educate account which gave 100$ worth of free AWS credits. I then needed to find a tutorial that showed how to host a MERN app on AWS EC2. Surprisingly, there were not a lot of full tutorials on this topic. Some tutorials involved MERN apps, but not EC2 and instead used Elastic Beanstalk. Other tutorials seemed to be very brief and didn't describe the full process. I ended up coming across a very detailed tutorial: https://medium.com/@rksmith369/how-to-deploy-mern-stack-app-on-aws-ec2-with-ssl-nginx-the-right-way-e76c1a8cd6c6 which I used to follow. I then used Github Student Developer Pack's credits to get a free domain name from Name.com and tied it together with the deployed AWS EC2 instance for a fully functioning hosted app along with HTTPS. 

### Finalize
To finish up the application, I wanted to add a few more features. This included a "click to copy lobby ID" function, implementing a leaderboard for each excerpt that would keep track of users' high scores based on WPM, email verification when registering for an account, UI changes such as adding backgrounds and changing color schemes, and adding a favicon as well as a logo. 

## Screenshots

## Challenges
- Hosting on AWS
- Saving lobby details and reconnecting to lobby
- Connecting to socket rooms

## Links/References
- React Typing: https://github.com/RodneyCumming/react-typing
- Deploying MERN app on AWS EC2: https://medium.com/@rksmith369/how-to-deploy-mern-stack-app-on-aws-ec2-with-ssl-nginx-the-right-way-e76c1a8cd6c6
- Setting up HTTPS: https://blog.cloudboost.io/setting-up-an-https-sever-with-node-amazon-ec2-nginx-and-lets-encrypt-46f869159469
- League of Legends scraper: https://github.com/kshiftw/league_scraper/blob/master/scraper.py
- Project Gutenberg scraper: https://github.com/kshiftw/league_scraper/blob/master/gutenberg.py
