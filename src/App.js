// @ts-check

import React, { useReducer, useEffect } from 'react';
import styled from 'styled-components';

function useKeyDown(key, onKeyDown) {
  useEffect(() => {
    const handler = e => {
      if (e.key === key) {
        onKeyDown();
      }
    };

    window.addEventListener('keydown', handler);

    return () => window.removeEventListener('keydown', handler);
  }, [onKeyDown]);
}

const StyledScreen = styled.div`
  height: 30rem;
  width: 50rem;
  padding: 1rem;
  padding-top: 2rem;
  background: white;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;

  > header {
    margin-bottom: 1rem;
  }

  [data-variant='welcome-screen-div'] {
    font-size: 26px;
    padding: 18%;
    margin-top: 2%;
    border-radius: 15px;
    background-color: lightblue;
  }

  [data-variant='question-screen-div'] {
    font-size: 26px;
    padding: 20%;
    padding-left: 29%;
    margin-top: 1.5%;
    border-radius: 15px;
    background-color: lightyellow;
  }

  [data-variant='form-screen-div'] {
    font-size: 26px;
    padding-top: 19%;
    padding-bottom: 16.4%;
    padding-left: 35%;
    padding-right: 30%;
    border-radius: 15px;
    background-color: #Cdbeda;
  }

  [data-variant='thanks-screen-div'] {
    font-size: 26px;
    padding-top: 26%;
    padding-bottom: 24%;
    padding-left: 27%;
    padding-right: 30%;
    border-radius: 15px;
    background-color: #B7e8b6;
  }

  [data-variant='form-textarea'] {
    margin-top: 7%;
  }

  [data-variant='form-submit-button'] {
    margin-left: 27%;
  }

  button {
    background: #4088da;
    appearance: none;
    border: none;
    text-transform: uppercase;
    color: white;
    letter-spacing: 0.5px;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 20rem;
    align-self: flex-end;
    cursor: pointer;
    font-size: 0.75rem;

    + button {
      margin-left: 0.5rem;
    }

    &[data-variant='next'] {
      text-align: center;
      position: relative;
      margin-top: 10%;
      left: 41%;
      right: 50%;
    }
    &[data-variant='good'] {
      background-color: #7cbd67;
      margin-top: 7%;
      left: 15%;
    }
    &[data-variant='bad'] {
      background-color: #ff4652;
      left: 21%;
    }
  }

  textarea {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #dedede;
    font-size: 1rem;
  }

  [data-testid='close-button'] {
    position: absolute;
    top: 0;
    right: 0;
    appearance: none;
    height: 2rem;
    width: 2rem;
    line-height: 0;
    border: none;
    background: transparent;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    &:before {
      content: '×';
      font-size: 1.5rem;
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;

function WelcomeScreen({ onClickNext }) {
  return (
    <StyledScreen data-testid="welcome-screen">
      <div data-variant="welcome-screen-div">
        <header>Thank you for attending QECamp 2022! &#128571;</header>
        <button
          onClick={onClickNext}
          data-testid="next-button"
          data-variant="next"
        >
        Next
        </button>
      </div>
    </StyledScreen>
  );
}

function QuestionScreen({ onClickGood, onClickBad, onClose }) {
  useKeyDown('Escape', onClose);

  return (
    <StyledScreen data-testid="question-screen">
      <div data-variant="question-screen-div">
        <header>How was your experience?</header>
        <button
          onClick={onClickGood}
          data-testid="good-button"
          data-variant="good"
        >
          Good
        </button>
        <button onClick={onClickBad} data-testid="bad-button" data-variant="bad">
          Bad
        </button>
      </div>
      <button data-testid="close-button" title="close" onClick={onClose} />
    </StyledScreen>
  );
}

function FormScreen({ onSubmit, onClose }) {
  useKeyDown('Escape', onClose);

  return (
    <StyledScreen
      as="form"
      data-testid="form-screen"
      onSubmit={e => {
        e.preventDefault();
        const { response } = e.target.elements;

        onSubmit({
          value: response
        });
      }}
    >
      <div data-variant="form-screen-div">
        <header>Care to tell us why?</header>
        <textarea
          data-testid="response-input"
          data-variant="form-textarea"
          name="response"
          placeholder="Complain here"
          onKeyDown={e => {
            if (e.key === 'Escape') {
              e.stopPropagation();
            }
          }}
        />
        <button
          data-testid="submit-button"
          data-variant="form-submit-button"
        >
          Submit
        </button>
      </div>
      <button
        data-testid="close-button"
        title="close"
        type="button"
        onClick={onClose}
      />
    </StyledScreen>
  );
}

function ThanksScreen({ onClose }) {
  useKeyDown('Escape', onClose);

  return (
    <StyledScreen data-testid="thanks-screen">
      <div data-variant="thanks-screen-div">
        <header>Thanks for your feedback &#127881;</header>
        <button data-testid="close-button" title="close" onClick={onClose} />
      </div>
    </StyledScreen>
  );
}

function feedbackReducer(state, event) {
  switch (state) {
    case 'welcome':
      switch (event.type) {
        case 'NEXT':
          return 'question';
        default:
          return state;
      }
    case 'question':
      switch (event.type) {
        case 'GOOD':
          return 'thanks';
        case 'BAD':
          return 'form';
        case 'CLOSE':
          return 'closed';
        default:
          return state;
      }
    case 'form':
      switch (event.type) {
        case 'SUBMIT':
          return 'thanks';
        case 'CLOSE':
          return 'closed';
        default:
          return state;
      }
    case 'thanks':
      switch (event.type) {
        case 'CLOSE':
          return 'closed';
        default:
          return state;
      }
    default:
      return state;
  }
}

function Feedback() {
  const [state, send] = useReducer(feedbackReducer, 'welcome');

  switch (state) {
    case 'welcome':
      return (
        <WelcomeScreen
          onClickNext={() => send({ type: 'NEXT' })}
        />
      );
    case 'question':
      return (
        <QuestionScreen
          onClickGood={() => send({ type: 'GOOD' })}
          onClickBad={() => send({ type: 'BAD' })}
          onClose={() => send({ type: 'CLOSE' })}
        />
      );
    case 'form':
      return (
        <FormScreen
          onSubmit={value => send({ type: 'SUBMIT', value })}
          onClose={() => send({ type: 'CLOSE' })}
        />
      );
    case 'thanks':
      return <ThanksScreen onClose={() => send({ type: 'CLOSE' })} />;
    case 'closed':
      return null;
  }
}

const StyledApp = styled.main`
  height: 100vh;
  width: 100vw;
  background: #f5f8f9;
  display: flex;
  justify-content: center;
  align-items: center;

  &,
  * {
    position: relative;
    box-sizing: border-box;
  }
`;

function App() {
  return (
    <StyledApp>
      <Feedback />
    </StyledApp>
  );
}

export default App;
