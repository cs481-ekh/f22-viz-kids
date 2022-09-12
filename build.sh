#!/bin/bash

echo "##################"
echo "Building Movilo..."
echo "##################"

echo
echo "###############"
echo "Installing node"
echo "###############"
sudo apt install nodejs || ( echo "Install node failed"; exit 1; )
echo "node version: $(node -v)"

echo
echo "##############"
echo "Installing npm"
echo "##############"
sudo apt install npm || ( echo "Install npm failed"; exit 1; )
echo "npm version: $(npm -v)"

echo
echo "#######################"
echo "Installing dependencies"
echo "#######################"
npm install || ( echo "Install dependencies failed"; exit 1; )

echo
echo "###############"
echo "Running webpack"
echo "###############"
npm run build || ( echo "Webpack failed"; exit 1; )

echo
echo "###########################"
echo "Movilo build was successful"
echo "###########################"
exit 0
