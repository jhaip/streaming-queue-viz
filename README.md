# Robot Seeing Tool

A tool to help tell a more complete story of the making process. Code versions, serial log data, and notes are automatically saved and shown across time.

[Demo video on YouTube](https://www.youtube.com/watch?v=LqK2nMTE90g)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development. Currently the project is not deployed publicly and must be run on your own computer. Setup has only been tested on a Mac computer.

### Prerequisites

You will need a system with Docker, Python, pip, and NPM installed.

* [Docker Installation Guide](https://docs.docker.com/install/)
* [pip Installation Guide](https://pip.pypa.io/en/stable/installing/)
* [npm Installation Guide](https://docs.npmjs.com/getting-started/installing-node)

The ability to save code changes and serial logs have only been developed with a Circuit Playground Express board using CircuitPython on a Mac computer. CircuitPython makes tracking code changes as simple as tracking the changes of a file mounted on your computer. Other electronic boards or platforms like Arduino could be supported but would require additional development. I am open to contributions in this area.

* [Circuit Playground Express board from Adafruit](https://www.adafruit.com/product/3333)
* [CircuitPython tutorial](https://learn.adafruit.com/welcome-to-circuitpython/what-is-circuitpython)

The data logging and visualization parts of this project are not dependent on a particular board or platform.

### Installing

Install the frontend's NPM packages

```
npm install
```

Build the frontend using webpack

```
npx webpack -d
```

Start the Docker containers. The first time you run this it will build and pull container images. Leave this running while you are running the project.

```
docker-compose up
```

Install the Python requirements for the code that saves serial logs and the code versions.

```
pip install -r circuitpython/requirements.txt
```

To automatically track changes to Circuit Playground Express board's code, run the `watch_code.sh` script as a background process or in an open terminal. Currently code changes are only set up to work with a CircuitPython that
mounts itself to `/Volumes/CIRCUITPY` as this is where the Circuit Playground Express
board mounts on my Mac. The script must be started after your board is plugged into the computer.

```
./circuitpython/watch_code.sh
```

To automatically log and see serial logs from the board, run  `serial_logger.py`
as a background process or in an open terminal with the path to your board's serial port and the serial baud rate. On Mac you can use `ls /dev/tty.*` to find the serial path. The script must be started after your board is plugged into the computer.

```
python circuitpython/serial_logger.py "/dev/tty.usbmodem1411" 115200
```

### Testing

For testing purposes, you don't need a Circuit Playground Express. The [testscripts](testscripts) folder has several scripts to send a fake code update message and fake serial log messages. Using these you can see how the UI changes with code versions and serial logs.

```
python testscripts/send_code.py
./testscripts/serial_log_stress_test.sh
./testscripts/send_some_serial.sh
```

## Built With

* [webpack](https://webpack.js.org/)     for building the frontend
* [React](https://reactjs.org/) and [Redux](https://redux.js.org/) for the web UI
* websockets to stream data updates to the frontend
* [SQLite](https://www.sqlite.org/index.html) database to save the data (the `example.db` file)
* [RabbitMQ](https://www.rabbitmq.com/) message queue to hold data updates until the backend can process them.
* Python's [Twisted](https://twistedmatrix.com/trac/) for the backend web server, websocket backend, and interfacing with RabbitMQ
* Python's [watchdog](https://pypi.python.org/pypi/watchdog) package and shell utilities to log when the CircuitPython code changes.

## Meta

Intial work by **Jacob Haip** ([jhaip](https://github.com/jhaip))

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Put bug reports and project discussions should happen in Github issues (<https://github.com/jhaip/streaming-queue-viz/issues>).

**Contributing Code:**

1. Fork it (<https://github.com/jhaip/streaming-queue-viz/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
