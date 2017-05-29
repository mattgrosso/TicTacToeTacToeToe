// import React, { Component } from 'react';
const POSITIONS = [
    "topLeft",
    "topCenter",
    "topRight",
    "middleLeft",
    "middleCenter",
    "middleRight",
    "bottomLeft",
    "bottomCenter",
    "bottomRight"
];

class Board extends React.Component {
    render() {
        const { winner, playable, nextBoard } = this.props;
        const playableBoards = POSITIONS.map(pos => (
            <InnerBoard position={pos} innerGame={this.props.game[pos]} playable={playable} />
        ));

        let winnerElement;
        if (winner) {
            winnerElement = <div className="WinsTheGame">{winner}</div>;
        } else {
            winnerElement = null;
        }

        let style;
        if (playable) {
            style = {
                opacity: "0.5"
            };
        } else {
            style = {
                opacity: "1"
            };
        }



        return (
            <section style={style} className={`gameboard ${nextBoard ? "" : "nextBoard"}`}>
                {winnerElement}
                {playableBoards}
            </section>
        );
    }
}

// export default Board;
