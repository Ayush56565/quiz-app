import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Menu } from 'semantic-ui-react';

import Stats from './Stats';
import QNA from './QNA';

const Result = ({
  totalQuestions,
  correctAnswers,
  timeTaken,
  questionsAndAnswers,
  replayQuiz,
  resetQuiz,
}) => {
  const [activeTab, setActiveTab] = useState('Stats');

  const handleTabClick = (e, { name }) => {
    setActiveTab(name);
  };

  return (
    <div style={{ padding: 100 }}>
      <Container>
        <Menu fluid widths={2}>
          <Menu.Item
            name="Results"
            active={activeTab === 'Results'}
            onClick={handleTabClick}
          />
          <Menu.Item
            name="Answers"
            active={activeTab === 'Answers'}
            onClick={handleTabClick}
          />
        </Menu>
        {activeTab === 'Results' && (
          <Stats
            totalQuestions={totalQuestions}
            correctAnswers={correctAnswers}
            timeTaken={timeTaken}
            replayQuiz={replayQuiz}
            resetQuiz={resetQuiz}
          />
        )}
        {activeTab === 'Answers' && <QNA questionsAndAnswers={questionsAndAnswers} />}
        <br />
      </Container>
    </div>
  );
};

Result.propTypes = {
  totalQuestions: PropTypes.number.isRequired,
  correctAnswers: PropTypes.number.isRequired,
  timeTaken: PropTypes.number.isRequired,
  questionsAndAnswers: PropTypes.array.isRequired,
  replayQuiz: PropTypes.func.isRequired,
  resetQuiz: PropTypes.func.isRequired,
};

export default Result;