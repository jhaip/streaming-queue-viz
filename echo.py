#!/usr/bin/env python

import pika
from threading import Thread
import logging
import time
logging.basicConfig()


connection = pika.BlockingConnection(pika.ConnectionParameters('rabbit'))
print('Connected:localhost')
channel = connection.channel()

def threaded_rmq():
    channel.exchange_declare(exchange='logs',
                             exchange_type='fanout')
    channel.queue_declare(queue="my_queue")
    channel.queue_declare(queue="derivative_data_queue")
    channel.queue_bind(exchange='logs',
                       queue='derivative_data_queue')
    channel.basic_consume(consumer_callback, queue="derivative_data_queue", no_ack=True)
    channel.start_consuming()


def consumer_callback(ch, method, properties, body):
    logging.info("[x] Received %r" % (body,))
    body_str = "%r" % (body,)
    if "ECHO" not in body_str:
        echo_message = "ECHO (%r)" % (body,)
        # time.sleep(1)
        channel.basic_publish(exchange='logs',
                              routing_key='my_queue',
                              body=echo_message)
    else:
        logging.info("ECHO in body, skipping")


def signal_handler(signal, frame):
    print('You pressed Ctrl+C!')
    connection.close()
    sys.exit(0)

if __name__ == "__main__":
    logging.info('Starting thread RabbitMQ in ECHO')
    threadRMQ = Thread(target=threaded_rmq)
    threadRMQ.start()

    signal.signal(signal.SIGINT, signal_handler)
