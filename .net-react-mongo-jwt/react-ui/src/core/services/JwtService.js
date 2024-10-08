class JwtService {
    static getToken() {
      return localStorage.getItem('token');
    }
  
    static saveToken(token) {
      localStorage.setItem('token', token);
    }
  
    static destroyToken() {
      localStorage.removeItem('token');
    }
  }
  
  export default JwtService;
  