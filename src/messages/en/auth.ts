export const auth = {
  title: "Authentication",
  description: "Sign in to access your TikTok earnings calculator dashboard and saved calculations.",
  backToHome: "Back to Home",
  brandTitle: "TikTok Money Calculator",
  brandSubtitle: "Calculate Your Creator Earnings",
  brandDescription: "Estimate your potential earnings as a TikTok creator with our advanced calculator.",
  whyChooseUs: "Why Choose Us",
  
  features: {
    calculator: {
      title: "Advanced Calculator",
      description: "Precise earnings calculations based on real data"
    },
    secure: {
      title: "Secure & Private",
      description: "Your data is protected with industry-standard security"
    },
    community: {
      title: "Creator Community",
      description: "Join thousands of creators maximizing their earnings"
    },
    fast: {
      title: "Lightning Fast",
      description: "Get instant results and insights"
    }
  },
  
  signin: {
    title: "Sign In",
    subtitle: "Welcome back to TikTok Money Calculator",
    socialSignin: {
      title: "Quick Sign In"
    },
    form: {
      signInWith: "Sign in with {provider}",
      signUpWith: "Sign up with {provider}",
      connecting: "Connecting...",
      email: {
        label: "Email",
        placeholder: "Enter your email"
      },
      password: {
        label: "Password",
        placeholder: "Enter your password"
      },
      rememberMe: "Remember me",
      forgotPassword: "Forgot Password?",
      signIn: "Sign In",
      signingIn: "Signing in...",
      noAccount: "Don't have an account?",
      signUpLink: "Sign up here"
    },
    or: "OR",
    emailSignin: {
      title: "Sign in with Email"
    },
    noAccount: {
      text: "Don't have an account?",
      signUp: "Sign up here"
    },
    forgotPassword: "Forgot your password?",
    social: {
      benefits: {
        title: "Sign in for exclusive benefits",
        fast: "Lightning-fast calculations",
        secure: "Bank-level security",
        noPassword: "No password required"
      }
    },
    orContinueWith: "Or continue with",
    google: "Continue with Google",
    github: "Continue with GitHub",
    messages: {
      emailVerified: "Email verified successfully! You can now sign in."
    },
    benefits: {
      title: "With your account you can",
      saveCalculations: "Save calculation results",
      viewHistory: "View calculation history",
      personalDashboard: "Access personal dashboard",
      exportData: "Export data reports"
    },
    security: {
      notice: "Your data is protected with industry-standard encryption and SSL security",
      protected: "Your data is protected with industry-standard encryption",
      emailVerification: "Email Verified"
    }
  },
  
  signUp: {
    title: "Sign Up",
    subtitle: "Create your account to get started",
    name: {
      label: "Full Name",
      placeholder: "Enter your full name"
    },
    email: {
      label: "Email",
      placeholder: "Enter your email"
    },
    password: {
      label: "Password",
      placeholder: "Create a password"
    },
    confirmPassword: {
      label: "Confirm Password",
      placeholder: "Confirm your password"
    },
    agreeToTerms: "I agree to the Terms of Service and Privacy Policy",
    submit: "Create Account",
    hasAccount: "Already have an account?",
    signInLink: "Sign in here",
    orContinueWith: "Or continue with",
    google: "Continue with Google",
    github: "Continue with GitHub"
  },
  
  forgotPassword: {
    title: "Reset Password",
    subtitle: "Enter your email to receive reset instructions",
    email: {
      label: "Email",
      placeholder: "Enter your email"
    },
    submit: "Send Reset Link",
    backToSignIn: "Back to Sign In",
    checkEmail: "Check your email for reset instructions"
  },
  
  errors: {
    invalidCredentials: "Invalid email or password",
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    nameRequired: "Name is required",
    passwordMismatch: "Passwords do not match",
    emailInvalid: "Please enter a valid email",
    passwordTooShort: "Password must be at least 8 characters",
    termsRequired: "You must agree to the terms",
    signInError: "Failed to sign in. Please try again.",
    signUpError: "Failed to create account. Please try again.",
    emailNotVerified: "Email not verified. Please check your email and click the verification link",
    accountNotLinked: "This email is already linked to another account",
    oauthNotLinked: "OAuth account not linked",
    emailSignin: "Email sign in failed",
    callback: "Callback error",
    oauthCallback: "OAuth callback error",
    oauthCreateAccount: "OAuth account creation failed",
    sessionRequired: "Sign in required",
    socialSignIn: "Social sign in failed. Please try again.",
    general: "An error occurred. Please try again.",
    default: "An unknown error occurred during sign in. Please try again"
  },
  
  success: {
    signedIn: "Successfully signed in!",
    signedUp: "Account created successfully!",
    passwordReset: "Password reset email sent!"
  },
  
  stats: {
    users: "10K+",
    calculations: "100K+",
    accuracy: "99%"
  },
  
  testimonial: {
    quote: "This calculator helped me understand my true earning potential and negotiate better brand deals. The estimates are surprisingly accurate!",
    author: "Sarah Chen",
    role: "Content Creator"
  },
  
  legal: {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    cookies: "Cookie Policy"
  },
  
  help: {
    needHelp: "Need help?",
    contactSupport: "Contact Support"
  }
} as const;