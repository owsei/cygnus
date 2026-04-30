import React from 'react';




function httpService(url) {
  // Function to make a GET request
  const get = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        ...options
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  return {
    get
  };
}

export default httpService;