import express from 'express';
import { 
    registerUser, 
    loginUser, 
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';

const router = express.Router();

// Rutas de autenticación
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;