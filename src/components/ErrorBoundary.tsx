import { Component, type ErrorInfo, type ReactNode } from "react";

export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() { return { failed: true }; }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Page failed to render", error, info.componentStack);
  }

  render() {
    if (this.state.failed) return (
      <main className="min-h-screen grid place-content-center gap-4 p-8 text-center bg-background">
        <h1 className="text-2xl font-semibold">This page could not load.</h1>
        <p>Please reload the page and try again.</p>
        <button className="rounded-md bg-primary text-primary-foreground px-6 py-3" onClick={() => window.location.reload()}>Reload page</button>
        <a href="/" className="underline">Return home</a>
      </main>
    );
    return this.props.children;
  }
}
