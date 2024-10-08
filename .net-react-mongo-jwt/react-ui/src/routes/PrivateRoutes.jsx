import {Route, Routes, Navigate} from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Home from '../pages/Home'
import MasterLayout from '../layouts/MasterLayout'
import AuthLayout from '../layouts/AuthLayout'
import Login from '../auth/Login'
import Register from '../auth/Register'
import UserList from '../pages/account/UserList'


const PrivateRoutes = () => {

  return (
    <Routes>
      <Route element={<MasterLayout />}>
      
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='/' element={<Home />} />
        <Route path='/user' element={<UserList />} />
        
    
       
      </Route>
      <Route element={<AuthLayout />}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Route>
    </Routes>
  )
}



export {PrivateRoutes}
