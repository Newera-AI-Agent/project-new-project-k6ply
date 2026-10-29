'use client';

import { useState, useCallback, FormEvent } from 'react';
import { z } from 'zod';

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(20, 'Message must be at least 20 characters').max(5000),
});

// Form state machine: pristine -> dirty -> touched -> invalid-after-touched
type FieldState = 'pristine' | 'dirty' | 'touched' | 'invalid';

type FormState = {
  values: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  fieldStates: Record<keyof z.infer<typeof contactSchema>, FieldState>;
  errors: Partial<Record<keyof z.infer<typeof contactSchema>, string>>;
  submitted: boolean;
  submitStatus: 'idle' | 'submitting' | 'success' | 'error';
  submitError: string | null;
};

const initialState: FormState = {
  values: { name: '', email: '', subject: '', message: '' },
  fieldStates: { name: 'pristine', email: 'pristine', subject: 'pristine', message: 'pristine' },
  errors: {},
  submitted: false,
  submitStatus: 'idle',
  submitError: null,
};

function getFieldStateClass(state: FieldState, hasError: boolean): string {
  if (hasError && (state === 'touched' || state === 'invalid')) return 'border-error';
  if (state === 'touched' || state === 'invalid') return 'border-success';
  if (state === 'dirty') return 'border-text-subtle';
  return 'border-surface-border';
}

export function ContactForm() {
  const [state, setState] = useState<FormState>(initialState);

  // Validate single field
  const validateField = useCallback((name: keyof z.infer<typeof contactSchema>, value: string) => {
    try {
      contactSchema.shape[name].parse(value);
      return null;
    } catch (err) {
      if (err instanceof z.ZodError) {
        return err.errors[0]?.message ?? 'Invalid';
      }
      return 'Invalid';
    }
  }, []);

  // Handle input change
  const handleChange = useCallback((name: keyof z.infer<typeof contactSchema>, value: string) => {
    setState((prev) => {
      const newFieldState = prev.fieldStates[name] === 'pristine' ? 'dirty' : prev.fieldStates[name];
      const error = validateField(name, value);
      
      return {
        ...prev,
        values: { ...prev.values, [name]: value },
        fieldStates: { ...prev.fieldStates, [name]: newFieldState },
        errors: { ...prev.errors, [name]: error ?? undefined },
      };
    });
  }, [validateField]);

  // Handle blur - transition to touched
  const handleBlur = useCallback((name: keyof z.infer<typeof contactSchema>) => {
    setState((prev) => {
      if (prev.fieldStates[name] === 'pristine' || prev.fieldStates[name] === 'dirty') {
        const error = validateField(name, prev.values[name]);
        return {
          ...prev,
          fieldStates: { ...prev.fieldStates, [name]: error ? 'invalid' : 'touched' },
          errors: { ...prev.errors, [name]: error ?? undefined },
        };
      }
      return prev;
    });
  }, [validateField]);

  // Validate all fields
  const validateAll = useCallback(() => {
    const result = contactSchema.safeParse(state.values);
    
    if (!result.success) {
      const errors: FormState['errors'] = {};
      const fieldStates: FormState['fieldStates'] = { ...state.fieldStates };
      
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof z.infer<typeof contactSchema>;
        errors[field] = err.message;
        fieldStates[field] = 'invalid';
      });
      
      setState((prev) => ({ ...prev, errors, fieldStates }));
      return false;
    }
    
    // Mark all as touched/valid
    const fieldStates: FormState['fieldStates'] = {
      name: 'touched',
      email: 'touched',
      subject: 'touched',
      message: 'touched',
    };
    setState((prev) => ({ ...prev, fieldStates, errors: {} }));
    return true;
  }, [state.values]);

  // Handle submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateAll()) return;
    
    setState((prev) => ({ ...prev, submitStatus: 'submitting', submitError: null, submitted: true }));
    
    try {
      // Simulate form submission - replace with actual endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.values),
      });

      if (!response.ok) {
        throw new Error('Failed to send message. Please try again.');
      }

      setState((prev) => ({ ...prev, submitStatus: 'success' }));
      
      // Reset form after success
      setTimeout(() => {
        setState(initialState);
      }, 3000);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        submitStatus: 'error',
        submitError: err instanceof Error ? err.message : 'Something went wrong',
      }));
    }
  };

  // Check if field has error in current state
  const hasFieldError = (name: keyof z.infer<typeof contactSchema>) => {
    const fieldState = state.fieldStates[name];
    return (fieldState === 'touched' || fieldState === 'invalid') && !!state.errors[name];
  };

  // Get field class
  const getFieldClass = (name: keyof z.infer<typeof contactSchema>) => {
    return getFieldStateClass(state.fieldStates[name], hasFieldError(name));
  };

  return (
    <section
      id="contact"
      className="section"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <header className="mb-16 max-w-2xl">
          <span className="caption text-primary-accent mb-4" style={{ letterSpacing: '0.1em' }}>
            04 / Contact
          </span>
          <h2 id="contact-heading" className="display-lg text-primary mb-4">
            Let's talk
          </h2>
          <p className="body-lg text-text-secondary">
            Have a project in mind? Found a bug? Just want to say hi?
            I read every message — even the weird ones.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto"
          noValidate
          aria-label="Contact form"
        >
          {/* Error Summary - appears on submit error */}
          {state.submitStatus === 'error' && (
            <div
              className="error-summary"
              role="status"
              tabIndex={-1}
              id="error-summary"
            >
              <h2>Please fix the following errors:</h2>
              <ul>
                {state.submitError && (
                  <li>
                    <a href="#message" onClick={() => document.getElementById('message')?.focus()}>
                      {state.submitError}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Success message */}
          {state.submitStatus === 'success' && (
            <div
              className="error-summary border-success bg-surface-overlay"
              role="status"
              tabIndex={-1}
              id="success-message"
            >
              <h2 className="text-success">Message sent!</h2>
              <p className="text-text-secondary">I'll get back to you as soon as I can.</p>
            </div>
          )}

          {/* Name */}
          <div className="field mb-6">
            <label htmlFor="name" className="label">
              Name <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              value={state.values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              className={`input ${getFieldClass('name')}`}
              aria-invalid={hasFieldError('name')}
              aria-describedby={hasFieldError('name') ? 'name-error' : undefined}
              disabled={state.submitStatus === 'submitting'}
              required
            />
            {hasFieldError('name') && (
              <p id="name-error" className="field-error" role="alert">{state.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="field mb-6">
            <label htmlFor="email" className="label">
              Email <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={state.values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`input ${getFieldClass('email')}`}
              aria-invalid={hasFieldError('email')}
              aria-describedby={hasFieldError('email') ? 'email-error' : undefined}
              disabled={state.submitStatus === 'submitting'}
              required
            />
            {hasFieldError('email') && (
              <p id="email-error" className="field-error" role="alert">{state.errors.email}</p>
            )}
          </div>

          {/* Subject */}
          <div className="field mb-6">
            <label htmlFor="subject" className="label">
              Subject <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={state.values.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              onBlur={() => handleBlur('subject')}
              className={`input ${getFieldClass('subject')}`}
              aria-invalid={hasFieldError('subject')}
              aria-describedby={hasFieldError('subject') ? 'subject-error' : undefined}
              disabled={state.submitStatus === 'submitting'}
              required
            />
            {hasFieldError('subject') && (
              <p id="subject-error" className="field-error" role="alert">{state.errors.subject}</p>
            )}
          </div>

          {/* Message */}
          <div className="field mb-8">
            <label htmlFor="message" className="label">
              Message <span className="text-error" aria-hidden="true">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={state.values.message}
              onChange={(e) => handleChange('message', e.target.value)}
              onBlur={() => handleBlur('message')}
              className={`textarea ${getFieldClass('message')}`}
              aria-invalid={hasFieldError('message')}
              aria-describedby={hasFieldError('message') ? 'message-error' : undefined}
              disabled={state.submitStatus === 'submitting'}
              required
              rows={6}
            />
            {hasFieldError('message') && (
              <p id="message-error" className="field-error" role="alert">{state.errors.message}</p>
            )}
            <p className="caption text-text-subtle" aria-hidden="true">
              {state.values.message.length}/5000 characters
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto"
            disabled={state.submitStatus === 'submitting'}
          >
            {state.submitStatus === 'submitting' ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="31.4 31.4"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                </svg>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>

          <p className="caption text-text-subtle mt-4 text-center">
            No tracking. No newsletter. Just your message in my inbox.
          </p>
        </form>
      </div>
    </section>
  );
}
