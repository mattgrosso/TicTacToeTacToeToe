class GameStartForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {value: this.props.initalUsername};
  }

  handleChange = (e) => {
    this.setState({value: e.target.value})
  }

/**
 * This triggers when the new game button is clicked. It hides the button and
 * emits the event 'i_want_to_play_right_meow' to the server.
 */
  handleSubmit = (e) => {
    this.props.submit(this.state.value, e);
    e.preventDefault();
  }

  render() {
    return (<form id="register-new-player" onSubmit={this.handleSubmit}>
      <label for="">Username</label>
      <input 
        type="text" 
        name="username" 
        value={this.state.value} 
        placeholder="Anonymoose" 
        onChange={this.handleChange}
      />
      <button className="new-game-button" type="submit" name="button" >Start Game</button>
    </form>);
  }
}