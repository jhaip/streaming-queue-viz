#!/usr/bin/env python

import pika
from threading import Thread
import logging
import time
import signal
import json
import sqlite3
import datetime
import sys
logging.basicConfig(level=logging.INFO)


connection = pika.BlockingConnection(pika.ConnectionParameters('rabbit'))
print('Connected:localhost')
channel = connection.channel()
db_conn = None
db_c = None


def threaded_rmq():
    global db_conn
    global db_c
    db_conn = sqlite3.connect('example.db')
    db_c = db_conn.cursor()
    db_c.execute('''CREATE TABLE IF NOT EXISTS data
                 (timestamp text, value text, source text)''')
    db_conn.commit()
    any_views = False
    for row in db_c.execute("SELECT * FROM data WHERE source='view'"):
        any_views = True
        # logging.info(row)
    if not any_views:
        initial_view_params = {
            "start": None,
            "end": None,
            "subviews": [
                {
                    "func": None,
                    "type": "",
                    "sources": ["serial"]
                },
                {
                    "func": None,
                    "type": "",
                    "sources": ["serial"]
                },
                {
                    "func": None,
                    "type": "code",
                    "sources": ["code"]
                },
                {
                    "func": None,
                    "type": "annotation",
                    "sources": ["annotation"]
                }
            ]
        }
        data = (datetime.datetime.utcnow().isoformat(),
                json.dumps(initial_view_params),
                'view')
        db_c.execute("INSERT INTO data VALUES (?,?,?)", data)
        db_conn.commit()

    channel.exchange_declare(exchange='logs',
                             exchange_type='fanout')
    channel.queue_declare(queue="my_queue")
    channel.queue_declare(queue="database_log")
    channel.queue_bind(exchange='logs',
                       queue='database_log')
    channel.basic_consume(consumer_callback, queue="database_log", no_ack=True)
    channel.start_consuming()


def consumer_callback(ch, method, properties, body):
    global db_conn
    global db_c
    body_str = str(body, 'utf-8')
    logging.info("[db consumer] Received %s" % (body_str,))
    if body_str:
        body_json = json.loads(body_str)
        logging.info(body_json)
        logging.info("******")
        data = (body_json["timestamp"], body_json["value"], body_json["source"])
        db_c.execute("INSERT INTO data VALUES (?,?,?)", data)
        db_conn.commit()


def signal_handler(signal, frame):
    print('You pressed Ctrl+C!')
    db_conn.close()
    connection.close()
    sys.exit(0)

if __name__ == "__main__":
    logging.info('Starting thread RabbitMQ in DATABASE CONSUMER')
    # threadRMQ = Thread(target=threaded_rmq)
    # threadRMQ.start()
    threaded_rmq()

    signal.signal(signal.SIGINT, signal_handler)
