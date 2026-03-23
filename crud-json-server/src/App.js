import React from "react";
import Lists from "./Lists";
import CreateList from "./CreateList";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      alldata: [],
      singledata: {
        title: "",
        author: "",
      },
    };
  }

  getLists = () => {
    this.setState({ loading: true });

    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          loading: false,
          alldata: result,
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  loadList = (id) => {
    this.setState({
      singledata: {
        title: "",
        author: "",
      },
    });

    return fetch(`http://localhost:5000/posts/${id}`)
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          singledata: {
            title: result.title ? result.title : "",
            author: result.author ? result.author : "",
          },
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  handleChange = (event) => {
    let title = this.state.singledata.title;
    let author = this.state.singledata.author;

    if (event.target.name === "title") {
      title = event.target.value;
    } else {
      author = event.target.value;
    }

    this.setState({
      singledata: {
        title: title,
        author: author,
      },
    });
  };

  createList = () => {
    return fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.singledata),
    })
      .then(() => {
        this.setState({
          singledata: {
            title: "",
            author: "",
          },
        });
        this.getLists();
      })
      .catch((error) => console.error("Error creating data:", error));
  };

  updateList = (id) => {
    fetch(`http://localhost:5000/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        ...this.state.singledata,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        this.setState({
          singledata: {
            title: "",
            author: "",
          },
        });
        this.getLists();
      })
      .catch((error) => console.error("Error updating data:", error));
  };

  deleteList = (id) => {
    fetch(`http://localhost:5000/posts/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        this.getLists();
      })
      .catch((error) => console.error("Error deleting data:", error));
  };

  render() {
    const lisTable = this.state.loading ? (
      <span>Loading Data... Please be patient.</span>
    ) : (
      <Lists
        alldata={this.state.alldata}
        singledata={this.state.singledata}
        loadList={this.loadList}
        updateList={this.updateList}
        deleteList={this.deleteList}
        handleChange={this.handleChange}
      />
    );
    return (
      <div className="container">
        <span className="title-bar">
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.getLists}
          >
            Get Lists
          </button>
          <CreateList
            singledata={this.state.singledata}
            handleChange={this.handleChange}
            createList={this.createList}
          />
        </span>
        {lisTable}
      </div>
    );
  }
}

export default App;
