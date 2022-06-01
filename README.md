# Speedy Maths
## A maths education app which teaches you about techniques to use to get faster at mental maths.

## Here is the URL: https://speedymaths-b7f6e.web.app

### To build
I built my own custom build engine, in python, it just takes all html, css, js and asset files, and puts them into a singular directory where all files are on the same level. This was so I could easily just send this folder to any hosting service.\
If you want to use this for your own Vanilla-TS projects, then you can just download the [Build.py](build.py) file, place it in the root of your project, and modify the *Src folder* and *CompiledJS folder*, and *Assets folder* locations.

```
SHIFT + COMMAND + B - Select tsc: build
python3 build.py
```

## The Home Screen
When building this website, I aimed to make it feel as similar to a mobile app as a native app.
Here is a preview of the home screen

![Home Screen Preview](Previews/Home.png?raw=true)

The home screen is just to allow the user to select which operation they want to work on, as well as which game mode they want to play, they can either:
- Read the Tutorial
- Play Singleplayer mode - Timed quiz
- Play Multiplayer mode - Timed quiz but with other people at the same time

### Artwork
All the artwork is done in Figma, then I export it as an SVG file into the Assets. Then I just add their names to an <img> tag inside of HTML, which is dynamically embedded with the correct SVG as well as a custom colour in Javascript.

## The Quiz
The quiz is just a multiple choice quiz, 10 questions and timed from when you enter to when you have finished the last question. If you get a question wrong, the quiz does not move on, and adds 5 seconds onto the timer to stop people from just spamming all the answers.

Here is a preview of the quiz screens

![Quiz Previews](Previews/Quiz.png?raw=true)

When you finish a quiz, it tells you your time and you can click the Done button to return to the previous screen.

## Multiplayer
Multiplayer just puts everyone into a singular lobby/party, then anyone can start the game, and everyone has to try and complete the quiz in the shortest time possible. After clicking the Done button the players will be transported back to the party screen, where they can see their and other people's times.

Here are a few previews of the different screens, the 2 last pictures have multiple devices, to show the multiplayer working

![Muliplayer Previews](Previews/Multiplayer.png?raw=true)

This was quite tricky to implement, due to these reasons:
- Using Firebase Realtime Database, so the only way to send a message to all members is to listen to a specific key, and then update that whenever you want to send the message. This is how I add players to the same party, and also how I start the game for everyone at the same time.
- It was also tricky because all of the multiplayer screens are part of the same HTML file, so I have to selectively show and hide sections depending on the stage of the game which the players are in

Here is a basic illustration of the multiplayer flow:\
![MultiplayerFlow](Previews/MultiplayerFlow.png?raw=true)

## Tutorials
The tutorials show the user how to do a certain operation, it was a bit tricky to explain basic operations such as addition and subtract, which is why I use Memorization as a technique a lot of times.

The screen uses a set structure, but I change the contents dynamically just like the quiz.

Here is a preview of the tutorial for Square Roots of 4 Digit Numbers:

![Tutorial Preview](Previews/Tutorial.png?raw=true)