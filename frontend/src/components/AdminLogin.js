// import React, { useState } from 'react';
// import axios from 'axios';

// const AdminLogin = () => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('/api/auth/login', { ...formData, role: 'admin' });
//             localStorage.setItem('token', response.data.token);
//             alert('Login successful');
//         } catch (err) {
//             console.error(err);
//             if (err.response && err.response.data.message === 'You are not allowed to login from here') {
//                 alert('You are not allowed to login from here');
//             } else {
//                 alert('Login failed');
//             }
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
//             <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
//             <button type="submit">Login as Admin</button>
//         </form>
//     );
// };

// export default AdminLogin;
import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post('/api/auth/login', { ...values, role: 'admin' });
                localStorage.setItem('token', response.data.token);
                toast.success('Login successful');
            } catch (err) {
                console.error(err);
                if (err.response && err.response.data.message === 'You are not allowed to login from here') {
                    toast.error('You are not allowed to login from here');
                } else {
                    toast.error('Login failed');
                }
            }
        },
    });

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Admin Login
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Login as Admin
                    </Button>
                </form>
                <ToastContainer />
            </Box>
        </Container>
    );
};

export default AdminLogin;
