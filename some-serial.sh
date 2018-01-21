for run in {1..10}
do
    curl -H "Content-Type: application/json" -X POST -d '{"source": "serial", "value": "'"$(( ( RANDOM % 10 )  + 1 ))"'"}' "http://localhost:8002/"
done
