#!/bin/bash

watchmedo shell-command \
    --patterns="*/code.py" \
    --command='python send_code.py $watch_event_type "$watch_src_path" "$watch_dest_path"' \
    /Volumes/CIRCUITPY
