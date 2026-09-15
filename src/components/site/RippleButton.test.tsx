import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import RippleButton from "./RippleButton";

it("keeps an asChild link working after adding a ripple", () => {
  render(<RippleButton asChild><a href="/contact" onClick={(event) => event.preventDefault()}>Contact us</a></RippleButton>);
  fireEvent.click(screen.getByRole("link", { name: "Contact us" }));
  expect(screen.getByRole("link", { name: "Contact us" })).toHaveAttribute("href", "/contact");
});
