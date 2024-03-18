import React from 'react';
import { Link } from 'react-router-dom';

function Homepage() {
  const backgroundImageStyle = {
    backgroundImage: "url('data:image/jpeg;base64,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')",
    height: '100vh',
    backgroundSize: 'cover',
  };

  return (
    <div className='bg-image d-flex justify-content-center align-items-center' style={backgroundImageStyle}>
      <div className="container text-center">
        <div class="mb-100">
          <h1>Vcube Chat Application</h1>
        </div>

        <div className="image-container">
          <img src="images/vcube1.png" alt="" height="450px" />
          <div className="overlay-button">
            <Link to="/login">
              <button className="btn btn-primary">Chat with us</button>
            </Link>
          </div>
        </div>

        <div className="content"></div>

        <div className="footer">
          <p>&copy; 2024 V Chat. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
