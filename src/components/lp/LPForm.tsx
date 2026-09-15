import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { submitLead, validateContactDetails } from "@/lib/leadSubmission";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  service: string;
  project: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

interface LPFormProps {
  service: string;
}

const LPForm = ({ service }: LPFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    phone: "",
    email: "",
    service,
    project: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = validateContactDetails(formData);
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) {
      const form = e.currentTarget as HTMLFormElement;
      requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }

    setSubmitting(true);
    const { error } = await submitLead({
      name: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      service_type: formData.service,
      message: formData.project,
      prefer_phone: false,
      status: "new",
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
      return;
    }
    navigate("/thank-you");
  };

  const errMsg = (k: keyof FormState) =>
    errors[k] ? <p id={`lp-${k}-error`} role="alert" className="text-sm text-destructive mt-1">{errors[k]}</p> : null;

  const inputCls = (k: keyof FormState) =>
    cn("mt-2 rounded-sm", errors[k] && "border-destructive focus-visible:ring-destructive");

  return (
    <div className="w-full max-w-md mx-auto">
      <h2
        className="font-display"
        style={{ fontWeight: 700, fontSize: "22px", color: "#1A1A1A", letterSpacing: "-0.02em" }}
      >
        Get your free estimate
      </h2>
      <p className="mt-1" style={{ fontSize: "13px", color: "#6B6560" }}>
        No commitment. We respond within one business day.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <div>
          <Label htmlFor="lp-fullName">Full Name</Label>
          <Input
            id="lp-fullName"
            autoComplete="name"
          maxLength={120}
          value={formData.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? `lp-fullName-error` : undefined}
            className={inputCls("fullName")}
          />
          {errMsg("fullName")}
        </div>

        <div>
          <Label htmlFor="lp-phone">Phone Number</Label>
          <Input
            id="lp-phone"
            type="tel"
            autoComplete="tel"
          maxLength={30}
          value={formData.phone}
            onChange={(e) => setField("phone", e.target.value)}
            aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? `lp-phone-error` : undefined}
            className={inputCls("phone")}
          />
          {errMsg("phone")}
        </div>

        <div>
          <Label htmlFor="lp-email">Email Address</Label>
          <Input
            id="lp-email"
            type="email"
            autoComplete="email"
          maxLength={254}
          value={formData.email}
            onChange={(e) => setField("email", e.target.value)}
            aria-invalid={!!errors.email}
          aria-describedby={errors.email ? `lp-email-error` : undefined}
            className={inputCls("email")}
          />
          {errMsg("email")}
        </div>

        <div>
          <Label htmlFor="lp-service">Service</Label>
          <Input
            id="lp-service"
            value={formData.service}
            readOnly
            className="mt-2 rounded-sm bg-stone/60 cursor-default"
          />
        </div>

        <div>
          <Label htmlFor="lp-project">
            Tell us about your project{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Textarea
            id="lp-project"
            rows={3}
            maxLength={5000}
          value={formData.project}
            onChange={(e) => setField("project", e.target.value)}
            className="mt-2 rounded-sm"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary-dark rounded-sm"
        >
          {submitting ? "Sending..." : "Send My Request"}
        </Button>

        <p className="text-center" style={{ fontSize: "12px", color: "#6B6560" }}>
          Licensed and Insured. Serving New England since 2004.
        </p>
      </form>
    </div>
  );
};

export default LPForm;
