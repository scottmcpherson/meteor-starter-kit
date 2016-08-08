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
          this.props.tasks.refetch();
        });
  }
  render() {
    const { title } = this.props.task;

    return (
      <li>{title}<a href="#" onClick={this.deleteTask}>Delete</a></li>
    )
  }
}

class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.mutations.addTask(e.target.value)
          .then(({ err, data }) => {
            console.log(data);
            if (!err) return this.props.tasks.refetch();
            console.log('err', err);
          });
    }
  }
  render() {
    return (
      <div>
        <input name="text" onKeyPress={this.handleKeyPress}/>
      </div>
    )
  }
}

function TaskList({ tasksData, mutations }) {

  const { tasks } = tasksData

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

      <TaskForm mutations={mutations} tasks={tasksData} />
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
    addTask: (title) => ({
      mutation: gql`
        mutation ($title: String!) {
          addTask(title: $title) {
            _id
            title
          }
        }
      `,
      variables: {
        title: title
      }
    }),
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
