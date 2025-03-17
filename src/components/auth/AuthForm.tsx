
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormValues = z.infer<typeof authSchema>;

export const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/upload',
        },
      });
      
      if (error) {
        throw error;
      }
      
      // The redirect will happen automatically after successful authentication
    } catch (error: any) {
      console.error('Error signing in with Google:', error.message);
      toast.error('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (values: AuthFormValues) => {
    setIsLoading(true);
    
    try {
      let response;
      
      if (authMode === 'signin') {
        response = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
      } else {
        response = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${window.location.origin}/upload`,
          },
        });
      }
      
      const { error } = response;
      
      if (error) {
        throw error;
      }
      
      if (authMode === 'signin') {
        toast.success('Signed in successfully!');
        navigate('/upload');
      } else {
        toast.success('Account created! Please check your email to confirm your account.');
      }
    } catch (error: any) {
      console.error('Authentication error:', error.message);
      
      if (error.message.includes('User already registered')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please try again.');
      } else {
        toast.error(error.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass-card p-8 animate-scale-in">
      <div className="flex flex-col items-center space-y-6">
        <div className="rounded-full bg-primary p-3">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="text-white"
          >
            <path 
              d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeMiterlimit="10" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeMiterlimit="10" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M8 13H12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeMiterlimit="10" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M8 17H16" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeMiterlimit="10" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-center">
          {authMode === 'signin' ? 'Sign in to RFP Analyzer' : 'Create an Account'}
        </h2>
        <p className="text-muted-foreground text-center">
          Access the Unirail RFP analysis tool to extract and analyze information from your documents.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmailAuth)} className="w-full space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                authMode === 'signin' ? 'Sign In' : 'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        
        <div className="flex items-center w-full">
          <div className="flex-grow h-px bg-border"></div>
          <span className="px-3 text-muted-foreground text-sm">OR</span>
          <div className="flex-grow h-px bg-border"></div>
        </div>
        
        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-white border border-border rounded-lg px-4 py-3 shadow-sm hover:shadow transition-all duration-200 relative overflow-hidden"
        >
          {!isLoading ? (
            <>
              <svg viewBox="0 0 48 48" width="24" height="24">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span className="font-medium">Sign in with Google</span>
            </>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Signing in...</span>
            </div>
          )}
        </Button>
        
        <div className="text-sm text-center">
          {authMode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => setAuthMode('signup')}
                className="text-primary hover:underline font-medium"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => setAuthMode('signin')}
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
