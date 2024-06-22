// import React, { useState } from 'react';
// import axios from 'axios';

// const AdminRegistration = () => {
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
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
//             await axios.post('/api/auth/register', { ...formData, role: 'admin' });
//             alert('Registration successful, please check your email for verification link');
//         } catch (err) {
//             console.error(err);
//             alert('Registration failed');
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
//             <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
//             <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
//             <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
//             <button type="submit">Register as Admin</button>
//         </form>
//     );
// };

// export default AdminRegistration;


import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminRegistration = () => {
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                await axios.post('/api/auth/register', { ...values, role: 'admin' });
                toast.success('Registration successful, please check your email for verification link');
            } catch (err) {
                console.error(err);
                toast.error('Registration failed');
            }
        },
    });

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Admin Registration
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                        margin="normal"
                    />
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
                        Register as Admin
                    </Button>
                </form>
                <ToastContainer />
            </Box>
        </Container>
    );
};

export default AdminRegistration;
