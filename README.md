
- Restart the server
```bash
sudo forever restartall
```

------

# Start/Stop app

(While in the directory listed above)

- To view running processes
```
sudo forever list
```

- Start the app:
```
sudo forever start index.js
```

- Stop the app:
```
sudo forever stop index.js
```

- Restart the app:
```
sudo forever restartall
```

# Debugging

When using the `forever` node module it will pass console.log statements to a file. If you want to see the output to the command line stop the app using the command `forever stop index.js` and start the app using `nodemon index.js` (to stop type ctrl+c). Ensure you restart the app using the `forever` node module `forever start index.js` after debugging is complete.
