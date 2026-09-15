import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const SERVICES = [
  "Interior Painting",
  "Exterior Painting",
  "Remodeling",
  "Handyman Services",
  "Multiple Services",
  "Not Sure Yet",
];

const REFERRAL_OPTIONS = [
  { value: "Facebook or Instagram Ad", label: "I saw your ad on Facebook or Instagram" },
  { value: "Friend or Family Referral", label: "A friend or family recommended you" },
  { value: "Google Search", label: "I found you on Google" },
  { value: "Van or Vehicle", label: "I saw your van or vehicle in my area" },
  { value: "Yard Sign", label: "I saw a yard sign near my neighborhood" },
  { value: "Other", label: "Other" },
];

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  referralSource: string;
  project: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  service: "",
  referralSource: "",
  project: "",
};

interface ContactFormProps {
  compact?: boolean;
}

const ContactForm = ({ compact = false }: ContactFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);
  const utmSource = searchParams.get("utm_source");
  const utmMedium = searchParams.get("utm_medium");

  const getAutoSource = () => {
    if (utmSource === "google" && utmMedium === "cpc") return "Google Ads";
    if (utmSource === "facebook" || utmSource === "instagram") return "Facebook or Instagram Ad";
    if (utmSource) return utmSource;
    return "";
  };

  const [formData, setFormData] = useState<FormState>({ ...emptyForm, referralSource: getAutoSource() });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
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
    if (!formData.address.trim()) next.address = "This field is required.";
    if (!formData.service) next.service = "This field is required.";
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
      service_type: formData.service,
      message: [formData.address ? `Address: ${formData.address}` : "", formData.project]
        .filter(Boolean)
        .join("\n\n"),
      prefer_phone: false,
      status: "new",
      source: formData.referralSource || "Website Form",
      campaign_name: utmSource ? `${utmSource}/${utmMedium || "organic"}` : null,
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
    setSubmitted(true);
    navigate("/thank-you");
  };

  if (submitted) {
    return (
      <div className="text-center py-10">
        <h3 className="font-display text-3xl md:text-4xl text-foreground">
          We got your request.
        </h3>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto leading-relaxed">
          Thank you for reaching out. Someone from our team will contact you within one business day.
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-8 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-sm"
        >
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const errorMsg = (key: keyof FormState) =>
    errors[key] ? (
      <p className="text-sm text-destructive mt-1">{errors[key]}</p>
    ) : null;

  const inputClass = (key: keyof FormState) =>
    cn("rounded-sm", errors[key] && "border-destructive focus-visible:ring-destructive");

  const fieldGap = compact ? 12 : 20;
  const inputH = compact ? 40 : 46;
  const labelSize = compact ? 13 : 14;
  const btnH = compact ? 44 : 50;
  const textareaRows = compact ? 3 : 4;

  const labelStyle = { fontSize: labelSize, fontWeight: 500 } as const;
  const inputStyle = { height: inputH } as const;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: fieldGap }}
    >
      <div>
        <Label htmlFor="fullName" style={labelStyle}>Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
          aria-invalid={!!errors.fullName}
          className={cn("mt-1.5", inputClass("fullName"))}
          style={inputStyle}
        />
        {errorMsg("fullName")}
      </div>

      <div>
        <Label htmlFor="phone" style={labelStyle}>Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setField("phone", e.target.value)}
          aria-invalid={!!errors.phone}
          className={cn("mt-1.5", inputClass("phone"))}
          style={inputStyle}
        />
        {errorMsg("phone")}
      </div>

      <div>
        <Label htmlFor="email" style={labelStyle}>Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setField("email", e.target.value)}
          aria-invalid={!!errors.email}
          className={cn("mt-1.5", inputClass("email"))}
          style={inputStyle}
        />
        {errorMsg("email")}
      </div>

      <div>
        <Label htmlFor="address" style={labelStyle}>Property Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setField("address", e.target.value)}
          aria-invalid={!!errors.address}
          className={cn("mt-1.5", inputClass("address"))}
          style={inputStyle}
        />
        {errorMsg("address")}
      </div>

      <div>
        <Label htmlFor="service" style={labelStyle}>Service Needed</Label>
        <Select
          value={formData.service}
          onValueChange={(v) => setField("service", v)}
        >
          <SelectTrigger
            id="service"
            aria-invalid={!!errors.service}
            className={cn(
              "mt-1.5 rounded-sm",
              errors.service && "border-destructive focus:ring-destructive",
            )}
            style={inputStyle}
          >
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {SERVICES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errorMsg("service")}
      </div>

      <div>
        <Label style={labelStyle}>
          How did you hear about us?{" "}
          <span style={{ fontWeight: 400, color: "#6B6560", fontSize: 12 }}>(optional)</span>
        </Label>
        <Select
          value={formData.referralSource}
          onValueChange={(v) => setField("referralSource", v)}
        >
          <SelectTrigger
            className="mt-1.5 rounded-sm"
            style={inputStyle}
          >
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Facebook or Instagram Ad">I saw your ad on Facebook or Instagram</SelectItem>
            <SelectItem value="Friend or Family Referral">A friend or family member recommended you</SelectItem>
            <SelectItem value="Google Search">I found you on Google</SelectItem>
            <SelectItem value="Van or Vehicle">I saw your van or truck in my area</SelectItem>
            <SelectItem value="Yard Sign">I saw a yard sign near my neighborhood</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="project" style={labelStyle}>
          Tell us about your project{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="project"
          rows={textareaRows}
          value={formData.project}
          onChange={(e) => setField("project", e.target.value)}
          placeholder="Describe the space, what needs to be done, any details that help us prepare a better estimate."
          className="mt-1.5 rounded-sm"
        />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-primary-foreground hover:bg-primary-dark rounded-sm text-base"
        style={{ height: btnH }}
      >
        {submitting ? "Sending..." : "Send My Request"}
      </Button>
    </form>
  );
};

export default ContactForm;
