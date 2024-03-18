import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Loginpage() {
    const { loginUser } = useContext(AuthContext);
    const history = useHistory();
    const [loginError, setLoginError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const success = await loginUser(email, password);
        if (success) {
            history.push('/msg');
        } else {
            setLoginError(true);
        }
    };

    return (
        <div className="container">
            <h2 className="text-center">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Username" name="email" />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" placeholder="Password" name="password" />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Login</button>
            </form>
            {loginError && <p style={{ color: 'red' }} className="text-center">Incorrect username or password</p>}
            <p className="text-center">Don't have an account? <Link to='/register'>Register Here</Link></p>
        </div>
    );
}

export default Loginpage;
