current-dir := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

.PHONY: test
test: 
	npm run test

.PHONY: compile
compile: 
	node compile.js

.PHONY: deploy
deploy:
	node deploy.js
