import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import {SignIn } from './components/SignIn';
import { ProtectedRoute } from './components/services/authentication';
import { AutoSignin } from './components/AutoSignin';


function App() {
  return (
    <>
    <Router>
          <Routes>
            <Route index path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/sign-in/" element={<SignIn />} />
            <Route path="/uptask-user/sign-in/:email/:password/" element={<AutoSignin />} />
            <Route path="*" element={<SignIn />} />
          </Routes>
        </Router>
    </>
  );
}

export default App;
