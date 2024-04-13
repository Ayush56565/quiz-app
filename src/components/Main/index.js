import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Segment,
  Item,
  Dropdown,
  Divider,
  Button,
  Message,
} from 'semantic-ui-react';

// import mindImg from '../../images/mind.svg';

import {
  CATEGORIES,
  NUM_OF_QUESTIONS,
  COUNTDOWN_TIME,
} from '../../constants';
import { shuffle } from '../../utils';

import Offline from '../Offline';

const Main = ({ startQuiz }) => {
  const [category, setCategory] = useState('0');
  const [numOfQuestions, setNumOfQuestions] = useState(5);
  // const [questionsType, setQuestionsType] = useState('0');
  const [countdownTime, setCountdownTime] = useState({
    hours: 0,
    minutes: 120,
    seconds: 0,
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);

  const handleTimeChange = (e, { name, value }) => {
    setCountdownTime({ ...countdownTime, [name]: value });
  };

  let allFieldsSelected = false;
  if (
    category &&
    numOfQuestions &&
    (countdownTime.hours || countdownTime.minutes || countdownTime.seconds)
  ) {
    allFieldsSelected = true;
  }

  const fetchData = () => {
    setProcessing(true);

    if (error) setError(null);

    const API = `https://opentdb.com/api.php?amount=${numOfQuestions}&category=${category}&difficulty=medium&type=multiple`;

    fetch(API)
      .then(respone => respone.json())
      .then(data =>
        setTimeout(() => {
          const { response_code, results } = data;

          if (response_code === 1) {
            const message = (
              <p>
                The API doesn't have enough questions for your query. (Ex.
                Asking for 50 Questions in a Category that only has 20.)
                <br />
                <br />
                Please change the <strong>No. of Questions</strong>,{' '}
                <strong>Difficulty Level</strong>, or{' '}
                <strong>Type of Questions</strong>.
              </p>
            );

            setProcessing(false);
            setError({ message });

            return;
          }

          results.forEach(element => {
            element.options = shuffle([
              element.correct_answer,
              ...element.incorrect_answers,
            ]);
          });

          setProcessing(false);
          startQuiz(
            results,
            countdownTime.hours + countdownTime.minutes + countdownTime.seconds
          );
        }, 1000)
      )
      .catch(error =>
        setTimeout(() => {
          if (!navigator.onLine) {
            setOffline(true);
          } else {
            setProcessing(false);
            setError(error);
          }
        }, 1000)
      );
  };

  if (offline) return <Offline />;

  return (
    <div style={{ padding: 100 }}>
      <Container>
        <Segment>
          <Item.Group divided>
            <Item>
              <Item.Content>
                <Item.Header>
                  <h1>Quiz Application</h1>
                </Item.Header>
                {error && (
                  <Message error onDismiss={() => setError(null)}>
                    <Message.Header>Error!</Message.Header>
                    {error.message}
                  </Message>
                )}
                <Divider />
                <Item.Meta>
                  <p>Choose your category</p>
                  <Dropdown
                    fluid
                    selection
                    name="category"
                    placeholder="Select Quiz Category"
                    header="Select Quiz Category"
                    options={CATEGORIES}
                    value={category}
                    onChange={(e, { value }) => setCategory(value)}
                    disabled={processing}
                  />
                  <br />
                  <p>No.of questions</p>
                  <Dropdown
                    fluid
                    selection
                    name="numOfQ"
                    placeholder="Select No. of Questions"
                    header="Select No. of Questions"
                    options={NUM_OF_QUESTIONS}
                    value={numOfQuestions}
                    onChange={(e, { value }) => setNumOfQuestions(value)}
                    disabled={processing}
                  />
                  <br />
                  <p>Select the countdown time</p>
                  <Dropdown
                    search
                    selection
                    name="hours"
                    placeholder="Select Hours"
                    header="Select Hours"
                    options={COUNTDOWN_TIME.hours}
                    value={countdownTime.hours}
                    onChange={handleTimeChange}
                    disabled={processing}
                  />
                  <Dropdown
                    search
                    selection
                    name="minutes"
                    placeholder="Select Minutes"
                    header="Select Minutes"
                    options={COUNTDOWN_TIME.minutes}
                    value={countdownTime.minutes}
                    onChange={handleTimeChange}
                    disabled={processing}
                  />
                  <Dropdown
                    search
                    selection
                    name="seconds"
                    placeholder="Select Seconds"
                    header="Select Seconds"
                    options={COUNTDOWN_TIME.seconds}
                    value={countdownTime.seconds}
                    onChange={handleTimeChange}
                    disabled={processing}
                  />
                </Item.Meta>
                <Divider />
                <Item.Extra>
                  <Button
                    primary
                    size="big"
                    icon="play"
                    color="Teal"
                    labelPosition="left"
                    content={processing ? 'Starting...' : 'Start the quiz'}
                    onClick={fetchData}
                    disabled={!allFieldsSelected || processing}
                  />
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <br />
      </Container>
    </div>
  );
};

Main.propTypes = {
  startQuiz: PropTypes.func.isRequired,
};

export default Main;
