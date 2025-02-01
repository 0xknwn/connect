

curl -d '{"calls": "[{\"contractAddress\":\"0x2ae7a2b0ede9a997e2d53e2b99f67877ac68e8de4266f30706b24bd6cd53190\",\"entrypoint\":\"increment\",\"calldata\":[]}]", "type": "request", "application": "0x0", "domain": "localhost:3000"}' http://localhost:3000/message
{"status":"OK"}


curl -d '{"calls": [{"contractAddress":"0x2ae7a2b0ede9a997e2d53e2b99f67877ac68e8de4266f30706b24bd6cd53190","entrypoint":"increment","calldata":[]}], "type": "request", "application": "0x0", "domain": "localhost:3000"}' http://localhost:3000/message

