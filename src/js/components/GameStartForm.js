class GameStartForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.initalUsername,
      computer: false,
    };
    console.log(this.state);
  }

  handleChange = e => {
    this.setState({ username: e.target.value });
  };

  handleToggleComputer = e => {
    this.setState({ computer: e.target.checked });
  };

  /**
 * This triggers when the new game button is clicked. It hides the button and
 * emits the event 'i_want_to_play_right_meow' to the server.
 */
  handleSubmit = e => {
    this.props.submit(this.state, e);
    e.preventDefault();
  };

  render() {
    return (
      <form id="register-new-player" onSubmit={this.handleSubmit}>
        <label for="">Username</label>
        <input
          type="text"
          name="username"
          value={this.state.username}
          placeholder="Anonymoose"
          onChange={this.handleChange}
        />
        <label for="#play-a-computer">
          <input id="play-a-computer" type="checkbox" onChange={this.handleToggleComputer} />
          Play a Computer
        </label>
        <button className="new-game-button" type="submit" name="button">
          Start Game
        </button>
      </form>
    );
  }
}
