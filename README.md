# MetaTacToe

![](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Incomplete_Ultimate_Tic-Tac-Toe_Board.png/220px-Incomplete_Ultimate_Tic-Tac-Toe_Board.png)

Is an implementation of ["Ultimate Tic Tac Toe"](https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe) written as an online multiplayer game. It has a very basic AI, and random player matching. It uses node/express and a react/socket.io frontend.

## Development

```sh
  npm install # npm i
```

Run the local webpack server.   This will proxy requests to the dev server but __it will not start it__.
If you want to use Hot Module Reload (HMR) use this and connect to http://localhost:9000
```sh
npm run dev-webpack
```

Run the local node server, and watch for file changes in the server directory.
```sh
npm run dev-server
```

Run the test suite.
```sh
npm test # npm t
```

## Contributing

Bug reports and pull requests are welcome on GitHub at [https://github.com/mattgrosso/TicTacToeTacToeToe](https://github.com/mattgrosso/TicTacToeTacToeToe). This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.


## License

The project is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).