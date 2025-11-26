const API_CONFIG = {
    baseURL: process.env.NODE_ENV === 'production' 
      ? 'https://fake-url-for-build.com' 
      : ''
  };
  
  export default API_CONFIG;