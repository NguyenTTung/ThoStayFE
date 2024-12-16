import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.scss';

import './ustils/theme/theme.scss';

import { User } from '@/pages/user/index';
import { Admin } from './pages/admin';
import Login from './pages/login';
import ProtectedRoute from './services/api/ProtectedRoute';
import Unauthorized from './pages/login/components/unauthorized';

function App() {
	return (
		<Router>
			<div className='App'>
				<Routes>
					<Route
						path='/login'
						element={<Login />}
					/>
					<Route
						path='/unauthorized'
						element={<Unauthorized />}
					/>
					<Route
						path='/*'
						element={<User />}
					/>
					<Route element={<ProtectedRoute allowedRoles={['Admin', 'Owner', 'Staff']} />}>
						<Route
							path='/admin/*'
							element={<Admin />}
						/>
					</Route>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
