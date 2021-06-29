#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

cd $DIR

cd docs/2012f/osa/files
BASE_URL="https://fox-gieg.com/patches/github/n1ckfg/ITP_OpenSourceAnimation/docs/2012f/osa/files"
wget "$BASE_URL/expressions_examples.zip"
wget "$BASE_URL/match.mov"