#!/bin/bash -e

DIR=$(dirname $(readlink -f $0))
PATH=$1

if [[ -z $PATH || ! -d $PATH ]]; then
    echo "Invalid path location, usage: "
    echo " ./install.sh <path to your bin> (ex: /usr/local/bin) "
    exit 1;
fi

/bin/ln -s $DIR/repoz $PATH/repoz
echo "repoz installed at $PATH/repoz"