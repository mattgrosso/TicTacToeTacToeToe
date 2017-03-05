  /**
   * Display Players
   * 
   * Create a series of LI tags with a react Identity key (for clean dom replacment)
   * also set a dynamic className (NOT class) of the online/offline status of the player. 
   * @param {Array} players
   */
  function playerList(players) {
    const listItems = players.map((player) => {
      let onlineStatus = player.status.online ? 'online' : 'offline';
      const list = <li className={onlineStatus} key={player.id} >{player.symbol} {player.username}</li>;
      return list;
    });
    const element = <ul>{listItems}</ul>;
    ReactDOM.render(
      element,
      document.getElementById('players')
    );
  }
