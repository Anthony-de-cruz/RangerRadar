#!/bin/bash

lat="1.${RANDOM}"
long="1.${RANDOM}"
text=$'text=logging\nlow\n'"${lat}"$'\n'"${long}"
keyword=$'keyword=LOGGING\nLOW\n'"${lat}"$'\n'"${long}"

curl -G 'http://localhost:8080/webhooks/inbound-sms' \
  --data-urlencode 'msisdn=110000000000' \
  --data-urlencode 'to=110000000000' \
  --data-urlencode 'messageId=ABCDEF0123456789' \
  --data-urlencode "${text}" \
  --data-urlencode 'type=text' \
  --data-urlencode "${keyword}"\
  --data-urlencode 'api-key=api-key' \
  --data-urlencode 'message-timestamp=2024-06-05+13:53:25'

