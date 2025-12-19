#!/bin/bash

adb devices | grep "device$" | while read -r line; do
    DEVICE_ID=$(echo "$line" | awk '{print $1}')
    if [ "$DEVICE_ID" != "List" ]; then
        adb -s "$DEVICE_ID" install "$1"
    fi
done
