import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { contactDetailsSchema } from '@/lib/leadSubmission';
import { cn } from '@/lib/utils';

export default function TwoStepInquiryForm({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate();
  const id = useId();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({ fullName: '', phone: '', email: '', zip: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState('');
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const token = useRef('');
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { if (step === 2) form.current?.querySelector('input')?.focus(); }, [step]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const next: Record<string, string> = {};
    const schema = step === 1 ? contactDetailsSchema.pick({ fullName: true, phone: true }) : contactDetailsSchema.pick({ email: true });
    const parsed = schema.safeParse(values);
    if (!parsed.success) parsed.error.issues.forEach(issue => { next[String(issue.path[0])] = issue.message; });
    if (step === 2) {
      if (!/^\d{5}(-\d{4})?$/.test(values.zip.trim())) next.zip = 'Enter a valid ZIP code.';
      if (!values.address.trim()) next.address = 'Enter your street address.';
    }
    setErrors(next); setFailure('');
    if (Object.keys(next).length) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    lock.current = true; setBusy(true);
    try {
      token.current ||= crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
      const { error } = await supabase.rpc('save_website_inquiry', {
        p_token: token.current, p_name: values.fullName.trim(), p_phone: values.phone.trim(),
        ...(step === 2 ? { p_details: { email: values.email.trim(), zip: values.zip.trim(), address: values.address.trim() } } : {}),
      });
      if (error) throw error;
      if (step === 1) setStep(2); else navigate('/thank-you');
    } catch {
      setFailure(step === 1 ? "We couldn't save your contact details. Please try again or call us directly." : "Your contact request is saved, but we couldn't save these details. Please try again.");
    } finally { lock.current = false; setBusy(false); }
  }
  const fields = step === 1
    ? [{ key: 'fullName', label: 'Full Name', auto: 'name', type: 'text', max: 120 }, { key: 'phone', label: 'Phone Number', auto: 'tel', type: 'tel', max: 30 }]
    : [{ key: 'email', label: 'Email Address', auto: 'email', type: 'email', max: 254 }, { key: 'zip', label: 'ZIP Code', auto: 'postal-code', type: 'text', max: 10 }, { key: 'address', label: 'Street Address', auto: 'street-address', type: 'text', max: 300 }];
  return <form ref={form} onSubmit={submit} noValidate aria-label="Request a consultation" className={cn('flex flex-col gap-4', dark && 'rounded-2xl border border-white/20 bg-black/30 p-6 text-white shadow-xl backdrop-blur-md')}>
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest" aria-live="polite">Step {step} of 2 · {step === 1 ? 'Your contact' : 'Your details'}</p>
      <div className="mb-4 flex gap-2" aria-hidden="true"><span className="h-1 flex-1 rounded bg-primary" /><span className={cn('h-1 flex-1 rounded', step === 2 ? 'bg-primary' : dark ? 'bg-white/25' : 'bg-muted')} /></div>
      <h3 className="font-display text-2xl">{step === 1 ? 'Request a Consultation' : 'Complete your request'}</h3>
      <p className={cn('mt-2 text-sm leading-relaxed', dark ? 'text-white/80' : 'text-muted-foreground')}>{step === 1 ? "Start with your name and phone number. We'll contact you about your free estimate." : 'Your contact request is saved. Add your email and project address so we can prepare for your consultation.'}</p>
    </div>
    <fieldset disabled={busy} className="flex min-w-0 flex-col gap-3">
      {fields.map(field => <div key={field.key}>
        <label htmlFor={`${id}-${field.key}`} className="mb-1.5 block text-sm font-medium">{field.label}</label>
        <input id={`${id}-${field.key}`} name={field.key} type={field.type} autoComplete={field.auto} maxLength={field.max} required
          value={values[field.key as keyof typeof values]}
          onChange={event => { setValues(previous => ({ ...previous, [field.key]: event.target.value })); setErrors(previous => ({ ...previous, [field.key]: '' })); }}
          aria-invalid={!!errors[field.key]} aria-describedby={errors[field.key] ? `${id}-${field.key}-error` : undefined}
          className={cn('h-11 w-full min-w-0 rounded-lg border px-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60', dark ? 'border-white/30 bg-white/10 text-white' : 'border-input bg-background text-foreground')} />
        {errors[field.key] && <p id={`${id}-${field.key}-error`} role="alert" className={cn('mt-1 text-sm', dark ? 'text-red-200' : 'text-destructive')}>{errors[field.key]}</p>}
      </div>)}
    </fieldset>
    {failure && <p role="alert" className={cn('rounded-lg border p-3 text-sm', dark ? 'border-red-300/50 text-red-100' : 'border-destructive text-destructive')}>{failure}</p>}
    <button type="submit" disabled={busy} className="min-h-12 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60">{busy ? 'Saving…' : step === 1 ? 'Continue to Details →' : 'Complete My Request →'}</button>
    <p className={cn('text-center text-xs leading-relaxed', dark ? 'text-white/75' : 'text-muted-foreground')}>{step === 1 ? 'By continuing, you request a call from our team. No commitment.' : 'No commitment. We respond within one business day.'}</p>
  </form>;
}

