import React, { Component } from 'react';
import { connect } from 'react-apollo';
import gql from 'graphql-tag';

class TaskItem extends Component {
  constructor(props) {
    super(props);
  }
  deleteTask() {
    console.log(`Delete ${this.props.task.title}`);
    this.props.onDelete(this.props.task.title)
  }
  render() {
    const index = this.props.index;
    const { title } = this.props.task;

    return (
      <li key={index}>{title} <a href="#" onClick={this.deleteTask.bind(this)}>Delete</a></li>
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
      {tasks && tasks.map((task, index) =>
        <TaskItem key={index} task={task} index={index} onDelete={(...args) => mutations.deleteTask(...args)}/>)}
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
    deleteTask: (title) => ({
      mutation: gql`
        mutation ($title: String!) {
          deleteTask(title: $title) {
            title
          }
        }
      `,
      variables: {
        title
      },
      updateQueries: {
        tasks: (previousQueryResult, { mutationResult }) => {
          console.log('previousQueryResult: ', previousQueryResult);
          console.log('mutationResult: ', mutationResult);
          return {
            tasks: [mutationResult],
          }
        }
      }
    })
  })
})(TaskList);

export default Tasks;

// ,
// mapMutationsToProps: () => ({
//   deleteTask: (title) => ({
//     mutation: gql`
//       mutation deleteTask($title: !String) {
//         title
//       }
//     `
//   })
