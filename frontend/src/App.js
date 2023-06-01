import React, { Component } from "react";
import Modal from "./Components/Modal";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      // taskList: tasks,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
      todoList: [],
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("http://localhost:8000/api/tasks/")
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err));
  };

  toggle = () => {//add this after modal creation
    this.setState({ modal: !this.state.modal });//add this after modal creation
  };
  // handleSubmit = item => {//add this after modal creation
  //   this.toggle();//add this after modal creation
  //   alert("save" + JSON.stringify(item));//add this after modal creation
  // };

  // Submit an item
  handleSubmit = item => {
    this.toggle();
    if (item.id) {
      // if old post to edit and submit
      axios
        .put(`http://localhost:8000/api/tasks/${ item.id }/`, item)
        .then(res => this.refreshList());
      return;
    }
    // if new post to submit
    axios
      .post("http://localhost:8000/api/tasks/", item)
      .then(res => this.refreshList());
  };

  // Delete item
  handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/tasks/${ item.id }/`)
      .then(res => this.refreshList());
  };
  // handleDelete = item => {//add this after modal creation
  //   alert("delete" + JSON.stringify(item));//add this after modal creation
  // };

  // Create item
  createItem = () => {
    const item = { title: "", description: "", completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  //Edit item
  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          Completed
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          Incompleted
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item) => item.completed === viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "complete-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button className="btn btn-info mr-2" onClick={ () => this.editItem(item)}>Edit</button>
          <button className="btn btn-danger mr-2" onClick={ () => this.handleDelete(item)}>Delete</button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="content p-3 mb-2 bg-info">
        <h1 className="text-white text-uppercase text-center">Task Manager</h1>
        <div className="row">
          <div className="col-md-6 col-sma-10 mx-auto p-0">
            <div className="card p-3">
              <div>
                <button className="btn btn-warning" onClick={this.createItem}>Add task</button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>

        <footer className="my-5 mb-2 bg-info text-white text-center">
          Testing
          {this.state.modal ? (
            <Modal
              activeItem={this.state.activeItem}
              toggle={this.toggle}
              onSave={this.handleSubmit}
            />
          ) : null}
        </footer>
      </main>
    );
  }
}

export default App;
