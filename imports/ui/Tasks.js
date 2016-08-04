import React, { Component } from 'react';
import { connect } from 'react-apollo';
import gql from 'graphql-tag';

class TaskItem extends Component {
  constructor(props) {
    super(props);
    this.deleteTask = this.deleteTask.bind(this);
  }
  deleteTask() {
    console.log(`Delete ${this.props.task.title}`);
    this.props.onDelete(this.props.task)
  }
  render() {
    const { title } = this.props.task;

    return (
      <li>{title} <a href="#" onClick={this.deleteTask}>Delete</a></li>
    )
  }
}

function TaskList({ tasksData, mutations }) {
  const { tasks } = tasksData
  console.log(tasks);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>
      {tasks &&
        tasks.map(task =>
          <TaskItem key={task._id} task={task} onDelete={mutations.deleteTask} />
        )
      }
      </ul>
    </div>
  )
}

// This container brings in Apollo GraphQL data
const Tasks = connect({
  mapQueriesToProps() {
    return {
      tasksData: {
        query: gql`
            {
              tasks {
                _id
                title
              }
            }
          `
      }
    };
  },
  mapMutationsToProps: () => ({
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
  })
})(TaskList);

export default Tasks;
