import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import App from '../App'
// import {Logout, AuthPage, useAuth} from '../modules/auth'


const {BASE_URL} = import.meta.env

const AppRoutes = () => {
//   const {currentUser} = useAuth()
  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route element={<App />}>

        <Route path='/*' element={<PrivateRoutes />} />


          {/* <Route path='error/*' element={<ErrorsPage />} /> */}
          {/* <Route path='logout' element={<Logout />} />
          {currentUser ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to='/dashboard' />} />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )} */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
