# codename: Stemmy

## Publish, share, and sequence skeletal beats

### Maybe it should be called Skelly instead actually?

### Setup

After cloning the repo, here are the steps to get the back and front ends up and running.

## Backend setup

# 1 Pre-requisites

You'll need node v10/npm and yarn to get stemmy-server up and running. You'll also need to install gcsfuse, which lets us share storage via a Google Cloud Storage Bucket rather than needing to move a file repository around between developers. On Mac OS with Homebrew:

```
brew cask install osxfuse
brew install gcsfuse
```

On Ubuntu (using gcsfuse 0.30.0 due to issues with current release):
```
export GCSFUSE_REPO=gcsfuse-`lsb_release -c -s`
echo "deb http://packages.cloud.google.com/apt $GCSFUSE_REPO main" | sudo tee /etc/apt/sources.list.d/gcsfuse.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
sudo apt-get update
sudo apt-get install gcsfuse=0.30.0
```

# 2 Add Uncommitted (Sensitive) Files

Place the .env and gcloudstoragecreds.json files provided by Tim within the ./stemmy-server folder.

# 3 Launch Dev Server

Then, from within stemmy-server:

```
yarn install
yarn start
```

### Front-end setup

In the stemmy-web folder:

```
yarn install
yarn start
```

Ideally, this should all work out just great.