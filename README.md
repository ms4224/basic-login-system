# basic-login-system

This is a backup file for a basic user-login system I wrote while working at True Barbarian Games.  Includes routes to sign up, sign in, recover password, username, etc.

I have removed the test files and a few other files as they contain some information that is sensitive to TRUE BARBARIAN GAMES.

This is one of my first projects, so I have ALOT of comments written down to try to follow the logic.  Sorry if this is a bit annoying.

This system is a 'prototype', unfortunately it was never implemented before the company was dismantled.  The idea was to eventually have users be able to login and view their statuses of different games that they have played (and from there add other features).

You can view the company website at www.TrueBarbarianGames.com

#Notes
When I created this project, I used Thunks and Generators to avoid "callback hell".  You can view thunkify and synchronize files to see how this works.
I'm not sure how often that technique is used in industry today, but it' quite a fun technique.  If you click on any of the routes, you will notice the code looks synchronous (with the yield operator, indicating waiting on callbacks).  
