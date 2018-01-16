# streaming-queue-viz

1. HTML file for frontend
2. JS library to set up websocket connection and make a simple vizual of a serial log
3. Python Twisted app to receive HTTP request, add timestamp, and put into queue. Query SQLite DB for historical data
4. Queue itself: RabbitMQ
5. Process to subscribe to queue and save to database
6. SQLite DB
7. BONUS: Process to subscribe to queue and push a derivative source to the database
8. Script to fake pushing data via HTTP at a certain rate (100/s)
