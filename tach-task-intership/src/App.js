import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [bicycles, setBicycles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    color: '',
    wheelSize: '',
    price: '',
    id: '',
    description: '',
  });

  useEffect(() => {
    // Fetch bicycles data from the backend and setBicycles state
     axios.get('your_backend_api_url/bicycles').then((response) => setBicycles(response.data));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    // Update the status of the bicycle with the given ID
     axios.put(`your_backend_api_url/bicycles/${id}`, { status: newStatus }).then(() => {
    //   // After updating the status, fetch the updated data and setBicycles state
      axios.get('your_backend_api_url/bicycles').then((response) => setBicycles(response.data));
    });
  };

  const handleSave = () => {
    // Save the form data to the backend
     axios.post('your_backend_api_url/bicycles', formData).then(() => {
    //   // After saving, fetch the updated data and setBicycles state
      axios.get('your_backend_api_url/bicycles').then((response) => setBicycles(response.data));
    //   // Clear the form data
       setFormData({
        name: '',
        type: '',
         color: '',
        wheelSize: '',
        price: '',
         id: '',
         description: '',
       });
     });
  };

  const handleClear = () => {
    // Clear the form data
    setFormData({
      name: '',
      type: '',
      color: '',
      wheelSize: '',
      price: '',
      id: '',
      description: '',
    });
  };

  return (
    <div>
      <div style={{ backgroundColor: 'gray', textAlign: 'center', padding: '10px' }}>
        <h1 style={{ color: 'white' }}>admin.bike-booking.com</h1>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          {/* Display bicycle groups here */}
          {bicycles.map((bike) => (
            <div key={bike.id} style={{ border: '2px solid', borderColor: getStatusColor(bike.status) }}>
              <div>
                <p>{bike.name}</p>
                <p>{`${bike.type}(${bike.color})`}</p>
                <p>{`ID: ${bike.id}`}</p>
              </div>
              <div>
                <p>Status: {bike.status}</p>
                <select onChange={(e) => handleStatusChange(bike.id, e.target.value)}>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="unavailable">Unavailable</option>
                </select>
                <p>{`Cost per hour: ${bike.price}`}</p>
                <button>Close</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, marginLeft: '20px' }}>
          {/* Display the form here */}
          <form>
            {/* Form fields go here */}
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={handleClear}>Clear</button>
          </form>
        </div>
      </div>
      <div>
        {/* Display statistics here */}
        <p>Total bikes: {bicycles.length}</p>
        <p>Available bikes: {getBikesByStatus('available')}</p>
        <p>Booked bikes: {getBikesByStatus('busy')}</p>
        <p>Average bike cost: {calculateAverageCost()}</p>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  // Define colors based on status
  switch (status) {
    case 'available':
      return 'green';
    case 'busy':
      return 'orange';
    case 'unavailable':
      return 'red';
    default:
      return 'gray';
  }
};

const getBikesByStatus = (status) => {
  // Filter bicycles by status and return the count
  bicycles.filter((bike) => bike.status === status).length
};

const calculateAverageCost = () => {
  // Calculate and return the average cost of bicycles
 (bicycles.reduce((sum, bike) => sum + bike.price, 0) / bicycles.length).toFixed(2)
};

export default App;
