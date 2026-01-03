import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Compass } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"></div>

            <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-md shadow-2xl border border-white/20 p-10 rounded-3xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-brand-primary p-4 rounded-2xl mb-4 shadow-lg shadow-brand-primary/20">
                        <Compass className="text-white" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-500 mt-2 font-medium">Continue your adventure with GlobeTrotter</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-100 mb-6 text-sm text-center font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="text-gray-900 bg-gray-50 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20"
                        placeholder="you@example.com"
                    />
                    <div>
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="text-gray-900 bg-gray-50 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20"
                            placeholder="••••••••"
                        />
                        <div className="flex justify-end mt-1">
                            <Link to="#" className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <Button type="submit" className="w-full py-3.5 text-lg font-bold bg-brand-primary hover:bg-brand-secondary text-white shadow-lg shadow-brand-primary/30 transition-all rounded-xl">
                        Log In
                    </Button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                    <p className="text-gray-600">
                        Don't have an account? <Link to="/signup" className="text-brand-secondary font-bold hover:underline">Sign up now</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Login;
