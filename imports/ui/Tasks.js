import React, { Component } from 'react';
import { connect } from 'react-apollo';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';

const client = new ApolloClient();

class TaskItem extends Component {
  constructor(props) {
    super(props);
    this.deleteTask = this.deleteTask.bind(this);
  }
  deleteTask() {
    // Can also call delete on the mutations directly
    // this.prop.mutations.deleteTask(_id).then(....

    this.props.onDelete(this.props.task)
        .then((err, data) => {
          // Can refetch the data this way
          // this.props.tasks.refetch();
        });
  }
  render() {
    const { title } = this.props.task;

    return (
      <li>{title}<a href="#" onClick={this.deleteTask}>Delete</a></li>
    )
  }
}

function TaskList({ tasksData }) {
  const { tasks } = tasksData
  console.log(tasksData);
  console.log(mutations);

  // Have to specify polling here
  tasksData.startPolling(1000);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>
      {tasks &&
        tasks.map(task =>
          <TaskItem key={task._id} task={task} tasks={tasksData} onDelete={mutations.deleteTask} />
        )
      }
      </ul>
    </div>
  )
}

// This container brings in Apollo GraphQL data

function mapQueriesToProps() {
  return {
    tasksData: {
      query: gql`
          query tasks {
            tasks {
              _id
              title
            }
          }
        `
    }
  };
};

function mapMutationsToProps() {
  return {
    deleteTask: (task) => ({
      mutation: gql`
        mutation ($id: String!) {
          deleteTask(_id: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: task._id
      },
      updateQueries: {
        tasks: (previousQueryResult, { mutationResult }) => {
          console.log('previousQueryResult: ', previousQueryResult);
          console.log('mutationResult: ', mutationResult);
          const newTasks = mutationResult.data.deleteTask;
          return {
            tasks: newTasks,
          }
        }
      }
    })
  }
};

const Tasks = connect({
  mapQueriesToProps,
  mapMutationsToProps
})(TaskList);

export default Tasks;
