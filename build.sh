#!/bin/bash

echo "##################"
echo "Building Movilo..."
echo "##################"

echo
echo "###############"
echo "Running webpack"
echo "###############"
npm run build || { echo "Webpack failed"; exit 1; }

echo
echo "###########################"
echo "Movilo build was successful"
echo "###########################"
exit 0
