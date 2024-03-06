# Torii Delete Issue
This repository demonstrates the issue experienced by the torii client when a delete occurs in the world. 
It comprises a dojo contract in the contract directory and a react-app in the react-app directory. 
It only has one model, Person, which comprises an id, name, and age. Using the react-app, a user
can create a person and delete a person.

# Prerequisites
## Install dojoup
````shell
curl -L https://install.dojoengine.org | bash
````
## Install dojo v0.5.1
````shell
dojoup --version v0.5.1
````

## Build contract
````shell
sozo build --manifest-path ./contract/Scarb.toml
````

## Install react-app dependencies
````shell
cd react-app && yarn install
````

# Steps to simulate issue
## Run katana
````shell
katana
````

## Migrate world
````shell
sozo migrate --manifest-path ./contract/Scarb.toml
````

## Initialize the world
````shell
bash contract/scripts/default_auth.sh
````

## Run torii
````shell
torii -w 0x2ac6e34b79cfc17ad659d7b1b88de9d0471f029b1ff942515e2ebfea342c150 -d TORII.sqlite
````

## Run react-app
````shell
cd react-app && yarn dev
````

Then, deploy a burner account. Create a person. Then delete said person.
