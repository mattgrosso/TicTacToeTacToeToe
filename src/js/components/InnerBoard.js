// import React, { Component } from "react";

class InnerBoard extends React.Component {
    render() {
        const { position, innerGame, playable, nextBoard } = this.props;
        let style;
        if (playable) {
            style = {
                cursor: "pointer"
            };
        } else {
            style = {
                cursor: "not-allowed"
            };
        }


        const playableSquares = POSITIONS.map(pos => (
            <div style={style} className={`inner ${pos}`}>
                {innerGame[pos]}
            </div>
        ));



        return (
            <section

                className={`outer ${position} ${innerGame.winner + "Winner"} ${nextBoard ? "nextBoard" : ""}`}
            >
                <div className="XWins">X</div>
                <div className="OWins">O</div>
                <div className="CWins">C</div>
                {playableSquares}
            </section>
        );
    }
}

// export default InnerBoard;
