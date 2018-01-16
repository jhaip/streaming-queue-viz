curl -H "Content-Type: application/json" -X POST -d '{"source": "serial", "value": "test"}' "http://localhost:8002/?[1-100]" &
pidlist="$pidlist $!"
curl -H "Content-Type: application/json" -X POST -d '{"source": "serial", "value": "test"}' "http://localhost:8002/?[1-100]" &
pidlist="$pidlist $!"
curl -H "Content-Type: application/json" -X POST -d '{"source": "serial", "value": "test"}' "http://localhost:8002/?[1-100]" &
pidlist="$pidlist $!"

for job in $pidlist do
  echo $job
  wait $job || let "FAIL+=1"
done

if [ "$FAIL" == "0" ]; then
  echo "YAY!"
else
  echo "FAIL! ($FAIL)"
fi
