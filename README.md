# Streaming Queue Visualization

1. HTML file for frontend
2. JS library to set up WebSocket connection and make a simple visual of a serial log
3. Python Twisted app to receive HTTP request, add timestamp, and put into queue. Query SQLite DB for historical data
4. Queue itself: RabbitMQ
5. Process to subscribe to queue and save to database
6. SQLite DB
7. BONUS: Process to subscribe to queue and push a derivative source to the database
8. Script to fake pushing data via HTTP at a certain rate (100/s)

## Tracking Code Changes

To automatically track changes to the code, run `./circuitpython/watch_code.sh`
as a background process or in an open terminal.

Currently code changes are only set up to work with a CircuitPython that
mounts itself to `/Volumes/CIRCUITPY` as this is where the Circuit Playground Express
board mounts on my Mac. The scripts require that python be installed along with
the libraries in the `circuitpython/requirements.txt` folder.

## Serial Logging

To automatically log and see serial logs, run `python circuitpython/serial_logger.py`
as a background process or in an open terminal.
