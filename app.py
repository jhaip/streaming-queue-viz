#!/usr/bin/env python

# How to send an web socket message using http://www.tornadoweb.org/.
# to get ready you have to install pika and tornado
# 1. pip install pika
# 2. pip install tornado

import os
import tornado.ioloop
import tornado.web
import tornado.websocket
import pika
from threading import Thread
import logging
import json
import datetime
logging.basicConfig(level=logging.INFO)


# web socket clients connected.
clients = []

connection = pika.BlockingConnection(pika.ConnectionParameters('rabbit'))
logging.info('Connected:localhost')
channel = connection.channel()


def threaded_rmq():
    channel.exchange_declare(exchange='logs',
                             exchange_type='fanout')
    channel.queue_declare(queue="my_queue")
    channel.queue_bind(exchange='logs',
                       queue='my_queue')
    logging.info('consumer ready, on my_queue')
    channel.basic_consume(consumer_callback, queue="my_queue", no_ack=True)
    channel.start_consuming()


def disconnect_to_rabbitmq():
    channel.stop_consuming()
    connection.close()
    logging.info('Disconnected from Rabbitmq')


def consumer_callback(ch, method, properties, body):
        logging.info("[x] Received %r" % (body,))
        # The messagge is brodcast to the connected clients
        for itm in clients:
            itm.write_message(body)


class SocketHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        logging.info('WebSocket opened')
        clients.append(self)
        logging.info("# CLIENTS: %d" % (len(clients),))

    def on_close(self):
        logging.info('WebSocket closed')
        clients.remove(self)
        logging.info("# CLIENTS: %d" % (len(clients),))


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("build/index.html")

    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        data["timestamp"] = datetime.datetime.utcnow().isoformat()
        r_connection = pika.BlockingConnection(pika.ConnectionParameters('rabbit'))
        r_channel = r_connection.channel()
        r_channel.exchange_declare(exchange='logs',
                                   exchange_type='fanout')
        r_channel.queue_declare(queue="my_queue")
        r_channel.queue_bind(exchange='logs',
                             queue='my_queue')
        r_channel.basic_publish(exchange='logs',
                                routing_key='',
                                body=json.dumps(data))
        r_connection.close()
        self.set_status(200)


application = tornado.web.Application([
    (r'/ws', SocketHandler),
    (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': 'build/static'}),
    (r"/", MainHandler),
])


def startTornado():
    application.listen(8002)
    try:
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        try:
            logging.info('Disconnecting from RabbitMQ..')
            disconnect_to_rabbitmq()
        except Exception as e:
            pass
        tornado.ioloop.IOLoop.instance().stop()


if __name__ == "__main__":
    logging.info('Starting thread RabbitMQ')
    threadRMQ = Thread(target=threaded_rmq)
    threadRMQ.start()

    logging.info('Starting thread Tornado')

    threadTornado = Thread(target=startTornado)
    threadTornado.start()
