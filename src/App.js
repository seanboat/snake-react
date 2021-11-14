import React, { useContext, useRef, useEffect } from "react";
import styled from "styled-components";
import { getNextCell } from "./context/actionsAndReducer";
import { GameContext } from "./context/gameContext";

const Main = styled.main`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Board = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 400px;
`;

const Row = styled.div`
  display: inline-flex;
  width: 100%;
  height: auto;
`;

const Column = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${({ isSnake, isApple }) =>
    isSnake ? "green" : isApple ? "red" : ""};
`;

const StartGameBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1em;
`;

const ResetGameBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1em;
`;

function App() {
  const gameInterval = useRef(null);
  const { state, dispatch, actions } = useContext(GameContext);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (
        !(
          e.keyCode === 37 ||
          e.keyCode === 38 ||
          e.keyCode === 39 ||
          e.keyCode === 40
        )
      ) {
        return;
      }

      dispatch({ type: actions.CHANGE_DIRECTION, payload: e.keyCode });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    clearInterval(gameInterval.current);
    gameInterval.current = setTimeout(() => {
      let type;

      const nextCell = getNextCell(state);

      console.log({ nextCell });

      switch (nextCell) {
        case -1:
          type = actions.OUT_OF_BOUNDS;
          break;
        case 1:
          type = actions.EAT_SELF;
          break;
        case 2:
          type = actions.EAT_APPLE;
          break;
        default:
          type = actions.MOVE;
      }

      console.log({ type });

      dispatch({ type });
    }, state.speed);
  });

  // immediately disable gameInterval to allow start press to handle it
  useEffect(() => {
    clearInterval(gameInterval.current);
  }, []);

  return (
    <Main>
      <Board>
        {state.board.map((row, rowIdx) => (
          <Row key={rowIdx}>
            {row.map((_, colIdx) => {
              /*           
                game square codes:
                0: empty
                1: snake
                2: apple
              */
              const isSnake = state.board[rowIdx][colIdx] === 1;
              const isApple = state.board[rowIdx][colIdx] === 2;

              return (
                <Column key={colIdx} isSnake={isSnake} isApple={isApple} />
              );
            })}
          </Row>
        ))}
      </Board>
      <StartGameBtn
        onClick={(e) => {
          // handle btn state on global state, or local to this component?
          e.target.disabled = true;
          e.target.nextElementSibling.disabled = false;

          dispatch({ type: actions.START_GAME });
        }}
      >
        Start Game
      </StartGameBtn>
      <ResetGameBtn
        onClick={(e) => {
          clearInterval(gameInterval.current);
          dispatch({ type: actions.RESET_GAME });

          e.target.disabled = true;
          e.target.previousElementSibling.disabled = false;
        }}
      >
        Reset Game
      </ResetGameBtn>
    </Main>
  );
}

export default App;
