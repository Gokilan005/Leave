const API_BASE_URL = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'https://leave-2t9d.onrender.com');

export default API_BASE_URL;
