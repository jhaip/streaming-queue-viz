# Robot Seeing Tool

A tool to tell a more complete story of the making process. Code versions, serial log data, and notes are automatically saved and shown across time.

[Demo video on YouTube](https://www.youtube.com/watch?v=LqK2nMTE90g)

![Screenshot](/screenshots/screenshot.png?raw=true "Screenshot")

**Backstory**

This is a prototype tool to explore the idea of seeing changes in code and data over time. It moves way from the guess-check-forget cycle I found myself in while working on hobby electronics projects. My computer was filling up with screenshots and text files of projects I had worked on but I didn't remember their collective story. With this tool, the story of making is automatically recorded as I work so I can go back to it later or share it with others. Saving tweet-sized notes about what I am thinking while making expands the story.

**System Overview**

I am prototyping with the [Circuit Playground Express](https://www.adafruit.com/product/3333) microcontroller board. A script runs on my computer to track when a new version of code is sent to the board. Serial log messages from my code are also tracked. These scripts send the data to a web API that saves the data and sends updates to the user interface.

**User Interface**

The interface shows each version of code and the serial logs from that version of code. Each view of data is customizable: you can switch between data sources and visualizations and add JavaScript functions to manipulate the data before it is visualized.

**User Interface: Manipulation Functions**

The JavaScript functions fill the need between what can be seen from the raw serial logs and analyzing data while not activity making. Functions are automatically applied to new data streamed from the web API to help with seeing in the moment. Example uses include filtering values above a threshold, converting units, or extracting a number from text before making a line graph.

**Future Work**

* The missing piece of the story is a visual recording of what was being done. A camera feed should be integrated as another data source.
* Expand annotations: annotate individual data values, whole views of data, and time ranges. Show annotations inline in visualizations.
* Export data as a blog post outline, an embeddable timeline, or a movie.
* Support more electronics platforms like Particle or Arduino.

## Setup

These instructions will get you a copy of the project up and running on your local machine for development. Currently the project is not deployed publicly and must be run on your own computer. Setup has only been tested on a Mac computer.

### Prerequisites

You will need a system with Docker, Python, pip, and NPM installed.

* [Docker Installation Guide](https://docs.docker.com/install/)
* [pip Installation Guide](https://pip.pypa.io/en/stable/installing/)
* [npm Installation Guide](https://docs.npmjs.com/getting-started/installing-node)

The ability to save code changes and serial logs have only been developed with a Circuit Playground Express board using CircuitPython on a Mac computer. CircuitPython makes tracking code changes as simple as tracking the changes of a file mounted on your computer. Other electronic boards or platforms like Arduino could be supported but would require additional development. I am open to contributions in this area.

* [Circuit Playground Express board from Adafruit](https://www.adafruit.com/product/3333)
* [CircuitPython reference](https://learn.adafruit.com/welcome-to-circuitpython/what-is-circuitpython)

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

Start the Docker containers. The first time you run this it will build and pull container images. Leave this running.

```
docker-compose up
```

Install the Python requirements for the code that saves serial logs and the code versions.

```
pip install -r circuitpython/requirements.txt
```

To automatically track changes to Circuit Playground Express board's code, run the `watch_code.sh` script as a background process or in an open terminal. Currently code changes are only set up to work with a CircuitPython that
mounts to `/Volumes/CIRCUITPY` (this is where the Circuit Playground Express
board mounts on my Mac). The script must be started after your board is plugged into the computer.

```
./circuitpython/watch_code.sh
```

To automatically track serial logs from the board, run  `serial_logger.py`
as a background process or in an open terminal. The two inputs to the script are the path to your board's serial port and the serial baud rate. On Mac you can use `ls /dev/tty.*` to find the serial path. The script must be started after your board is plugged into the computer.

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
* [RabbitMQ](https://www.rabbitmq.com/) to queue data updates until the backend can process them
* Python's [Twisted](https://twistedmatrix.com/trac/) for the backend web server, websocket backend, and interfacing with RabbitMQ
* Python's [watchdog](https://pypi.python.org/pypi/watchdog) package and shell utilities to track when the CircuitPython code changes

## Meta

Initial work by **Jacob Haip** ([jhaip](https://github.com/jhaip))

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Bug reports and project discussions should happen in Github issues (<https://github.com/jhaip/streaming-queue-viz/issues>).

**Contributing Code:**

1. Fork it (<https://github.com/jhaip/streaming-queue-viz/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
