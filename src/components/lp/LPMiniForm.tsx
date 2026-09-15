import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
};
type Errors = Partial<Record<keyof FormState, string>>;

interface LPMiniFormProps {
  service: string;
  idPrefix?: string;
}

const LPMiniForm = ({ service, idPrefix = "lpmini" }: LPMiniFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setFormData((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!formData.fullName.trim()) next.fullName = "This field is required.";
    if (!formData.phone.trim()) next.phone = "This field is required.";
    if (!formData.email.trim()) {
      next.email = "This field is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      next.email = "Please enter a valid email.";
    }
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'present' : 'MISSING');
    console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'present' : 'MISSING');
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      name: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      service_type: service,
      prefer_phone: false,
      status: "new",
    });
    setSubmitting(false);

    if (error) {
      console.error('Supabase insert error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
      return;
    }
    navigate("/thank-you");
  };

  const inputCls = (k: keyof FormState) =>
    cn("mt-2 rounded-sm bg-background", errors[k] && "border-destructive focus-visible:ring-destructive");
  const errMsg = (k: keyof FormState) =>
    errors[k] ? <p className="text-sm text-destructive mt-1">{errors[k]}</p> : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-[480px] mx-auto space-y-4">
      <div>
        <Label htmlFor={`${idPrefix}-name`} className="text-background">Full Name</Label>
        <Input
          id={`${idPrefix}-name`}
          value={formData.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
          aria-invalid={!!errors.fullName}
          className={inputCls("fullName")}
        />
        {errMsg("fullName")}
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-phone`} className="text-background">Phone Number</Label>
        <Input
          id={`${idPrefix}-phone`}
          type="tel"
          value={formData.phone}
          onChange={(e) => setField("phone", e.target.value)}
          aria-invalid={!!errors.phone}
          className={inputCls("phone")}
        />
        {errMsg("phone")}
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-email`} className="text-background">Email Address</Label>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          value={formData.email}
          onChange={(e) => setField("email", e.target.value)}
          aria-invalid={!!errors.email}
          className={inputCls("email")}
        />
        {errMsg("email")}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full h-[50px] bg-primary text-primary-foreground hover:bg-primary-dark rounded-sm font-semibold"
      >
        {submitting ? "Sending..." : "Send My Request"}
      </Button>

      <p className="text-center" style={{ fontSize: "11px", color: "#9CA3AF" }}>
        No commitment. We respond within one business day.
      </p>
    </form>
  );
};

export default LPMiniForm;
