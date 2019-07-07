# Lunchbox λ \ node-red-contrib-lunchbox

Custom node for [Node-RED](https://nodered.org) to connect to the [brain](https://github.com/lunchbox-lambda/brain) using the [client](https://github.com/lunchbox-lambda/client) module.  
This node will emit the following topics with their respective payloads:
- connectivity
- computer
- environment-list
- environments
- recipes

NOTE: You can always use the native _inject_ and _debug_ nodes to get more details about the emitted payloads. The _lunchbox_ node will always output all the topics at once for any type of input received.
