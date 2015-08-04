
all:
	gulp nowatch

clean:
	gulp clean
	for p in `ls node_modules`; do npm uninstall $$p; done

restart:
	killall node || true
	nohup node app.js </dev/null &>/dev/null &
	true


