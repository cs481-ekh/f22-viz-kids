#!/bin/bash

echo "###################################"
echo "Preparing environment for Movilo..."
echo "###################################"

echo
echo "###############"
echo "Installing node"
echo "###############"
sudo apt install nodejs || { echo "Install node failed"; exit 1; }
echo "node version installed: $(node -v)"

echo
echo "##############"
echo "Installing npm"
echo "##############"
sudo apt install npm || { echo "Install npm failed"; exit 1; }
echo "npm version installed: $(npm -v)"

echo
echo "#######################"
echo "Installing dependencies"
echo "#######################"
npm install || { echo "Install dependencies failed"; exit 1; }

echo
echo "######################################"
echo "Environment preparation was successful"
echo "######################################"
exit 0
