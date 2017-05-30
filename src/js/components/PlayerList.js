/**
   * Display Players
   *
   * Create a series of LI tags with a react Identity key (for clean dom replacment)
   * also set a dynamic className (NOT class) of the online/offline status of the player.
   * @param {Array} props
   */
import React from 'react';

class PlayerList extends React.Component {
  render() {
    const listItems = this.props.players.map((player) => {
      const onlineStatus = player.status.online ? 'online' : 'offline';
      const listElement = (
        <li className={onlineStatus} key={player.id}>
          {player.symbol} {player.username}
        </li>
      );
      return listElement;
    });
    return (
      <ul id="players">
        {listItems}
      </ul>
    );
  }
}

export default PlayerList;