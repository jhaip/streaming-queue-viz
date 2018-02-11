#!/usr/bin/env python

import pika
import logging
logging.basicConfig()

connection = pika.BlockingConnection(pika.ConnectionParameters('rabbit'))
print('Connected:localhost')
channel = connection.channel()
channel.exchange_declare(exchange='logs',
                         exchange_type='fanout')
channel.queue_declare(queue="my_queue")
channel.queue_bind(exchange='logs',
                   queue='my_queue')
for i in range(10):
    channel.basic_publish(exchange='logs',
                          routing_key='',
                          body='(%d)' % i)
connection.close()
