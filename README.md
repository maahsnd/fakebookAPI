# Fakebook API

This is the brain behind my fakebook client, implementing authentication (bcrypt, cookies, JWTS), photo operations (Cloudinary), fake/ stock content creation (Faker), and all of the operations you'd expect——user creation, posts, comments, likes, requesting (and accepting/ declining) friends. At the time, this was the largest project I had completed, and represented a significant achievement and point of pride for me. Accordingly, I spent longer than I perhaps should have on it,
resulting in a fairly complete product. In retrospect, there are of course issues I would approach differently, having learned much since then.

Frontend Repo: https://github.com/maahsnd/fakebookFrontEnd

# Built with

* Node.Js
* Express
* Mongoose/MongoDB
* JS Cookie
* BcryptJs
* Cloudinary
* JSON Web Token
* Faker

# Features

* Sign up and log in with email
* Send friend requests and approve or delete them
* Make text-only posts
* Like posts
* Add comments
* Upload custom profile picture
* Edit 'About Me' section of profile
* Home page shows newsfeed of all your friends' posts
* Profile page shows posts, friends list, and option to add friend
* Suggested friends list
