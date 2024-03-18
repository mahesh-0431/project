import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Loginpage from './views/Loginpage';
import Homepage from './views/Homepage';
import Registerpage from './views/Registerpage';
import Message from './views/Message';
import MessageDetail from './views/MessageDetail';
import SearchUsers from './views/SearchUsers';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route component={Loginpage} path="/login" exact />
          <Route component={Registerpage} path="/register" exact />
          <Route component={Message} path='/msg' exact/>
          <Route component={MessageDetail} path="/inbox/:id" exact />
          <Route component={SearchUsers} path="/search/:username" exact />
          <Route component={Homepage} path="/" />
          
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
