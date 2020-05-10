import commonHoc from 'Components/commonHoc';

import { loadMessages } from 'Redux/actions';

import { usersByIdSelector } from 'Selectors/users';
import { currentUserSelector } from 'Selectors/session';
import { messagesTreeSelector } from 'Selectors/messages';

import MessagesList from './MessagesList';

const mapStateToProps = (state) => ({
  messagesTree: messagesTreeSelector(state),
  users: usersByIdSelector(state),
  user: currentUserSelector(state),
});

const mapDispatchToProps = {
  loadMessages,
};

const Container = commonHoc(MessagesList, {
  mapStateToProps,
  mapDispatchToProps,
});

export { Container as MessagesList };