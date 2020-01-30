#!/bin/bash

date > /home/pi/testing.log
cd /home/pi/Documents/code/census/client
forever start server.js
