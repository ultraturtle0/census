#!/bin/bash

date > /home/j/testing.log
cd /home/j/code/homepage
forever start server.js
