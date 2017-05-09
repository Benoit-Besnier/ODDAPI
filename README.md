# ODDAPI - API

Open Data Database and its Application Programming Interface - API Section

## How do I use this ?

This API will listen to one of your port (should be 3000 by default). You will have to search your local IP in order to
communicate with it.
For example, if your local IP address is ```192.168.12.247```, then you have to request on ```192.168.12.247:3000```.

>(TIP : You can use ``` SOMEWHERE > ipconfig ``` OR ``` SOMEWHERE > ifconfig ``` to get your local IP address) 

Later on, when the project will have further progressed, a simple documentation will be accessible on the GitHub wiki
section.

## How do I install it ?

Beforehand, you should install Node.js and NPM on your computer (or server).

> NOTICE : You'll need a command interpreter.

Then you have to clone this branch (```SOMEWHERE``` is your current path) to get the seed :

    SOMEWHERE > git clone https://github.com/Benoit-Besnier/ODDAPI.git

Once this is done, do the following command into the API folder in order to install all dependencies :

    SOMEWHERE/ODDAPI/API > npm install
    
Finally, you can execute server.js using either :

- ``` SOMEWHERE/ODDAPI/API > npm install ``` 

OR

- ``` SOMEWHERE/ODDAPI/API > node server.js ```

