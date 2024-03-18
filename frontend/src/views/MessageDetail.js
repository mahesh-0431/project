import React from 'react';
//import './style/Message.css';
import { useState, useEffect } from 'react';
import useAxios from '../utils/useAxios';
import { jwtDecode } from 'jwt-decode';
import { Link, useParams, useHistory } from 'react-router-dom/';
import moment from 'moment';

function MessageDetail() {

  const baseURL = 'http://127.0.0.1:8000/api';
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);
  const [newMessage, setNewMessage] = useState({ message: "" }); // Changed variable name to setNewMessage
  const [newSearch, setNewSearch] = useState({ search: "" }); // Changed variable name to setNewSearch

  const axios = useAxios();
  const id = useParams();
  const token = localStorage.getItem('authTokens');
  const decoded = jwtDecode(token);
  const user_id = decoded.user_id;
  const username = decoded.username;
  const history = useHistory();

  useEffect(() => {
    try {
      axios.get(baseURL + '/my-messages/' + user_id + '/').then((res) => {
        setMessages(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Get all messages for a conversation
  useEffect(() => {
    let interval = setInterval(() => {
      try {
        axios.get(baseURL + '/get-messages/' + user_id + '/' + id.id + '/').then((res) => {
          setMessage(res.data);
          console.log(res.data);
        });
      } catch (error) {
        console.log(error);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await axios.get(baseURL + '/profile/' + id.id + '/').then((res) => {
          setProfile(res.data);
          setUser(res.data.user);
        });

      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  // capture changes made by the user in those fields and update the component's state accordingly.
  const handleChange = (event) => {
    setNewMessage({
      ...newMessage,
      [event.target.name]: event.target.value,
    });
  };

  // Send Message
  const sendMessage = () => { // Changed function name to camelCase
    const formdata = new FormData();
    formdata.append("user", user_id);
    formdata.append("sender", user_id);
    formdata.append("reciever", id.id);
    formdata.append("message", newMessage.message);
    formdata.append("is_read", false);

    try {
      axios.post(baseURL + '/send-messages/', formdata).then((res) => {
        document.getElementById("text-input").value = "";
        setNewMessage({ message: "" }); // Corrected state update
      });
    } catch (error) {
      console.log("error ===", error);
    }
  };

  const handleSearchChange = (event) => {
    setNewSearch({
      ...newSearch,
      [event.target.name]: event.target.value,
    });
  };

  console.log(newSearch.username);

  const searchUser = () => { // Changed function name to camelCase
    axios.get(baseURL + '/search/' + newSearch.username + '/')
      .then((res) => {
        if (res.status === 404) {
          console.log(res.data.detail);
          alert("User does not exist");
        } else {
          history.push('/search/' + newSearch.username + '/');
        }
      })
      .catch((error) => {
        alert("User Does Not Exist");
      });
  };


  const handleLogout = () => {
    localStorage.removeItem('authTokens');
    history.push('/login');
  };

  return (
    <div>
      <main className="content" style={{ marginTop: "150px" }}>
        <div className="container p-0">
          <h1 className="h3 mb-3">Messages</h1>
          <div className="card">
            <div className="row g-0">
              <div className="col-12 col-lg-5 col-xl-3 border-right">
                <div className="px-4 ">
                  <div className="d-flfex align-itemfs-center">
                    <div className="flex-grow-1 d-flex align-items-center mt-2">
                      <input
                        type="text"
                        className="form-control my-3"
                        placeholder="Search..."
                        onChange={handleSearchChange}
                        name='username'

                      />
                      <button className='ml-2' onClick={searchUser} style={{ border: "none", borderRadius: "50%" }}><i className='fas fa-search'></i></button>
                    </div>
                  </div>
                </div>
                {messages.map((message) =>
                  <Link
                    to={"/inbox-message/" + (message.sender.id === user_id ? message.reciever.id : message.sender.id) + "/"}
                    href="#"
                    className="list-group-item list-group-item-action border-0"
                    key={message.id} // Added key prop
                  >
                    <small><div className="badge bg-success float-right text-white">{moment.utc(message.date).local().startOf('seconds').fromNow()}</div></small>
                    <div className="d-flex align-items-start">
                      {message.sender.id !== user_id &&
                        <img src={message.sender_profile.image} className="rounded-circle mr-1" alt="1" width={40} height={40} />
                      }
                      {message.sender.id === user_id &&
                        <img src={message.reciever_profile.image} className="rounded-circle mr-1" alt="2" width={40} height={40} />
                      }
                      <div className="flex-grow-1 ml-3">
                        {message.sender.id === user_id &&
                          (message.reciever_profile.full_name !== null ? message.reciever_profile.full_name : message.reciever.username)
                        }

                        {message.sender.id !== user_id &&
                          (message.sender.username)
                        }
                        <div className="small">
                          <small>{message.message}</small>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                <hr className="d-block d-lg-none mt-1 mb-0" />
              </div>
              <div className="col-12 col-lg-7 col-xl-9">
                <div className="py-2 px-4 border-bottom d-none d-lg-block">
                  <div className="d-flex align-items-center py-1">
                    <div className="position-relative">
                      <img
                        src={profile.image}
                        className="rounded-circle mr-1"
                        alt=""
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="flex-grow-1 pl-3">
                      <strong>{profile.full_name}</strong>
                      <div className="text-muted small">
                        <em>@{user.username}</em>
                      </div>
                    </div>
                    <div>
                      <button onClick={handleLogout} className="btn btn-danger btn-lg mr-1 px-3">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
                <div className="position-relative">
                  <div className="chat-messages p-4">
                    {message.map((msg, index) =>
                      <>
                        {msg.sender.id !== user_id &&
                          <div className="chat-message-left pb-4" key={index}>
                            <div>
                              <img src={msg.sender_profile.image} className="rounded-circle mr-1" alt="Chris Wood" style={{ objectFit: "cover" }} width={40} height={40} />
                              <div className="text-muted small text-nowrap mt-2">
                              </div>
                            </div>
                            <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                              <div className="font-weight-bold mb-1">You</div>
                              {msg.message}
                              <br />
                              <span className='mt-3'>{moment.utc(msg.date).local().startOf('seconds').fromNow()}</span>
                            </div>
                          </div>
                        }
                        {msg.sender.id === user_id &&
                          <div className="chat-message-right pb-4" key={index}>
                            <div>
                              <img src={msg.sender_profile.image} className="rounded-circle mr-1" alt="{msg.reciever_profile.full_name}" style={{ objectFit: "cover" }} width={40} height={40} />
                              <br />
                              <div className="text-muted small text-nowrap mt-2">{moment.utc(msg.date).local().startOf('seconds').fromNow()}</div>
                            </div>
                            <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                              <div className="font-weight-bold mb-1">{msg.reciever_profile.full_name}</div>
                              {msg.message}
                            </div>
                          </div>
                        }

                      </>
                    )}

                  </div>
                </div>
                <div className="flex-grow-0 py-3 px-4 border-top">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your message"
                      value={newMessage.message}
                      name="message"
                      id='text-input'
                      onChange={handleChange}
                    />
                    <button onClick={sendMessage} className="btn btn-primary">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MessageDetail;
