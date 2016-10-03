PORT = 8000
SERVER = "http://localhost:$(PORT)"
all:
	@echo "In dialog box: accept incoming network connections"
	@echo "__________________________________________________"
	@echo "$(SERVER)/rangeslider.html"
	@echo "$(SERVER)/plot.html"
	@echo "$(SERVER)/rod.html"
	@echo "__________________________________________________"
	@echo "Recommended: switch over to node"
	@python -m SimpleHTTPServer $(PORT)

node:
	nodemon server.js
